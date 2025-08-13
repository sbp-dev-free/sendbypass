#!/usr/bin/env python3
from .test_base import ViewTestBase
from api.models.user import User
from api.models.temp_object import TempObject
from api.tests.fixtures import *

from rest_framework import status

import unittest

class TestFlightList(ViewTestBase):
    def setUp(self):
        super().setUp()

        self.u1 = UserFactory()

        self.a1 = AirportFactory()
        self.a2 = AirportFactory()

        self.al1 = AirlineFactory()

    @unittest.expectedFailure
    def test_create(self):
        url = self.reverse('flights-list')
        response = self.post(url, data={
            'source': self.a1.id,
            'destination': self.a2.id,
            'number': 'foo1234',
            'airline': self.al1.id
        })

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data
        )
