#!/usr/bin/env python3
#

from .base import \
    (PeybarEnumField, PeybarState,
     SBPForeignKey, PeybarBaseModel,
     PeybarBaseModelTimed, ActionError)
from .temp_object import \
    (PeybarTempObjectTimedModel,
     PeybarTempObjectModel,
     TempObjectForeignKey,
     TypedJSONField,
     MultipleTypedJSONField,
     TempObject)
from .user import User
from .trip import Trip, TripFlow
from .types import ServiceType, ActionStatus
from .cost import Cost
from .types import *

from django.db import models, transaction as db_transaction
from django.db.models import Q


class ServiceActionError(ActionError):
    HAS_REQUEST = 0

class ServicePropertiesShopping(PeybarTempObjectModel):
    type = PeybarEnumField(
        ServiceItemType,
        default=ServiceItemType.VISIBLE_LOAD)
    weight = models.FloatField()

class ServicePropertiesShipping(PeybarTempObjectModel):
    type = PeybarEnumField(ServiceItemType)
    weight = models.FloatField()
    height = models.FloatField(blank=True, null=True)
    width = models.FloatField(blank=True, null=True)
    length = models.FloatField(blank=True, null=True)

class Service(PeybarBaseModelTimed):
    trip = SBPForeignKey(
        Trip,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='services')

    type = PeybarEnumField(ServiceType)

    properties = MultipleTypedJSONField(
        objs=[ServicePropertiesShopping, ServicePropertiesShipping])

    cost = TypedJSONField(Cost)

    description = models.TextField(null=True, blank=True)
    status = PeybarEnumField(ActionStatus, default=ActionStatus.SUBMITTED)

    def get_real_status(self):
        now = timezone.now()

        if self.status == ActionStatus.ACCEPTED and \
           now > self.trip.destination.to:
            return ActionStatus.EXPIRED

        return self.status

    @property
    def requests(self):
        from api.models.request import Request

        return Request.objects.filter(
            trip__service=self
        )

    def delete(self):
        with db_transaction.atomic():
            s = Service.objects.filter(pk=self.id).select_for_update()[0]

            from .request import Request

            if Request.objects.filter(
                    service=self
            ).exists():
                raise ServiceActionError(
                    action=ActionError.DELETE,
                    obj=self,
                    type=ServiceActionError.HAS_REQUEST,
                    reason=''
                )

            super().delete()

    class Meta():
        db_table = 'Service'

class ServiceFlow():
    status = PeybarState(ActionStatus, default=ActionStatus.SUBMITTED)

    def __init__(self, service):
        self.service = service

    @status.getter()
    def _status(self):
        return self.service.status

    @status.setter()
    def _set_status(self, value):
        self.service.status = value

    @status.on_success()
    def _on_status_change(self, descriptor, source, target, **kwargs):
        self.service.save(update_fields=['status',])

    @status.transition(source=[ActionStatus.SUBMITTED], target=ActionStatus.ACCEPTED)
    def accept(self, request=None, accept_trip=True):
        if accept_trip and self.service.trip.status == ActionStatus.SUBMITTED:
            TripFlow(self.service.trip).accept(request)

    @status.transition(source=[ActionStatus.PENDING, ActionStatus.ACCEPTED], target=ActionStatus.PENDING)
    def add_request(self, request):
        if self.service.trip.status == ActionStatus.ACCEPTED:
            TripFlow(self.service.trip).add_request(request)

    @status.transition(source=[ActionStatus.PENDING, ActionStatus.PROCESSING], target=ActionStatus.PROCESSING)
    def start_processing(self, request):
        if self.service.trip.status == ActionStatus.PENDING:
            TripFlow(self.service.trip).start_processing(request)

    @status.transition(source=[ActionStatus.PROCESSING, ActionStatus.FINISHED], target=ActionStatus.FINISHED)
    def done(self, request=None, user=None):
        if self.service.trip.status == ActionStatus.PROCESSING and \
           not Service.objects.filter(
               ~Q(id=self.service.id),
               status=ActionStatus.PROCESSING,
               trip=self.service.trip,
           ).exists():
            TripFlow(self.service.trip).done(request)
