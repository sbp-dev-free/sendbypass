from .base import PeybarCreateAPIView
from api.serializers import TicketSerializer, SubscribeSerializer
from api.models import Ticket, EventSubscribe

from rest_framework import status, serializers
from rest_framework.response import Response


class TicketList(PeybarCreateAPIView):
    serializer_class = TicketSerializer
    queryset = Ticket.objects.all()

    def post(self, request, version, *args, **kwargs):
        data = request.data

        if 'consent' not in data or \
           not serializers.BooleanField().to_internal_value(data=data['consent']):
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data='Consent is not provided.'
            )

        ser = self.get_serializer(data=request.data)

        ser.is_valid(raise_exception=True)

        validated_data = ser.validated_data

        m = ser.create(validated_data)

        ser = self.get_serializer(instance=m)

        return Response(
            status=status.HTTP_201_CREATED,
            data={'consent': True, **ser.data}
        )

class SubscribeList(PeybarCreateAPIView):
    serializer_class = SubscribeSerializer
    queryset = EventSubscribe.objects.all()
