#!/usr/bin/env python3

from .base import (
    PeybarBaseSerializer,
    CustomEnumChoiceField,
    PeybarNonModelBaseSerializer,
    PeybarBaseSerializerNullableFields)
from .temp_object import (
    PeybarNestedTempObjectSerializer,
    PeybarNestedTempObjectSerializerNullableFields)
from .location import UserLocationSerializer
from api.models import (
    Location, User, Social,
    Profile, Language, Country,
    UserContact, Social)
from api.models.user import PhoneNumber, UserFile
from api.models.types import *

from rest_framework import serializers
from django.contrib.auth import authenticate
from django.db.models import fields, Q, Exists, OuterRef
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from drf_spectacular.utils import extend_schema_field, PolymorphicProxySerializer


class PasswordResetRequestSerializer(PeybarNonModelBaseSerializer):
    email = serializers.EmailField(max_length=200)

@extend_schema_field(
    PolymorphicProxySerializer(
        serializers=[PasswordResetRequestSerializer],
        component_name='account_request_data',
        resource_type_field_name='account_request_data'
    ))
class AccountRequestData(serializers.DictField):
    pass

class AccountRequestSerializer(PeybarNonModelBaseSerializer):
    type = CustomEnumChoiceField(AccountRequestType)
    data = AccountRequestData()

    def to_internal_value(self, data):
        validated_data = super().to_internal_value(data)

        if validated_data['type'] == AccountRequestType.RESET_PASSWORD:
            ser = PasswordResetRequestSerializer(context=self.context, data=validated_data.pop('data'))
            ser.parent = self

            ser.is_valid(raise_exception=True)

            validated_data['data'] = ser.validated_data
        else:
            validated_data['data'] = {}

        return validated_data

class PasswordResetSerializer(PeybarNonModelBaseSerializer):
    password = serializers.CharField(max_length=128)
    confirm_password = serializers.CharField(max_length=128)

    def validate(self, data):
        validated_data = super().validate(data)

        if validated_data['password'] != validated_data['confirm_password']:
            raise serializers.ValidationError(
                {'': 'Confirm and password are not the same.'}
            )

        return validated_data

class UserSerializer(PeybarBaseSerializer):
    token = serializers.SerializerMethodField()

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data.pop('email'),
            password=validated_data.pop('password'),
            request=self.context['request'],
            **validated_data,
        )

        return user

    def get_token(self, obj):
        token = CustomeTokenSerializer.get_token(obj)

        return {
            "refresh": str(token),
            "access": str(token.access_token)
        }

    class Meta():
        model = User
        fields = ['id', 'email', 'password', 'register_time', 'token']
        read_only_fields = ['id', 'register_time', 'token']
        extra_kwargs = {
            'password': {'write_only': True}
        }

class CustomeTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['email_verified'] = user.profile.email_verified
        token['scopes'] = [
            permission.codename for permission in user.get_permissions()
            if not permission.codename.find('tempobject') != -1
        ]

        for group in user.groups.all():
            token['scopes'].extend(
                [
                    permission.codename for permission in group.permissions.all()
                    if not permission.codename.find('tempobject') != -1
                ]
            )
        # ...

        return token

class ZoneCodeSerializer(PeybarNonModelBaseSerializer):
    country = serializers.SlugRelatedField(queryset=Country.objects.all(), slug_field='iso_3')
    country_tag = serializers.CharField(source='country.location.readable_tag', read_only=True)
    zone_code = serializers.CharField(max_length=4, read_only=True,)

    def to_internal_value(self, data):
        validated_data = super().to_internal_value(data)

        return validated_data['country']

    def to_representation(self, instance):
        return {
            'country': instance.iso_3,
            'country_tag': instance.location.readable_tag,
            'zip_code': instance.zip_code
        }

class PhoneNumberSerializer(PeybarBaseSerializer):
    zone_code = ZoneCodeSerializer()
    phone = serializers.CharField(max_length=12, required=True)

    def create(self, validated_data):
        if hasattr(self.context['request'], 'user'):
            validated_data['user'] = self.context['request'].user

        return super().create(validated_data)

    class Meta():
        model = PhoneNumber
        fields = ('zone_code', 'phone')

class SocialSerializer(PeybarBaseSerializer):
    type = CustomEnumChoiceField(SocialType)

    def create(self, validated_data):
        if hasattr(self.context['request'], 'user'):
            validated_data['user'] = self.context['request'].user

        return super().create(validated_data)

    class Meta():
        model = Social
        fields = ('type', 'link',)

@extend_schema_field(
    PolymorphicProxySerializer(
        serializers=[PhoneNumberSerializer, SocialSerializer],
        component_name='contact_data',
        resource_type_field_name='contact_data'
    ))
class ContactDataSerializer(serializers.DictField):
    pass

