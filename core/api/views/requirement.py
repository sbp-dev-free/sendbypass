#!/usr/bin/env python3

from api.serializers import RequirementSerializer
from .base import \
    (PeybarTempObjectListCreate,
     AuthenticatedObjectMixin,
     PeybarTempObjectRetrieveUpdateDestroyAPIView,
     PeybarTempObjectFilterSet,
     CustomEnumChoiceFilter,
     MultipleCustomEnumChoiceFilter,
     PeybarBaseFilter,
     PeybarListCreateAPIView,
     PeybarRetrieveUpdateDestroyAPIView,
     SBPBaseViewException,
     NULL_QUERY_VALUE)
from .permission import IsAuthenticatedOrReadOnly, IsOwner
from .parsers import MultiPartJsonParser
from .errors import APIErrorCode
from api.models.types import \
    (ServiceType, ItemType, RoleType, ServiceItemType, ActionStatus, ProfileStatus)
from api.models.temp_object import TempObject
from api.models.service import Service
from api.models.requirement import RequirementActionError
from api.models import Location, Requirement, City, Country

from rest_framework import permissions, status
from rest_framework.parsers import JSONParser
import django_filters
from django.db import models
from django.db.models import Q
from django.db.models.functions import Cast
from django.utils import timezone

class RequirementAPIModifyError(SBPBaseViewException):
    status_code = status.HTTP_406_NOT_ACCEPTABLE
    default_detail = "Not able to delete"

    def _get_api_code(self, itype):
        if itype == RequirementActionError.HAS_REQUEST:
            return APIErrorCode.REQUIREMENT_HAS_REQUEST

class RequirementFilter(PeybarBaseFilter):
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

    types = MultipleCustomEnumChoiceFilter(ServiceType, method='filter_type')
    service_types = MultipleCustomEnumChoiceFilter(ServiceItemType, method='filter_service_type')
    item_types = MultipleCustomEnumChoiceFilter(ItemType, method='filter_item_type')

    role = CustomEnumChoiceFilter(RoleType, method='filter_role')

    weight = django_filters.NumberFilter(method='filter_weight',)
    cost = django_filters.NumberFilter(method='filter_cost')

    service = django_filters.ModelChoiceFilter(queryset=Service.objects.all(), method='filter_service')

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
                    Q(destination__to__gte=timezone.now())
                )
            )

        return queryset.filter(
            Q(status__in=[ActionStatus.FINISHED, ActionStatus.EXPIRED]) | \
            (
                Q(status__in=[
                    ActionStatus.ACCEPTED,
                    ActionStatus.SUBMITTED
                ]) & \
                Q(destination__to__lt=timezone.now())
            )
        )

    def filter_weight(self, queryset, name, value):
        return queryset.filter(
            properties__weight__lte=float(value)
        )

    def filter_cost(self, queryset, name, value):
        return queryset.filter(
            cost__wage__lte=float(value)
        )

    def filter_role(self, queryset, name, value):
        return queryset

    def filter_from_city(self, queryset, name, value):
        locations = Location.objects.filter(city=value).values('id')

        return queryset.filter(source__location_id__in=locations)

    def filter_to_city(self, queryset, name, value):
        locations = Location.objects.filter(city=value).values('id')

        return queryset.filter(destination__location_id__in=locations)

    def filter_from_location(self, queryset, name, location):
        if location == NULL_QUERY_VALUE:
            return queryset

        q = Q(source__location_id=None) | \
            Q(source__location_id=location.id)

        locations = Location.objects.filter(parent=location).values('id',)

        if locations:
            return queryset.filter(q | Q(source__location_id__in=locations))

        return queryset.filter(q)

    def filter_to_location(self, queryset, name, location):
        if location == NULL_QUERY_VALUE:
            return queryset

        q = Q(destination__location_id=location.id)

        locations = Location.objects.filter(parent=location).values('id',)

        if locations:
            return queryset.filter(q | Q(destination__location_id__in=locations))

        return queryset.filter(q)

    def filter_type(self, queryset, name, value):
        return queryset.filter(
            type__in=value
        )

    def filter_service_type(self, queryset, name, value):
        if len(value) > 1:
            return queryset


        if ServiceItemType.DOCUMENT == value[0]:
            return queryset.filter(properties__type=ItemType.DOCUMENT)
        else:
            return queryset.filter(~Q(properties__type=ItemType.DOCUMENT))

    def filter_item_type(self, queryset, name, value):
        return queryset.filter(
            properties__type__in=value
        )

    def filter_service(self, queryset, name, value):
        service = value

        kwargs = {
            'type': service.type
        }

        if service.properties.type == ServiceItemType.DOCUMENT:
            kwargs['properties__type'] = ItemType.DOCUMENT
        else:
            queryset = queryset.filter(~Q(properties__type=ItemType.DOCUMENT))

        return queryset.filter(**kwargs)

    def filter_queryset(self, queryset):
        initial_queryset = queryset

        if 'types' in self.form.cleaned_data and self.form.cleaned_data['types']:
            initial_queryset = self.filters['types'].filter(initial_queryset, self.form.cleaned_data.pop('types'))

        queryset = super().filter_queryset(initial_queryset)

        if not self.similar:
            return queryset

        return initial_queryset.filter(~Q(id__in=queryset))

    class PeybarMeta():
        model = Requirement

class RequirementList(
        PeybarListCreateAPIView):
    def get_queryset(self):
        queryset = Requirement.objects.all()

        if not self.request.user.is_anonymous:
            if 'role' not in self.request.query_params:
                return queryset.filter(user_id=self.request.user.id)

            try:
                role = RoleType[self.request.query_params['role']]
            except KeyError as e:
                return queryset.none()

            if role == RoleType.CUSTOMER:
                return queryset.filter(user_id=self.request.user.id)

        return queryset.annotate(to=Cast('destination__to', output_field=models.DateTimeField())).filter(
            Q(visible=True),
            Q(user__profile__status=ProfileStatus.VERIFIED),
            (Q(to__isnull=True) | Q(to__gt=timezone.now())),
            status__in=[ActionStatus.ACCEPTED, ActionStatus.PENDING],)

    parser_classes = [MultiPartJsonParser, JSONParser]

    permission_classes = [
        IsAuthenticatedOrReadOnly,
        permissions.DjangoModelPermissionsOrAnonReadOnly
    ]

    serializer_class = RequirementSerializer
    filterset_class = RequirementFilter

class RequirementDetail(
        AuthenticatedObjectMixin,
        PeybarRetrieveUpdateDestroyAPIView):
    queryset = Requirement.objects.all()
    parser_classes = [MultiPartJsonParser, JSONParser]

    permission_classes = [
        permissions.IsAuthenticated,
        IsOwner,
        permissions.DjangoModelPermissions
    ]

    serializer_class = RequirementSerializer

    def patch(self, request, *args, **kwargs):
        try:
            return super().patch(request, *args, **kwargs)
        except RequirementActionError as e:
            raise RequirementAPIModifyError(
                type=e.type,
                detail=e.detail
            )

    def delete(self, request, *args, **kwargs):
        try:
            return super().delete(request, *args, **kwargs)
        except RequirementActionError as e:
            raise RequirementAPIModifyError(
                type=e.type,
                detail=e.detail
            )
