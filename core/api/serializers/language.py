from api.models import Language
from .base import PeybarBaseSerializer

from rest_framework import serializers

class LanguageSerializer(PeybarBaseSerializer):
    name = serializers.CharField(max_length=30)
    iso = serializers.CharField(max_length=4)

    class Meta:
        model = Language
        fields = ('name', 'iso')
