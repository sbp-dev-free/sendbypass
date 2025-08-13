#!/usr/bin/env python3

from .base import PeybarNonModelBaseSerializer, CustomEnumChoiceField, PeybarBaseSerializer
from .temp_object import \
    (PeybarTempObjectTimedSerializer,
     PeybarNestedTempObjectSerializer,
     TempObjectRelatedField, TempObject,
     PeybarTempObjectBaseSerializer)
from api.models.request import *
from api.models import Requirement, Service, User, Trip, OrderStep
from api.models.types import *
from .location import LocationSerializer, PositionSerializer
from .requirement import RequirementSerializer
from .service import ServiceSerializer
from .user import ProfileSerializer

from rest_framework import serializers, exceptions
from drf_spectacular.utils import extend_schema_field, PolymorphicProxySerializer


class DealSerialiezr(PeybarNestedTempObjectSerializer):
    cost = serializers.FloatField()
    traveler_fee = serializers.FloatField(default=0.0)
    requester_fee = serializers.FloatField(default=0.0)

    class Meta:
        sub_model = Deal

class RequestSerializer(PeybarBaseSerializer):
    requirement = serializers.PrimaryKeyRelatedField(queryset=Requirement.objects.all())
    service = serializers.PrimaryKeyRelatedField(queryset=Service.objects.all())

    requirement_data = RequirementSerializer(read_only=True, source='requirement')
    service_data = ServiceSerializer(read_only=True, source='service')

    deal = DealSerialiezr()

    submitted_by = serializers.SerializerMethodField()
    accepted_by = serializers.SerializerMethodField()

    role = serializers.SerializerMethodField()
    description = serializers.CharField(required=False, default='', allow_blank=True, allow_null=True)

    status = CustomEnumChoiceField(ActionStatus, required=False, source='get_real_status')

    accept_time = serializers.DateTimeField(read_only=True)
    submit_time = serializers.DateTimeField(read_only=True)
    end_time = serializers.DateTimeField(read_only=True)

    traveler_data = ProfileSerializer(read_only=True, source='service.trip.user.profile')
    customer_data = ProfileSerializer(read_only=True, source='requirement.user.profile')

    def to_representation(self, instance):
        out = super().to_representation(instance)

        if instance.status == ActionStatus.DELIVERED:
            try:
                step = OrderStep.objects.get(
                    type=StepType.DONE,
                    status=StepStatus.DONE,
                    user=self.context['request'].user,
                    request=instance
                )
                out['status'] = ActionStatus.FINISHED.label
                out['end_time'] = step.end_time
            except OrderStep.DoesNotExist as e:
                pass
        elif instance.status == ActionStatus.FINISHED:
            # Each side must get different finished time based on the done step of itself
            step = OrderStep.objects.get(
                type=StepType.DONE,
                status=StepStatus.DONE,
                user=self.context['request'].user,
                request=instance
            )

            out['end_time'] = step.end_time

        return out

    def get_submitted_by(self, obj):
        user = self.context['request'].user

        if user == obj.requirement.user:
            return RoleType.CUSTOMER.name if obj.submitted_by == user else RoleType.TRAVELER.name
        else:
            return RoleType.TRAVELER.name if obj.submitted_by == user else RoleType.CUSTOMER.name

    def get_accepted_by(self, obj):
        if not obj.accepted_by:
            return None

        user = self.context['request'].user

        if user == obj.requirement.user:
            return RoleType.TRAVELER.name if obj.submitted_by == user else RoleType.CUSTOMER.name
        else:
            return RoleType.CUSTOMER.name if obj.submitted_by == user else RoleType.TRAVELER.name

    def get_role(self, obj):
        user = self.context['request'].user

        return RoleType.CUSTOMER.name if user == obj.requirement.user else RoleType.TRAVELER.name

    def create(self, validated_data):
        user = self.context['request'].user

        if user != validated_data['service'].trip.user and \
           user != validated_data['requirement'].user:
            raise exceptions.PermissionDenied

        validated_data['submitted_by'] = user

        return super().create(validated_data)

    class Meta:
        model = Request
        fields = '__all__'

class RequirementRequestSerializer(PeybarBaseSerializer):
    service = serializers.PrimaryKeyRelatedField(queryset=Requirement.objects.all())
    deal = DealSerialiezr()
    id = serializers.IntegerField()

    class Meta:
        model = Request
        fields = ('service', 'deal', 'id')

class ServiceRequestSerializer(PeybarBaseSerializer):
    service = serializers.PrimaryKeyRelatedField(queryset=Service.objects.all())
    deal = DealSerialiezr()
    id = serializers.IntegerField()

    class Meta:
        model = Request
        fields = ('service', 'deal', 'id')

