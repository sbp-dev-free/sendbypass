#!/usr/bin/env python3

from attrs import define
from django.conf import settings
from django.urls import reverse_lazy
from oauthlib.common import UNICODE_ASCII_CHARACTER_SET
from .base import SBPError

from typing import Dict
from random import SystemRandom
from urllib.parse import urlencode
import jwt

import requests
import logging

logger = logging.getLogger()

class LoginError(SBPError):
    THIRD_PARTY = 0
    INVALID_INPUT = 1
    INVALID_AUTH = 2

@define
class GoogleAccessTokens:
    id_token: str
    access_token: str

    def decode_id_token(self) -> Dict[str, str]:
        id_token = self.id_token
        decoded_token = jwt.decode(jwt=id_token, options={"verify_signature": False})

        return decoded_token

@define
class GoogleRawLoginCredentials:
    client_id: str
    client_secret: str
    project_id: str


def google_raw_login_get_credentials() -> GoogleRawLoginCredentials:
    client_id = settings.GOOGLE_OAUTH2_CLIENT_ID
    client_secret = settings.GOOGLE_OAUTH2_CLIENT_SECRET
    project_id = settings.GOOGLE_OAUTH2_PROJECT_ID

    if not client_id:
        raise ImproperlyConfigured("GOOGLE_OAUTH2_CLIENT_ID missing in env.")

    if not client_secret:
        raise ImproperlyConfigured("GOOGLE_OAUTH2_CLIENT_SECRET missing in env.")

    if not project_id:
        raise ImproperlyConfigured("GOOGLE_OAUTH2_PROJECT_ID missing in env.")

    credentials = GoogleRawLoginCredentials(
        client_id=client_id,
        client_secret=client_secret,
        project_id=project_id
    )

    return credentials

class GoogleRawLoginFlowService:
    API_URI = reverse_lazy("google-redirect", kwargs={'version': 'v1'})

    GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/auth"
    GOOGLE_ACCESS_TOKEN_OBTAIN_URL = "https://oauth2.googleapis.com/token"
    GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"

    SCOPES = [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "openid",
    ]

    def __init__(self):
        self._credentials = google_raw_login_get_credentials()

    @staticmethod
    def _generate_state_session_token(length=30, chars=UNICODE_ASCII_CHARACTER_SET):
        # This is how it's implemented in the official SDK
        rand = SystemRandom()
        state = "".join(rand.choice(chars) for _ in range(length))
        return state

    def _get_redirect_uri(self, request):
        domain = request.META.get('HTTP_REFERER', 'https://{}/'.format(settings.API_SETTINGS['DOMAIN']))

        if domain.endswith('/'):
            domain = domain[:-1]

        return '{}/check-auth'.format(domain)

    def get_authorization_url(self, request):
        redirect_uri = self._get_redirect_uri(request)

        state = self._generate_state_session_token()

        params = {
            "response_type": "code",
            "client_id": self._credentials.client_id,
            "redirect_uri": redirect_uri,
            "scope": " ".join(self.SCOPES),
            "state": state,
            "access_type": "offline",
            "include_granted_scopes": "true",
            "prompt": "select_account",
        }

        query_params = urlencode(params)
        authorization_url = f"{self.GOOGLE_AUTH_URL}?{query_params}"

        return authorization_url, state

    def get_tokens(self, request, code: str) -> GoogleAccessTokens:
        redirect_uri = self._get_redirect_uri(request)

        data = {
            "code": code,
            "client_id": self._credentials.client_id,
            "client_secret": self._credentials.client_secret,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code",
        }

        response = requests.post(self.GOOGLE_ACCESS_TOKEN_OBTAIN_URL, data=data)

        if not response.ok:
            logger.critical('Response of google auth is not ok: {}'.format(response.content))

            raise LoginError(
                type=LoginError.THIRD_PARTY,
                reason='Failed to obtain access token from Google: {}.'.format(response.content)
            )

        tokens = response.json()
        google_tokens = GoogleAccessTokens(
            id_token=tokens["id_token"],
            access_token=tokens["access_token"]
        )

        return google_tokens

    def get_user_info(self, *, google_tokens: GoogleAccessTokens):
        access_token = google_tokens.access_token

        response = requests.get(
            self.GOOGLE_USER_INFO_URL,
            params={"access_token": access_token}
        )

        if not response.ok:
            raise ApplicationError("Failed to obtain user info from Google.")

        return response.json()
