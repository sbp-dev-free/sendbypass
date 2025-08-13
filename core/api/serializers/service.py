#!/usr/bin/env python3

from .base import CustomEnumChoiceField, PeybarBaseSerializer, WeightField
from .temp_object import PeybarTempObjectTimedSerializer, TempObjectRelatedField, PeybarNestedTempObjectSerializer
from .cost import CostSerializer
from .user import ProfileSerializer
from api.models import User, Trip
from api.models.service import \
    (Service, ServicePropertiesShipping, ServicePropertiesShopping)
from api.models.types import ServiceType, RoleType, ServiceItemType
from api.models.temp_object import TempObject

from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field, PolymorphicProxySerializer

class ServicePropertiesShoppingSerializer(PeybarNestedTempObjectSerializer):
    type = CustomEnumChoiceField(
        ServiceItemType,
        default=ServiceItemType.VISIBLE_LOAD)
    weight = WeightField()

    class Meta():
        sub_model = ServicePropertiesShopping

class ServicePropertiesShippingSerializer(PeybarNestedTempObjectSerializer):
    type = CustomEnumChoiceField(
        ServiceItemType,
        default=ServiceItemType.VISIBLE_LOAD)
    weight = WeightField()

    class Meta():
        sub_model = ServicePropertiesShipping

@extend_schema_field(
    PolymorphicProxySerializer(
        serializers=[
            ServicePropertiesShoppingSerializer,
            ServicePropertiesShippingSerializer],
        component_name='service_properties',
        resource_type_field_name='service_properties'
    ))
class ServicePropertiesSerializer(serializers.Serializer):
    pass

class ServiceSerializer(PeybarBaseSerializer):
    def to_representation(self, instance):
        from .request import ServiceRequestSerializer, RequestSerializer, ActivityRequestSerializer
        from .trip import TripSerializer

        if isinstance(self.root, serializers.ListSerializer):
            root_type = self.root.child
        else:
            root_type = self.root

        def _remove_user_field():
            if 'user' in self.fields:
                del self.fields['user']

        def _add_requests_field():
            if 'requests' not in self.fields:
                self.fields['requests'] = ServiceRequestSerializer(many=True, read_only=True)

        def _add_trip_data_field():
            if 'trip_data' not in self.fields:
                self.fields['trip_data'] = TripSerializer(read_only=True, source='trip')

        if isinstance(root_type, ServiceSerializer):
            _remove_user_field()
            _add_requests_field()
            _add_trip_data_field()
        elif isinstance(root_type, RequestSerializer) or \
             isinstance(root_type, ActivityRequestSerializer):
            _add_trip_data_field()
        elif isinstance(root_type, TripSerializer):
            _remove_user_field()
            _add_requests_field()

        if instance.type == ServiceType.SHIPPING:
            ser = ServicePropertiesShippingSerializer(context=self.context)

            obj = ServicePropertiesShipping
        else:
            ser = ServicePropertiesShoppingSerializer(context=self.context)

            obj = ServicePropertiesShopping

        self.fields['properties'] = ser

        data = super().to_representation(instance)

        if 'requests' in self.fields:
            requests = instance.requests

            data['requests'] = self.fields['requests'].to_representation(requests)

        return data

    def validate(self, data):
        validated_data = super().validate(data)

        if not self.partial:
            for service in validated_data['trip'].get_services():
                if service.type == validated_data['type'] and \
                   service.properties.type == validated_data['properties'].type:
                    raise serializers.ValidationError({'': 'Already same type service has been added.'})

        return validated_data

    def _find_properties_serializer(self, service_type, properties_type, kwargs={}):
        if service_type == ServiceType.SHIPPING:
            ser = ServicePropertiesShippingSerializer(**kwargs)
        else:
            ser = ServicePropertiesShoppingSerializer(**kwargs)

        if type(self) != type(self.fields['properties']):
            self.fields['properties'] = ser

        return self.fields['properties']

    def to_internal_value(self, data):
        if 'image' in data and isinstance(data['image'], list):
            data['image'] = data['image'][0]

        validated_data = super().to_internal_value(data)

        if 'properties' in data:
            type = validated_data['type']
            properties_type = ServiceItemType[data['properties']['type']]

            # Always set to true

            kwargs = {
                'context': self.context,
                'instance': self.instance.properties if self.instance else None,
                'partial': True,
                'data': data['properties']
            }

            ser = self._find_properties_serializer(type, properties_type, kwargs)

            ser.is_valid(raise_exception=True)

            validated_data['properties'] = ser.validated_data

        return validated_data

    def update(self, instance, validated_data):
        if 'properties' in validated_data:
            self._find_properties_serializer(validated_data['type'], validated_data['properties']['type'])

            properties_data = validated_data.pop('properties')

            self.fields['properties'].update(instance.properties, properties_data)

        if 'cost' in validated_data:
            cost_data = validated_data.pop('cost')

            self.fields['cost'].update(instance.cost, cost_data)

        return super().update(instance, validated_data)

    def create(self, validated_data):
        self._find_properties_serializer(validated_data['type'], validated_data['properties']['type'])

        validated_data['properties'] = self.fields['properties'].Meta.sub_model(**validated_data['properties'])

        instance = super().create(validated_data)

        return instance

    trip = serializers.PrimaryKeyRelatedField(queryset=Trip.objects.all(), required=False)

    type = CustomEnumChoiceField(ServiceType)
    properties = ServicePropertiesSerializer(required=True)
    cost = CostSerializer()

    role = serializers.SerializerMethodField()
    description = serializers.CharField(required=False, default='', allow_blank=True, allow_null=True)

    user = serializers.PrimaryKeyRelatedField(read_only=True, source='trip.user')
    user_data = ProfileSerializer(read_only=True, source='trip.user.profile')

    def get_role(self, obj):
        request = self.context.get('request')

        user_id = obj.trip.user_id

        if not request.user.is_anonymous and request.user.id == user_id:
            return RoleType.TRAVELER.name

        return RoleType.CUSTOMER.name

    class Meta():
        model = Service
        fields = ('trip', 'type', 'properties', 'cost', 'role', 'description', 'user', 'id', 'user_data')
