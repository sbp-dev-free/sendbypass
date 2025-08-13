#!/usr/bin/env python3

from .base import \
    (PeybarEnumField, PeybarState,
     SBPForeignKey, PeybarBaseModel,
     SBPOneToOneField)
from .temp_object import \
    (PeybarTempObjectModel,
     TempObjectForeignKey,
     TypedJSONField,
     PeybarTempObjectTimedModel,
     MultipleTypedJSONField,
     TempObject)
from .requirement import Requirement, RequirementFlow
from .service import Service, ServiceFlow
from .trip import Trip
from .location import Location, Position
from .types import *
from .user import User, UserComment, UserFile
from api.utils import send_email

from django.db import models, transaction as db_transaction
from django.db.models import Q
from rest_framework import permissions
from django.utils import timezone
from random import randint
from viewflow.fsm import TransitionNotAllowed
from django.template.loader import render_to_string

class IsUserRelatedToRequest(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.requirement.user == request.user or \
            obj.service.user == request.user

class Deal(PeybarTempObjectModel):
    cost = models.FloatField()
    traveler_fee = models.FloatField()
    requester_fee = models.FloatField()

class Request(PeybarBaseModel):
    requirement = SBPForeignKey(
        Requirement,
        on_delete=models.CASCADE,
        blank=False,
        null=False,
        related_name='requests'
    )
    service = SBPForeignKey(
        Service,
        on_delete=models.CASCADE,
        blank=False,
        null=False,
        related_name='requests'
    )

    deal = TypedJSONField(Deal)

    status = PeybarEnumField(ActionStatus, default=ActionStatus.SUBMITTED)

    submitted_by = SBPForeignKey(
        User,
        blank=False,
        null=False,
        on_delete=models.CASCADE,
        related_name='submitted_requests')
    accepted_by = SBPForeignKey(
        User,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        related_name='acceptor_requests')

    description = models.TextField(null=True, blank=True)

    submit_time = models.DateTimeField(null=True, blank=True)
    accept_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)

    def get_real_status(self, user=None):
        if self.status == ActionStatus.DELIVERED:
            if user and OrderStep.objects.filter(
                    request=self,
                    type=StepType.DONE,
                    status=StepStatus.DONE,
                    user=user
            ).exists():
                return ActionStatus.FINISHED

        if self.status != ActionStatus.SUBMITTED or \
           self.service.trip.description.to > timezone.now():
            return self.status

        return ActionStatus.EXPIRED

    def get_steps(self, user):
        return OrderStep.objects.filter(
            user=user,
            request=self
        )

    def save(self, *args, **kwargs):
        if self.id:
            super().save(*args, **kwargs)

            return

        with db_transaction.atomic():
            super().save(*args, **kwargs)

            try:
                RequirementFlow(self.requirement).add_request(self)
                ServiceFlow(self.service).add_request(self)
            except TransitionNotAllowed as e:
                raise e

        self.status = ActionStatus.PENDING
        self.submit_time = timezone.now()

        super().save(update_fields=['status', 'submit_time'])

    @property
    def traveler(self):
        return self.service.trip.user

    @property
    def customer(self):
        return self.requirement.user

    class Meta():
        db_table = 'Request'

