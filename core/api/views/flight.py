#!/usr/bin/env python3

from .base import PeybarTempObjectListCreate
from api.serializers.flight import FlightSerializer
from api.models.flight import Flight

class FlightList(PeybarTempObjectListCreate):
    serializer_class = FlightSerializer
    object_type = Flight
