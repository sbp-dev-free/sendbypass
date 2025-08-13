#!/usr/bin/env python3

from api.models import Airport
from api.serializers import AirportSerializer
from .base import PeybarListCreateAPIView

class AirportList(PeybarListCreateAPIView):
    serializer_class = AirportSerializer
    queryset = Airport.objects.all()
