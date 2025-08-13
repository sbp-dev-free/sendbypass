#!/usr/bin/env python3

from django.urls import re_path

from django.core.mail import EmailMessage
from django.core.mail.message import utf8_charset_qp
from django.core.mail import get_connection as get_email_connection
from django.conf import settings
from django.utils import timezone

import json
import decimal
from datetime import timedelta, datetime
from enum import Enum
import logging
import requests


logger = logging.getLogger()

def peybar_url(txt, *args,
                **kwargs):
    versions = kwargs.pop('versions', ['v1'])
    url_txt = txt

    url_txt = '(?P<version>({versions}))/{txt}'.\
        format(versions='|'.join(versions), txt=txt)

    return re_path(url_txt, *args, **kwargs)

def get_datetime_str(time):
    txt = time.isoformat()

    return txt

def get_datetime(txt):
    time = datetime.fromisoformat(txt)

    if time.tzinfo:
        return time

    return make_aware(time)

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        from api.models import Location

        if isinstance(obj, decimal.Decimal):
            return str(obj)
        elif isinstance(obj, timedelta):
            return obj.days
        elif isinstance(obj, datetime):
            return get_datetime_str(obj)
        elif isinstance(obj, Enum):
            return obj.value
        elif isinstance(obj, Location):
            return str(obj)
        elif obj is None:
            return '__null__'

        return super().default(obj)

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from six import text_type

class TokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return (
            text_type(user.pk) + text_type(timestamp) +
            text_type(user.profile.email_verified)
        )

account_activation_token = TokenGenerator()

def send_email(subject, message, to, sender=None, email_server=None, **kwargs):
    if email_server is None:
        email_server = 'default'

    server_settings = settings.EMAIL_SERVERS[email_server]

    if not sender:
        sender = server_settings['SENDER']

    with get_email_connection(
            host=server_settings['HOST'],
            port=server_settings['PORT'],
            username=server_settings['USER'],
            password=server_settings['PASSWORD'],
            use_tls=server_settings['TLS']
    ) as connection:

        email = EmailMessage(
            subject, message, from_email=sender, to=to,
            connection=connection,
            **kwargs
        )

        email.content_subtype = 'html'
        email.encoding = utf8_charset_qp

        email.send()

        logger.info('Send email to {}.'.format(to[0]))

def get_user_device(request):
    user_req_device = []
    bot = False
    # Let's assume that the visitor uses an iPhone...
    if request.user_agent.is_mobile:
        user_req_device.append({"type": "is_mobile"})
    elif request.user_agent.is_tablet:  # returns False
        user_req_device.append({"type": "is_tablet"})
    elif request.user_agent.is_touch_capable:  # returns True
        user_req_device.append({"type": "is_touch_capable"})
    elif request.user_agent.is_pc:  # returns False
        user_req_device.append({"type": "is_pc"})
    elif request.user_agent.is_bot:  # returns False
        user_req_device.append({"type": "is_bot"})
        bot = True
    # Accessing user agent's browser attributes
    user_req_device.append(
        {
            "browser": {
                "family": request.user_agent.browser.family,
                # "version": request.user_agent.browser.version,
                "version_string": request.user_agent.browser.version_string,
            },
        }
    )

    # Operating System properties
    user_req_device.append(
        {
            "os": {
                "family": request.user_agent.os.family,
                # "version": request.user_agent.os.version,
                "version_string": request.user_agent.os.version_string,
            },
        }
    )
    # Device properties
    user_req_device.append(
        {
            "device": request.user_agent.device.family,
        }
    )

    return user_req_device, bot

class Event:
    def __init__(
            self,
            action,
            user,
            data,
            timestamp=None
    ):
        self.action = action
        self.user = user
        self.data = data

        if timestamp:
            self.timestamp = timestamp
        else:
            self.timestamp = timezone.now()

    def get_dict(self):
        return {
            'timestamp': self.timestamp,
            'action': self.action.value,
            'user': self.user.email if self.user else 'NOT_KNOWN',
            'data': self.data
        }

class EventAction(Enum):
    pass

class EventEmoji(Enum):
    DART = ':dart:'
    AIRPLANE = ':airplane:'
    PACKAGE = ':package:'
    NAZAR = ':nazar_amulet:'
    BELLHOP_BELL = ':bellhop_bell:'

class _SlackBot:
    def __init__(self):
        self._enable = settings.API_SETTINGS['EVENTS_SLACK_ENABLE']

        if self._enable:
            self._url = settings.API_SETTINGS['EVENTS_SLACK_URL']

    def send(self, title, event, emoji=None):
        headers = {'Content-Type': 'application/json'}

        msg = \
"""
{emoji}*{title}*
```
{data}
```
""".format(emoji=emoji.value if emoji else '', title=title, data=json.dumps(event.get_dict(), indent=2, default=DecimalEncoder().default))

        if not self._enable:
            return

        r = requests.post(
            url=self._url,
            data=json.dumps({'text': msg}),
            headers=headers
        )

_slack_bot = None

def get_slack_bot():
    global _slack_bot

    if not _slack_bot:
        _slack_bot = _SlackBot()

    return _slack_bot
