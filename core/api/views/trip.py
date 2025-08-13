#!/usr/bin/env python3

from .base import \
    (
        PeybarListCreateAPIView,
        PeybarRetrieveUpdateAPIView,
        PeybarRetrieveUpdateDestroyAPIView,
        CustomEnumChoiceFilter,
        MultipleCustomEnumChoiceFilter,
        PeybarBaseFilter,
        AuthenticatedObjectMixin,
        SBPBaseViewException,
        NULL_QUERY_VALUE
    )
from .errors import *
from api.serializers.trip import TripSerializer
from api.models import Trip, Location, City, Country
from api.models.trip import TripActionError
from api.models.temp_object import TempObject
from api.models.service import Service
from .parsers import MultiPartJsonParser
from .permission import IsOwner, IsAuthenticatedOrReadOnly
from api.models.types import ServiceType, ServiceItemType, RoleType, ActionStatus, ProfileStatus

import django_filters
from django.db.models import Q, Exists, OuterRef
from django.db.models.functions import Cast
from django.db import models
from rest_framework import permissions, status
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from django.utils import timezone

class TripAPIModifyError(SBPBaseViewException):
    status_code = status.HTTP_406_NOT_ACCEPTABLE
    default_detail = "Not able to delete"

    def _get_api_code(self, itype):
        if itype == TripActionError.HAS_REQUEST:
            return APIErrorCode.TRIP_HAS_REQUEST

class TripFilter(PeybarBaseFilter):
    from_city = django_filters.ModelChoiceFilter(
        queryset=City.objects.all(),
        to_field_name='name',
        method='filter_from_city')
    to_city = django_filters.ModelChoiceFilter(
        queryset=City.objects.all(),
        to_field_name='name',
        method='filter_to_city')

    from_location = django_filters.ModelChoiceFilter(
        queryset=Location.objects.filter(Q(user__isnull=True)),
        to_field_name='readable_tag',
        method='filter_from_location',
        null_label='null',
        null_value=NULL_QUERY_VALUE)
    to_location = django_filters.ModelChoiceFilter(
        queryset=Location.objects.filter(Q(user__isnull=True)),
        to_field_name='readable_tag',
        method='filter_to_location',
        null_label='null',
        null_value=NULL_QUERY_VALUE)

    type = CustomEnumChoiceFilter(ServiceType, method='filter_type')
    service_types = MultipleCustomEnumChoiceFilter(ServiceItemType, method='filter_service_item')

    role = CustomEnumChoiceFilter(RoleType, method='filter_role')

    weight = django_filters.NumberFilter(method='filter_weight')

    cost = django_filters.NumberFilter(method='filter_cost')

    active = django_filters.BooleanFilter(method='filter_active')

    def filter_active(self, queryset, name, value):
        if value:
            return queryset.filter(
                ~Q(status__in=[
                    ActionStatus.FINISHED,
                    ActionStatus.EXPIRED,
                    ActionStatus.SUBMITTED,
                    ActionStatus.ACCEPTED]) |
                (
                    Q(status__in=[
                        ActionStatus.ACCEPTED,
                        ActionStatus.SUBMITTED
                    ]) & \
                    Q(flight__destination__to__gte=timezone.now())
                )
            )

        return queryset.filter(
            Q(status__in=[ActionStatus.FINISHED, ActionStatus.EXPIRED]) | \
            (
                Q(status__in=[
                    ActionStatus.ACCEPTED,
                    ActionStatus.SUBMITTED
                ]) & \
                Q(flight__destination__to__lt=timezone.now())
            )
        )

    def filter_weight(self, queryset, name, value):
        return queryset.filter(
            Q(Exists(
                Service.objects.filter(
                    properties__weight__gte=float(value),
                    trip_id=OuterRef('id')
                )
            ))
        )

    def filter_cost(self, queryset, name, value):
        return queryset.filter(
            Q(Exists(
                Service.objects.filter(
                    cost__wage__lte=float(value),
                    trip=OuterRef('id')
                )
            ))
        )

    def filter_type(self, queryset, name, value):
        return queryset.filter(
            Q(Exists(
                Service.objects.filter(
                    type=value,
                    trip=OuterRef('id')
                )
            ))
        )

    def filter_service_item(self, queryset, name, value):
        return queryset.filter(
            Q(Exists(
                Service.objects.filter(
                    properties__type__in=value,
                    trip=OuterRef('id')
                )
            ))
        )

    def filter_role(self, queryset, name, value):
        return queryset

    def filter_from_city(self, queryset, name, value):
        locations = Location.objects.filter(city=value).values('id')

        return queryset.filter(flight__source__location_id__in=locations)

    def filter_to_city(self, queryset, name, value):
        locations = Location.objects.filter(city=value).values('id')

        return queryset.filter(flight__destination__location_id__in=locations)

    def filter_from_location(self, queryset, name, location):
        if location == NULL_QUERY_VALUE:
            return queryset

        q = Q(source_id=location.id)

        locations = Location.objects.filter(parent=location)

        if locations:
            return queryset.filter(q | Q(source__in=locations))

        return queryset.filter(q)

    def filter_to_location(self, queryset, name, location):
        if location == NULL_QUERY_VALUE:
            return queryset

        q = Q(destination=location)

        locations =Location.objects.filter(parent=location)

        if locations:
            return queryset.filter(q | Q(destination__in=locations))

        return queryset.filter(q)

    def filter_queryset(self, queryset):
        initial_queryset = queryset

        if 'type' in self.form.cleaned_data:
            initial_queryset = self.filters['type'].filter(initial_queryset, self.form.cleaned_data.pop('type'))

        queryset = super().filter_queryset(initial_queryset)

        if not self.similar:
            return queryset

        return initial_queryset.filter(~Q(id__in=queryset))

    class PeybarMeta():
        model = Trip

