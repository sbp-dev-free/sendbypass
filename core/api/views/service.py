#!/usr/bin/env python3

from api.models.temp_object import TempObject
from api.models.service import Service
from api.serializers.service import ServiceSerializer
from api.models import Location
from api.models.requirement import Requirement
from api.models.temp_object import TempObject
from api.models.service import ServiceActionError
from .base import \
    (AuthenticatedObjectMixin,
     PeybarListCreateAPIView,
     PeybarRetrieveUpdateDestroyAPIView,
     PeybarBaseFilter,
     SBPBaseViewException)
from .permission import IsOwner
from .errors import *
from api.models.types import *

from rest_framework import permissions, status
import django_filters
from django.db.models import Q

class ServiceDeleteAPIError(SBPBaseViewException):
    status_code = status.HTTP_406_NOT_ACCEPTABLE

    def _get_api_code(self, itype):
        if itype == ServiceActionError.HAS_REQUEST:
            return APIErrorCode.SERVICE_HAS_REQUEST


class IsTripOrRequestRelateToUser(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if obj.trip.user_id == request.user.id:
            return True

        if not request.method in permissions.SAFE_METHODS:
            return False

        requests = obj.requests.all()

        for irequest in requests:
            if irequest.requirement.user == request.user:
                return True

        return False

class ServiceFilter(PeybarBaseFilter):
    requirement = django_filters.ModelChoiceFilter(
        queryset=Requirement.objects.all(),
        method='filter_requirement')
    trip = django_filters.NumberFilter(method='filter_trip')

    def filter_trip(self, queryset, name, value):
        return queryset.filter(trip_id=int(value))

    def filter_requirement(self, queryset, name, value):
        requirement = value

        kwargs = {
            'type': requirement.type
        }

        if requirement.properties.type == ItemType.DOCUMENT:
            kwargs['properties__type'] = ServiceItemType.DOCUMENT
        else:
            queryset = queryset.filter(
                ~Q(properties__type=ServiceItemType.DOCUMENT)
            )

        return queryset.filter(**kwargs)

    class PeybarMeta():
        model = Service

class ServiceList(
        PeybarListCreateAPIView):
    def get_queryset(self):
        return Service.objects.filter(
            trip__user=self.request.user
        )

    permission_classes = [
        permissions.IsAuthenticated,
        permissions.DjangoModelPermissionsOrAnonReadOnly
    ]

    serializer_class = ServiceSerializer
    filterset_class = ServiceFilter

class ServiceDetail(
        PeybarRetrieveUpdateDestroyAPIView):
    def get_queryset(self):
        #TODO We must check for specific services, this could lead to reveal all services.

        return Service.objects.filter(
        )

    permission_classes = [
        permissions.IsAuthenticated,
        IsTripOrRequestRelateToUser,
        permissions.DjangoModelPermissions]

    serializer_class = ServiceSerializer

    def delete(self, request, *args, **kwargs):
        try:
            return super().delete(request, *args, **kwargs)
        except ServiceActionError as e:
            raise ServiceDeleteAPIError(
                type=e.type,
                detail=e.detail
            )
