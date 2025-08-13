#!/usr/bin/env python3

from .base import PeybarBaseSerializer
from .temp_object import PeybarTempObjectBaseSerializer, TempObjectRelatedField
from .base import CustomEnumChoiceField
from .service import ServiceSerializer
from .flight import FlightSerializer
from .user import ProfileSerializer
from .location import LocationSerializer
from api.models.temp_object import TempObject
from api.models.trip import Trip
from api.models.service import Service
from api.models.flight import Flight
from api.models import User, Location
from api.models.types import ActionStatus, ServiceType, ServiceItemType, PublishStatus

from rest_framework import serializers
from django.db import transaction as db_transaction


class TripSerializer(PeybarBaseSerializer):
    id = serializers.IntegerField(read_only=True)

    flight = FlightSerializer()

    ticket_number = serializers.CharField(max_length=50)

    services = serializers.SerializerMethodField()

    image = serializers.ImageField(required=False, source='image.file')

    description = serializers.CharField(required=False, default='', allow_null=True)

    status = CustomEnumChoiceField(ActionStatus, source='get_real_status', read_only=True)

    user_data = ProfileSerializer(read_only=True, source='user.profile')

    publish_status = CustomEnumChoiceField(PublishStatus, read_only=True, source='get_publish_status')


    source = serializers.PrimaryKeyRelatedField(queryset=Location.objects.filter(user__isnull=True), default=None)

    source_data = LocationSerializer(source='source', read_only=True)

    destination = serializers.PrimaryKeyRelatedField(queryset=Location.objects.filter(user__isnull=True), default=None)

    destination_data = LocationSerializer(source='destination', read_only=True)

    def to_representation(self, instance):
        if not isinstance(self.root, TripSerializer)  and \
           ( not isinstance(self.root, serializers.ListSerializer) or not isinstance(self.root.child, TripSerializer)):
            if 'services' in self.fields:
                del self.fields['services']

        return super().to_representation(instance)

    def get_services(self, obj):
        ser = ServiceSerializer(
            context=self.context,
        )

        ser.parent = self

        o = {}

        for service in obj.services.all():
            o['{}:{}'.format(
                service.type.name.lower(),
                service.properties.type.name.lower()
            )] = ser.to_representation(
                instance=service
            )

        return o

    def create(self, validated_data):
        flight_data = validated_data.pop('flight')

        flight, _ = Flight.objects.get_or_create(flight_data)

        validated_data['user'] = self.context['request'].user
        validated_data['flight'] = flight

        image_data = None

        if 'image' in validated_data:
            image_data = validated_data.pop('image')['file']

        services_data = {}

        if 'services' in validated_data and validated_data['services']:
            services_data = validated_data.pop('services')

        with db_transaction.atomic():
            ins = super().create(validated_data)

            if image_data:
                ins.add_image(image_data)

            ser = ServiceSerializer(
                context=self.context
            )

            ser.parent = self

            for service_data in services_data.values():
                service_data['trip'] = ins

                ser.create(service_data)

        return ins

    def to_internal_value(self, data):
        if 'image' in data and isinstance(data['image'], list):
            data['image'] = data['image'][0]

        services_data = {}

        if 'services' in data and data['services']:
            services_data = data['services']

        validated_data = super().to_internal_value(data)

        ser = ServiceSerializer(
            context=self.context
        )

        ser.parent = self

        validated_data['services'] = {}

        for type, service_data in services_data.items():
            service_type, property_type = type.split(':')

            service_type = ServiceType[service_type.upper()]
            property_type = ServiceItemType[property_type.upper()]

            validated_data['services'][(service_type, property_type)] = ser.to_internal_value(service_data)

        return validated_data

    @db_transaction.atomic()
    def update(self, instance, validated_data):
        flight_data = None
        services_data = {}
        image_data = None

        if 'flight' in validated_data:
            flight_data = validated_data.pop('flight')

        if 'services' in validated_data and validated_data['services']:
            services_data = validated_data.pop('services')

        if 'image' in validated_data:
            image_data = validated_data.pop('image')['file']

        visible = validated_data.pop('visible', None)

        if validated_data:
             instance = super().update(instance, validated_data)

        if flight_data:
            instance.change_flight(flight_data)

        partial_ser = ServiceSerializer(
            context=self.context
        )

        partial_ser.parent = self.parent

        create_ser = ServiceSerializer(
            context=self.context
        )

        cur_services = []

        for type, service_data in services_data.items():
            service_type = type[0]
            property_type = type[1]

            try:
                service = next(service for service in instance.services.all() if service.type == service_type and service.properties.type == property_type)

                instance._able_to_modify(raise_exception=True)

                cur_services.append(service)

                partial_ser.update(
                    instance=service,
                    validated_data=service_data
                )
            except StopIteration as e:
                service_data['trip'] = instance

                cur_services.append(create_ser.create(
                    validated_data=service_data,
                ))

        for service in instance.services.all():
            if service not in cur_services:
                instance._able_to_modify(raise_exception=True)

                service.delete()

        if image_data:
            instance.add_image(image_data)

        if visible is not None:
            if visible:
                instance.set_visible()
            else:
                instance.set_invisible()

        return instance

    class Meta():
        model = Trip
        fields = ('id', 'flight', 'ticket_number', 'services', 'image',
                  'description', 'status', 'user_data',
                  'visible', 'publish_status', 'source', 'source_data',
                  'destination', 'destination_data')
