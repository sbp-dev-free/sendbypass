from api.models.user import UserFile, UserFileWithSymlink

from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.utils import timezone

import logging
from decimal import Decimal


class Command(BaseCommand):
    help = 'Add symlinks for files'

    def handle(self, *args, **options):
        for user_file in UserFile.objects.all():
            UserFileWithSymlink.create_symlink(user_file.file.path)