class ActivityRequestSerializer(PeybarBaseSerializer):
    user = serializers.SerializerMethodField()

    deal = DealSerialiezr()
    description = serializers.CharField(required=False, default='')
    status = CustomEnumChoiceField(ActionStatus, required=False, source='get_real_status')

    accept_time = serializers.DateTimeField(read_only=True)
    submit_time = serializers.DateTimeField(read_only=True)
    end_time = serializers.DateTimeField(read_only=True)

    def get_side(self, obj):
        request = self.context['request']

        if obj.submitted_by == request.user:
            return 'OUTBOX'

        return 'INBOX'

    def get_user(self, obj):
        request = self.context['request']

        if obj.requirement.user == request.user:
            ser = ProfileSerializer(instance=obj.service.trip.user.profile, context=self.context)
        else:
            ser = ProfileSerializer(instance=obj.requirement.user.profile, context=self.context)

        ser.parent = self

        return ser.data

class RequirementActivitySerializer(ActivityRequestSerializer):
    activity = RequirementSerializer(source='requirement')

    class Meta:
        model = Request
        fields = (
            'id', 'user', 'deal',
            'description', 'status', 'accept_time',
            'submit_time', 'end_time', 'activity'
        )

class ServiceActivitySerializer(ActivityRequestSerializer):
    activity = ServiceSerializer(source='service')

    class Meta:
        model = Request
        fields = (
            'id', 'user', 'deal',
            'description', 'status', 'accept_time',
            'submit_time', 'end_time', 'activity'
        )

class ActivityRequestSerializer(PeybarNonModelBaseSerializer):
    id = serializers.IntegerField(read_only=True)
    type = CustomEnumChoiceField(ActivityType, source='object_type')

    activity = serializers.SerializerMethodField()
    requests = serializers.SerializerMethodField()
    side = CustomEnumChoiceField(RequestSide, read_only=True)

    def get_activity(self, obj):
        if obj['object_type'] == ActivityType.SERVICE:
            ser = ServiceSerializer(instance=Service.objects.get(id=obj['object_id']), context=self.context)
        else:
            ser = RequirementSerializer(instance=Requirement.objects.get(id=obj['object_id']), context=self.context)

        ser.parent = self

        return ser.data

    def get_requests(self, obj):
        if obj['object_type'] == ActivityType.SERVICE:
            ser_cls = RequirementActivitySerializer
        else:
            ser_cls = ServiceActivitySerializer

        out = []

        for request_id in [int(d) for d in obj['requests'].split(',')]:
            ser = ser_cls(instance=Request.objects.get(id=request_id), context=self.context)

            ser.parent = self

            out.append(ser.data)

        return out

class OrderStepPropertiesSerializer(PeybarNestedTempObjectSerializer):
    description = serializers.CharField(required=False, allow_null=True, allow_blank=True)

class TravelerPaymentPropertiesSerializer(OrderStepPropertiesSerializer):
    class Meta():
        sub_model = TravelerPaymentProperties

class CustomerPaymentPropertiesSerializer(OrderStepPropertiesSerializer):
    link = serializers.URLField(read_only=True)

    class Meta():
        sub_model = CustomerPaymentProperties

class CustomerPurchasePropertiesSerializer(OrderStepPropertiesSerializer):
    image = serializers.ImageField(read_only=True, source='image.file')

    class Meta:
        sub_model = CustomerPurchaseProperties

class TravelerPurchasePropertiesSerializer(OrderStepPropertiesSerializer):
    # TODO: This part is buggy, user can send a null image
    image = serializers.ImageField(required=True, source='image.file', allow_null=True)

    class Meta:
        sub_model = TravelerPurchaseProperties

class CustomerDeliverPropertiesSerializer(OrderStepPropertiesSerializer):
    code = serializers.CharField(max_length=12, read_only=True)

    class Meta():
        sub_model = CustomerDeliverProperties

class TravelerReceivePropertiesSerializer(OrderStepPropertiesSerializer):
    code = serializers.CharField(
        max_length=12,
        allow_null=True,
        allow_blank=True)

    class Meta:
        sub_model = TravelerReceiveProperties

class CustomerReceivePropertiesSerializer(OrderStepPropertiesSerializer):
    code = serializers.CharField(
        max_length=12,
        read_only=True)

    class Meta:
        sub_model = CustomerReceiveProperties

class TravelerDeliverPropertiesSerializer(OrderStepPropertiesSerializer):
    code = serializers.CharField(
        max_length=12,
        allow_null=True,
        allow_blank=True)

    class Meta:
        sub_model = TravelerDeliverProperties

