#!/usr/bin/env python3

from api.models import Location
from api.tests.fixtures import *
from .test_base import ViewTestBase

from rest_framework import status

import unittest

class TestLocationList(ViewTestBase):
    def setUp(self):
        super().setUp()

        self.co1 = CountryFactory()

        self.ci1 = CityFactory(country=self.co1)

    def test_list_cities_by_filter(self):
        co2 = CountryFactory()

        ci2 = CityFactory(country=co2)

        url = self.reverse('cities-list')
        response = self.get(url, data={'country': self.co1.iso_3})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            1
        )

class TestLocationQuery(ViewTestBase):
    def setUp(self):
        self.co1 = CountryFactory(
            name='foob co',
            long_name='foo bar co',
            iso_2='fo',
            iso_3='foo'
        )

        self.co2 = CountryFactory(
            name='barz co',
            long_name='bar zee co',
            iso_2='ba',
            iso_3='bar'
        )

        self.ci1 = CityFactory(
            country=self.co1,
            name='foob ci',
            iso='foo',
            area_code='21'
        )

        self.ci2 = CityFactory(
            country=self.co2,
            name='barz co',
            iso='bar',
            area_code='22'
        )

        self.ai1 = AirportFactory(
            name='foob air',
            iata_code='foob',
            airport_code='foob1',
            location__city=self.ci1
        )

        self.ai2 = AirportFactory(
            name='barz air',
            iata_code='barz',
            airport_code='barz1',
            location__city=self.ci2
        )


    def test_list_locations(self):
        url = self.reverse('locations-list')
        response = self.get(url, data={'limit': 10})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        data = response.data

        self.assertEqual(
            len(data['results']),
            6
        )

    def test_list_locations_by_country_query(self):
        url = self.reverse('locations-list')
        response = self.get(
            url,
            data={
                'query': 'foob co'
            })

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        data = response.data

        self.assertEqual(
            len(data['results']),
            3
        )

    def test_list_locations_by_city_query(self):
        url = self.reverse('locations-list')
        response = self.get(
            url,
            data={
                'query': 'foob ci'
            })

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        data = response.data

        self.assertEqual(
            len(data['results']),
            2
        )

    def test_list_locations_iterate_next_country_query(self):
        url = self.reverse('locations-list')
        response = self.get(
            url,
            data={
                'query': 'foob co',
                'limit': 1
            })

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        data = response.data

        next_url = data['next']

        results1 = data['results']

        self.assertEqual(
            len(results1),
            1
        )

        response = self.get(
            next_url,)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data
        next_url = data['next']
        results2 = data['results']

        self.assertEqual(
            len(results2),
            1
        )

        self.assertNotEqual(
            results1[0]['id'],
            results2[0]['id']
        )

        response = self.get(
            next_url,)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        next_url = data['next']

        results3 = data['results']

        self.assertNotEqual(
            results1[0]['id'],
            results3[0]['id']
        )
        self.assertNotEqual(
            results2[0]['id'],
            results3[0]['id']
        )

    def test_list_locations_iterate_pre_coutry_query(self):
        url = self.reverse('locations-list')
        response = self.get(
            url,
            data={
                'query': 'foob co',
                'limit': 1
            })

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        data = response.data

        next_url = data['next']

        results1 = data['results']

        self.assertEqual(
            len(results1),
            1
        )

        response = self.get(
            next_url,)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data
        pre_url = data['previous']
        results2 = data['results']

        response = self.get(
            pre_url,)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        results3 = data['results']

        self.assertEqual(
            len(results3),
            1
        )

        self.assertEqual(
            results1[0]['id'],
            results3[0]['id']
        )

    def test_list_locations_iterate_next_less_than_4(self):
        url = self.reverse('locations-list')
        response = self.get(
            url,
            data={
                'query': 'foo',
                'limit': 10
            })

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        data = response.data

        self.assertEqual(
            len(data['results']),
            3,
            data['results']
        )

    def test_list_locations_by_type(self):
        url = self.reverse('locations-list')
        response = self.get(
            url,
            data={
                'query': 'foo',
                'limit': 10,
                'type': 'CITY'
            })

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertEqual(
            len(data['results']),
            1,
            data['results']
        )

    def test_list_locations_by_country(self):
        url = self.reverse('locations-list')
        response = self.get(
            url,
            data={
                'limit': 10,
                'country': self.co1.location.readable_tag
            })

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        data = response.data

        self.assertEqual(
            len(data['results']),
            3,
            data['results']
        )

    def test_get_location_by_tag(self):
        url = self.reverse('locations-list')
        response = self.get(
            url,
            data={
                'tag': self.ai1.location.readable_tag
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertEqual(
            data['results'][0]['tag'],
            self.ai1.location.readable_tag
        )

    def test_get_location_by_name(self):
        url = self.reverse('locations-list')
        response = self.get(
            url,
            data={
                'type': 'CITY',
                'object_name': self.ci1.name
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK)

        data = response.data

        self.assertEqual(
            len(data['results']),
            1
        )