class RequestFlow():
    status = PeybarState(ActionStatus, default=ActionStatus.SUBMITTED)

    def __init__(self, request):
        self.request = request

    @status.getter()
    def _status(self):
        return self.request.status

    @status.setter()
    def _set_status(self, value):
        self.request.status = value

        if value == ActionStatus.ACCEPTED:
            self.request.accept_time = timezone.now()
        elif value == ActionStatus.FINISHED:
            self.request.end_time = timezone.now()
        elif value == ActionStatus.CANCELED:
            self.request.end_time = timezone.now()
        elif value == ActionStatus.REJECTED:
            self.request.end_time = timezone.now()

    def _send_accept_email(self):
        request = self.request

        message = render_to_string('accept_order.html', {
            'user': request.accepted_by,
            'order': request
        })

        send_email('Accept order', message, to=[request.accepted_by.email])

        message = render_to_string('accept_order.html', {
            'user': request.submitted_by,
            'order': request
        })

        send_email('Accept order', message, to=[request.submitted_by.email])

    def _send_reject_email(self):
        request = self.request

        message = render_to_string('reject_order.html', {
            'user': request.submitted_by,
            'order': request
        })

        send_email('Reject order', message, to=[request.submitted_by.email])


    @status.on_success()
    def _on_status_change(self, descriptor, source, target):
        if self.status == ActionStatus.ACCEPTED:
            self.request.save(update_fields=['status', 'accept_time', 'accepted_by'])

            self._send_accept_email()
        elif self.status == ActionStatus.PAYED:
            self.request.save(update_fields=['status',])
        elif self.status == ActionStatus.RECEIVED:
            self.request.save(update_fields=['status',])
        elif self.status == ActionStatus.DELIVERED:
            self.request.save(update_fields=['status',])
        elif self.status == ActionStatus.FINISHED:
            self.request.save(update_fields=['status', 'end_time'])
        elif self.status == ActionStatus.CANCELED:
            self.request.save(update_fields=['status', 'end_time'])
        elif self.status == ActionStatus.REJECTED:
            self.request.save(update_fields=['status', 'end_time'])

            self._send_reject_email()

    def _user_can_accept(self, user):
        return self.request.submitted_by != user

    @status.transition(source=[ActionStatus.PENDING, ActionStatus.ACCEPTED], target=ActionStatus.ACCEPTED, permission=_user_can_accept)
    def accept(self, user):
        with db_transaction.atomic():
            try:
                RequirementFlow(self.request.requirement).add_request(self.request)
                ServiceFlow(self.request.service).add_request(self.request)
            except TransitionNotAllowed as e:
                raise e

            step = OrderStep(
                type=StepType.PAYMENT,
                properties=TravelerPaymentProperties(),
                role=RoleType.TRAVELER,
                request=self.request,
                user=self.request.service.trip.user,
                status=StepStatus.WAITING,
            )

            step.save()

            step = OrderStep(
                type=StepType.PAYMENT,
                properties=CustomerPaymentProperties(link='http://foo.com/index.html'),
                role=RoleType.CUSTOMER,
                request=self.request,
                user=self.request.requirement.user,
                status=StepStatus.PENDING,
                follow_step=step,
            )

            step.save()

            self.request.accepted_by = user

    def _user_can_cancel(self, user):
        return self.request.submitted_by == user

    @status.transition(source=[ActionStatus.PENDING], target=ActionStatus.CANCELED, permission=_user_can_cancel)
    def cancel(self, user):
        pass

    def _user_can_reject(self, user):
        return self.request.submitted_by != user

    @status.transition(source=[ActionStatus.PENDING], target=ActionStatus.REJECTED, permission=_user_can_reject)
    def reject(self, user):
        pass

    @status.transition(source=[ActionStatus.ACCEPTED], target=ActionStatus.PAYED, permission=_user_can_accept)
    def payed(self):
        with db_transaction.atomic():
            try:
                RequirementFlow(self.request.requirement).start_processing(self.request)
                ServiceFlow(self.request.service).start_processing(self.request)
            except TransitionNotAllowed as e:
                raise e

    @status.transition(source=[ActionStatus.PAYED], target=ActionStatus.RECEIVED, permission=_user_can_accept)
    def received(self):
        pass

    @status.transition(source=[ActionStatus.PAYED], target=ActionStatus.RECEIVED, permission=_user_can_accept)
    def purchased(self):
        pass

    @status.transition(source=[ActionStatus.RECEIVED], target=ActionStatus.DELIVERED, permission=_user_can_accept)
    def delivered(self):
        with db_transaction.atomic():
            try:
                RequirementFlow(self.request.requirement).start_processing(self.request)
                ServiceFlow(self.request.service).start_processing(self.request)
            except TransitionNotAllowed as e:
                raise e

    @status.transition(source=[ActionStatus.DELIVERED], target=ActionStatus.FINISHED, permission=_user_can_accept)
    def done(self):
        pass

class OrderStepPropertiesBase(PeybarTempObjectModel):
    description = models.TextField(blank=True, null=True)

class TravelerPaymentProperties(OrderStepPropertiesBase):
    pass

class CustomerPaymentProperties(OrderStepPropertiesBase):
    link = models.URLField(blank=True, null=True)

class TravelerPurchaseProperties(OrderStepPropertiesBase):
    image = SBPForeignKey(
        'UserFile',
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='+'
    )

class CustomerPurchaseProperties(OrderStepPropertiesBase):
    image = SBPForeignKey(
        'UserFile',
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='+'
    )

