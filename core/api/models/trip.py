#!/usr/bin/env python3

from .base import PeybarBaseModel, PeybarState, ActionError, PeybarBaseModelTimed
from .temp_object import PeybarTempObjectTimedModel, TempObjectForeignKey, TypedJSONField, TempObject
from .flight import Flight
from .user import User, UserFile
from .base import SBPForeignKey, PeybarEnumField
from .types import ActionStatus, PublishStatus
from api.utils import send_email, EventAction, Event, EventEmoji, get_slack_bot

from django.db import models, transaction as db_transaction
from django.utils import timezone
from django.template.loader import render_to_string
from django.conf import settings


class TripActionError(ActionError):
    HAS_REQUEST = 0

class TripEvent(EventAction):
    SUBMIT = 'Submit'
    START_PROCES = 'Start Process'
    PENDING = 'Pending'
    ACCEPT = 'Accept'

class Trip(PeybarBaseModelTimed):
    flight = SBPForeignKey(
        Flight,
        on_delete=models.CASCADE,
        blank=False,
        null=False)

    user = SBPForeignKey(
        User,
        on_delete=models.CASCADE,
        blank=False,
        null=False)

    ticket_number = models.CharField(max_length=20)

    image = SBPForeignKey(
        UserFile,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )

    description = models.TextField(null=True, blank=True)
    status = PeybarEnumField(ActionStatus, default=ActionStatus.SUBMITTED)

    visible = models.BooleanField(default=True)

    source = SBPForeignKey(
        'Location',
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='+'
    )

    destination = SBPForeignKey(
        'Location',
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='+'
    )

    def set_visible(self):
        if not self.visible:
            self.visible = True

            self.save(update_fields=['visible',])

    def set_invisible(self):
        if self.visible:
            self.visible = False

            self.save(update_fields=['visible',])

    def add_image(self, file):
        image = UserFile.objects.create(
            owner=self.user,
            related_object=self,
            field_name='image',
            file=file
        )

        self.image = image

        self.save(update_fields=['image'])

    def get_real_status(self):
        now = timezone.now()

        if self.status in (ActionStatus.SUBMITTED, ActionStatus.ACCEPTED) and \
           (self.flight.destination.to and now > self.flight.destination.to):
            return ActionStatus.EXPIRED

        return self.status

    def get_services(self):
        return self.services.all()

    def delete(self):
        with db_transaction.atomic():
            t = Trip.objects.filter(pk=self.id).select_for_update()[0]

            from .request import Request

            if Request.objects.filter(
                    service__in=self.get_services()
            ).exists():
                raise TripActionError(
                    action=ActionError.DELETE,
                    obj=self,
                    type=TripActionError.HAS_REQUEST,
                    reason=''
                )

            self.services.all().delete()
            super().delete()

    def _able_to_modify(self, raise_exception=False):
        from .request import Request

        if Request.objects.filter(
                    service__in=self.get_services()
        ).exists():
            if raise_exception:
                raise TripActionError(
                    action=ActionError.UPDATE,
                    obj=self,
                    type=TripActionError.HAS_REQUEST,
                    reason='Trip has active request'
                )

            return False

        return True

    def change_flight(self, flight_data):
        with db_transaction.atomic():
            t = Trip.objects.filter(pk=self.id).select_for_update()[0]

            if not self._able_to_modify():
                raise TripActionError(
                            action=ActionError.UPDATE,
                            obj=self,
                            type=TripActionError.HAS_REQUEST,
                            reason='Trip has active request'
                        )

            from .location import Position

            flight_data['source'] = Position(
                **flight_data['source']
            )

            flight_data['destination'] = Position(
                **flight_data['destination']
            )

            flight, created = self.flight.update_or_create(flight_data)

            if created:
                self.flight = flight

                self.save(update_fields=['flight',])
            else:
                self.status = ActionStatus.SUBMITTED

                self.save(update_fields=['status',])

            return self

    def change_flight(self, flight_data):
        with db_transaction.atomic():
            t = Trip.objects.filter(pk=self.id).select_for_update()[0]

            if not self._able_to_modify():
                raise TripActionError(
                            action=ActionError.UPDATE,
                            obj=self,
                            type=TripActionError.HAS_REQUEST,
                            reason='Trip has active request'
                        )

            from .location import Position

            flight_data['source'] = Position(
                **flight_data['source']
            )

            flight_data['destination'] = Position(
                **flight_data['destination']
            )

            flight, created = self.flight.update_or_create(flight_data)

            if created:
                self.flight = flight
                self.status = ActionStatus.SUBMITTED

                self.save(update_fields=['flight', 'status'])
            else:
                self.status = ActionStatus.SUBMITTED

                self.save(update_fields=['status',])

            return self

    def save(self, *args, **kwargs):
        if not self.id:
            if not self.source:
                self.source = self.flight.source.location.city.location

            if not self.destination:
                self.destination = self.flight.destination.location.city.location

            super().save(*args, **kwargs)

            self._send_submit_notifs()

            return

        with db_transaction.atomic():
            t = Trip.objects.filter(pk=self.id).select_for_update()[0]


            if 'update_fields' not in kwargs:
                update_fields = []

                for field in Trip._meta.fields:
                    if getattr(self, field.name) != getattr(t, field.name):
                        update_fields.append(field.name)
            else:
                update_fields = kwargs.pop('update_fields')

            if not self._able_to_modify():
                for key in update_fields:
                    if key not in ('visible', 'status'):
                        raise TripActionError(
                            action=ActionError.UPDATE,
                            obj=self,
                            type=TripActionError.HAS_REQUEST,
                            reason='Trip has active request'
                        )

            if 'status' not in update_fields and \
               not (len(update_fields) == 1 and update_fields[0] == 'visible'):
                self.status = ActionStatus.SUBMITTED

                update_fields.append('status')

            super().save(*args, update_fields=update_fields, **kwargs)

    def is_expired(self):
        return self.flight.destination.to < timezone.now()

    def get_publish_status(self):
        if not self.visible:
            return PublishStatus.PRIVATE

        if self.status == ActionStatus.FINISHED or \
           self.is_expired():
            return PublishStatus.FINISHED

        if self.user.able_to_pulish('trip') and \
           self.status == ActionStatus.ACCEPTED:
            return PublishStatus.PUBLISHED

        return PublishStatus.PENDING

    def _send_submit_notifs(self):
        subject = "We’ve Received Your Trip"

        message = render_to_string(
            'add_trip.html',
            {
                'user': self.user,
                'domain': settings.API_SETTINGS['DOMAIN']
            }
        )

        send_email(subject, message, to=[self.user.email])

        get_slack_bot().send(
            'New Trip',
            event=Event(
                TripEvent.SUBMIT,
                self.user,
                data={
                    'id': self.id,
                    'num_services': self.services.count(),
                    'source': self.flight.source.location,
                    'destination': self.flight.destination.location,
                    'flight_time': self.flight.source.to
                },
            ),
            emoji=EventEmoji.AIRPLANE
        )

    class Meta():
        db_table = 'Trip'

