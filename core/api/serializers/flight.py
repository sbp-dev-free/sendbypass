#!/usr/bin/env python3
from .base import PeybarBaseSerializer
from .temp_object import PeybarTempObjectBaseSerializer
from .location import LocationSerializer, PositionSerializer, AirportPositionSerializer
from api.models.flight import Flight, Airline
from api.models.types import FlightStatus

from rest_framework import serializers

class FlightSerializer(PeybarBaseSerializer):
    source = AirportPositionSerializer()
    destination = AirportPositionSerializer()

    number = serializers.CharField(max_length=20, required=True)
    airline = serializers.CharField(max_length=50, source='airline.name')

    def update(self, instance, validated_data):
        if 'destination' in validated_data:
            destination_data = validated_data.pop('destination')

            self.fields['destination'].update(instance.destination, destination_data)

        if 'source' in validated_data:
            source_data = validated_data.pop('source')

            self.fields['source'].update(instance.source, source_data)

        return super().update(instance, validated_data)

    class Meta():
        model = Flight
        fields = ('source', 'destination', 'number', 'airline')
