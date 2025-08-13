from api.models.user import UserFileWithSymlink
from api.models.types import DimensionUnit

from rest_framework import serializers
from drf_spectacular.extensions import OpenApiSerializerFieldExtension
from drf_spectacular.plumbing import build_basic_type
from drf_spectacular.openapi import OpenApiTypes


class CategoryFieldFix(OpenApiSerializerFieldExtension):
    target_class = 'api.serializers.base.CustomEnumChoiceField'

    def map_serializer_field(self, auto_schema, direction):
        str = {
            **build_basic_type(OpenApiTypes.STR),
            'enum': [v.label for v in self.target.choices]
        }

        return str


class CustomEnumChoiceField(serializers.ChoiceField):
    def __init__(self, enum_class, **kwargs):
        self._enum_class = enum_class
        
        super().__init__(choices=enum_class,
                         **kwargs)

    def to_representation(self, obj):
        if obj == '' and self.allow_blank:
            return obj

        return self._choices[obj].label

    def to_internal_value(self, data):
        if isinstance(data, self._enum_class):
            return data
        
        # To support inserts with the value
        if data == '' and self.allow_blank:
            return ''

        for key, val in self._choices.items():
            if val.label == data:
                return key

        self.fail('invalid_choice', input=data)

class PeybarBaseSerializer(
        serializers.ModelSerializer):
    pass

class PeybarBaseSerializerNullableFields(
        PeybarBaseSerializer):
    def update(self, instance, validated_data):
        new_instance = super().update(instance, validated_data)

        for field in instance._meta.fields:
            if getattr(new_instance, field.name) and \
               not field.name in validated_data:
                new_instance.field = None

        return new_instance

class PeybarBaseListSerializer(serializers.ListSerializer):
    pass


class PeybarNonModelBaseSerializer(serializers.Serializer):
    pass

class QueryParamSerializer(PeybarNonModelBaseSerializer):
    pass


class SymlinkImageField(serializers.ImageField):
    pass

class WeightField(serializers.FloatField):
    def __init__(self, *args, **kwargs):
        super().__init__(
            *args,
            min_value=0,
            max_value=60000,
            **kwargs
        )

class DimensionField(serializers.FloatField):
    def __init__(self, *args, unit=DimensionUnit.CM, **kwargs):
        super().__init__(
            *args,
            min_value=0,
            max_value=150 if unit==DimensionUnit.CM else 1.5,
            **kwargs
        )
