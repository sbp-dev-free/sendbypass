#!/usr/bin/env python3

from .base import \
    (PeybarEnumField, SBPForeignKey,
     PeybarState, PeybarBaseModel, ActionError,
     PeybarBaseModelTimed)
from .temp_object import \
    (PeybarTempObjectTimedModel,
     TempObjectForeignKey,
     TypedJSONField,
     PeybarTempObjectModel,
     MultipleTypedJSONField,
     TempObject)
from .user import User, UserFile
from .trip import Trip
from .types import *
from .cost import Cost
from .location import Location, Position
from api.utils import send_email, Event, EventEmoji, EventAction, get_slack_bot

from django.db import models, transaction as db_transaction
from django.utils import timezone
from django.template.loader import render_to_string
from django.conf import settings


class RequirementActionError(ActionError):
    HAS_REQUEST = 0

class RequirementEvent(EventAction):
    SUBMIT = 'Submit'
    ACCEPT = 'Accept'

class RequirementPropertiesBase(PeybarTempObjectModel):
    def update(self, validated_data):
        updated = False

        for k, v in validated_data.items():
            if v != getattr(self, k):
                setattr(self, k, v)
                updated = True

        return updated

    class Meta(PeybarTempObjectModel.Meta):
        abstract = True


class RequirementPropertiesShopping(RequirementPropertiesBase):
    type = PeybarEnumField(ItemType, default=ItemType.CLOTH)
    weight = models.FloatField()
    height = models.FloatField(null=True, blank=True)
    width = models.FloatField(null=True, blank=True)
    length = models.FloatField(null=True, blank=True)
    link = models.URLField(max_length=2000, null=True, blank=True)
    flexible_dimensions = models.BooleanField(default=False)

class RequirementPropertiesShipping(RequirementPropertiesBase):
    type = PeybarEnumField(ItemType, default=ItemType.DOCUMENT)
    weight = models.FloatField()
    height = models.FloatField(null=True, blank=True)
    width = models.FloatField(null=True, blank=True)
    length = models.FloatField(null=True, blank=True)
    flexible_dimensions = models.BooleanField(default=False)

class RequirementPropertiesShippingDocument(RequirementPropertiesBase):
    type = PeybarEnumField(ItemType, default=ItemType.DOCUMENT)
    weight = models.FloatField()
    size = PeybarEnumField(DocumentSizeType, default=DocumentSizeType.A4)
    length = models.FloatField(blank=True, null=True)
    width = models.FloatField(blank=True, null=True)
    num = models.PositiveIntegerField(default=1)