class TripList(
        PeybarListCreateAPIView):
    def get_queryset(self):
        queryset = Trip.objects.all()

        if not self.request.user.is_anonymous:
            if 'role' not in self.request.query_params:
                return queryset.filter(user_id=self.request.user.id)

            try:
                role = RoleType[self.request.query_params['role']]
            except KeyError as e:
                return queryset.none()

            if role == RoleType.TRAVELER:
                return queryset.filter(user_id=self.request.user.id)

        return queryset.annotate(
            to=Cast('flight__destination__to',
                    output_field=models.DateTimeField())).filter(
                        Q(visible=True),
                        Q(user__profile__status=ProfileStatus.VERIFIED),
                        (Q(to__isnull=True) | Q(to__gt=timezone.now())),
                        Q(Exists(
                            Service.objects.filter(
                                trip=OuterRef('id')
                            )
                        )),
                        status__in=[ActionStatus.ACCEPTED, ActionStatus.PENDING],)


    parser_classes = [MultiPartJsonParser, JSONParser]

    permission_classes = [
        IsAuthenticatedOrReadOnly,
        permissions.DjangoModelPermissionsOrAnonReadOnly
    ]

    serializer_class = TripSerializer
    object_type = Trip
    filterset_class = TripFilter

class TripDetail(
        AuthenticatedObjectMixin,
        PeybarRetrieveUpdateDestroyAPIView):
    parser_classes = [MultiPartJsonParser, JSONParser]

    permission_classes = [
        permissions.IsAuthenticated,
        IsOwner,
        permissions.DjangoModelPermissions]

    serializer_class = TripSerializer
    queryset = Trip.objects.all()

    def patch(self, request, *args, **kwargs):
        try:
            if 'visible' in request.data and \
               len(request.data) == 1:
                try:
                    visible = self.get_serializer().fields['visible'].to_internal_value(request.data['visible'])

                    trip = self.get_object()

                    if visible:
                        trip.set_visible()
                    else:
                        trip.set_invisible()

                    return Response(
                        status=status.HTTP_200_OK,
                        data=self.get_serializer(instance=trip).data
                    )
                except ValueError as e:
                    return Response(
                        status=status.HTTP_400_BAD_REQUEST,
                        detail='Set correct visible'
                    )

            return super().patch(request, *args, **kwargs)
        except TripActionError as e:
            raise TripAPIModifyError(
                type=e.type,
                detail=e.detail
            )

    def delete(self, request, *args, **kwargs):
        try:
            return super().delete(request, *args, **kwargs)
        except TripActionError as e:
            raise TripAPIModifyError(
                type=e.type,
                detail=e.detail
            )
