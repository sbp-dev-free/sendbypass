#!/usr/bin/env python3

from .base import (
    PeybarBaseModel, PeybarEnumField,
    SBPForeignKey, PeybarBaseModelManager,
    ActionError)
from .temp_object import TypedJSONField
from .location import Location, Position
from .types import AirportType, FlightStatus

from django.db import models, transaction as db_transaction

class FlightActionError(ActionError):
    ALREADY_ACCEPTED = 0

class Airport(PeybarBaseModel):
    type = PeybarEnumField(AirportType)
    name = models.CharField(max_length=200, blank=False, null=False)

    iata_code = models.CharField(max_length=10, blank=True, null=True)
    website = models.CharField(max_length=50, blank=True, null=True)
    airport_code = models.CharField(max_length=10, blank=True, null=True)

    @property
    def location(self):
        return Location.objects.filter(
            object_type=Airport.get_content_type(),
            object_id=self.id,
            user__isnull=True
        ).earliest('id')

    def ident_keys(self):
        return [
            self.iata_code,
            self.name,
        ]

    class Meta():
        db_table = 'Airport'

class Airline(PeybarBaseModel):
    name = models.CharField(max_length=200, blank=False, null=False)
    icon = models.ImageField(upload_to='airlines/', blank=True, null=True)

    class Meta():
        db_table = 'Airline'

class FlightManager(PeybarBaseModelManager):
    def get_or_create(self, validated_data):
        flights = Flight.objects.filter(
            number=validated_data['number'],
            source__location_id=validated_data['source'].location.id,
            source__to=validated_data['source'].to,
            destination__location_id=validated_data['destination'].location.id,
            destination__to=validated_data['destination'].to
        )

        if flights:
            return flights[0], False

        airline, _ = Airline.objects.get_or_create(name=validated_data.pop('airline')['name'].strip())

        return Flight.objects.create(
            airline=airline,
            **validated_data
        ), True


class Flight(PeybarBaseModel):
    objects = FlightManager()

    source = TypedJSONField(Position)
    destination = TypedJSONField(Position)

    number = models.CharField(max_length=20, blank=True, null=True)

    airline = SBPForeignKey(
        Airline,
        blank=False,
        null=False,
        on_delete=models.CASCADE
    )

    status = PeybarEnumField(FlightStatus, default=FlightStatus.PENDING)

    def update_or_create(self, validated_data):
        if 'number' in validated_data:
            return Flight.objects.get_or_create(
                validated_data
            )

        with db_transaction.atomic():
            f = Flight.objects.filter(pk=self.id).select_for_update()[0]

            if f.status == FlightStatus.ACCEPTED:
                raise FlightActionError(
                    action=ActionError.UPDATE,
                    obj=self,
                    type=FlightActionError.FLIGHT_ALREADY_ACCEPTED,
                    reason='Could not change flight which is accepted.'
                )

            for k, v in validated_data.items():
                if k == 'destination':
                    self.destination.update(validated_data['destination'])
                elif k == 'source':
                    self.source.update(validated_data['source'])
                else:
                    setattr(self, k, v)

            super().save()

            return self, False

    def get_dict(self):
        out = {
            'source': self.source.get_dict(),
            'destination': self.destination.get_dict(),
            'number': self.number,
            'airline': self.airline.name
        }

        out['source']['location'] = out['source'].pop('location_id')
        out['destination']['location'] = out['destination'].pop('location_id')

        return out

    def __str__(self):
        return '{}->{} by {} airline'.format(str(self.source), str(self.destination), self.airline.name)

    class Meta():
        db_table = 'Flight'