class Requirement(PeybarBaseModelTimed):
    cost = TypedJSONField(Cost)

    source = TypedJSONField(Position)
    destination = TypedJSONField(Position)

    type = PeybarEnumField(ServiceType)
    user = SBPForeignKey(
        User,
        on_delete=models.CASCADE,
        blank=False,
        null=False)

    properties = MultipleTypedJSONField(objs=[
        RequirementPropertiesShipping,
        RequirementPropertiesShippingDocument,
        RequirementPropertiesShopping
    ])


    comment = models.TextField(null=True, blank=True)

    image = SBPForeignKey(
        UserFile,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )

    name = models.CharField(max_length=50)
    status = PeybarEnumField(ActionStatus, default=ActionStatus.SUBMITTED)

    visible = models.BooleanField(default=True)

    def get_real_status(self):
        now = timezone.now()

        if self.status == ActionStatus.SUBMITTED and \
           (self.destination.to and now > self.destination.to):
            return ActionStatus.EXPIRED

        return self.status

    @property
    def requests(self):
        from api.models.request import Request

        return Request.objects.filter(
            requirement=self
        )

    def _able_to_modify(self):
        from .request import Request

        return not Request.objects.filter(
                    requirement=self
        ).exists()

    def delete(self):
        with db_transaction.atomic():
            r = Requirement.objects.filter(pk=self.id).select_for_update()[0]

            from .request import Request

            if Request.objects.filter(
                    requirement=self
            ).exists():
                raise RequirementActionError(
                    action=ActionError.DELETE,
                    obj=self,
                    type=RequirementActionError.HAS_REQUEST,
                    reason=''
                )

            super().delete()

    def change_locations(self, source, destination):
        with db_transaction.atomic():
            r = Requirement.objects.filter(pk=self.id).select_for_update()[0]

            if not r._able_to_modify():
                raise RequirementActionError(
                    action=ActionError.UPDATE,
                    obj=r,
                    type=RequirementActionError.HAS_REQUEST,
                    reason='Requirement has request.'
                )

            update_fields = []

            if source:
                if self.source.update(source):
                    update_fields.append('source',)

            if destination:
                if self.destination.update(destination):
                    update_fields.append('destination')

            if update_fields:
                self.save(update_fields=update_fields)

    def change_cost(self, cost):
        with db_transaction.atomic():
            r = Requirement.objects.filter(pk=self.id).select_for_update()[0]

            if not r._able_to_modify():
                raise RequirementActionError(
                    action=ActionError.UPDATE,
                    obj=r,
                    type=RequirementActionError.HAS_REQUEST,
                    reason='Requirement has request.'
                )

            if self.cost.update(cost):
                self.save(update_fields=['cost',])

    def change_properties(self, properties):
        with db_transaction.atomic():
            r = Requirement.objects.filter(pk=self.id).select_for_update()[0]

            if not r._able_to_modify():
                raise RequirementActionError(
                    action=ActionError.UPDATE,
                    obj=r,
                    type=RequirementActionError.HAS_REQUEST,
                    reason='Requirement has request.'
                )

            if self.properties.update(properties):
                self.save(update_fields=['properties',])

    def add_image(self, file):
        image = UserFile.objects.create(
            owner=self.user,
            related_object=self,
            field_name='image',
            file=file
        )

        self.image = image

        self.save(update_fields=['image'])

    def save(self, *args, **kwargs):
        if not self.id:
            super().save(*args, **kwargs)

            self._send_submit_notifs()

            return

        with db_transaction.atomic():
            r = Requirement.objects.filter(pk=self.id).select_for_update()[0]

            if 'update_fields' not in kwargs:
                update_fields = []

                for field in Requirement._meta.fields:
                    if getattr(self, field.name) != getattr(r, field.name):
                        update_fields.append(field.name)
            else:
                update_fields = kwargs.pop('update_fields')

            if not self._able_to_modify():
                for key in update_fields:
                    if key not in ('visible', 'status'):
                        raise RequirementActionError(
                            action=ActionError.UPDATE,
                            obj=self,
                            type=RequirementActionError.HAS_REQUEST,
                            reason='Requirement has active request'
                        )

            if 'status' not in update_fields and \
               not (len(update_fields) == 1 and update_fields[0] == 'visible'):
                self.status = ActionStatus.SUBMITTED

                update_fields.append('status')

            super().save(*args, update_fields=update_fields, **kwargs)

    def is_expired(self):
        return self.destination and self.destination.to and self.destination.to < timezone.now()

    def get_publish_status(self):
        if not self.visible:
            return PublishStatus.PRIVATE

        if self.status == ActionStatus.FINISHED or \
           self.is_expired():
            return PublishStatus.FINISHED

        if self.user.able_to_pulish('requirement') and \
           self.status == ActionStatus.ACCEPTED:
            return PublishStatus.PUBLISHED

        return PublishStatus.PENDING

    def _send_submit_notifs(self):
        if self.type == ServiceType.SHIPPING:
            subject = "We’ve Received Your Shipping Request!"

            message = render_to_string(
                'add_shipping_need.html',
                {
                    'user': self.user,
                    'domain': settings.API_SETTINGS['DOMAIN']
                }
            )

            send_email(subject, message, to=[self.user.email])

            get_slack_bot().send(
                'New Shipping',
                event=Event(
                    RequirementEvent.SUBMIT,
                    self.user,
                    data={
                        'id': self.id,
                        'source': self.source.location,
                        'destination': self.destination.location,
                        'due_time': self.destination.to if self.destination.to else None,
                    },
                ),
                emoji=EventEmoji.PACKAGE
            )
        else:
            subject = "Thanks for Your Purchase Request – We’re Reviewing It"

            message = render_to_string(
                'add_shopping_need.html',
                {
                    'user': self.user,
                    'domain': settings.API_SETTINGS['DOMAIN']
                }
            )

            send_email(subject, message, to=[self.user.email])

            get_slack_bot().send(
                'New Shipping',
                event=Event(
                    RequirementEvent.SUBMIT,
                    self.user,
                    data={
                        'id': self.id,
                        'source': self.source.location,
                        'destination': self.destination.location,
                        'due_time': self.destination.to if self.destination.to else None,
                    },
                ),
                emoji=EventEmoji.PACKAGE
            )


    class Meta():
        db_table = 'Requirement'