class CustomerDeliverProperties(OrderStepPropertiesBase):
    code = models.CharField(max_length=12)

class TravelerReceiveProperties(OrderStepPropertiesBase):
    code = models.CharField(max_length=12, blank=True, null=True)

class CustomerReceiveProperties(OrderStepPropertiesBase):
    code = models.CharField(max_length=12)

class TravelerDeliverProperties(OrderStepPropertiesBase):
    code = models.CharField(max_length=12, blank=True, null=True)

class DoneProperties(OrderStepPropertiesBase):
    comment = models.TextField(blank=True, null=True)
    rate = models.PositiveIntegerField(default=5)

class OrderStep(PeybarBaseModel):
    type = PeybarEnumField(StepType)
    status = PeybarEnumField(StepStatus, default=StepStatus.WAITING)
    timestamp = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(blank=True, null=True)
    properties = MultipleTypedJSONField(objs=[
        TravelerPaymentProperties,
        CustomerPaymentProperties,
        CustomerPurchaseProperties,
        TravelerPurchaseProperties,
        CustomerDeliverProperties,
        CustomerReceiveProperties,
        TravelerReceiveProperties,
        TravelerDeliverProperties,
        DoneProperties])
    role = PeybarEnumField(RoleType)
    request = SBPForeignKey(
        Request,
        on_delete=models.CASCADE,
        blank=False,
        null=False,
        related_name='steps'
    )
    user = SBPForeignKey(User, blank=False, null=False, on_delete=models.CASCADE)

    follow_step = SBPOneToOneField(
        'OrderStep',
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )

    @property
    def other_step(self):
        if self.follow_step:
            return self.follow_step

        try:
            return OrderStep.objects.get(follow_step=self)
        except OrderStep.DoesNotExist as e:
            return None

    class Meta():
        db_table = 'OrderStep'

class OrderStepFlow():
    status = PeybarState(StepStatus, default=StepStatus.WAITING)

    def __init__(self, step, properties):
        self._step = step
        self._properties = properties

    @status.getter()
    def _status(self):
        return self._step.status

    @status.setter()
    def _set_status(self, value):
        self._step.status = value
        self._step.end_time = timezone.now()

        self._change_properties()

        if self._step.type == StepType.PURCHASE:
            if self._step.role == RoleType.TRAVELER:
                self._step.status = StepStatus.WAITING
                self._step.follow_step.status = StepStatus.PENDING
                self._step.end_time = None
            else:
                self._step.status = value
                self._step.other_step.status = StepStatus.DONE
        elif self._step.type != StepType.DONE and self._step.follow_step:
            self._step.follow_step.status = value
            self._step.follow_step.end_time = timezone.now()

    @status.on_success()
    def _on_status_change(self, descriptor, source, target):
        self._step.save(update_fields=['status', 'end_time', 'properties'])

        if self._step.follow_step:
            self._step.follow_step.save(update_fields=['status', 'end_time', 'properties'])

    def _user_can_accept(self, user):
        return user == self._step.user

    def _check_condition(self):
        return True

    def check_condition(self):
        return self._check_condition()

    def _change_properties(self):
        pass

    @status.transition(source=[StepStatus.PENDING], target=StepStatus.DONE, conditions=[check_condition], permission=_user_can_accept)
    def accept(self, user):
        self._accept(user)

class PaymentStepFlow(OrderStepFlow):
    def _generate_shipping_steps(self, user):
        step = OrderStep(
            type=StepType.DELIVER,
            role=RoleType.CUSTOMER,
            properties=CustomerDeliverProperties(code=randint(1, 2e6)),
            status=StepStatus.WAITING,
            user=user,
            request=self._step.request
        )

        step.save()

        step = OrderStep(
            type=StepType.RECEIVE,
            role=RoleType.TRAVELER,
            properties=TravelerReceiveProperties(),
            follow_step=step,
            status=StepStatus.PENDING,
            user=self._step.follow_step.user,
            request=self._step.request
        )

        step.save()

        return step

    def _generate_shopping_steps(self, user):
        step = OrderStep(
            type=StepType.PURCHASE,
            role=RoleType.CUSTOMER,
            properties=CustomerPurchaseProperties(),
            status=StepStatus.WAITING,
            user=user,
            request=self._step.request
        )

        step.save()

        step = OrderStep(
            type=StepType.PURCHASE,
            role=RoleType.TRAVELER,
            properties=TravelerPurchaseProperties(),
            status=StepStatus.PENDING,
            user=self._step.request.service.trip.user,
            request=self._step.request,
            follow_step=step
        )

        step.save()

        return step

    def _accept(self, user):
        if self._step.request.service.type == ServiceType.SHIPPING:
            self._generate_shipping_steps(user)
        else:
            self._generate_shopping_steps(user)

        if self._step.request.status == ActionStatus.ACCEPTED:
            RequestFlow(self._step.request).payed()

