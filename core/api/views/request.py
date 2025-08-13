#!/usr/bin/env python3

from api.models import OrderStep
from api.models.temp_object import TempObject
from api.serializers.request import *
from api.models.request import *
from .base import \
    (
        PeybarTempObjectListCreate,
        AuthenticatedObjectMixin,
        CustomEnumChoiceFilter,
        PeybarTempObjectFilterSet,
        PeybarTempObjectRetrieveUpdateDestroyAPIView,
        PeybarBaseFilter,
        PeybarListCreateAPIView,
        PeybarRetrieveUpdateAPIView,
        PeybarListAPIView
    )
from api.models.types import *
from .parsers import MultiPartJsonParser

from rest_framework import permissions, status, filters
from rest_framework.response import Response
import django_filters
from django.db.models import Q, Case, When, Value as V, F
from django.db.models.functions import Cast
from django_mysql.models import GroupConcat
from rest_framework.parsers import JSONParser

class IsRelatedToRequest(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.requirement.user == request.user or \
            obj.service.trip.user == request.user

class IsStepRelatedToUser(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class RequestFilter(PeybarBaseFilter):
    type = CustomEnumChoiceFilter(ServiceType, method='filter_type')
    side = CustomEnumChoiceFilter(RequestSide, method='filter_side')
    role = CustomEnumChoiceFilter(RoleType, method='filter_role')

    service = django_filters.ModelChoiceFilter(queryset=Service.objects.all(), method='filter_service')
    requirement = django_filters.ModelChoiceFilter(queryset=Requirement.objects.all(), method='filter_requirement')

    status = CustomEnumChoiceFilter(ActionStatus)

    def filter_role(self, queryset, name, value):
        if value == RoleType.CUSTOMER:
            return queryset.filter(
                requirement__user=self.request.user
            )
        else:
            return queryset.filter(
                ~Q(requirement__user=self.request.user)
            )

    def filter_type(self, queryset, name, value):
        return queryset.filter(requirement__type=value)

    def filter_side(self, queryset, name, value):
        if value == RequestSide.OUTBOX:
            return queryset.filter(submitted_by=self.request.user)
        else:
            return queryset.filter(~Q(submitted_by=self.request.user))

    def filter_service(self, queryset, name, value):
        return queryset.filter(service=value)

    def filter_requirement(self, queryset, name, value):
        return queryset.filter(requirement=value)

    class PeybarMeta():
        model = Request

class RequestList(
        PeybarListCreateAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
        permissions.DjangoModelPermissionsOrAnonReadOnly
    ]

    serializer_class = RequestSerializer
    filterset_class = RequestFilter

    ordering_fields = ['submit_time', 'status',]

    def get_queryset(self):
        return Request.objects.filter(
            Q(service__trip__user=self.request.user) | Q(requirement__user=self.request.user),
            status__in=[ActionStatus.PENDING, ActionStatus.SUBMITTED, ActionStatus.CANCELED, ActionStatus.REJECTED],
        )

class ActivityRequestFilter(RequestFilter):
    activity = CustomEnumChoiceFilter(ActivityType, method='get_activity')

    def get_activity(self, queryset, name, value):
        if value == ActivityType.SERVICE:
            return queryset.filter(
                service__trip__user=self.request.user
            )
        elif value == ActivityType.SHIPPING:
            return queryset.filter(
                requirement__user=self.request.user,
                requirement__type=ServiceType.SHIPPING
            )
        else:
            return queryset.filter(
                requirement__user=self.request.user,
                requirement__type=ServiceType.SHOPPING
            )

    def filter_queryset(self, queryset):
        queryset = super().filter_queryset(queryset)

        return queryset.annotate(
            object_id=\
            Case(When(Q(requirement__user=self.request.user),
                      then=F('requirement')),
                 default=F('service')),
            object_type=\
            Case(When(Q(requirement__user=self.request.user),
                      then=Case(
                          When(
                              Q(requirement__type=ServiceType.SHIPPING),
                              then=V(ActivityType.SHIPPING, output_field=PeybarEnumField(ActivityType))),
                          default=V(ActivityType.SHOPPING, output_field=PeybarEnumField(ActivityType)),
                      )),
                 default=V(ActivityType.SERVICE, output_field=PeybarEnumField(ActivityType))),
            side=Case(When(Q(submitted_by=self.request.user), then=V(RequestSide.OUTBOX,
                                                                     output_field=PeybarEnumField(RequestSide))),
                      default=V(RequestSide.INBOX, output_field=PeybarEnumField(RequestSide)))).\
                 values('object_id', 'object_type', 'side').annotate(requests=GroupConcat(F('id'))).\
                 values('object_id', 'object_type', 'side', 'requests')

class ActivityRequestList(
        PeybarListAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    serializer_class = ActivityRequestSerializer
    filterset_class = ActivityRequestFilter

    def get_queryset(self):
        return Request.objects.filter(
            Q(service__trip__user=self.request.user) | Q(requirement__user=self.request.user),
            status__in=[ActionStatus.PENDING, ActionStatus.SUBMITTED, ActionStatus.CANCELED, ActionStatus.REJECTED]
        )

class RequestDetail(
        PeybarRetrieveUpdateAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsRelatedToRequest,
        permissions.DjangoModelPermissions
    ]

    serializer_class = RequestSerializer

    def get_queryset(self):
        return Request.objects.filter(
            Q(service__trip__user=self.request.user) | Q(requirement__user=self.request.user),
            status__in=[ActionStatus.PENDING, ActionStatus.SUBMITTED],
        )

    def patch(self, request, version, *args, **kwargs):
        data = request.data

        if 'status' in request.data:
            try:
                new_status = ActionStatus[request.data.pop('status')]
            except ValueError as e:
                return Response(
                    status=status.HTTP_400_BAD_REQUEST,
                    data={'status': 'Not a valid status {}.'.format(status)}
                )

            obj = self.get_object()

            if new_status == ActionStatus.ACCEPTED:
                flow = RequestFlow(obj)

                if not flow.accept.has_perm(request.user):
                    return Response(
                        status=status.HTTP_403_FORBIDDEN,
                        data={'Self user could not accept the request by himself.'}
                    )

                flow.accept(request.user)
            elif new_status == ActionStatus.CANCELED:
                flow = RequestFlow(obj)

                if not flow.cancel.has_perm(request.user):
                    return Response(
                        status=status.HTTP_403_FORBIDDEN,
                        data={'Self user could not accept the request by himself.'}
                    )
                flow.cancel(request.user)
            elif new_status == ActionStatus.REJECTED:
                flow = RequestFlow(obj)

                if not flow.reject.has_perm(request.user):
                    return Response(
                        status=status.HTTP_403_FORBIDDEN,
                        data={'Self user could not accept the request by himself.'}
                    )
                flow.reject(request.user)

            ser = self.get_serializer(instance=obj)

            return Response(
                status=status.HTTP_200_OK,
                data=ser.data
            )

class OrderList(
        PeybarListCreateAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsRelatedToRequest
    ]

    serializer_class = OrderSerializer
    filterset_class = RequestFilter

    def get_queryset(self):
        return Request.objects.filter(
            Q(service__trip__user=self.request.user) | Q(requirement__user=self.request.user),
            ~Q(status__in=[ActionStatus.PENDING, ActionStatus.CANCELED, ActionStatus.CANCELED, ActionStatus.REJECTED])
        )

class OrderDetail(
        PeybarRetrieveUpdateAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsRelatedToRequest
    ]

    serializer_class = OrderSerializer

    def get_queryset(self):
        return Request.objects.filter(
            Q(service__trip__user=self.request.user) | Q(requirement__user=self.request.user),
            ~Q(status__in=[ActionStatus.PENDING, ActionStatus.CANCELED])
        )

class OrderStepDetail(
        PeybarRetrieveUpdateAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsStepRelatedToUser
    ]

    serializer_class = OrderStepSerializer

    parser_classes = [MultiPartJsonParser, JSONParser]

    def get_queryset(self):
        return OrderStep.objects.filter(
            user=self.request.user
        )

    def patch(self, request, version, *args, **kwargs):
        data = request.data

        if 'status' in request.data:
            if 'properties' not in request.data:
                properties_data = {}
            else:
                properties_data = request.data['properties']

            try:
                new_status = StepStatus[request.data.pop('status')]
            except ValueError as e:
                return Response(
                    status=status.HTTP_400_BAD_REQUEST,
                    data={'status': 'Not a valid status {}.'.format(status)}
                )

            obj = self.get_object()

            kwargs = {
                'data': properties_data,
                'instance': obj.properties,
                'context': self.get_serializer_context()
            }

            if obj.type == StepType.PAYMENT and obj.role == RoleType.CUSTOMER:
                properties_ser = CustomerPaymentPropertiesSerializer(**kwargs)
                properties_ser.parent = self.get_serializer()
                properties_ser.is_valid(raise_exception=True)

                flow = PaymentStepFlow(obj, properties_ser.validated_data)

                if not flow.accept.has_perm(request.user):
                    return Response(
                        status=status.HTTP_403_FORBIDDEN,
                        data={'status': 'User could not change status of step'}
                    )

                flow.accept(request.user)
            elif obj.type == StepType.RECEIVE and obj.role == RoleType.TRAVELER:
                properties_ser = TravelerReceivePropertiesSerializer(**kwargs)
                properties_ser.parent = self.get_serializer()
                properties_ser.is_valid(raise_exception=True)

                flow = DeliverToAirportFlow(obj, properties_ser.validated_data)

                if not flow.accept.has_perm(request.user):
                    return Response(
                        status=status.HTTP_403_FORBIDDEN,
                        data={'status': 'User could not change status of step.'}
                    )

                flow.accept(request.user)
            elif obj.type == StepType.PURCHASE and obj.role == RoleType.TRAVELER:
                if 'properties[image]' in request.data:
                    kwargs['data']['image'] = request.data['properties[image]'][0]

                properties_ser = TravelerPurchasePropertiesSerializer(partial=True, **kwargs)
                properties_ser.parent = self.get_serializer()

                properties_ser.is_valid(raise_exception=True)

                validated_data = properties_ser.validated_data

                flow = PurchaseItemFlow(obj, validated_data)

                if not flow.accept.has_perm(request.user):
                    return Response(
                        status=status.HTTP_403_FORBIDDEN,
                        data={
                            'status': 'User could not change status of step.'
                        }
                    )

                flow.accept(request.user)
            elif obj.type == StepType.PURCHASE and obj.role == RoleType.CUSTOMER:
                properties_ser = CustomerPurchasePropertiesSerializer(partial=True, **kwargs)
                properties_ser.parent = self.get_serializer()

                properties_ser.is_valid(raise_exception=True)

                validated_data = properties_ser.validated_data

                flow = PurchaseItemFlow(obj, validated_data)

                if not flow.accept.has_perm(request.user):
                    return Response(
                        status=status.HTTP_403_FORBIDDEN,
                        data={
                            'status': 'User could not change status of step.'
                        }
                    )

                flow.accept(request.user)
            elif obj.type == StepType.DELIVER and obj.role == RoleType.TRAVELER:
                properties_ser = TravelerDeliverPropertiesSerializer(**kwargs)
                properties_ser.parent = self.get_serializer()
                properties_ser.is_valid(raise_exception=True)

                flow = ReceiveToCustomerFlow(obj, properties_ser.validated_data)

                if not flow.accept.has_perm(request.user):
                    return Response(
                        status=status.HTTP_403_FORBIDDEN,
                        data={'status': 'User could not change status of step.'}
                    )

                flow.accept(request.user)
            elif obj.type == StepType.DONE:
                properties_ser = DonePropertiesSerializer(**kwargs)
                properties_ser.parent = self.get_serializer()
                properties_ser.is_valid(raise_exception=True)

                flow = DoneFlow(obj, properties_ser.validated_data)

                if not flow.accept.has_perm(request.user):
                    return Response(
                        status=status.HTTP_403_FORBIDDEN,
                        data={'status': 'User could not change status of step.'}
                    )

                flow.accept(request.user)
            else:
                return Response(
                    status=status.HTTP_403_FORBIDDEN,
                    data={'status': 'User could not change status of step.'}
                )
        else:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data='You must set status of step.'
            )

        ser = self.get_serializer(instance=obj)

        return Response(
            status=status.HTTP_200_OK,
            data=ser.data
        )
