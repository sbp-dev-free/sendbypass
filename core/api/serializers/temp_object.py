from api.models.temp_object import TempObject
from .base import *

from django.db import transaction as db_transaction, connection
import json
from rest_framework import serializers

class PeybarNestedTempObjectSerializer(PeybarNonModelBaseSerializer):
    def to_internal_value(self, data):
        first_real_anc = self

        while True:
            if not first_real_anc.parent:
                break

            first_real_anc = first_real_anc.parent

            if first_real_anc.partial:
                break

        validated_data = super().to_internal_value(data)

        if first_real_anc.partial or self.partial:
            return validated_data
        else:
            instance = self.Meta.sub_model(**validated_data)

            instance.full_clean()

            return instance

    def update(self, instance, validated_data):
        data = validated_data

        if not isinstance(instance, self.Meta.sub_model):
            m = self.Meta.sub_model(**instance)

            m.clean_fields()
        else:
            m = instance

        for key, value in data.items():
            field = self.fields[key]

            if isinstance(field, serializers.Serializer):
                field.update(getattr(m, key), value)
            else:
                setattr(m, key, value)

        return m

class PeybarNestedTempObjectSerializerNullableFields(PeybarNestedTempObjectSerializer):
    def update(self, instance, validated_data):
        new_instance = super().update(instance, validated_data)

        for field in instance._meta.fields:
            if getattr(new_instance, field.name) and \
               not field.name in validated_data:
                new_instance.field = None

        return new_instance


class PeybarTempObjectBaseSerializer(PeybarNonModelBaseSerializer):
    id = serializers.IntegerField(read_only=True)

    def __init__(self, instance=None, *args, **kwargs):
        if instance:
            instance = self.get_original_instance(instance)

        super().__init__(instance, *args, **kwargs)

    def validate(self, data):
        if hasattr(self, 'initial_data'):
            unknown_keys = set(self.initial_data.keys()) - set(self.fields.keys())
            if unknown_keys:
                raise serializers.ValidationError({'': "Got unknown fields: {}".format(unknown_keys)})

        return super().validate(data)

    def get_original_instance(self, instance):
        m = instance

        if isinstance(instance, TempObject):
            nested = instance.data

            m = self.Meta.sub_model(**nested)

            m.full_clean()

            m.id = instance.object_id
        elif isinstance(instance, dict):
            id = instance.get('id', None)

            m = self.Meta.sub_model(**instance)

            m.id = id
        elif isinstance(instance, str):
            instance = json.loads(instance[1:-1] if instance and instance[0] == '"' else instance)

            id = instance.get('id', None)

            m = self.Meta.sub_model(**instance)

            m.id = id

        return m

    def to_representation(self, instance):
        m = self.get_original_instance(instance)

        data = super().to_representation(m)

        data['id'] = m.id

        return data

    def create(self, validated_data):
        m = self.Meta.sub_model(**validated_data)

        m.save()

        return m

    def update(self, instance, validated_data):
        data = validated_data

        if isinstance(instance, TempObject):
            m = self.Meta.sub_model(**instance.data)

            m.clean_fields()

            m.id = instance.object_id
        else:
            m = instance

        for key, value in data.items():
            field = self.fields[key]

            if isinstance(field, serializers.Serializer):
                new_obj = field.update(getattr(m, key), value)

                setattr(m, key, new_obj)
            else:
                setattr(m, key, value)

        m.save(update_fields=list(data.keys()))

        return m

class PeybarTempObjectTimedSerializer(PeybarTempObjectBaseSerializer):
    created_at = serializers.DateTimeField(read_only=True)

class CustomJSONField(serializers.JSONField):
    def to_representation(self, value):
        if isinstance(value, dict):
            return value
        elif isinstance(value, list):
            return value

        data = json.loads(value)

        return data

class TempObjectRelatedField(serializers.IntegerField):
    def __init__(self, object_type, *args, **kwargs):
        self._obj_type = object_type

        super().__init__(*args, **kwargs)

    def to_representation(self, value):
        return value.id

    def to_internal_value(self, data):
        m = TempObject.objects.filter(
            object_id=data,
            object_type=self._obj_type.__name__
        )

        if not m:
            if not self.allow_null:
                raise serializers.ValidationError('Not correct id {}'.format(data))
            return None

        m = m[0]

        m = self._obj_type(**m.data)

        m.full_clean()

        return m
