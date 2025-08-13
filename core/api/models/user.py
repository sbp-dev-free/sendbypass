#!/usr/bin/env python3

from .temp_object import PeybarTempObjectTimedModel, PeybarTempObjectModel, TypedJSONField
from api.utils import account_activation_token, send_email
from .base import \
    (PeybarBaseModel, SBPForeignKey,
     SBPOneToOneField, PeybarEnumField,
     SBPOneToOneField, PeybarBaseModelManager,
     PeybarBaseModelTimed, ActionError)
from .types import *
from api.utils import get_user_device, EventAction, Event, get_slack_bot, EventEmoji

from django.db import models, transaction as db_transaction
from django.db.models import Count
from django.db.models.functions import Coalesce
from django.contrib.auth.models import Group, Permission, UserManager as BaseUserManager
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.contrib import admin
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from django.contrib import messages
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

import os
import hashlib
from datetime import timedelta


class UserEvent(EventAction):
    REGISTER = 'Register'
    VERIFY_PROFILE = 'Verify Profile'

class UserDocumentError(ActionError):
    STILL_IN_PROCESS = 0

class UserManager(BaseUserManager):
    def create_user(self, email, submit_type=UserSubmitType.WEB, password=None, request=None, **extra_fields):
        if not email:
            raise ValueError('The given email must be set')

        email = self.normalize_email(email)
        user = self.model(email=email, submit_type=submit_type, **extra_fields)

        if submit_type.is_by_using_platform():
            user.set_password(password)

        with db_transaction.atomic():
            user.save(using=self._db)

            profile = Profile.objects.create(user=user)
            device = None

            if request:
                device, _ = get_user_device(request)

            UserDocument.objects.create(
                user=user,
                type=UserDocumentType.REGISTER,
                status=UserDocumentStatus.VERIFIED,
                device=device
            )

            if submit_type.is_by_using_platform():
                if request:
                    user.verify_email(request)
            else:
                document = UserDocument.objects.create(
                    user=user,
                    type=UserDocumentType.EMAIL,
                    device=device
                )

                user.set_email_verified()

        return user

    def create_superuser(self, email,  password=None, **extra_fields):
        if not email:
            raise ValueError("User must have an email")
        if not password:
            raise ValueError("User must have a password")

        user = self.model(
            email=self.normalize_email(email)
        )

        user.set_password(password)

        user.is_staff = True
        user.is_active = True

        user.save(using=self._db)

        return user

class Social(PeybarBaseModel):
    type = PeybarEnumField(SocialType)
    link = models.CharField(max_length=200)

    verified = models.BooleanField(default=False)

    class Meta():
        db_table = 'Social'

class PhoneNumber(PeybarBaseModelTimed):
    zone_code = SBPForeignKey(
        'Country',
        on_delete=models.DO_NOTHING,
        blank=False,
        null=False)
    phone = models.CharField(max_length=12, blank=False, null=False)

    class Meta:
        db_table = 'PhoneNumber'

class UserContact(PeybarBaseModelTimed):
    type = PeybarEnumField(ContactType)

    user = SBPForeignKey(
        'User',
        on_delete=models.CASCADE,
        blank=False,
        null=False
    )

    contact = GenericForeignKey(
        'object_type',
        'object_id'
    )

    object_type = SBPForeignKey(
        ContentType,
        on_delete=models.PROTECT,
        db_index=False,
        db_constraint=False)
    object_id = models.PositiveBigIntegerField(
        blank=False,
        null=False)

    class Meta:
        db_table = 'UserContact'

# use just for consistent migrations
class OldPhoneNumber(PeybarTempObjectModel):
    zip_code = SBPForeignKey(
         'Country',
         on_delete=models.DO_NOTHING,
         blank=False,
         null=False)
    area_code = models.CharField(max_length=4, blank=True, null=True)
    phone = models.CharField(max_length=12, blank=False, null=False)
    socials = models.JSONField(blank=True, null=True, default=list)

