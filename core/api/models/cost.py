#!/usr/bin/env python3

from .temp_object import PeybarTempObjectModel
from .base import PeybarEnumField
from api.models.types import CurrencyType

from django.db import models

class Cost(PeybarTempObjectModel):
    wage = models.FloatField()
    fee = models.FloatField(null=True, blank=True)
    item_price = models.FloatField(
        blank=True, null=True,
        help_text='The estimated price of an item, whether it is a shipping or shopping. For shopping it is necessary.')

    unit = PeybarEnumField(CurrencyType, default=CurrencyType.USD)

    def update(self, validated_data):
        updated = False

        for k, v in validated_data.items():
            if v != getattr(self, k):
                setattr(self, k, v)
                updated = True

        return updated
