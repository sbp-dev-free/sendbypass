from api.models.user import UserFile, UserFileWithSymlink
from api.models import Country, City, Airport, Location

from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.utils import timezone

import logging
from decimal import Decimal


class Command(BaseCommand):
    help = 'Add meta data for locations'

    def add_arguments(self, parser):
        parser.add_argument(
            '--search-tag',
            dest='search_tag',
            action='store_true'
        )
        parser.add_argument(
            '--readable-tag',
            dest='readable_tag',
            action='store_true'
        )

    def add_search_tag(self):
        for country in Country.objects.all():
            location = country.location

            if not location.related_object:
                location.related_object = country

                location.save(update_fields=['object_type', 'object_id'])

            location.renew_tag()

        for city in City.objects.all():
            location = city.location

            if not location.related_object:
                location.related_object = city
                location.parent = city.country.location

                location.save(update_fields=['object_type', 'object_id', 'parent'])

            location.renew_tag()

        for location in Location.objects.filter(object_type=Airport.get_content_type()):
            airport = location.related_object

            location.parent = location.city.location

            location.save(update_fields=['parent'])

            location.renew_tag()

    def add_readable_tag(self):
        for country in Country.objects.all():
            location = country.location

            location.add_readable_tag()

        for city in City.objects.all():
            location = city.location

            location.add_readable_tag()

        for location in Location.objects.filter(object_type=Airport.get_content_type()):
            location.add_readable_tag()


    def handle(self, *args, **options):
        if options['search_tag']:
            self.add_search_tag()

        if options['readable_tag']:
            self.add_readable_tag()
