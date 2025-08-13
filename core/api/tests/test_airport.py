#!/usr/bin/env python3
from .test_base import ViewTestBase
from .fixtures import *

from rest_framework import status


class TestAirportList(ViewTestBase):
    def setUp(self):
        super().setUp()

        self.co1 = CountryFactory()
        self.ci1 = CityFactory()

    def test_create_airport(self):
        url = self.reverse('airports-list')
        response = self.post(url, data={
            'name': 'foo',
            'type': 'LARGE',
            'location': {
                'country': self.co1.name,
                'city': self.ci1.name,
                'district': 'foo',
                'logtitude': '13',
                'latitude': '16',
            },
            'iata_code': 'foo',
            'website': 'http://asda.com',
            'airport_code': 'foo'
        })

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data
        )

    def test_list_airports(self):
        AirportFactory()

        url = self.reverse('airports-list')
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )
    # def test_patch_airport_location(self):
    #     a = AirportFactory()

    #     url = self.reverse('airport-detail', kwargs={'pk': a.id})
    #     response = self.patch(
    #         url,
    #         data={
    #             'location': {
    #                 'country': 'foo2'
    #             }
    #         }
    #     )

    #     self.assertEqual(
    #         response.status_code,
    #         status.HTTP_200_OK
    #     )

    #     url = self.reverse('airport-detail', kwargs={'pk': a.id})
    #     response = self.get(url)

    #     self.assertEqual(
    #         response.status_code,
    #         status.HTTP_200_OK
    #     )

    #     self.assertEqual(
    #         response.data['country'],
    #         'foo2'
    #     )
