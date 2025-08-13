from .base import PeybarBaseModel, SBPForeignKey
from .location import LocationBaseModel, Location
from .types import LocationType

from django.db import models


class Language(PeybarBaseModel):
    name = models.CharField(max_length=20)
    iso = models.CharField(max_length=10)

    class Meta:
        db_table = 'Language'

class Country(LocationBaseModel):
    long_name = models.CharField(max_length=100)

    name = models.CharField(max_length=50)

    iso_2 = models.CharField(max_length=2)
    iso_3 = models.CharField(max_length=3)

    continent = models.CharField(max_length=30)

    region = models.CharField(max_length=30)

    zip_code = models.IntegerField()

    captial = SBPForeignKey(
        'City',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='+'
    )

    location = SBPForeignKey(
        'Location',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='countries'
    )

    population = models.IntegerField(
        default=0
    )

    def save(self, *args, **kwargs):
        created = False

        if not self.id:
            created = True

        super().save(*args, **kwargs)

        if created:
            l = Location.objects.create(
                country=self,
                city=None,
                latitude=None,
                longitude=None,
                type=LocationType.COUNTRY,
                related_object=self
            )

            self.location = l

            self.save(update_fields=['location',])


    def ident_keys(self):
        return [
            self.iso_2,
            self.iso_3,
            self.name,
            self.long_name
        ]

    class Meta:
        db_table = 'Country'

class City(LocationBaseModel):
    country = SBPForeignKey(
        Country,
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        related_name='cities'
    )
    name = models.CharField(max_length=50)
    name_ascii = models.CharField(max_length=50)

    iso = models.CharField(max_length=10, default='')

    area_code = models.IntegerField(default=0)

    longitude = models.FloatField(blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)

    type = models.CharField(max_length=20)

    province = models.CharField(max_length=50)
    province_ascii = models.CharField(max_length=50)

    population = models.IntegerField(default=0)

    location = SBPForeignKey(
        'Location',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='+'
    )

    def save(self, *args, **kwargs):
        created = False

        if not self.id:
            created = True

        super().save(*args, **kwargs)

        if created:
            l = Location.objects.create(
                country=self.country,
                city=self,
                latitude=self.latitude,
                longitude=self.longitude,
                related_object=self,
                type=LocationType.CITY,
            )

            l.set_new_parent(self.country.location)

            self.location = l

            self.save(update_fields=['location',])

    def ident_keys(self):
        return [
            self.iso,
            self.name_ascii,
            self.name
        ]

    class Meta:
        db_table = 'City'