class Profile(PeybarBaseModelTimed):
    user = SBPOneToOneField(
        'User',
        on_delete=models.CASCADE,
        blank=False,
        null=False
    )

    email_verified = models.BooleanField(default=False)

    first_name = models.CharField(max_length=200, blank=True, null=True)
    last_name = models.CharField(max_length=200, blank=True, null=True)

    image = SBPForeignKey(
        'UserFile',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='avatars'
    )

    background = SBPForeignKey(
        'UserFile',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='backgrounds'
    )

    total_orders = models.PositiveIntegerField(default=0)
    rates = models.JSONField(default=dict)

    status = PeybarEnumField(ProfileStatus, default=ProfileStatus.PENDING)

    bio = models.CharField(max_length=200, blank=True, null=True)
    website = models.CharField(max_length=200, blank=True, null=True)

    current_location = SBPForeignKey(
        'Location',
        on_delete=models.SET_NULL,
        blank=True,
        null=True
    )

    speak_languages = models.ManyToManyField('Language')

    type = PeybarEnumField(
        ProfileType,
        default=ProfileType.PERSONAL
    )

    def aggregate_comment(self, comment):
        self.total_orders += 1

        if comment.rate not in self.rates:
            self.rates[comment.rate] = 0

        self.rates[comment.rate] += 1

        self.save(update_fields=['total_orders', 'rates'])

    def save(self, *args, update_fields=None, **kwargs):
        created = False

        if not self.id:
            created = True

        super().save(*args, update_fields=update_fields, **kwargs)

    def is_verified(self):
        return self.status == ProfileStatus.VERIFIED

    def get_cur_location(self):
        if self.current_location:
            return self.current_location

        from api.models import Location

        try:
            return Location.objects.filter(user=self.user).latest('id')
        except Location.DoesNotExist as e:
            return None

    def set_cur_location(self, loc):
        self.current_location = loc

        self.save(update_fields=['current_location',])

    @property
    def full_name(self):
        if not self.first_name and not self.last_name:
            return self.user.email

        if not self.last_name:
            return self.first_name

        return '{} {}'.format(self.first_name, self.last_name)

    def set_verified(self,):
        if self.status == ProfileStatus.VERIFIED:
            return

        self.status = ProfileStatus.VERIFIED

        self.save(update_fields=['status',])

        self.send_verify_email()

    def send_verify_email(self):
        email = self.user.email

        subject = "Your profile has been approved!"

        message = render_to_string('verify_profile.html', {
            'user': self.user,
            'domain': settings.API_SETTINGS['DOMAIN'],
        })

        send_email(subject, message, to=[email])

        get_slack_bot().send(
            'User Verified',
            event=Event(
                UserEvent.VERIFY_PROFILE,
                self.user,
                data={
                    'id': self.user.id,
                },
            ),
            emoji=EventEmoji.NAZAR
        )


    class Meta():
        db_table = 'Profile'