class PurchaseItemFlow(OrderStepFlow):
    def _change_properties(self):
        if self._step.follow_step:
            self._step.properties.image = UserFile.objects.create(
                owner=self._step.user,
                related_object=self._step,
                field_name='item',
                file=self._properties['image']['file']
            )

            self._step.follow_step.properties.image = self._step.properties.image

    def _accept(self, user):
        if self._step.role == RoleType.CUSTOMER:
            step = OrderStep(
                type=StepType.RECEIVE,
                role=RoleType.CUSTOMER,
                properties=CustomerReceiveProperties(code=randint(1, 2e6)),
                status=StepStatus.WAITING,
                user=user,
                request=self._step.request
            )

            step.save()

            step = OrderStep(
                type=StepType.DELIVER,
                role=RoleType.TRAVELER,
                properties=TravelerDeliverProperties(),
                follow_step=step,
                status=StepStatus.PENDING,
                user=self._step.request.traveler,
                request=self._step.request
            )

            step.save()

            if self._step.request.status == ActionStatus.PAYED:
                RequestFlow(self._step.request).received()

class DeliverToAirportFlow(OrderStepFlow):
    def _check_condition(self):
        return self._properties.code == self._step.follow_step.properties.code

    def _change_properties(self):
        self._step.properties.code = self._properties.code

    def _accept(self, user):
        step = OrderStep(
            type=StepType.RECEIVE,
            role=RoleType.CUSTOMER,
            properties=CustomerReceiveProperties(code=randint(1, 2e6)),
            status=StepStatus.WAITING,
            user=self._step.follow_step.user,
            request=self._step.request
        )

        step.save()

        step = OrderStep(
            type=StepType.DELIVER,
            role=RoleType.TRAVELER,
            properties=TravelerDeliverProperties(),
            follow_step=step,
            status=StepStatus.PENDING,
            user=user,
            request=self._step.request
        )

        step.save()

        if self._step.request.status == ActionStatus.PAYED:
            RequestFlow(self._step.request).received()

class ReceiveToCustomerFlow(OrderStepFlow):
    def _check_condition(self):
        return self._properties.code == self._step.follow_step.properties.code

    def _change_properties(self):
        self._step.properties.code = self._properties.code

    def _accept(self, user):
        step = OrderStep(
            type=StepType.DONE,
            role=RoleType.CUSTOMER,
            properties=DoneProperties(),
            user=self._step.follow_step.user,
            status=StepStatus.PENDING,
            request=self._step.request,
        )

        step.save()

        step = OrderStep(
            type=StepType.DONE,
            role=RoleType.TRAVELER,
            properties=DoneProperties(),
            user=user,
            status=StepStatus.PENDING,
            request=self._step.request,
            follow_step=step
        )

        step.save()

        if self._step.request.status == ActionStatus.RECEIVED:
            RequestFlow(self._step.request).delivered()

class DoneFlow(OrderStepFlow):
    def _change_properties(self):
        self._step.properties.description = self._properties.description
        self._step.properties.rate = self._properties.rate

        UserComment.objects.create(
            user=self._step.user,
            commentor=self._step.other_step.user,
            comment=self._properties.description,
            rate=self._properties.rate,
            related_object=self._step.request
        )

    def _accept(self, user):
        from api.models.service import ServiceFlow
        from api.models.requirement import RequirementFlow

        request = self._step.request

        if request.service.trip.user == user:
            ServiceFlow(request.service).done(request, user)
        else:
            RequirementFlow(request.requirement).done(request, user)

        if self._step.request.status == ActionStatus.DELIVERED and \
           OrderStep.objects.filter(
               ~Q(id=self._step.id),
               request=self._step.request,
               status=StepStatus.DONE,
               type=StepType.DONE):
            RequestFlow(self._step.request).done()
