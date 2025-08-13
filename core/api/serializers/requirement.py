#!/usr/bin/env python3

from .base import PeybarBaseSerializer, WeightField, DimensionField
from .user import ProfileSerializer, BusinessProfileSerializer
from api.models.requirement import \
    (Requirement, RequirementPropertiesShopping,
     RequirementPropertiesShipping, RequirementPropertiesShippingDocument)
from api.models import User
from .temp_object import PeybarTempObjectTimedSerializer, TempObjectRelatedField, PeybarNestedTempObjectSerializer
from .base import CustomEnumChoiceField
from api.models.types import *
from .cost import CostSerializer
from api.models.types import ServiceType, ActionStatus
from .location import LocationSerializer, PositionSerializer, GeneralPositionSerializer
from api.models.temp_object import TempObject
from api.models.types import RoleType

from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field, PolymorphicProxySerializer

class RequirementPropertiesBaseSerializer(PeybarNestedTempObjectSerializer):
    type = CustomEnumChoiceField(ItemType)

class RequirementPropertiesShoppingSerializer(RequirementPropertiesBaseSerializer):
    weight = WeightField()
    height = DimensionField(required=False,)
    length = DimensionField(required=False)
    width = DimensionField(required=False)
    link = serializers.URLField(
        max_length=2000,
        allow_null=True,
        allow_blank=True, required=False)
    flexible_dimensions = serializers.BooleanField(default=False, )

    class Meta():
        sub_model = RequirementPropertiesShopping

class RequirementPropertiesShippingSerializer(RequirementPropertiesBaseSerializer):
    type = CustomEnumChoiceField(ItemType)
    weight = WeightField()
    height = DimensionField(required=False)
    length = DimensionField(required=False)
    width = DimensionField(required=False)
    flexible_dimensions = serializers.BooleanField(default=False, )

    class Meta():
        sub_model = RequirementPropertiesShipping

class RequirementPropertiesShippingDocumentSerializer(RequirementPropertiesBaseSerializer):
    type = CustomEnumChoiceField(ItemType)
    weight = WeightField()
    size = CustomEnumChoiceField(DocumentSizeType, default=DocumentSizeType.A4)
    length = DimensionField(required=False, unit=DimensionUnit.CM)
    width = DimensionField(required=False, unit=DimensionUnit.CM)
    num = serializers.IntegerField(required=True)

    class Meta():
        sub_model = RequirementPropertiesShippingDocument

@extend_schema_field(
    PolymorphicProxySerializer(
        serializers=[
            RequirementPropertiesShoppingSerializer,
            RequirementPropertiesShippingSerializer,
            RequirementPropertiesShippingDocumentSerializer],
        component_name='properties',
        resource_type_field_name='properties'
    ))
class PropertiesSerializer(serializers.Serializer):
    type = CustomEnumChoiceField(ItemType)

class RequirementSerializer(PeybarBaseSerializer):
    def to_representation(self, instance):
        from .request import RequirementRequestSerializer, RequestSerializer, ActivityRequestSerializer

        if not isinstance(self.root, RequestSerializer) and \
           not isinstance(self.root, ActivityRequestSerializer) and \
           (not isinstance(self.root, serializers.ListSerializer) or \
            not isinstance(self.root.child,
                           RequestSerializer) or \
            not isinstance(self.root.child,
                           ActivityRequestSerializer)):
            self.fields['requests'] = RequirementRequestSerializer(many=True, read_only=True)

            if 'user' in self.fields:
                del self.fields['user']

            if instance.user.is_business_account():
                ser = BusinessProfileSerializer(source='user.profile')

                ser.parent = self

                self.fields['user_data'] = ser

        if instance.type == ServiceType.SHIPPING:
            if instance.properties.type == ItemType.DOCUMENT:
                ser = RequirementPropertiesShippingDocumentSerializer(context=self.context)

                obj = RequirementPropertiesShippingDocument
            else:
                ser = RequirementPropertiesShippingSerializer(context=self.context)

                obj = RequirementPropertiesShipping
        else:
            ser = RequirementPropertiesShoppingSerializer(context=self.context)

            obj = RequirementPropertiesShopping

        ser.parent = self

        self.fields['properties'] = ser

        data = super().to_representation(instance)

        if 'requests' in self.fields:
            requests = instance.requests

            data['requests'] = self.fields['requests'].to_representation(requests)

        return data

    def to_internal_value(self, data):
        if 'image' in data and isinstance(data['image'], list):
            data['image'] = data['image'][0]

        validated_data = super().to_internal_value(data)

        if 'properties' in data:
            if self.instance:
                type = self.instance.type

                item_type = self.instance.properties.type
            else:
                type = validated_data['type']

                item_type = validated_data['properties']['type']

            kwargs = {
                'context': self.context,
                'instance': self.instance.properties if self.instance else None,
                'partial': self.partial,
                'data': data.pop('properties')
            }

            if type == ServiceType.SHIPPING:
                if item_type == ItemType.DOCUMENT:
                    ser = RequirementPropertiesShippingDocumentSerializer(**kwargs)
                else:
                    ser = RequirementPropertiesShippingSerializer(**kwargs)
            else:
                ser = RequirementPropertiesShoppingSerializer(**kwargs)

            ser.parent = self
            self.fields['properties'] = ser

            ser.is_valid(raise_exception=True)

            validated_data['properties'] = ser.validated_data

        return validated_data

    def update(self, instance, validated_data):
        image_data = None

        if 'source' in validated_data or \
           'destination' in validated_data:
            instance.change_locations(source=validated_data.pop('source', None),
                                      destination=validated_data.pop('destination', None))

        if 'cost' in validated_data:
            instance.change_cost(
                validated_data.pop('cost')
            )

        if 'properties' in validated_data:
            instance.change_properties(
                validated_data.pop('properties')
            )

        if 'image' in validated_data:
            image_data = validated_data.pop('image')['file']

        if validated_data:
            instance = super().update(instance, validated_data)

        if image_data:
            instance.add_image(image_data)

        return instance

    type = CustomEnumChoiceField(ServiceType)
    cost = CostSerializer()
    source = GeneralPositionSerializer()
    destination = PositionSerializer()
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    user_data = ProfileSerializer(read_only=True, source='user.profile')

    properties = PropertiesSerializer()
    status = CustomEnumChoiceField(ActionStatus, source='get_real_status', read_only=True)

    comment = serializers.CharField(
        required=False,
        default='',
        allow_null=True,
        allow_blank=True)

    image = serializers.ImageField(required=False, source='image.file')
    name = serializers.CharField(required=True)

    role = serializers.SerializerMethodField()

    publish_status = CustomEnumChoiceField(PublishStatus, read_only=True, source='get_publish_status')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        image_data = None

        if 'image' in validated_data:
            image_data = validated_data.pop('image')['file']

        ins = super().create(validated_data)

        if image_data:
            ins.add_image(image_data)

        return ins

    def get_role(self, obj):
        request = self.context.get('request')

        if isinstance(obj, Requirement):
            user_id = obj.user.id
        else:
            user_id = obj['user']

        if not request.user.is_anonymous and request.user.id == user_id:
            return RoleType.CUSTOMER.name

        return RoleType.TRAVELER.name


    class Meta:
        sub_model = Requirement
        model = Requirement
        fields = '__all__'
