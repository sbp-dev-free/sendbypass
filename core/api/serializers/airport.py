#!/usr/bin/env python3

from .base import PeybarBaseSerializer, CustomEnumChoiceField
from .location import LocationSerializer
from api.models import Airport, Location
from api.models.types import AirportType

from rest_framework import serializers


class AirportSerializer(PeybarBaseSerializer):
    location = LocationSerializer()
    name = serializers.CharField(max_length=200)
    type = CustomEnumChoiceField(AirportType)
    iata_code = serializers.CharField(max_length=50)
    website = serializers.CharField(max_length=100)
    airport_code = serializers.CharField(max_length=100)

    def create(self, validated_data):
        location = validated_data.pop('location')

        ins = super().create(validated_data)

        location = Location.objects.create(
            related_object=ins,
            **location,
        )

        return ins

    class Meta():
        model = Airport
        fields = '__all__'
