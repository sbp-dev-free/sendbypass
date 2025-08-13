#!/usr/bin/env python3

from .base import \
    (PeybarListCreateAPIView,
     PeybarPatchListCreateAPIView,
     PeybarRetrieveUpdateAPIView,
     PeybarRetrieveUpdateDestroyAPIView,
     SBPBaseViewException,
     PeybarDestroyAPIView)
from .parsers import MultiPartJsonParser
from .errors import APIErrorCode
from .permission import IsOwner
from api.serializers.user import \
    (UserSerializer, ProfileSerializer, BusinessProfileSerializer,
     SocialSerializer, PasswordResetSerializer, PasswordResetRequestSerializer,
     AccountRequestSerializer, ContactSerializer)
from api.models import User, Profile, UserDocument, Social, UserContact
from api.utils import account_activation_token
from api.models.types import UserDocumentStatus, UserDocumentType, AccountRequestType
from api.models.user import UserDocumentError
from api.models.login import LoginError

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.authtoken.serializers import AuthTokenSerializer
from django.contrib.auth import login
from drf_spectacular.utils import extend_schema
from django.utils.encoding import force_bytes, force_str
from django.db import transaction as db_transaction
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework.decorators import api_view, renderer_classes, permission_classes
from django.contrib.auth import logout
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
)
from rest_framework.parsers import JSONParser
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed

class InvalidAuthException(SBPBaseViewException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Invalid auth.'
    default_code = 'invalid_auth'

    def _get_api_code(self, type):
        if type == LoginError.INVALID_INPUT:
            return APIErrorCode.LOGIN_INVALID_INPUT
        if type == LoginError.INVALID_AUTH:
            return APIErrorCode.LOGIN_INVALID_AUTH

class UserList(PeybarListCreateAPIView):
    serializer_class = UserSerializer

class UserDestroy(PeybarDestroyAPIView):
    permission_classes = (
        permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

    def delete(self, *args, **kwargs):
        user = self.get_object()

        user.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT,
            data=''
        )

class ContactList(PeybarPatchListCreateAPIView):
    permission_classes = (
        permissions.IsAuthenticated,
        IsOwner)

    serializer_class = ContactSerializer

    def get_queryset(self):
        return UserContact.objects.filter(
            user=self.request.user
        )

class LogoutView(PeybarListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated)

    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class LoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            return super().post(request, *args, **kwargs)
        except serializers.ValidationError as e:
            raise InvalidAuthException(
                type=LoginError.INVALID_INPUT,
                detail=str(e)
            )
        except AuthenticationFailed as e:
            raise InvalidAuthException(
                type=LoginError.INVALID_AUTH,
                detail='User name or password incorrect.'
            )
        except Exception as e:
            raise InvalidAuthException(APIErrorCode.INVALID_AUTH)

class ProfileDetail(PeybarRetrieveUpdateAPIView):
    parser_classes = [MultiPartJsonParser, JSONParser]

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_serializer_class(self):
        if self.request.user.is_business_account():
            return BusinessProfileSerializer

        return ProfileSerializer

    def get_object(self):
        return self.request.user.profile

    def get_queryset(self):
        return None

def reset_password_request(request, version, *args, **kwargs):
    ser = PasswordResetRequestSerializer(
        data=request.data['data']
    )

    ser.is_valid(raise_exception=True)

    email = ser.validated_data['email']

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist as e:
        return Response(
            status=status.HTTP_201_CREATED,
            data='Email has sent.'
        )

    user.send_reset_password(request)

    return Response(
        status=status.HTTP_201_CREATED,
        data='Email has sent.'
    )


def reverify_email_request(request, version, *args, **kwargs):
    user = request.user

    ser = PasswordResetRequestSerializer(
        data=request.data['data']
    )

    ser.is_valid(raise_exception=True)

    email = ser.validated_data['email']

    if not user.is_anonymous and email != user.email:
        return Response(
            status=status.HTTP_400_BAD_REQUEST,
            data='Request has sent for different user.'
        )

    user = User.objects.get(email=email)

    try:
        if user.verify_email(request=request):
            return Response(
                status=status.HTTP_201_CREATED,
                data='OK'
            )
    except UserDocumentError as e:
        return Response(
            status=status.HTTP_400_BAD_REQUEST,
            data='ERROR'
        )

@extend_schema(
    request=AccountRequestSerializer,
)
@api_view(('POST',))
def add_user_request(request, version, *args, **kwargs):
    ser = AccountRequestSerializer(data=request.data)

    ser.is_valid(raise_exception=True)

    data = ser.validated_data

    if data['type'] == AccountRequestType.RESET_PASSWORD:
        return reset_password_request(request, version, *args, **kwargs)
    elif data['type'] == AccountRequestType.VERIFY_EMAIL:
        return reverify_email_request(request, version, *args, **kwargs)


@api_view(('POST',))
def reset_password(request, version, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and account_activation_token.check_token(user, token):
        with db_transaction.atomic():
            ser = PasswordResetSerializer(data=request.data)

            ser.is_valid(raise_exception=True)
            password = ser.validated_data['password']

            user.set_password(password)

            user.save()

            return Response(
                status=status.HTTP_201_CREATED,
                data=''
            )

    return Response(
        status=status.HTTP_400_BAD_REQUEST,
        data='No invalid token or id'
    )

@api_view(('POST',))
def verify_document(request, version, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and account_activation_token.check_token(user, token):
        with db_transaction.atomic():
            user.set_email_verified()

            return Response(
                status=status.HTTP_201_CREATED,
                data=''
            )

    return Response(
        status=status.HTTP_400_BAD_REQUEST,
        data='No invalid token or id'
    )
