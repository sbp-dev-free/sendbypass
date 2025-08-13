#!/usr/bin/env python3

from api.models import Language
from api.tests.fixtures import *
from .test_base import ViewTestBase

from rest_framework import status

class TestLanguageList(ViewTestBase):
    def setUp(self):
        super().setUp()

        self.l1 = LanguageFactory()

    def test_get_languages(self):
        url = self.reverse('languages-list')
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        data = response.data['results']

        self.assertEqual(
            response.data['count'],
            1
        )