class DonePropertiesSerializer(OrderStepPropertiesSerializer):
    rate = serializers.IntegerField(min_value=1, max_value=5)
    comment = serializers.CharField(max_length=2000, allow_blank=True, allow_null=True, required=False)

    class Meta:
        sub_model = DoneProperties
        fields = ('rate', 'comment')

@extend_schema_field(
    PolymorphicProxySerializer(
        serializers=[
            TravelerPaymentPropertiesSerializer,
            CustomerPaymentPropertiesSerializer,
            CustomerDeliverPropertiesSerializer,
            CustomerPurchaseProperties,
            TravelerPurchaseProperties,
            TravelerReceivePropertiesSerializer,
            CustomerReceivePropertiesSerializer,
            TravelerDeliverPropertiesSerializer,
            DonePropertiesSerializer
        ],
        component_name='step_properties',
        resource_type_field_name='properties'
    ))
class StepPropertiesSerializer(serializers.Serializer):
    pass

class OrderStepSerializer(PeybarBaseSerializer):
    timestamp = serializers.DateTimeField()
    type = CustomEnumChoiceField(StepType)
    status = CustomEnumChoiceField(StepStatus)
    end_time = serializers.DateTimeField()
    properties = StepPropertiesSerializer()
    role = CustomEnumChoiceField(RoleType)

    def to_representation(self, instance):
        if isinstance(instance, TempObject):
            instance = OrderStep(**instance.data)

            instance.full_clean()

        data = super().to_representation(instance)
        kwargs = {
            'context': self.context,
            'instance': instance.properties
        }

        if isinstance(instance.properties, TravelerPaymentProperties):
            ser = TravelerPaymentPropertiesSerializer(**kwargs)
        elif isinstance(instance.properties, CustomerPaymentProperties):
            ser = CustomerPaymentPropertiesSerializer(**kwargs)
        elif isinstance(instance.properties, TravelerPurchaseProperties):
            ser = TravelerPurchasePropertiesSerializer(**kwargs)
        elif isinstance(instance.properties, CustomerPurchaseProperties):
            ser = CustomerPurchasePropertiesSerializer(**kwargs)
        elif isinstance(instance.properties, TravelerDeliverProperties):
            ser = TravelerDeliverPropertiesSerializer(**kwargs)
        elif isinstance(instance.properties, CustomerDeliverProperties):
            ser = CustomerDeliverPropertiesSerializer(**kwargs)
        elif isinstance(instance.properties, TravelerReceiveProperties):
            ser = TravelerReceivePropertiesSerializer(**kwargs)
        elif isinstance(instance.properties, CustomerReceiveProperties):
            ser = CustomerReceivePropertiesSerializer(**kwargs)
        elif isinstance(instance.properties, DoneProperties):
            ser = DonePropertiesSerializer(**kwargs)

        ser.parent = self

        data['properties'] = ser.data

        return data

    def to_internal_value(self, validated_data):
        o = super().to_internal_value(validated_data)

        if 'properties' in validated_data:
            if self.instance:
                type = self.instance.type
                role = serlf.instance.role
            else:
                type = o['type']
                role = o['role']

            if type == StepType.PAYMENT:
                if role == RoleType.TRAVELER:
                    ser = TravelerPaymentPropertiesSerializer
                else:
                    ser = CustomerPaymentPropertiesSerializer
            elif type == StepType.PURCHASE:
                if role == RoleType.TRAVELER:
                    ser = TravelerPurchaseProperties
                else:
                    ser = CustomerPurchaseProperties
            elif type == StepType.DELIVER:
                if role == RoleType.TRAVELER:
                    ser = TravelerDeliverPropertiesSerializer
                else:
                    ser = CustomerDeliverPropertiesSerializer
            elif type == StepType.RECEIVE:
                if role == RoleType.TRAVELER:
                    ser = TravelerReceivePropertiesSerializer
                else:
                    ser = CustomerReceivePropertiesSerializer
            else:
                ser = DonePropertiesSerializer

            self.fields['properties'] = ser(context=self.context)

            o['properties'] = self.fields['properties'].to_internal_value(data=validated_data.pop('properties'))

        return o

    class Meta:
        model = OrderStep
        fields = '__all__'

class OrderSerializer(RequestSerializer):
    steps = serializers.SerializerMethodField()

    @extend_schema_field(OrderStepSerializer(many=True))
    def get_steps(self, obj):
        steps = obj.get_steps(self.context['request'].user)

        return OrderStepSerializer(context=self.context, many=True, instance=steps).data