class UserDocument(PeybarBaseModel):
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(blank=True, null=True)

    user = SBPForeignKey(
        'User',
        on_delete=models.CASCADE,
        blank=False,
        null=False,
        related_name='documents'
    )

    type = PeybarEnumField(UserDocumentType)
    status = PeybarEnumField(UserDocumentStatus, default=UserDocumentStatus.PENDING)

    device = models.JSONField(blank=True, null=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        self.user.check_user_status(self)

    class Meta():
        db_table = 'UserDocument'

class UserComment(PeybarBaseModel):
    user = SBPForeignKey(
        'User',
        on_delete=models.CASCADE,
        blank=False,
        null=False,
        related_name='received_comments'
    )

    commentor = SBPForeignKey(
        'User',
        on_delete=models.CASCADE,
        blank=False,
        null=False,
        related_name='send_comments'
    )

    object_type = SBPForeignKey(
        ContentType,
        on_delete=models.PROTECT,
        db_index=False,
        db_constraint=False)
    object_id = models.PositiveBigIntegerField(
        blank=False,
        null=False)

    related_object = GenericForeignKey(
        'object_type',
        'object_id')

    rate = models.PositiveIntegerField()
    comment = models.TextField(null=True, blank=True)

    def save(self, *args, **kwargs):
        first_insert = False

        if not self.id:
            first_insert = True

        super().save(*args, **kwargs)

        if first_insert:
            user_profile = self.user.profile

            user_profile.aggregate_comment(self)

    class Meta():
        db_table = 'UserComment'

def upload_to(instance, filename):
    ext = ".".join(filename.split(".")[1:])

    model_name = instance.object_type.model
    object_id = instance.object_id

    num = UserFile.objects.filter(
        owner=instance.owner,
        object_id=instance.id,
        object_type=instance.get_content_type(),
        field_name=instance.field_name,
    ).aggregate(total=Coalesce(Count('id'), 0))['total']

    filename = '{}-{}_{}.{}'.format(
        instance.field_name,
        object_id,
        str(num),
        ext
    )

    path = 'user_images/{}/{}'.format(instance.owner.id, model_name)

    return os.path.join(path, filename)

class UserFileWithSymlinkFile(models.ImageField.attr_class):
    @staticmethod
    def generate_symlink_name(path):
        return hashlib.sha256(path.encode()).hexdigest()[:30]

    @property
    def url(self):
        if settings.SBP['PROTECT_MEDIA_FILES']:
            return '/files/{}'.format(self.generate_symlink_name(self.path))

        return super().url


class UserFileWithSymlink(models.ImageField):
    attr_class = UserFileWithSymlinkFile

    @staticmethod
    def create_symlink(path):
        symlink_name = UserFileWithSymlink.attr_class.generate_symlink_name(path)
        symlink_filename = '{}{}'.format(settings.SBP['MEDIA_SYMLINK_ROOT'], symlink_name)

        if settings.SBP['RUN_IN_CONTAINER']:
            path = path[path.find(settings.MEDIA_ROOT) + len(settings.MEDIA_ROOT):]

            path = '{}{}'.format(settings.SBP['CONTAINER_HOST_MEDIA_ROOT'], path)

        os.symlink(path, symlink_filename)

        return symlink_filename

    def pre_save(self, model_instance, add):
        file = super().pre_save(model_instance, add)

        if settings.SBP['PROTECT_MEDIA_FILES']:
            self.create_symlink(file.path)

        return file

class UserFile(PeybarBaseModel):
    owner = SBPForeignKey(
        'User',
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )

    file = UserFileWithSymlink(blank=False, null=False, upload_to=upload_to)

    object_type = SBPForeignKey(
        ContentType,
        on_delete=models.PROTECT,
        db_index=False,
        db_constraint=False)

    object_id = models.PositiveBigIntegerField(
        blank=False,
        null=False)

    related_object = GenericForeignKey(
        'object_type',
        'object_id')

    field_name = models.CharField(max_length=100, blank=False, null=False)

    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    status = PeybarEnumField(UserDocumentStatus, default=UserDocumentStatus.PENDING)

    device = models.JSONField(blank=True, null=True)

    def __str__(self):
        return '{}: {}'.format(self.created_at, self.file.url)

    class Meta():
        db_table = 'UserFile'

class User(AbstractBaseUser, PermissionsMixin):
    objects = UserManager()

    email = models.EmailField(unique=True)
    register_time = models.DateTimeField(auto_now_add=True)

    kyc_level = models.PositiveIntegerField(default=0)

    submit_type = PeybarEnumField(UserSubmitType, default=UserSubmitType.WEB)

    is_staff = models.BooleanField(
        _("staff status"),
        default=False,
        help_text=_("Designates whether the user can log into this admin site."),
    )

    is_active = models.BooleanField(
        _("active"),
        default=True,
        help_text=_(
            "Designates whether this user should be treated as active. "
            "Unselect this instead of deleting accounts."
        ),
    )

    USERNAME_FIELD = 'email'
    REQUIERED_FIELDS = []

    def able_to_pulish(self, model):
        return self.profile.is_verified() and \
            self.kyc_level > 0

    def get_permissions(user):
        if user.is_superuser:
            return Permission.objects.all()

        return user.user_permissions.all() | Permission.objects.filter(group__user=user)

    def set_email_verified(self):
        profile = Profile.objects.get(user=self)

        profile.email_verified = True
        profile.save(update_fields=['email_verified',])

        document = UserDocument.objects.get(
            user=self,
            type=UserDocumentType.EMAIL,
            status=UserDocumentStatus.PENDING)

        document.status = UserDocumentStatus.VERIFIED

        document.save(update_fields=['status',])

        self.save(update_fields=['kyc_level',])

        self._send_welcome_email()

    def _send_welcome_email(self):
        subject = "You’re Verified! Let’s Get Started with Sendbypass"

        message = render_to_string(
            'welcome.html',
            {
                'user': self,
                'domain': settings.API_SETTINGS['DOMAIN']
            }
        )

        send_email(subject, message, to=[self.email])

    def send_reset_password(self, request):
        current_site = get_current_site(request)

        email = self.email
        subject = "Reset Email"
        message = render_to_string('reset_email.html', {
            'request': request,
            'user': self,
            'domain': settings.API_SETTINGS['DOMAIN'],
            'uid': urlsafe_base64_encode(force_bytes(self.pk)),
            'token': account_activation_token.make_token(self),
            'redirect': request.data['data'].get('redirect', '/')
        })

        send_email(subject, message, to=[email])

        return True


    def verify_email(self, request):
        with db_transaction.atomic():
            try:
                last_email = UserDocument.objects.filter(
                    user=self,
                    type=UserDocumentType.EMAIL).select_for_update().latest('id')

                if last_email.status == UserDocumentStatus.VERIFIED:
                    raise UserDocumentError(
                        type=UserDocumentError.ALREADY_VALIDATED,
                        reason=''
                    )

                if last_email.status == UserDocumentStatus.PENDING:
                    if timezone.now() - last_email.start_time >= timedelta(seconds=settings.API_SETTINGS['VERIFY_EMAIL_RESEND_TIMEOUT']):
                        last_email.status = UserDocumentStatus.FAILED
                        last_email.end_time = timezone.now()

                        last_email.save(update_fields=['status', 'end_time'])
                    else:
                        raise UserDocumentError(
                            action=ActionError.UPDATE,
                            obj=last_email,
                            type=UserDocumentError.STILL_IN_PROCESS,
                            reason=''
                        )
            except UserDocument.DoesNotExist as e:
                pass

            document = UserDocument.objects.create(
                user=self,
                type=UserDocumentType.EMAIL
            )

            current_site = get_current_site(request)

            user = self
            email = self.email
            subject = "Welcome to Sendbypass! Verify Your Sendbypass Account Now!"

            message = render_to_string('verify_email.html', {
                'request': request,
                'user': user,
                'domain': settings.API_SETTINGS['DOMAIN'],
                'uid':urlsafe_base64_encode(force_bytes(user.pk)),
                'token':account_activation_token.make_token(user),
                'redirect': request.data['data'].get('redirect', '/') \
                if 'data' in request.data else '/'
            })

            send_email(subject, message, to=[email])

            return True

    def delete(self, ):
        with db_transaction.atomic():
            Profile.objects.filter(user=self).delete()
            UserDocument.objects.filter(user=self).delete()

            self.groups.clear()

            super().delete()

    def check_user_status(self, document):
        if document.status == UserDocumentStatus.VERIFIED:
            # check for all needed profile
            #
            documents = UserDocument.objects.filter(user=self, status=UserDocumentStatus.VERIFIED)

            if len(documents) > 2:
                self.kyc_level = 1

                group = Group.objects.get(name='kyc_level_1')

                self.groups.add(group)

                self.save(update_fields=['kyc_level',])

    def is_business_account(self):
        return self.profile.type == ProfileType.BUSINESS

    def set_business_profile(self, verified=False):
        with db_transaction.atomic():
            profile = self.profile

            profile.type = ProfileType.BUSINESS

            profile.save(update_fields=['type',])

            self.groups.clear()

            business_group = Group.objects.get(name='business_level_1')

            self.groups.add(business_group)

            if not verified:
                profile.status = ProfileStatus.PENDING

                profile.save(update_fields=['status',])

    def change_profile(self, validated_data, request=None):
        with db_transaction.atomic():
            profile = self.profile
            update_fields = []

            if 'speak_languages' in validated_data:
                languages = list(profile.speak_languages.all())
                new_languages = validated_data.pop('speak_languages')

                for lang in new_languages:
                    if lang not in languages:
                        profile.speak_languages.add(lang)

                for lang in languages:
                    if lang not in new_languages:
                        profile.speak_languages.remove(lang)

            if 'image' in validated_data or \
               'background' in validated_data:
                if 'image' in validated_data:
                    profile.image = UserFile.objects.create(
                        related_object=profile,
                        owner=self,
                        file=validated_data.pop('image'),
                        field_name='image'
                    )

                    update_fields.append('image')

                if 'background' in validated_data:
                    profile.background = UserFile.objects.create(
                        related_object=profile,
                        owner=self,
                        file=validated_data.pop('background'),
                        field_name='background'
                    )

                    update_fields.append('background')

                profile.status = ProfileStatus.PENDING
                update_fields.append('status',)


            for k, v in validated_data.items():
                setattr(profile, k, v)
                update_fields.append(k)

            profile.save(update_fields=update_fields)

            if ('first_name' in validated_data and (validated_data['first_name'] or profile.first_name)) or \
               ('last_name' in validated_data and (validated_data['last_name'] or profile.last_name)):
                if request:
                    device = get_user_device(request)
                else:
                    device = {}

                UserDocument.objects.create(
                    type=UserDocumentType.PROFILE_NAME,
                    status=UserDocumentStatus.VERIFIED,
                    user=self,
                    device=device
                )

        return profile

    def save(self, *args, **kwargs):
        created = False

        if not self.id:
            created = True

        super().save(*args, **kwargs)

        if created:
            get_slack_bot().send(
                title='New user registered',
                event=Event(
                    action=UserEvent.REGISTER,
                    user=self,
                    data={}
                ),
                emoji=EventEmoji.DART
            )

    class Meta:
          db_table = 'User'

admin.site.register(User)
