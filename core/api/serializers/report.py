from api.models import Ticket, EventSubscribe
from .base import PeybarBaseSerializer, CustomEnumChoiceField
from api.models.types import TicketType

from rest_framework import serializers


class TicketSerializer(PeybarBaseSerializer):
    name = serializers.CharField(
        max_length=100,
        required=True
    )

    email = serializers.EmailField(
        max_length=50,
        required=True
    )

    phone_number = serializers.CharField(
        max_length=20,
        required=True
    )

    topic = CustomEnumChoiceField(
        TicketType,
    )

    subscribe = serializers.BooleanField(
        default=False
    )

    message = serializers.CharField(
        max_length=400,
        required=True
    )

    def create(self, validated_data):
        if self.context['request'] and not self.context['request'].user.is_anonymous:
            validated_data['user'] = self.context['request'].user

        return super().create(validated_data)

    class Meta:
        model = Ticket
        fields = ('name', 'email',
                  'phone_number', 'message', 'topic',
                  'subscribe',)

class SubscribeSerializer(PeybarBaseSerializer):
    email = serializers.EmailField(
        max_length=50,
        required=True
    )

    timestamp = serializers.DateTimeField(
        read_only=True
    )

    def create(self, validated_data):
        if self.context['request'] and not self.context['request'].user.is_anonymous:
            validated_data['user'] = self.context['request'].user

        return super().create(validated_data)


    class Meta:
        model = EventSubscribe
        fields = ('email', 'timestamp')
