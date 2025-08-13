#!/usr/bin/env python3

from .temp_object import PeybarNestedTempObjectSerializer
from api.models.cost import Cost
from .base import CustomEnumChoiceField
from api.models.types import CurrencyType

from rest_framework import serializers

class CostSerializer(PeybarNestedTempObjectSerializer):
    wage = serializers.FloatField()
    fee = serializers.FloatField(required=False, allow_null=True)
    item_price = serializers.FloatField(
        required=False,
        allow_null=True,
        help_text='The estimated price of an item, whether it is a shipping or shopping. For shopping it is necessary.')

    unit = CustomEnumChoiceField(CurrencyType, allow_null=True, default=CurrencyType.USD, required=False)

    class Meta:
        sub_model = Cost
        fields = ['wage', 'fee', 'item_price', 'unit']
