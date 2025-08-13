#!/usr/bin/env python3

from api.models import User, Profile
from api.serializers.user import UserSerializer
from api.models.types import *
from api.models.login import (
    GoogleRawLoginFlowService,
    LoginError,
)
from .base import SBPBaseViewException, PeybarListCreateAPIView
from .errors import APIErrorCode

from rest_framework.views import APIView
from django.shortcuts import redirect
from rest_framework import serializers, status
from rest_framework.response import Response



class GoogleLoginError(SBPBaseViewException):
    def _get_api_code(self, type):
        if type == LoginError.THIRD_PARTY:
            return APIErrorCode.LOGIN_GOOGLE_ERROR

class PublicApi(PeybarListCreateAPIView):
    authentication_classes = ()
    permission_classes = ()

class GoogleLoginRedirectApi(PublicApi):
    def get(self, request, *args, **kwargs):
        google_login_flow = GoogleRawLoginFlowService()

        authorization_url, state = google_login_flow.get_authorization_url(request)

        request.session["google_oauth2_state"] = state

        return redirect(authorization_url)

class GoogleLoginApi(PublicApi):
    class InputSerializer(serializers.Serializer):
        code = serializers.CharField(required=False)
        error = serializers.CharField(required=False, allow_blank=True)
        state = serializers.CharField(required=False)

    def post(self, request, *args, **kwargs):
        input_serializer = self.InputSerializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)

        validated_data = input_serializer.validated_data

        code = validated_data.get("code")
        error = validated_data.get("error", None)
        state = validated_data.get("state")

        if error is not None and error:
            return Response(
                {"error": error},
                status=status.HTTP_400_BAD_REQUEST
            )

        if code is None or state is None:
            return Response(
                {"error": "Code and state are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

#        session_state = request.session.get("google_oauth2_state")
#
#        if session_state is None:
#            return Response(
#                {"error": "CSRF check failed no session."},
#                status=status.HTTP_400_BAD_REQUEST
#            )
#
#        del request.session["google_oauth2_state"]
#
#        if state != session_state:
#            return Response(
#                {"error": "CSRF check failed session is incorrect."},
#                status=status.HTTP_400_BAD_REQUEST
#            )

        google_login_flow = GoogleRawLoginFlowService()

        try:
            google_tokens = google_login_flow.get_tokens(request=request, code=code)
        except LoginError as e:
            raise GoogleLoginError(
                type=e.type,
                detail=e.detail
            )

        id_token_decoded = google_tokens.decode_id_token()
        user_info = google_login_flow.get_user_info(google_tokens=google_tokens)

        user_email = id_token_decoded["email"]

        email = user_info['email']

        if not User.objects.filter(email=email).exists():
            user = User.objects.create_user(
                email=email,
                submit_type=UserSubmitType.GOOGLE
            )

            if 'given_name' in user_info or \
               'family_name' in user_info:
                user.change_profile(
                    {
                        'first_name': user_info['given_name'] if 'given_name' in user_info else None,
                        'last_name': user_info['family_name'] if 'family_name' in user_info else None
                    }
                )

            status_code = status.HTTP_201_CREATED
        else:
            user = User.objects.get(email=email)

            if user.submit_type != UserSubmitType.GOOGLE:
                return Response(
                    status=status.HTTP_401_UNAUTHORIZED,
                    data='User does not exist.'
                )

            status_code = status.HTTP_200_OK

        return Response(
            status=status_code,
            data=UserSerializer(instance=user).data
        )