class RequirementFlow():
    status = PeybarState(ActionStatus, default=ActionStatus.SUBMITTED)

    def __init__(self, requirement):
        self.requirement = requirement

    @status.getter()
    def _status(self):
        return self.requirement.status

    @status.setter()
    def _set_status(self, value):
        self.requirement.status = value

    @status.on_success()
    def _on_status_change(self, descriptor, source, target):
        self.requirement.save(update_fields=['status',])

        if target == ActionStatus.ACCEPTED and source != ActionStatus.ACCEPTED:
            self._send_accept_email()

    def _send_accept_email(self, request=None):
        need = self.requirement

        if self.requirement.type == ServiceType.SHIPPING:
            subject = "Your Shipping Request Is Live - Connect Now!"

            message = render_to_string(
                'accept_shipping_need.html',
                {
                    'user': need.user,
                    'domain': settings.API_SETTINGS['DOMAIN']
                }
            )

            send_email(subject, message, to=[need.user.email])

            get_slack_bot().send(
                'Accept Shipping Need',
                event=Event(
                    RequirementEvent.ACCEPT,
                    need.user,
                    data={
                        'id': need.id,
                        'source': need.source.location,
                        'destination': need.destination.location,
                        'due_time': need.destination.to if need.destination.to else None,
                    },
                ),
                emoji=EventEmoji.BELLHOP_BELL
            )
        else:
            subject = "Your Purchase Request Is Live - Time To Shop!"

            message = render_to_string(
                'accept_shopping_need.html',
                {
                    'user': need.user,
                    'domain': settings.API_SETTINGS['DOMAIN']
                }
            )

            send_email(subject, message, to=[need.user.email])

            get_slack_bot().send(
                'Accept Shopping Need',
                event=Event(
                    RequirementEvent.ACCEPT,
                    need.user,
                    data={
                        'id': need.id,
                        'source': need.source.location,
                        'destination': need.destination.location,
                        'due_time': need.destination.to if need.destination.to else None,
                    },
                ),
                emoji=EventEmoji.BELLHOP_BELL
            )


    @status.transition(source=[ActionStatus.SUBMITTED], target=ActionStatus.ACCEPTED)
    def accept(self, request=None):
        return

    @status.transition(source=[ActionStatus.ACCEPTED, ActionStatus.PENDING], target=ActionStatus.PENDING)
    def add_request(self, request):
        return

    @status.transition(source=[ActionStatus.PENDING, ActionStatus.PROCESSING], target=ActionStatus.PROCESSING)
    def start_processing(self, request):
        return

    @status.transition(source=[ActionStatus.PROCESSING, ActionStatus.FINISHED], target=ActionStatus.FINISHED)
    def done(self, request=None, user=None):
        return