class TripFlow():
    status = PeybarState(ActionStatus, default=ActionStatus.SUBMITTED)

    def __init__(self, trip):
        self.trip = trip

    @status.getter()
    def _status(self):
        return self.trip.status

    @status.setter()
    def _set_status(self, value):
        self.trip.status = value

    @status.on_success()
    def _on_status_change(self, descriptor, source, target):
        self.trip.save(update_fields=['status',])

        if target == ActionStatus.ACCEPTED and source != ActionStatus.ACCEPTED:
            self._send_accept_email()

    @status.transition(source=[ActionStatus.SUBMITTED], target=ActionStatus.ACCEPTED)
    def accept(self, request=None):
        pass

    def _send_accept_email(self, request=None):
        subject = "Your Trip Is Live—Start Earning Now!"
        trip = self.trip

        message = render_to_string(
            'accept_trip.html',
            {
                'user': trip.user,
                'domain': settings.API_SETTINGS['DOMAIN']
            }
        )

        send_email(subject, message, to=[trip.user.email])

        get_slack_bot().send(
            'Accept Trip',
            event=Event(
                TripEvent.ACCEPT,
                trip.user,
                data={
                    'id': trip.id,
                    'num_services': trip.services.count(),
                    'source': trip.flight.source.location,
                    'destination': trip.flight.destination.location,
                    'flight_time': trip.flight.source.to
                },
            ),
            emoji=EventEmoji.BELLHOP_BELL
        )

    @status.transition(source=[ActionStatus.PENDING, ActionStatus.ACCEPTED], target=ActionStatus.PENDING)
    def add_request(self, request):
        return

    @status.transition(source=[ActionStatus.PENDING, ActionStatus.PROCESSING], target=ActionStatus.PROCESSING)
    def start_processing(self, request):
        return

    @status.transition(source=[ActionStatus.PROCESSING, ActionStatus.FINISHED], target=ActionStatus.FINISHED)
    def done(self, request):
        return
