#!/usr/bin/env python3

from .test_base import ViewTestBase
from .utils import encode_nested_dict
from api.models.user import User
from api.models.flight import Flight
from api.models.location import Location
from api.models.trip import Trip, TripFlow
from api.models.service import ServiceFlow
from api.models.requirement import RequirementFlow
from api.models.temp_object import TempObject
from api.tests.fixtures import *

from rest_framework import status
from django.utils import timezone
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import SimpleUploadedFile

from datetime import timedelta, datetime


class TestTripList(ViewTestBase):
    def setUp(self):
        super().setUp()

        self.u1 = UserFactory()
        self.airline = AirlineFactory()

        self.flight = FlightFactory(airline=self.airline)

        self.flight_dict = self.flight.get_dict()

    def test_do_not_accept_without_login(self):
        url = self.reverse('trips-list')

        response = self.post(url, data={
            'flight': self.flight_dict,
            'ticket_number': 'foo123'
        })

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )

    def test_without_profile_completion_could_not_create(self):
        u = UserFactory(_verified=False)
        self.login(u)

        document = UserDocument.objects.create(
            user=u,
            type=UserDocumentType.EMAIL,
        )

        u.set_email_verified()
        self.login(u)

        url = self.reverse('trips-list')

        response = self.post(url, data={
            'flight': self.flight_dict,
            'ticket_number': 'foo123'
        })

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

        url = self.reverse('trips-list')

        response = self.post(url, data={
            'flight': self.flight_dict,
            'ticket_number': 'foo123'
        })

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data
        )

    def test_create(self):
        self.login(self.u1)

        self.flight_dict['number'] = '{}_foo'.format(self.flight_dict['number'])

        f1 = SimpleUploadedFile("foo.jpg", self.generate_photo_file(), content_type="img/jpeg")

        url = self.reverse('trips-list')
        response = self.post(
            url,
            data=encode_nested_dict({
                'flight': self.flight_dict,
                'ticket_number': 'foo123',
                'image': f1
            }),
            format='multipart')

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data
        )

        self.assertIn(
            'id',
            response.data
        )

        data = response.data

        self.assertEqual(
            data['status'],
            'SUBMITTED'
        )

        self.assertIn(
            'flight',
            data
        )

        self.assertIn(
            'source',
            data['flight']
        )

        self.assertIn(
            'location_data',
            data['flight']['source']
        )

        self.assertIn(
            'image',
            data
        )

    def test_add_service_to_trip_return_services(self):
        t1 = TripFactory(flight=self.flight, user=self.u1)
        s1 = ShippingVisibleLoadServiceFactory(trip=t1)

        self.login(self.u1)

        url = self.reverse('trips-list')
        response = self.get(url)

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
            'services',
            data
        )

        self.assertEqual(
            len(data['services']),
            1
        )

    def test_get_no_trips_by_other_role_when_no_service(self):
        t1 = TripFactory(flight=self.flight, user=self.u1)
        u2 = UserFactory()

        self.login(u2)

        url = self.reverse('trips-list')
        response = self.get(url, data={'role': 'CUSTOMER'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            0
        )

    def test_get_no_trip_when_user_not_defined_and_no_services(self):
        t1 = TripFactory(flight=self.flight, user=self.u1)

        url = self.reverse('trips-list')
        response = self.get(url, data={'role': 'CUSTOMER'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            0
        )

    def test_get_trips_by_other_role(self):
        t1 = TripFactory(flight=self.flight, user=self.u1)
        s1 = ShippingVisibleLoadServiceFactory(trip=t1)

        ServiceFlow(s1).accept()

        u2 = UserFactory()

        self.login(u2)

        url = self.reverse('trips-list')
        response = self.get(url, data={'role': 'CUSTOMER'})

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
            t1.id
        )

        self.assertEqual(
            data['services']['shipping:visible_load']['role'],
            'CUSTOMER'
        )

    def test_get_trips_by_other_role_self(self):
        t1 = TripFactory(flight=self.flight, user=self.u1)
        s1 = ShippingVisibleLoadServiceFactory(trip=t1)

        ServiceFlow(s1).accept()
        
        u2 = UserFactory()

        self.login(u2)

        url = self.reverse('trips-list')
        response = self.get(url, data={'role': 'CUSTOMER'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            1
        )

    def test_get_no_trips_when_no_service(self):
        t1 = TripFactory(flight=self.flight, user=self.u1)
        u2 = UserFactory()

        self.login(u2)

        url = self.reverse('trips-list')
        response = self.get(url, data={'role': 'CUSTOMER', 'type': 'SHIPPING'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            0
        )

    def test_get_trips_by_type(self):
        t1 = TripFactory(flight=self.flight, user=self.u1)
        s1 = ShippingVisibleLoadServiceFactory(trip=t1)

        ServiceFlow(s1).accept()
        
        u2 = UserFactory()

        self.login(u2)

        url = self.reverse('trips-list')
        response = self.get(url, data={'role': 'CUSTOMER', 'type': 'SHIPPING'})

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
            t1.id
        )

        self.assertEqual(
            len(data['services']),
            1
        )

    def test_get_trips_by_type_by_self(self):
        t1 = TripFactory(flight=self.flight, user=self.u1)
        s1 = ShippingVisibleLoadServiceFactory(trip=t1)

        ServiceFlow(s1).accept()
        
        u2 = UserFactory()

        self.login(self.u1)

        url = self.reverse('trips-list')
        response = self.get(url, data={'role': 'CUSTOMER', 'type': 'SHIPPING'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            1
        )

    def test_get_trips_by_other_type(self):
        t1 = TripFactory(flight=self.flight, user=self.u1)
        s1 = ShippingVisibleLoadServiceFactory(trip=t1)
        ServiceFlow(s1).accept()
        
        u2 = UserFactory()

        self.login(u2)

        url = self.reverse('trips-list')
        response = self.get(url, data={'role': 'CUSTOMER', 'type': 'SHOPPING'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.assertEqual(
            response.data['count'],
            0
        )

    def test_get_trips_by_service_type(self):
        t1 = TripFactory(flight=self.flight, user=self.u1)
        s1 = ShippingVisibleLoadServiceFactory(trip=t1)
        ServiceFlow(s1).accept()
        
        u2 = UserFactory()

        self.login(u2)

        url = self.reverse('trips-list')
        response = self.get(url, data={'role': 'CUSTOMER', 'type': 'SHIPPING', 'service_types[]': 'VISIBLE_LOAD'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.assertEqual(
            response.data['count'],
            1
        )


    def test_get_trips_by_other_service_type(self):
        t1 = TripFactory(flight=self.flight, user=self.u1)
        s1 = ShippingVisibleLoadServiceFactory(trip=t1)
        ServiceFlow(s1).accept()
        
        u2 = UserFactory()

        self.login(u2)

        url = self.reverse('trips-list')
        response = self.get(url, data={'role': 'CUSTOMER', 'type': 'SHIPPING', 'service_types': 'DOCUMENT'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            0
        )

    def test_get_trips_by_weight(self):
        u2 = UserFactory()

        t1 = TripFactory(flight=self.flight, user=self.u1)
        s1 = ShippingVisibleLoadServiceFactory(trip=t1, properties__weight=20)
        ServiceFlow(s1).accept()
        
        t2 = TripFactory(flight=self.flight, user=u2)
        s2 = ShippingVisibleLoadServiceFactory(trip=t2, properties__weight=10)
        ServiceFlow(s2).accept()
        
        u3 = UserFactory()

        self.login(u3)

        url = self.reverse('trips-list')
        response = self.get(url, data={'role': 'CUSTOMER', 'weight': 15})

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
            t1.id
        )

    def test_get_trips_by_cost(self):
        u2 = UserFactory()

        t1 = TripFactory(flight=self.flight, user=self.u1)
        s1 = ShippingVisibleLoadServiceFactory(trip=t1, cost__wage=20)
        ServiceFlow(s1).accept()
        
        t2 = TripFactory(flight=self.flight, user=u2)
        s2 = ShippingVisibleLoadServiceFactory(trip=t2, cost__wage=10)
        ServiceFlow(s2).accept()
        
        u3 = UserFactory()

        self.login(u3)

        url = self.reverse('trips-list')
        response = self.get(url, data={'role': 'CUSTOMER', 'cost': 15})

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
            t2.id
        )

    def test_get_services_by_city(self):
        self.f2 = Flight.objects.create(
            source=PositionFactory(),
            destination=PositionFactory(),
            number='foo1235',
            airline=self.airline
        )

        t1 = TripFactory(flight=self.flight, user=self.u1)
        s1 = ShippingDocumentServiceFactory(trip=t1)
        ServiceFlow(s1).accept()
        
        t2 = TripFactory(flight=self.f2, user=self.u1)
        s2 = ShippingDocumentServiceFactory(trip=t2)
        ServiceFlow(s2).accept()
        
        url = self.reverse('trips-list')
        response = self.get(
            url,
            data={
                'from_city': self.flight.source.location.city.name,
                'to_city': self.flight.destination.location.city.name
            }
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


        self.assertEqual(
            data['id'],
            t1.id
        )

    def test_get_services_by_location(self):        
        self.f2 = Flight.objects.create(
            source=PositionFactory(),
            destination=PositionFactory(),
            number='foo1235',
            airline=self.airline
        )

        t1 = TripFactory(flight=self.flight, user=self.u1)
        s1 = ShippingDocumentServiceFactory(trip=t1)
        ServiceFlow(s1).accept()

        t2 = TripFactory(flight=self.f2, user=self.u1)
        s2 = ShippingDocumentServiceFactory(trip=t2)
        ServiceFlow(s2).accept()

        url = self.reverse('trips-list')
        response = self.get(
            url,
            data={
                'from_location': t1.source.readable_tag,
                'to_location': t1.destination.readable_tag
            }
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


        self.assertEqual(
            data['id'],
            t1.id
        )

    def test_get_services_by_location_null(self):
        self.f2 = Flight.objects.create(
            source=PositionFactory(),
            destination=PositionFactory(),
            number='foo1235',
            airline=self.airline
        )

        t1 = TripFactory(flight=self.flight, user=self.u1)
        s1 = ShippingDocumentServiceFactory(trip=t1)
        ServiceFlow(s1).accept()

        t2 = TripFactory(flight=self.f2, user=self.u1)
        s2 = ShippingDocumentServiceFactory(trip=t2)
        ServiceFlow(s2).accept()

        url = self.reverse('trips-list')
        response = self.get(
            url,
            data={
                'from_location': 'null',
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        data = response.data

        self.assertTrue(
            data['count']
        )


    def test_get_trips_after_expire(self):
        f2 = Flight.objects.create(
            source=PositionFactory(to=timezone.now() - timedelta(days=9)),
            destination=PositionFactory(to=timezone.now() - timedelta(days=1)),
            number='foo1235',
            airline=self.airline
        )

        t1 = TripFactory(flight=f2, user=self.u1)
        s1 = ShippingDocumentServiceFactory(trip=t1)
        ServiceFlow(s1).accept()
        
        self.login(self.u1)

        url = self.reverse('trips-list')
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )
        data = response.data['results'][0]

        self.assertEqual(
            data['status'],
            'EXPIRED'
        )

    def test_get_trips_after_expire_return_none(self):
        f2 = Flight.objects.create(
            source=PositionFactory(to=timezone.now() - timedelta(days=9)),
            destination=PositionFactory(to=timezone.now() - timedelta(days=1)),
            number='foo1235',
            airline=self.airline
        )

        t1 = TripFactory(flight=f2, user=self.u1)
        s1 = ShippingDocumentServiceFactory(trip=t1)
        ServiceFlow(s1).accept()
        
        u2 = UserFactory()

        self.login(u2)

        url = self.reverse('trips-list')
        response = self.get(url, {'role': 'CUSTOMER'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            0
        )

    def test_get_active_trips(self):
        t1 = TripFactory(flight=self.flight, user=self.u1)
        s1 = ShippingDocumentServiceFactory(trip=t1)
        ServiceFlow(s1).accept()

        self.login(self.u1)
        
        url = self.reverse('trips-list')
        response = self.get(url, {'active': True})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

    def test_without_accept_other_role_get_no_trips(self):
        f2 = Flight.objects.create(
            source=PositionFactory(),
            destination=PositionFactory(),
            number='foo1235',
            airline=self.airline
        )

        t1 = TripFactory(flight=f2, user=self.u1)
        s1 = ShippingDocumentServiceFactory(trip=t1)

        url = self.reverse('trips-list')
        response = self.get(url, {'role': 'CUSTOMER'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            0
        )

    def test_get_trips_when_profile_pending(self):
        t1 = TripFactory(flight=self.flight, user=self.u1)
        s1 = ShippingVisibleLoadServiceFactory(trip=t1)

        ServiceFlow(s1).accept()
        
        f1 = SimpleUploadedFile("foo.jpg", self.generate_photo_file(), content_type="img/jpeg")

        u2 = UserFactory()

        self.u1.change_profile(
            {
                'image': f1
            }
        )

        self.assertEqual(
            self.u1.profile.status,
            ProfileStatus.PENDING
        )

        self.login(u2)

        url = self.reverse('trips-list')
        response = self.get(url, data={'role': 'CUSTOMER'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            0
        )

    def test_return_other_results(self):
        t1 = TripFactory(flight=self.flight, user=self.u1)
        s1 = ShippingVisibleLoadServiceFactory(trip=t1)

        ServiceFlow(s1).accept()

        u2 = UserFactory()

        self.login(u2)

        l2 = LocationFactory()
        l3 = LocationFactory()

        url = self.reverse('trips-list')
        response = self.get(url, data={'role': 'CUSTOMER', 'similar': True, 'from_city': l2.city.name, 'to_city': l3.city.name})

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

    def test_return_other_results_do_not_return_self_results(self):
        t1 = TripFactory(flight=self.flight, user=self.u1)
        s1 = ShippingVisibleLoadServiceFactory(trip=t1)

        ServiceFlow(s1).accept()

        u2 = UserFactory()

        self.login(u2)

        l2 = LocationFactory()
        l3 = LocationFactory()

        url = self.reverse('trips-list')
        response = self.get(url, data={'role': 'CUSTOMER',
                                       'similar': True,
                                       'from_city': self.flight.source.location.city.name,
                                       'to_city': self.flight.destination.location.city.name})

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
        t1 = TripFactory(flight=self.flight, user=self.u1)
        s1 = ShippingVisibleLoadServiceFactory(trip=t1)

        ServiceFlow(s1).accept()

        u2 = UserFactory()

        self.login(u2)

        l2 = LocationFactory()
        l3 = LocationFactory()

        url = self.reverse('trips-list')
        response = self.get(url, data={'role': 'CUSTOMER',
                                       'type': 'SHOPPING',
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

class TestBusinessTripList(ViewTestBase):
    def setUp(self):
        super().setUp()

        self.u1 = UserFactory()

        self.u1.set_business_profile(verified=True)

        self.u2 = UserFactory()

        self.t1 = TripFactory(
            user=self.u2
        )

        TripFlow(self.t1).accept()
        
        s1 = ShippingVisibleLoadServiceFactory(trip=self.t1)

        ServiceFlow(s1).accept()

        self.airline = AirlineFactory()

        self.flight = FlightFactory(airline=self.airline)

        self.flight_dict = self.flight.get_dict()

    def test_could_not_create_trip(self):
        self.login(self.u1)

        self.flight_dict['number'] = '{}_foo'.format(self.flight_dict['number'])

        f1 = SimpleUploadedFile("foo.jpg", self.generate_photo_file(), content_type="img/jpeg")

        url = self.reverse('trips-list')
        response = self.post(
            url,
            data=encode_nested_dict({
                'flight': self.flight_dict,
                'ticket_number': 'foo123',
                'image': f1
            }),
            format='multipart')

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )

    def test_can_see_other_trips(self):
        self.login(self.u1)

        url = self.reverse('trips-list')
        response = self.get(
            url,
            data={'role': 'CUSTOMER'}
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            1
        )

class TestTripDetail(ViewTestBase):
    def setUp(self):
        super().setUp()

        self.u1 = UserFactory()

        self.t1 = TripFactory(
            user=self.u1
        )

        TripFlow(self.t1).accept()

    def test_could_not_get_when_not_login(self):
        url = self.reverse('trip-detail', kwargs={'pk': self.t1.id})
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

        url = self.reverse('trip-detail', kwargs={'pk': self.t1.id})
        response = self.get(
            url
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND
        )

    def test_retrieve(self):
        self.login(self.u1)

        url = self.reverse('trip-detail', kwargs={'pk': self.t1.id})
        response = self.get(
            url
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

    def test_patch_ticket_number(self):
        self.login(self.u1)

        url = self.reverse('trip-detail', kwargs={'pk': self.t1.id})
        response = self.patch(
            url,
            data={
                'ticket_number': 'foo123455'
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.assertIn(
            'ticket_number',
            response.data
        )

        self.assertEqual(
            response.data['ticket_number'],
            'foo123455'
        )

    def test_patch_time_of_location(self):
        self.login(self.u1)

        url = self.reverse('trip-detail', kwargs={'pk': self.t1.id})
        response = self.get(url)

        data = response.data

        data['flight']['destination']['to'] = self.t1.flight.destination.to + timedelta(days=1)
        
        response = self.patch(
            url,
            data=data
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        data = response.data

        self.assertEqual(
            datetime.fromisoformat(data['flight']['destination']['to']),
            self.t1.flight.destination.to + timedelta(days=1)
        )

    def test_get_trips_when_set_invisible(self):
        s1 = ShippingVisibleLoadServiceFactory(trip=self.t1)

        ServiceFlow(s1).accept()
 
        self.login(self.u1)

        url = self.reverse('trip-detail', kwargs={'pk': self.t1.id})
        response = self.patch(
            url,
            data={
                'visible': 'false'
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertFalse(
            response.data['visible']
        )

        u2 = UserFactory()

        self.login(u2)

        url = self.reverse('trips-list')
        response = self.get(url, data={'role': 'CUSTOMER'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            0
        )

    def test_able_to_delete_trip(self):
        self.login(self.u1)

        url = self.reverse('trip-detail', kwargs={'pk': self.t1.id})
        response = self.delete(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT
        )

        url = self.reverse('trip-detail', kwargs={'pk': self.t1.id})
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND
        )

    def test_able_to_delete_trip_even_with_service(self):
        s1 = ShippingVisibleLoadServiceFactory(trip=self.t1)
        ServiceFlow(s1).accept()

        self.login(self.u1)

        url = self.reverse('trip-detail', kwargs={'pk': self.t1.id})
        response = self.delete(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT
        )

        url = self.reverse('service-detail', kwargs={'pk': s1.id})
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND
        )

    def test_change_trip_make_it_submitted(self):
        self.login(self.u1)

        url = self.reverse('trip-detail', kwargs={'pk': self.t1.id})
        response = self.get(url)

        data = response.data

        data['flight']['destination']['to'] = self.t1.flight.destination.to + timedelta(days=1)

        response = self.patch(
            url,
            data=data
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

        url = self.reverse('trip-detail', kwargs={'pk': self.t1.id})
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

class TestTripDetailWithRequest(ViewTestBase):
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

    def test_trip_has_correct_status(self):
        self.login(self.u1)
        
        url = self.reverse('trip-detail', kwargs={'pk': self.t1.id})
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['status'],
            'PENDING'
        )

    def test_after_a_request_you_could_not_delete_trip(self):
        self.login(self.u1)

        url = self.reverse('trip-detail', kwargs={'pk': self.t1.id})
        response = self.delete(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_406_NOT_ACCEPTABLE
        )

    def test_could_not_change_trip_with_a_request(self):
        self.login(self.u1)

        url = self.reverse('trip-detail', kwargs={'pk': self.t1.id})
        response = self.get(url)

        data = response.data

        data['flight']['destination']['to'] = self.t1.flight.destination.to + timedelta(days=1)
        response = self.patch(
            url,
            data=data
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_406_NOT_ACCEPTABLE
        )

    def test_could_set_trip_invisible(self):
        self.login(self.u1)

        url = self.reverse('trip-detail', kwargs={'pk': self.t1.id})
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

    def test_changing_visible_no_effect_on_services(self):
        self.login(self.u1)

        url = self.reverse('trip-detail', kwargs={'pk': self.t1.id})
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
            data['visible'],
            False
        )

        self.assertEqual(
            len(data['services'].keys()),
            1
        )


    def test_trip_set_to_finished_when_request_has_done(self):
        self.forward_request(self.re)

        self.login(self.u1)

        url = self.reverse('trip-detail', kwargs={'pk': self.t1.id})
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

    def test_having_another_service_without_any_request(self):
        s2 = ShippingDocumentServiceFactory(trip=self.t1)
        ServiceFlow(s2).accept()

        self.forward_request(self.re)

        self.login(self.u1)

        url = self.reverse('trip-detail', kwargs={'pk': self.t1.id})
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

    def test_having_another_service_with_request(self):
        s2 = ShippingDocumentServiceFactory(trip=self.t1)
        ServiceFlow(s2).accept()

        r2 = ShippingRequirementFactory(user=self.u2, properties__type=ItemType.DOCUMENT)
        RequirementFlow(r2).accept()

        re2 = RequestFactory(
            requirement=r2,
            service=s2
        )

        self.forward_request(re2, StepType.PAYMENT)

        self.forward_request(self.re)

        self.login(self.u1)

        url = self.reverse('trip-detail', kwargs={'pk': self.t1.id})
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertNotEqual(
            data['status'],
            'FINISHED'
        )


class TestTripWithService(ViewTestBase):
    def setUp(self):
        super().setUp()

        self.u1 = UserFactory()
        self.u2 = UserFactory()

        self.t1 = TripFactory(
            user=self.u1
        )

        self.airline = AirlineFactory()
        self.flight = FlightFactory(airline=self.airline)

        self.flight_dict = self.flight.get_dict()


    def test_create_trip(self):
        self.login(self.u1)
        
        url = self.reverse('trips-list')

        response = self.post(url, data={
            'flight': self.flight_dict,
            'ticket_number': 'foo123',
            'services': {
                'shipping:visible_load': {
                    'type': 'SHIPPING',
                    'properties': {
                        'type': 'VISIBLE_LOAD',
                        'weight': 1,
                    },
                    'cost': {
                        'wage': 1234.5
                    },
                },
            }
        })

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data
        )

        data = response.data

        self.assertEqual(
            len(data['services']),
            1
        )

        self.assertIn(
            'shipping:visible_load',
            data['services']
        )
    
    def test_add_service_to_trip(self):
        self.login(self.u1)

        url = self.reverse('trip-detail', kwargs={'pk': self.t1.id})
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        data['services']['shipping:visible_load'] = {
                'type': 'SHIPPING',
                'properties': {
                    'type': 'VISIBLE_LOAD',
                    'weight': 1,
                    'height': 10,
                    'width': 20,
                    'length': 10
                },
                'cost': {
                    'wage': 1234.5
                },
        }

        response = self.patch(url, data)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        data = response.data

        self.assertEqual(
            len(data['services']),
            1
        )

        self.assertIn(
            'shipping:visible_load',
            data['services']
        )

    def test_edit_service(self):
        s1 = ShippingDocumentServiceFactory(trip=self.t1)
        ServiceFlow(s1).accept()

        self.login(self.u1)

        url = self.reverse('trip-detail', kwargs={'pk': self.t1.id})
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        f1 = SimpleUploadedFile("foo.jpg", self.generate_photo_file(), content_type="img/jpeg")

        data['image'] = f1

        response = self.patch(url, data=encode_nested_dict(data), format='multipart')

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertTrue(
            data['image']
        )

        f1 = SimpleUploadedFile("foo.jpg", self.generate_photo_file(), content_type="img/jpeg")

        data['services']['shipping:document']['properties']['weight'] = 20
        data['image'] = f1

        response = self.patch(url, data=encode_nested_dict(data), format='multipart')

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        data = response.data

        self.assertEqual(
            data['services']['shipping:document']['properties']['weight'],
            20,
            data['services']['shipping:document']
        )

    def test_add_shopping_without_dimensions(self):
        s1 = ShippingDocumentServiceFactory(trip=self.t1)
        ServiceFlow(s1).accept()

        self.login(self.u1)
        
        url = self.reverse('trip-detail', kwargs={'pk': self.t1.id})
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        data['services']['shopping:visible_load'] = {
                'type': 'SHOPPING',
                'properties': {
                    'type': 'VISIBLE_LOAD',
                    'weight': 1,
                },
                'cost': {
                    'wage': 1234.5
                },
        }

        response = self.patch(url, data)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertEqual(
            len(data['services']),
            2
        )

    def test_edit_shopping_service(self):
        s1 = ShippingDocumentServiceFactory(trip=self.t1)
        ServiceFlow(s1).accept()

        s2 = ShoppingVisibleLoadServiceFactory(trip=self.t1)
        ServiceFlow(s2).accept()

        self.login(self.u1)
        
        url = self.reverse('trip-detail', kwargs={'pk': self.t1.id})
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        data['services']['shopping:visible_load']['weight'] = 20

        response = self.patch(url, data)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

    def test_remove_a_service(self):
        s1 = ShippingDocumentServiceFactory(trip=self.t1)
        ServiceFlow(s1).accept()

        s2 = ShoppingVisibleLoadServiceFactory(trip=self.t1)
        ServiceFlow(s2).accept()

        self.login(self.u1)
        
        url = self.reverse('trip-detail', kwargs={'pk': self.t1.id})
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        data = response.data

        del data['services']['shopping:visible_load']

        response = self.patch(url, data=data)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertEqual(
            len(data['services']),
            1
        )

    def test_check_return_many_services_for_trip(self):
        s1 = ShippingDocumentServiceFactory(trip=self.t1)
        ServiceFlow(s1).accept()

        s2 = ShoppingVisibleLoadServiceFactory(trip=self.t1)
        ServiceFlow(s2).accept()

        self.login(self.u1)
        
        url = self.reverse('trip-detail', kwargs={'pk': self.t1.id})
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data
        
        self.assertEqual(
            len(data['services']),
            2
        )

        self.assertIn(
            'shipping:document',
            data['services']
        )

        self.assertIn(
            'shopping:visible_load',
            data['services']
        )

