#!/usr/bin/env python3

from .base import PeybarBaseSerializer, CustomEnumChoiceField
from .temp_object import \
    (PeybarTempObjectBaseSerializer, PeybarNestedTempObjectSerializer, TempObjectRelatedField, PeybarNonModelBaseSerializer)
from api.models import Location, Position, City, Country
from api.models.types import AirportType, LocationType
from api.models.location import LocationExprFilterOffset

from rest_framework import serializers


class CitySerializer(PeybarBaseSerializer):
    class Meta:
        model = City
        exclude = ('id',)

class CountrySerializer(PeybarBaseSerializer):
    class Meta:
        model = Country
        exclude = ('id',)

class AirportSerializer(PeybarNonModelBaseSerializer):
    type = CustomEnumChoiceField(AirportType)
    iata_code = serializers.CharField(max_length=50)
    website = serializers.CharField(max_length=100)
    airport_code = serializers.CharField(max_length=100)
    name = serializers.CharField(max_length=200)

class LocationOffsetSerializer(PeybarNonModelBaseSerializer):
    def to_internal_value(self, data):
        if not data:
            return LocationExprFilterOffset(
            )

        return LocationExprFilterOffset.parse_key(
            data
        )

class LocationQuerySerializer(PeybarNonModelBaseSerializer):
    limit = serializers.IntegerField(min_value=1, default=10)
    offset = LocationOffsetSerializer(default=lambda: LocationExprFilterOffset())
    query = serializers.CharField(max_length=100, default='')
    type = CustomEnumChoiceField(LocationType, default=None)
    city = serializers.SlugRelatedField(
        queryset=Location.objects.filter(type=LocationType.CITY),
        slug_field='readable_tag',
        default=None)
    country = serializers.SlugRelatedField(
        queryset=Location.objects.filter(type=LocationType.COUNTRY),
        slug_field='readable_tag',
        default=None)
    object_name = serializers.CharField(
        max_length=100,
        default=None)

    def to_internal_value(self, data):
        validated_data = super().to_internal_value(data)

        return validated_data

class LocationSerializer(PeybarBaseSerializer):
    city = serializers.SlugRelatedField(queryset=City.objects.all(), slug_field='name')
    country = serializers.SlugRelatedField(queryset=Country.objects.all(), slug_field='name')
    country_iso2 = serializers.CharField(source='country.iso_2', read_only=True)
    country_iso3 = serializers.CharField(source='country.iso_3', read_only=True)
    type = serializers.SerializerMethodField()
    tag = serializers.CharField(source='readable_tag', read_only=True)

    country_tag = serializers.CharField(
        read_only=True,
        source='country.location.tag')
    city_tag = serializers.CharField(
        read_only=True,
        source='city.location.tag')

    def create(self, validated_data):
        if hasattr(self.context['request'], 'user') and not self.context['request'].user.is_anonymous:
            validated_data['user'] = self.context['request'].user

        return super().create(validated_data)

    def to_representation(self, instance):
        if not instance.related_object:
            rel_ser = None
        elif instance.object_type.model == 'airport':
            rel_ser = AirportSerializer(instance=instance.related_object, context=self.context)
        elif instance.object_type.model == 'city':
            rel_ser = CitySerializer(instance=instance.related_object, context=self.context)
        elif instance.object_type.model == 'country':
            rel_ser = CountrySerializer(instance=instance.related_object, context=self.context)
        else:
            rel_ser = None

        data = super().to_representation(instance)

        if rel_ser:
            data['related_object'] = rel_ser.data

        return data

    def get_type(self, obj):
        if obj.object_type:
            return obj.object_type.model.upper()

        return 'PRIVATE'

    class Meta():
        model = Location
        fields = (
            'city', 'longitude', 'latitude', 'id', 'country_iso2', 'country_iso3',
            'country', 'description', 'type', 'tag', 'country_tag', 'city_tag')

class AirportLocationSerializer(LocationSerializer):
    airport = AirportSerializer(source='related_object')

    def validate(self, data):
        validated_data = super().validate(data)

        if validated_data['location'].type != LocationType.AIRPORT:
            raise serializers.ValidationError(
                {'location': 'Incorrect location type {}'.format(validated_data['location'].type)}
            )

        return validated_data

    class Meta(LocationSerializer.Meta):
        fields = LocationSerializer.Meta.fields + ('airport',)

class UserLocationSerializer(LocationSerializer):
    current = serializers.BooleanField(
        default=False,
        required=False,
    )

    def create(self, validated_data):
        user = self.context['request'].user
        current = validated_data.pop('current', False)

        instance = super().create(validated_data)

        if current:
            profile = user.profile

            profile.set_cur_location(
                instance
            )

        return instance

    def update(self, instance, validated_data):
        user = self.context['request'].user
        current = validated_data.pop('current', False)

        instance = super().update(instance, validated_data)

        if current:
            profile = user.profile

            profile.set_cur_location(
                instance
            )

        return instance

    def to_representation(self, instance):
        out = super().to_representation(instance)

        cur_location = instance.user.profile.get_cur_location()

        if cur_location == instance:
            out['current'] = True

        return out

    class Meta():
        model = Location
        fields = (
            'city', 'longitude', 'latitude', 'id', 'country_iso2', 'country_iso3',
            'country',  'description', 'current')



class PositionSerializer(PeybarNestedTempObjectSerializer):
    location = serializers.PrimaryKeyRelatedField(queryset=Location.objects.all())

    location_data = LocationSerializer(source='location', read_only=True)

    since = serializers.DateTimeField(allow_null=True, required=False)
    to = serializers.DateTimeField(allow_null=True, required=False)

    comment = serializers.CharField(allow_null=True, required=False)

    class Meta():
        sub_model = Position

class GeneralPositionSerializer(PositionSerializer):
    location = serializers.PrimaryKeyRelatedField(queryset=Location.objects.all(), allow_null=True)

class AirportPositionSerializer(PositionSerializer):
    location_data = AirportLocationSerializer(source='location', read_only=True)