class ContactSerializer(PeybarBaseSerializer):
    type = CustomEnumChoiceField(ContactType)
    data = ContactDataSerializer()

    def to_internal_value(self, data):
        data = super().to_internal_value(data)

        if self.instance:
            type = self.instance.type
        else:
            type = data['type']

        if type == ContactType.PHONE_NUMBER:
            ser = PhoneNumberSerializer(data=data['data'], instance=self.instance, context=self.context)
        else:
            ser = SocialSerializer(data=data['data'], instance=self.instance, context=self.context)

        ser.parent = self

        ser.is_valid(raise_exception=True)

        return {
            'type': type,
            'data': ser.validated_data
        }

    def to_representation(self, instance):
        data = {
            'id': instance.id,
        }

        if instance.type == ContactType.PHONE_NUMBER:
            data['type'] = ContactType.PHONE_NUMBER.name

            ser = PhoneNumberSerializer(instance=instance.contact, context=self.context)
        else:
            data['type'] = ContactType.SOCIAL.name

            ser = SocialSerializer(instance=instance.contact, context=self.context)

        ser.parent = self

        data['data'] = ser.data

        return data

    def create(self, validated_data):
        if validated_data['type'] == ContactType.PHONE_NUMBER:
            obj = PhoneNumber.objects.create(
                **validated_data['data']
            )

            return super().create(
                validated_data={
                    'type': ContactType.PHONE_NUMBER,
                    'user': self.context['request'].user,
                    'contact': obj
                }
            )

        if validated_data['type'] == ContactType.SOCIAL:
            obj = Social.objects.create(
                **validated_data['data']
            )

            return super().create(
                validated_data={
                    'type': ContactType.SOCIAL,
                    'user': self.context['request'].user,
                    'contact': obj
                }
            )

    def update(self, instance, validated_data):
        if instance.type == ContactType.PHONE_NUMBER:
            ser = PhoneNumberSerializer(
                context=self.context
            )

        if instance.type == ContactType.SOCIAL:
            ser = SocialSerializer(
                context=self.context
            )

        new_contact = ser.update(
            instance=instance.contact,
            validated_data=validated_data['data'],
        )

        return instance

    class Meta:
        model = UserContact
        fields = ('type', 'data')
        read_only_fields = ('id',)

class ProfileSerializer(PeybarBaseSerializerNullableFields):
    id = serializers.IntegerField(source='user.id', read_only=True)
    addresses = UserLocationSerializer(many=True, source='user.addresses')
    email = serializers.CharField(max_length=200, source='user.email')
    register_time = serializers.CharField(max_length=200, source='user.register_time')

    stats = serializers.SerializerMethodField()
    status = CustomEnumChoiceField(ProfileStatus)
    type = CustomEnumChoiceField(ProfileType)

    image = serializers.ImageField(required=False, source='image.file', default=None)
    background = serializers.ImageField(required=False, source='background.file', default=None)

    website = serializers.CharField(required=False, max_length=40, allow_null=True)

    current_location = serializers.PrimaryKeyRelatedField(
        source='get_cur_location',
        read_only=True
    )

    bio = serializers.CharField(required=False, max_length=200, allow_null=True, allow_blank=True)

    speak_languages = serializers.SlugRelatedField(many=True, queryset=Language.objects.all(), slug_field='iso')

    phone_number = serializers.SerializerMethodField()

    incomplete = serializers.SerializerMethodField()

    def get_incomplete(self, obj):
        return obj.first_name and \
            obj.last_name and \
            obj.image and \
            obj.background and \
            UserContact.objects.filter(
                user=obj.user,
                type=ContactType.PHONE_NUMBER
            ).exists()  and \
            UserContact.objects.filter(
                user=obj.user,
                type=ContactType.SOCIAL
            ).exists()


    def get_stats(self, obj):
        rates = obj.rates

        total = 0
        avg = 0

        for key, num in rates.items():
            key = int(key)
            num = int(num)

            avg += key * num
            total += num

        return {
            'total_successful_orders': total,
            'avg_rate': avg / total if total else 0
        }

    def to_internal_value(self, validated_data):
        if 'image' in validated_data and isinstance(validated_data['image'], list):
            validated_data['image'] = validated_data['image'][0]

        if 'background' in validated_data and isinstance(validated_data['background'], list):
            validated_data['background'] = validated_data['background'][0]

        if 'phone_number' in validated_data and not validated_data['phone_number']:
            # to ignore the empty dictionary
            validated_data['phone_number'] = None

        validated_data =  super().to_internal_value(validated_data)

        return validated_data

    def update(self, instance, validated_data):
        if 'type' in validated_data:
            if validated_data['type'] != instance.type and \
               validated_data['type'] == ProfileType.BUSINESS:
                instance.user.set_business_profile()

                return instance

            validated_data.pop('type')

        if 'image' in validated_data:
            validated_data['image'] = validated_data['image']['file']

        if 'background' in validated_data:
            validated_data['background'] = validated_data['background']['file']

        new_profile = instance.user.change_profile(
            validated_data,
            self.context['request']
        )

        return new_profile

    def get_phone_number(self, obj):
        phones = UserContact.objects.filter(
            user=obj.user,
            type=ContactType.PHONE_NUMBER
        )

        if not phones:
            return {}

        phone = phones.latest('id').contact

        socials = Social.objects.filter(
            Q(Exists(UserContact.objects.filter(
                type=ContactType.SOCIAL,
                object_id=OuterRef('id')
            ))),
            link=phone.phone,
        )

        return {
            'zone_code': {
                'country': phone.zone_code.iso_3,
                'zip_code': phone.zone_code.zip_code
            },
            'phone': phone.phone,
            'socials': [social.type.label for social in socials]
        }

    class Meta():
        model = Profile
        fields = (
            'register_time',
            'addresses',
            'email',
            'stats',
            'first_name',
            'last_name',
            'image',
            'id',
            'bio',
            'background',
            'website',
            'current_location',
            'speak_languages',
            'status',
            'type',
            'phone_number',
            'incomplete'
        )

class BusinessProfileSerializer(ProfileSerializer):
    business_name = serializers.CharField(
        max_length=200,
        source='first_name'
    )

    class Meta(ProfileSerializer.Meta):
        fields = [field for field in ProfileSerializer.Meta.fields \
                   if field not in ('first_name', 'last_name')] + ['business_name',]
