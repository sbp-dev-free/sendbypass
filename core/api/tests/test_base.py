#!/usr/bin/env python3

from api.models.temp_object import TempObject
from api.models import *
from api.models.types import *
from api.models.request import *

from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from rest_framework.response import Response
from django.urls import reverse
from django.contrib.auth.models import Group, Permission
from django.test import override_settings, TestCase
from unittest.mock import patch
from pydantic import BaseModel
import responses
from django.conf import settings

import json
from urllib.parse import urlparse, unquote_plus


class ErrorResponse(BaseModel):
    code: int
    type: str
    message: str

@override_settings(
    MEDIA_ROOT='/tmp/files',
    API_SETTINGS={**settings.API_SETTINGS,
                  'EVENTS_SLACK_ENABLE': False})
class ViewTestBase(APITestCase):
    version = 'v1'

    GET='get'
    POST='post'

    def __init__(self, *args, **kwargs):
        self._token = None
        self._email_patched = False

        super().__init__(*args, **kwargs)

    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        cls.email_patcher = patch('django.core.mail.EmailMessage.send', autospec=True)
        cls.email_connection_patcher = patch('api.utils.get_email_connection', autospec=True)

        cls.email_send = cls.email_patcher.start()
        cls.email_connection = cls.email_connection_patcher.start()

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()

        cls.email_patcher.stop()
        cls.email_connection_patcher.stop()

    def setUp(self):
        models = ['tempobject', 'trip', 'requirement', 'service', 'request']

        group = Group.objects.create(name='kyc_level_1')
        biz_group = Group.objects.create(name='business_level_1')

        for model in models:
            group.permissions.add(Permission.objects.get(codename='add_{}'.format(model)))
            group.permissions.add(Permission.objects.get(codename='change_{}'.format(model)))
            group.permissions.add(Permission.objects.get(codename='delete_{}'.format(model)))
            group.permissions.add(Permission.objects.get(codename='view_{}'.format(model)))

            if model not in ('trip', 'service'):
                biz_group.permissions.add(Permission.objects.get(codename='add_{}'.format(model)))
                biz_group.permissions.add(Permission.objects.get(codename='change_{}'.format(model)))
                biz_group.permissions.add(Permission.objects.get(codename='delete_{}'.format(model)))
                biz_group.permissions.add(Permission.objects.get(codename='view_{}'.format(model)))
            else:
                biz_group.permissions.add(Permission.objects.get(codename='view_{}'.format(model)))

        self._token = None

        self.email_send.reset_mock()
        self.email_connection.reset_mock()

        super(ViewTestBase, self).setUp()

    def tearDown(self):
        UserContact.objects.all().delete()
        PhoneNumber.objects.all().delete()

        City.objects.update(location=None)
        Country.objects.update(location=None)

        Group.objects.all().delete()

        TempObject.objects.all().delete()
        OrderStep.objects.all().delete()
        Request.objects.all().delete()
        Requirement.objects.all().delete()
        Service.objects.all().delete()
        Trip.objects.all().delete()

        Flight.objects.all().delete()
        Location.objects.all().delete()
        City.objects.all().delete()
        Country.objects.all().delete()

        super(ViewTestBase, self).tearDown()

    def reverse(self, url_name, exchange=None, **kwargs):
        if not 'kwargs' in kwargs:
            kwargs['kwargs'] = {}

        kwargs['kwargs']['version'] = self.version

        return reverse(url_name, **kwargs)

    def login(self, user):
        url = self.reverse('login')
        response = self.post(
            url,
            data={
                'email': user.email,
                'password': user._password
            }
        )

        if response.status_code == status.HTTP_200_OK:
            self._token = response.data['access']

            self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self._token)

            return True

        return False


    def get(self, url, data={}, auth=True, *args, **kwargs):
        return self.client.get(url, data, *args, **kwargs)

    def post(self, url, data={}, auth=True, format='json', **kwargs):
        return self.client.post(url, data, format=format, **kwargs)

    def put(self, url, data={}, format='json'):
        return self.client.put(url, data, format=format)

    def patch(self, url, data={}, format='json'):
        return self.client.patch(url, data, format=format)

    def delete(self, url, params={}, data={}, format='json'):
        return self.client.delete(url, params=params, data=data, format=format)

    def assertSchema(self, data, schema, msg=''):
        try:
            s = schema(**data)
        except pydantic.ValidationError as e:
            self.fail(
                '{}\n{}'.format(str(e), msg)
            )

    def assertErrorSchema(self, data):
        if not 'detail' in data:
            self.fail('Detail is not in error')

        detail = json.loads(data['detail'])

        self.assertSchema(
            detail,
            ErrorResponse
        )

        return detail

    def generate_photo_file(self):
        import base64

        return base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAUA" + "AAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO" + "9TXL0Y4OHwAAAABJRU5ErkJggg==")

    def forward_request(self, request, step_type=None):
        traveler = request.service.trip.user
        customer = request.requirement.user

        if request.status == ActionStatus.PENDING:
            if request.submitted_by == traveler:
                RequestFlow(request).accept(customer)
            else:
                RequestFlow(request).accept(traveler)

        traveler_step = request.get_steps(traveler)[0]
        customer_step = request.get_steps(customer)[0]

        PaymentStepFlow(customer_step, customer_step.properties).accept(customer)

        if step_type == StepType.PAYMENT:
            return

        traveler_step = request.get_steps(traveler).latest('id')
        customer_step = request.get_steps(customer).latest('id')

        DeliverToAirportFlow(traveler_step, customer_step.properties).accept(traveler)

        traveler_step = request.get_steps(traveler).latest('id')
        customer_step = request.get_steps(customer).latest('id')

        ReceiveToCustomerFlow(traveler_step, customer_step.properties).accept(traveler)

        traveler_step = request.get_steps(traveler).latest('id')
        customer_step = request.get_steps(customer).latest('id')

        DoneFlow(traveler_step, traveler_step.properties).accept(traveler)
        DoneFlow(customer_step, customer_step.properties).accept(customer)
