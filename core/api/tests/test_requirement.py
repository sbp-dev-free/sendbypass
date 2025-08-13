#!/usr/bin/env python3

from api.models import Requirement
from api.models.requirement import RequirementFlow
from api.models.service import ServiceFlow
from .test_base import ViewTestBase
from api.tests.fixtures import *
from .utils import encode_nested_dict

from rest_framework import status
from django.utils import timezone
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test.client import encode_multipart, BOUNDARY, MULTIPART_CONTENT

from datetime import timedelta, datetime


class TestRequirementList(ViewTestBase):
    def setUp(self):
        super().setUp()

        self.u1 = UserFactory()
        self.ai1 = AirportFactory()
        self.ai2 = AirportFactory()

        self.l1 = self.ai1.location
        self.l2 = self.ai2.location

    def test_do_not_accept_without_login(self):
        url = self.reverse('requirements-list')
        response = self.post(
            url,
            data={
                'type': 'SHIPPING',
                'properties': {
                    'weight': 1,
                    'height': 20,
                    'length': 30,
                    'width': 5,
                }
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
            response.data
        )

    def test_without_profile_completion_could_not_create(self):
        u = UserFactory(_verified=False)
        self.login(u)

        url = self.reverse('requirements-list')
        response = self.post(
            url,
            data={
                'type': 'SHIPPING',
                'properties': {
                    'type': 'DOCUMENT',
                    'weight': 1,
                    'height': 20,
                    'length': 30,
                    'width': 5,
                },
                'source': {
                    'location': self.l1.id,
                    'since': None,
                    'to': '2024-02-12T07:00:00+00:00',
                },
                'destination': {
                    'location': self.l2.id,
                    'since': None,
                    'to': '2024-02-13T07:00:00+00:00',
                },
                'cost': {
                    'wage': 123.4
                },
                'comment': 'foo',
                'name': 'foo'
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )

        document = UserDocument.objects.create(
            user=u,
            type=UserDocumentType.EMAIL,
        )

        u.set_email_verified()
        self.login(u)

        url = self.reverse('requirements-list')
        response = self.post(
            url,
            data={
                'type': 'SHIPPING',
                'properties': {
                    'type': 'DOCUMENT',
                    'weight': 1,
                    'height': 20,
                    'length': 30,
                    'width': 5,
                },
                'source': {
                    'location': self.l1.id,
                    'since': None,
                    'to': '2024-02-12T07:00:00+00:00',
                },
                'destination': {
                    'location': self.l2.id,
                    'since': None,
                    'to': '2024-02-13T07:00:00+00:00',
                },
                'cost': {
                    'wage': 123.4
                },
                'comment': 'foo',
                'name': 'foo'
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )

        u.change_profile(
            {
                'first_name': 'foo',
                'last_name': 'bar'
            }
        )

        url = self.reverse('requirements-list')
        response = self.post(
            url,
            data={
                'type': 'SHIPPING',
                'properties': {
                    'type': 'DOCUMENT',
                    'num': 2,
                    'size': 'A4',
                    'weight': 0,
                },
                'source': {
                    'location': self.l1.id,
                    'since': None,
                    'to': '2024-02-12T07:00:00+00:00',
                },
                'destination': {
                    'location': self.l2.id,
                    'since': None,
                    'to': '2024-02-13T07:00:00+00:00',
                },
                'cost': {
                    'wage': 123.4
                },
                'comment': 'foo',
                'name': 'foo'
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

    def test_create_requirement(self):
        self.login(self.u1)

        f1 = SimpleUploadedFile("foo.jpg", self.generate_photo_file(), content_type="img/jpeg")

        data = encode_nested_dict({
                    'type': 'SHIPPING',
                    'properties': {
                        'type': 'DOCUMENT',
                        'weight': 0,
                        'num': 4,
                        'size': 'CUSTOM',
                        'width': 20,
                        'length': 10
                    },
                    'source': {
                            'location': self.l1.id,
                            'since': None,
                            'to': '2024-02-12T07:00:00+00:00',
                        },
                    'destination': {
                            'location': self.l2.id,
                            'since': None,
                            'to': '2024-02-13T07:00:00+00:00',
                        },
                    'cost': {
                            'wage': 123.4
                        },
                    'comment': 'foo',
                    'name': 'foo',
                    'image': f1
                })

        url = self.reverse('requirements-list')
        response = self.post(
            url,
            data=data,
            format='multipart'
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data
        )

        requirement = response.data

        self.assertIn(
            'id',
            requirement
        )

        self.assertTrue(
            requirement['image']
        )

        self.assertIn(
            'properties',
            requirement
        )

        self.assertIn(
            'weight',
            requirement['properties']
        )

        self.assertEqual(
            requirement['properties']['weight'],
            0
        )

    def test_create_shopping_requirement(self):
        self.login(self.u1)

        url = self.reverse('requirements-list')
        response = self.post(
            url,
            data={
                'type': 'SHOPPING',
                'properties': {
                    'type': 'DOCUMENT',
                    'weight': 1,
                    'height': 20,
                    'length': 30,
                    'width': 5,
                    'link': 'http://foo.com/app'
                },
                'source': {
                    'location': self.l1.id,
                    'since': '2024-02-12T07:00:00+00:00',
                    'to': None,
                },
                'destination': {
                    'location': self.l2.id,
                    'since': '2024-02-13T07:00:00+00:00',
                    'to': None,
                },
                'cost': {
                    'wage': 123.4
                },
                'comment': 'foo',
                'name': 'foo'
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data
        )

        requirement = response.data

        self.assertIn(
            'id',
            requirement
        )

        self.assertIn(
            'properties',
            requirement
        )

        self.assertIn(
            'weight',
            requirement['properties']
        )

        self.assertEqual(
            requirement['properties']['weight'],
            1
        )

    def test_create_shopping_requirement_with_general_location(self):
        self.login(self.u1)

        url = self.reverse('requirements-list')
        response = self.post(
            url,
            data={
                'type': 'SHOPPING',
                'properties': {
                    'type': 'CLOTH',
                    'weight': 1,
                    'height': 20,
                    'length': 30,
                    'width': 5,
                },
                'source': {
                    'location': None,
                    'since': None,
                },
                'destination': {
                    'location': self.l2.id,
                    'since': '2024-02-13T07:00:00+00:00',
                    'to': None,
                },
                'cost': {
                    'wage': 123.4
                },
                'comment': 'foo',
                'name': 'foo'
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data
        )

        requirement = response.data

        self.assertIn(
            'id',
            requirement
        )

    def test_get_requirements_by_other_role(self):
        r1 = ShippingRequirementFactory(
            user=self.u1,
            cost={'wage': 1000}
        )

        RequirementFlow(r1).accept()

        u2 = UserFactory()

        self.login(u2)

        url = self.reverse('requirements-list')
        response = self.get(url, data={'role': 'TRAVELER'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.assertEqual(
            response.data['count'],
            1
        )

        data = response.data['results'][0]

        self.assertEqual(
            data['id'],
            r1.id
        )

        self.assertEqual(
            data['role'],
            'TRAVELER'
        )

    def test_get_requirements_after_expire_time(self):
        r1 = ShippingRequirementFactory(
            user=self.u1,
            cost={'wage': 1000},
            source__to=timezone.now() - timedelta(days=10),
            destination__to=timezone.now() - timedelta(days=1)
        )

        self.login(self.u1)

        url = self.reverse('requirements-list')
        response = self.get(url, data={'role': 'CUSTOMER'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.assertEqual(
            response.data['count'],
            1
        )

        data = response.data['results'][0]

        self.assertEqual(
            data['id'],
            r1.id
        )

        self.assertEqual(
            data['status'],
            'EXPIRED'
        )

    def test_get_requirements_by_other_role_do_not_return_after_expire(self):
        r1 = ShippingRequirementFactory(
            user=self.u1,
            cost={'wage': 1000},
            source__to=timezone.now() - timedelta(days=10),
            destination__to=timezone.now() - timedelta(days=1)
        )

        RequirementFlow(r1).accept()

        u2 = UserFactory()

        self.login(u2)

        url = self.reverse('requirements-list')
        response = self.get(url, data={'role': 'TRAVELER'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.assertEqual(
            response.data['count'],
            0
        )

    def test_get_requirements_by_other_without_login_role_do_not_return_after_expire(self):
        r1 = ShippingRequirementFactory(
            user=self.u1,
            cost={'wage': 1000},
            source__to=timezone.now() - timedelta(days=10),
            destination__to=timezone.now() - timedelta(days=1)
        )

        RequirementFlow(r1).accept()

        url = self.reverse('requirements-list')
        response = self.get(url, data={'role': 'TRAVELER'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.assertEqual(
            response.data['count'],
            0
        )

    def test_get_active_requirements(self):
        r1 = ShippingRequirementFactory(
            user=self.u1,
            cost={'wage': 1000}
        )

        RequirementFlow(r1).accept()

        self.login(self.u1)

        url = self.reverse('requirements-list')
        response = self.get(url, {'active': True})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            1
        )


    def test_get_requirements_by_other_role_self(self):
        r1 = ShippingRequirementFactory(
            user=self.u1,
            cost={'wage': 1000}
        )

        RequirementFlow(r1).accept()

        self.login(self.u1)

        url = self.reverse('requirements-list')
        response = self.get(url, data={'role': 'TRAVELER'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            1
        )

    def test_get_requirements_by_type(self):
        r1 = ShippingRequirementFactory(
            user=self.u1,
            cost={'wage': 1000}
        )

        RequirementFlow(r1).accept()

        u2 = UserFactory()

        self.login(u2)

        url = self.reverse('requirements-list')
        response = self.get(url, data={'role': 'TRAVELER', 'types': 'SHIPPING'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            1
        )

        data = response.data['results'][0]

        self.assertEqual(
            data['id'],
            r1.id
        )

    def test_get_requirement_by_other_type(self):
        r1 = ShippingRequirementFactory(
            user=self.u1,
            cost={'wage': 1000}
        )

        RequirementFlow(r1).accept()

        u2 = UserFactory()

        self.login(u2)

        url = self.reverse('requirements-list')
        response = self.get(url, data={'role': 'TRAVELER', 'types': 'SHOPPING'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.assertEqual(
            response.data['count'],
            0
        )

    def test_get_requirement_by_type_without_logging(self):
        r1 = ShippingRequirementFactory(
            user=self.u1,
            cost={'wage': 1000}
        )

        RequirementFlow(r1).accept()

        u2 = UserFactory()

        url = self.reverse('requirements-list')
        response = self.get(url, data={'role': 'TRAVELER', 'types': 'SHOPPING'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.assertEqual(
            response.data['count'],
            0
        )

    def test_get_requirement_by_service_type(self):
        r1 = ShippingDocumentRequirementFactory(
            user=self.u1,
            cost={'wage': 1000},
        )

        RequirementFlow(r1).accept()

        u2 = UserFactory()

        self.login(u2)

        url = self.reverse('requirements-list')
        response = self.get(url, data={'role': 'TRAVELER', 'types': 'SHIPPING', 'item_type': 'DOCUMENT'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            1
        )


    def test_get_requirement_by_other_service_type(self):
        r1 = ShippingRequirementFactory(
            user=self.u1,
            cost={'wage': 1000},
            properties__type=ItemType.CLOTH
        )

        RequirementFlow(r1).accept()

        u2 = UserFactory()

        self.login(u2)

        url = self.reverse('requirements-list')
        response = self.get(url, data={'role': 'TRAVELER', 'types': 'SHIPPING', 'service_types': 'DOCUMENT'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            0
        )

    def test_get_requirement_by_other_service_type2(self):
        r1 = ShippingRequirementFactory(
            user=self.u1,
            cost={'wage': 1000},
            properties__type=ItemType.CLOTH
        )

        RequirementFlow(r1).accept()

        u2 = UserFactory()

        self.login(u2)

        url = self.reverse('requirements-list')
        response = self.get(url, data={'role': 'TRAVELER', 'types': 'SHIPPING', 'service_types': 'VISIBLE_LOAD'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            1
        )

    def test_get_requirement_by_weight(self):
        u2 = UserFactory()

        r1 = ShippingRequirementFactory(
            user=self.u1,
            cost={'wage': 1000},
            properties__weight=20
        )

        r2 = ShippingRequirementFactory(
            user=u2,
            cost={'wage': 1000},
            properties__weight=10
        )

        RequirementFlow(r1).accept()
        RequirementFlow(r2).accept()

        u3 = UserFactory()

        self.login(u3)

        url = self.reverse('requirements-list')
        response = self.get(url, data={'role': 'TRAVELER', 'weight': 15})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            1
        )

        self.assertEqual(
            response.data['results'][0]['id'],
            r2.id
        )

    def test_get_requirement_by_cost(self):
        u2 = UserFactory()

        r1 = ShippingRequirementFactory(
            user=self.u1,
            cost={'wage': 20}
        )

        r2 = ShippingRequirementFactory(
            user=u2,
            cost={'wage': 10}
        )

        RequirementFlow(r1).accept()
        RequirementFlow(r2).accept()

        u3 = UserFactory()

        self.login(u3)

        url = self.reverse('requirements-list')
        response = self.get(url, data={'role': 'TRAVELER', 'cost': 15})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            1
        )

        self.assertEqual(
            response.data['results'][0]['id'],
            r2.id
        )

    def test_get_requirement_just_return_accepted_ones(self):
        u2 = UserFactory()

        r1 = ShippingRequirementFactory(
            user=self.u1,
            cost={'wage': 20}
        )

        r2 = ShippingRequirementFactory(
            user=u2,
            cost={'wage': 10}
        )

        RequirementFlow(r1).accept()

        u3 = UserFactory()

        self.login(u3)

        url = self.reverse('requirements-list')
        response = self.get(url, data={'role': 'TRAVELER'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            1
        )

        self.assertEqual(
            response.data['results'][0]['id'],
            r1.id
        )

    def test_get_requirements_by_city(self):
        r1 = ShippingRequirementFactory(
            user=self.u1,
            cost={'wage': 1000},
            properties__type=ItemType.CLOTH
        )

        RequirementFlow(r1).accept()

        url = self.reverse('requirements-list')
        response = self.get(
            url,
            data={
                'from_city': r1.source.location.city.name,
                'to_city': r1.destination.location.city.name
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.assertEqual(
            response.data['count'],
            1
        )

        data = response.data['results'][0]

        self.assertEqual(
            data['id'],
            r1.id
        )

    def test_get_requirements_by_location(self):
        r1 = ShippingRequirementFactory(
            user=self.u1,
            cost={'wage': 1000},
            properties__type=ItemType.CLOTH
        )

        RequirementFlow(r1).accept()

        url = self.reverse('requirements-list')
        response = self.get(
            url,
            data={
                'from_location': r1.source.location.city.location.readable_tag,
                'to_location': r1.destination.location.readable_tag
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.assertEqual(
            response.data['count'],
            1
        )

    def test_get_requirements_by_service(self):
        r1 = ShippingRequirementFactory(
            user=self.u1,
            cost={'wage': 1000},
            properties__type=ItemType.CLOTH
        )

        RequirementFlow(r1).accept()

        u2 = UserFactory()

        t = TripFactory(
            user=u2,
            flight__source=r1.source,
            flight__destination=r1.destination
        )

        s = ShippingVisibleLoadServiceFactory(
            trip=t,
            cost__wage=1000 + 10,
            properties__weight=r1.properties.weight + 10
        )

        ServiceFlow(s).accept()

        self.login(self.u1)

        url = self.reverse('requirements-list')
        response = self.get(
            url,
            data={
                'service': s.id
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertEqual(
            data['count'],
            1
        )

    def test_get_requirements_by_wrong_service(self):
        r1 = ShoppingRequirementFactory(
            user=self.u1,
            cost={'wage': 1000},
            properties__type=ItemType.CLOTH
        )

        RequirementFlow(r1).accept()

        u2 = UserFactory()

        t = TripFactory(
            user=u2,
            flight__source=r1.source,
            flight__destination=r1.destination
        )

        s = ShippingVisibleLoadServiceFactory(
            trip=t,
            cost__wage=1000 + 10,
            properties__weight=r1.properties.weight + 10
        )

        ServiceFlow(s).accept()

        self.login(self.u1)

        url = self.reverse('requirements-list')
        response = self.get(
            url,
            data={
                'service': s.id
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        data = response.data

        self.assertEqual(
            data['count'],
            0
        )

    def test_requirement_returns_after_a_request_has_sent(self):
        r1 = ShippingRequirementFactory(
            user=self.u1,
            cost={'wage': 1000},
            properties__type=ItemType.CLOTH
        )

        RequirementFlow(r1).accept()

        u2 = UserFactory()

        t = TripFactory(
            user=u2,
            flight__source=r1.source,
            flight__destination=r1.destination
        )

        s = ShippingVisibleLoadServiceFactory(
            trip=t,
            cost__wage=1000 + 10,
            properties__weight=r1.properties.weight + 10
        )

        ServiceFlow(s).accept()

        re = RequestFactory(
            requirement=r1,
            service=s
        )

        url = self.reverse('requirements-list')
        response = self.get(url, data={'role': 'TRAVELER'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertEqual(
            data['count'],
            1
        )

    def test_get_requirements_when_profile_is_pending(self):
        r1 = ShippingRequirementFactory(
            user=self.u1,
            cost={'wage': 1000}
        )

        f1 = SimpleUploadedFile("foo.jpg", self.generate_photo_file(), content_type="img/jpeg")

        RequirementFlow(r1).accept()

        self.u1.change_profile(
            {
                'image': f1
            }
        )

        u2 = UserFactory()

        self.login(u2)

        url = self.reverse('requirements-list')
        response = self.get(url, data={'role': 'TRAVELER'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.assertEqual(
            response.data['count'],
            0
        )

    def test_get_other_results(self):
        r1 = ShippingRequirementFactory(
            user=self.u1,
            cost={'wage': 1000}
        )

        RequirementFlow(r1).accept()

        u2 = UserFactory()

        l2 = LocationFactory()
        l3 = LocationFactory()

        url = self.reverse('requirements-list')
        response = self.get(url, data={'role': 'TRAVELER', 'similar': True, 'from_city': l2.city.name, 'to_city': l3.city.name})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        data = response.data

        self.assertEqual(
            data['count'],
            1
        )

    def test_get_other_results_not_return_self(self):
        r1 = ShippingRequirementFactory(
            user=self.u1,
            cost={'wage': 1000}
        )

        RequirementFlow(r1).accept()

        u2 = UserFactory()

        l2 = LocationFactory()
        l3 = LocationFactory()

        url = self.reverse('requirements-list')
        response = self.get(url, data={
            'role': 'TRAVELER',
            'similar': True,
            'from_city': r1.source.location.city.name,
            'to_city': r1.destination.location.city.name})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        data = response.data

        self.assertEqual(
            data['count'],
            0
        )

    def test_return_other_results_do_not_return_not_types(self):
        r1 = ShippingRequirementFactory(
            user=self.u1,
            cost={'wage': 1000}
        )

        RequirementFlow(r1).accept()

        u2 = UserFactory()

        self.login(u2)

        l2 = LocationFactory()
        l3 = LocationFactory()

        url = self.reverse('requirements-list')
        response = self.get(url, data={'role': 'TRAVELER',
                                       'types': ['SHOPPING',],
                                       'similar': True,
                                       'from_city': l2.city.name,
                                       'to_city': l3.city.name})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        data = response.data

        self.assertEqual(
            data['count'],
            0
        )

    def test_submit_document_with_standard_size(self):
        self.login(self.u1)

        url = self.reverse('requirements-list')
        response = self.post(
            url,
            data={
                'type': 'SHIPPING',
                'properties': {
                    'type': 'DOCUMENT',
                    'weight': 0,
                    'size': 'A4',
                    'num': 4
                },
                'source': {
                    'location': None,
                    'since': None,
                },
                'destination': {
                    'location': self.l2.id,
                    'since': '2024-02-13T07:00:00+00:00',
                    'to': None,
                },
                'cost': {
                    'wage': 123.4
                },
                'comment': 'foo',
                'name': 'foo'
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data
        )

    def test_send_custome_size_document(self):
        self.login(self.u1)

        url = self.reverse('requirements-list')
        response = self.post(
            url,
            data={
                'type': 'SHIPPING',
                'properties': {
                    'type': 'DOCUMENT',
                    'weight': 0,
                    'size': 'CUSTOM',
                    'num': 4
                },
                'source': {
                    'location': None,
                    'since': None,
                },
                'destination': {
                    'location': self.l2.id,
                    'since': '2024-02-13T07:00:00+00:00',
                    'to': None,
                },
                'cost': {
                    'wage': 123.4
                },
                'comment': 'foo',
                'name': 'foo'
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data
        )

class TestRequirementListBusiness(ViewTestBase):
    def setUp(self):
        super().setUp()

        self.u1 = UserFactory()

        self.u1.set_business_profile(verified=True)

        self.l1 = LocationFactory()
        self.l2 = LocationFactory()

    def test_create_requirement(self):
        self.login(self.u1)

        f1 = SimpleUploadedFile("foo.jpg", self.generate_photo_file(), content_type="img/jpeg")

        data = encode_nested_dict({
                    'type': 'SHIPPING',
                    'properties': {
                            'type': 'CLOTH',
                            'weight': 1,
                            'height': 20,
                            'length': 30,
                            'width': 5,
                        },
                    'source': {
                            'location': self.l1.id,
                            'since': None,
                            'to': '2024-02-12T07:00:00+00:00',
                        },
                    'destination': {
                            'location': self.l2.id,
                            'since': None,
                            'to': '2024-02-13T07:00:00+00:00',
                        },
                    'cost': {
                            'wage': 123.4
                        },
                    'comment': 'foo',
                    'name': 'foo',
                    'image': f1
                })

        url = self.reverse('requirements-list')
        response = self.post(
            url,
            data=data,
            format='multipart'
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data
        )

    def test_created_requirement_return_with_correct_profile(self):
        r = ShippingRequirementFactory(
            user=self.u1
        )

        RequirementFlow(r).accept()

        u2 = UserFactory()

        self.login(u2)

        url = self.reverse('requirements-list')
        response = self.get(
            url,
            data={'role': 'TRAVELER'}
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            1
        )

        data = response.data['results'][0]

        self.assertIn(
            'user_data',
            data
        )

        self.assertEqual(
            data['user_data']['type'],
            'BUSINESS'
        )

        self.assertIn(
            'business_name',
            data['user_data']
        )

class TestRequirementDetail(ViewTestBase):
    def setUp(self):
        super().setUp()

        self.u1 = UserFactory()

        self.r1 = ShippingRequirementFactory(
            user=self.u1,
            cost={'wage': 1000}
        )

        RequirementFlow(self.r1).accept()

    def test_could_not_get_when_not_login(self):
        url = self.reverse('requirement-detail', kwargs={'pk': self.r1.id})
        response = self.get(
            url
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )

    def test_could_not_get_when_not_own_object(self):
        u2 = UserFactory()
        self.login(u2)

        url = self.reverse('requirement-detail', kwargs={'pk': self.r1.id})
        response = self.get(
            url
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND
        )

    def test_retrieve(self):
        self.login(self.u1)

        url = self.reverse('requirement-detail', kwargs={'pk': self.r1.id})
        response = self.get(
            url
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

    def test_patch_costs(self):
        self.login(self.u1)

        url = self.reverse('requirement-detail', kwargs={'pk': self.r1.id})
        response = self.patch(
            url,
            data={
                'cost': {
                    'wage': 2000
                }
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.assertIn(
            'cost',
            response.data
        )

        self.assertEqual(
            response.data['cost']['wage'],
            2000
        )

    def test_patch_item_properties(self):
        self.login(self.u1)

        url = self.reverse('requirement-detail', kwargs={'pk': self.r1.id})
        response = self.patch(
            url,
            data={
                'properties': {
                    'weight': 20
                }
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertIn(
            'properties',
            response.data
        )

        self.assertEqual(
            response.data['properties']['weight'],
            20
        )

    def test_patch_shopping_item_properties(self):
        self.login(self.u1)

        r2 = ShoppingRequirementFactory(
            user=self.u1,
            cost={'wage': 1000}
        )

        url = self.reverse('requirement-detail', kwargs={'pk': r2.id})
        response = self.patch(
            url,
            data={
                'properties': {
                    'link': 'http://foo.com/app2'
                }
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertIn(
            'properties',
            response.data
        )

        self.assertEqual(
            response.data['properties']['link'],
            'http://foo.com/app2'
        )

    def test_patch_time_of_location(self):
        self.login(self.u1)

        url = self.reverse('requirement-detail', kwargs={'pk': self.r1.id})
        response = self.patch(
            url,
            data={
                'destination': {'to': self.r1.destination.to + timedelta(days=1)}
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        data = response.data

        self.assertEqual(
            datetime.fromisoformat(data['destination']['to']),
            self.r1.destination.to + timedelta(days=1)
        )

    def test_get_requirements_when_set_invisible(self):
        self.login(self.u1)

        url = self.reverse('requirement-detail', kwargs={'pk': self.r1.id})
        response = self.patch(
            url,
            data={
                'visible': False
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        u2 = UserFactory()

        self.login(u2)

        url = self.reverse('requirements-list')
        response = self.get(url, data={'role': 'TRAVELER'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.assertEqual(
            response.data['count'],
            0
        )

    def test_able_to_delete_requirement(self):
        self.login(self.u1)

        url = self.reverse('requirement-detail', kwargs={'pk': self.r1.id})
        response = self.delete(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT
        )

        url = self.reverse('requirement-detail', kwargs={'pk': self.r1.id})
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND
        )

    def test_change_requirement_make_it_submitted(self):
        self.login(self.u1)

        url = self.reverse('requirement-detail', kwargs={'pk': self.r1.id})

        response = self.patch(
            url,
            data={
                'destination': {'to': self.r1.destination.to + timedelta(days=1)}
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertEqual(
            data['status'],
            'SUBMITTED'
        )

    def test_change_visible_have_no_effect_on_status(self):
        self.login(self.u1)

        url = self.reverse('requirement-detail', kwargs={'pk': self.r1.id})
        response = self.patch(
            url,
            data={
                'visible': False
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertEqual(
            data['status'],
            'ACCEPTED'
        )

class TestRequirementDetailWithRequest(ViewTestBase):
    def setUp(self):
        super().setUp()

        self.u1 = UserFactory()
        self.u2 = UserFactory()

        self.t1 = TripFactory(
            user=self.u1
        )

        self.s1 = ShippingVisibleLoadServiceFactory(trip=self.t1)
        ServiceFlow(self.s1).accept()

        self.r1 = ShippingRequirementFactory(user=self.u2)
        RequirementFlow(self.r1).accept()

        self.re = RequestFactory(
            requirement=self.r1,
            service=self.s1
        )

    def test_after_a_request_you_could_not_delete_requirement(self):
        self.login(self.u2)

        url = self.reverse('requirement-detail', kwargs={'pk': self.r1.id})
        response = self.delete(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_406_NOT_ACCEPTABLE
        )

    def test_could_not_change_requirement_with_a_request(self):
        self.login(self.u2)

        url = self.reverse('requirement-detail', kwargs={'pk': self.r1.id})

        response = self.patch(
            url,
            data={
                'destination': {'to': self.t1.flight.destination.to + timedelta(days=1)}
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_406_NOT_ACCEPTABLE
        )

    def test_could_set_requirement_invisible(self):
        self.login(self.u2)

        url = self.reverse('requirement-detail', kwargs={'pk': self.r1.id})
        response = self.patch(
            url,
            data={
                'visible': False
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

    def test_requirement_set_to_finished_when_request_has_done(self):
        self.forward_request(self.re)

        self.login(self.u2)

        url = self.reverse('requirement-detail', kwargs={'pk': self.r1.id})
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertEqual(
            data['status'],
            'FINISHED'
        )

    def test_document_change_number(self):
        r1 = ShippingDocumentRequirementFactory(
            user=self.u1,
            properties__num=4)

        self.login(self.u1)

        url = self.reverse('requirement-detail', kwargs={'pk': r1.id})
        response = self.patch(
            url,
            data={
                'properties': {
                    'num': 2
                }
            })

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['properties']['num'],
            2
        )
