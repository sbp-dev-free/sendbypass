#!/usr/bin/env python3

from api.models import Request
from api.models.requirement import RequirementFlow
from api.models.service import ServiceFlow
from api.models.request import *
from api.tests.fixtures import *
from .test_base import ViewTestBase
from .utils import encode_nested_dict

from rest_framework import status
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import SimpleUploadedFile

import unittest
import json


class TestShippingRequestBase(ViewTestBase):
    def setUp(self):
        super().setUp()

        self.traveler = UserFactory()
        self.customer = UserFactory()

        self.a1 = AirportFactory()
        self.a2 = AirportFactory()
        self.l1 = self.a1.location
        self.l2 = self.a2.location
        self.f1 = FlightFactory(source__location=self.a1, destination__location=self.a2)
        self.t1 = TripFactory(user=self.traveler, flight=self.f1)
        self.s1 = ShippingVisibleLoadServiceFactory(trip=self.t1)

        self.r1 = ShippingRequirementFactory(user=self.customer)

        ServiceFlow(self.s1).accept()
        RequirementFlow(self.r1).accept()

class TestRequestList(TestShippingRequestBase):
    def setUp(self):
        super().setUp()

    def test_do_not_accept_without_login(self):
        url = self.reverse('requests-list')
        response = self.post(
            url,
            data={
                'requirement': self.r1.id,
                'service': self.s1.id,
                'deal': {
                    'cost': 1234,
                    'traveler_fee': 23.4,
                    'customer_fee': 22
                },
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
            response.data
        )

    def test_create(self):
        self.login(self.customer)
        
        url = self.reverse('requests-list')
        response = self.post(
            url,
            data={
                'requirement': self.r1.id,
                'service': self.s1.id,
                'deal': {
                    'cost': 1234,
                    'traveler_fee': 23.4,
                    'customer_fee': 22
                },
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data
        )

        self.assertIn(
            'submitted_by',
            response.data
        )

        self.assertEqual(
            response.data['submitted_by'],
            'CUSTOMER'
        )

        self.assertEqual(
            response.data['role'],
            'CUSTOMER'
        )

    def test_could_not_create_when_no_correct_user(self):
        u2 = UserFactory()

        self.login(u2)

        url = self.reverse('requests-list')
        response = self.post(
            url,
            data={
                'requirement': self.r1.id,
                'service': self.s1.id,
                'deal': {
                    'cost': 1234,
                    'traveler_fee': 23.4,
                    'customer_fee': 22
                },
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
            response.data
        )

    def test_post_request_change_both_side_status(self):
        self.login(self.customer)

        url = self.reverse('requests-list')
        response = self.post(
            url,
            data={
                'requirement': self.r1.id,
                'service': self.s1.id,
                'deal': {
                    'cost': 1234,
                    'traveler_fee': 23.4,
                    'customer_fee': 22
                },
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data
        )

        self.r1.refresh_from_db()
        self.s1.refresh_from_db()

        self.assertEqual(
            self.r1.status,
            ActionStatus.PENDING
        )

        self.assertEqual(
            self.s1.status,
            ActionStatus.PENDING
        )

    def test_get_requests_list(self):
        re = RequestFactory(
            requirement=self.r1,
            service=self.s1
        )

        self.login(self.customer)

        url = self.reverse('requests-list')
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
            'requirement_data',
            data
        )

        self.assertIn(
            'user',
            data['requirement_data']
        )

        self.assertIn(
            'service_data',
            data
        )

        self.assertIn(
            'trip_data',
            data['service_data']
        )

        self.assertIn(
            'user',
            data['service_data']
        )

    def test_get_requests_list_by_type_shipping(self):
        re = RequestFactory(
            requirement=self.r1,
            service=self.s1
        )

        self.login(self.customer)

        url = self.reverse('requests-list')
        response = self.get(url, data={'type': 'SHIPPING'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            1
        )

    def test_get_requests_list_by_type_shopping(self):
        re = RequestFactory(
            requirement=self.r1,
            service=self.s1
        )

        self.login(self.customer)

        url = self.reverse('requests-list')
        response = self.get(url, data={'type': 'SHOPPING'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            0
        )

    def test_get_requests_list_by_side(self):
        re = RequestFactory(
            requirement=self.r1,
            service=self.s1,
            submitted_by=self.customer
        )

        self.login(self.customer)

        url = self.reverse('requests-list')
        response = self.get(url, data={'side': 'OUTBOX'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            1
        )

    def test_get_requests_list_by_side_other(self):
        re = RequestFactory(
            requirement=self.r1,
            service=self.s1,
            submitted_by=self.customer
        )

        self.login(self.customer)

        url = self.reverse('requests-list')
        response = self.get(url, data={'side': 'INBOX'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            0
        )

    def test_able_to_send_another_request_for_service(self):
        re = RequestFactory(
            requirement=self.r1,
            service=self.s1,
            submitted_by=self.customer
        )

        u = UserFactory()

        r2 = ShippingRequirementFactory(user=u)

        RequirementFlow(r2).accept()

        self.login(u)

        url = self.reverse('requests-list')
        response = self.post(
            url,
            data={
                'requirement': r2.id,
                'service': self.s1.id,
                'deal': {
                    'cost': 1234,
                    'traveler_fee': 23.4,
                    'customer_fee': 22
                },
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

        self.assertEqual(
            response.data['status'],
            'PENDING'
        )

    def test_able_to_send_another_request_for_requirement(self):
        re = RequestFactory(
            requirement=self.r1,
            service=self.s1,
            submitted_by=self.customer
        )

        u = UserFactory()

        t2 = TripFactory(user=u, flight=self.f1)
        s2 = ShippingVisibleLoadServiceFactory(trip=t2)

        ServiceFlow(s2).accept()

        self.login(u)

        url = self.reverse('requests-list')
        response = self.post(
            url,
            data={
                'requirement': self.r1.id,
                'service': s2.id,
                'deal': {
                    'cost': 1234,
                    'traveler_fee': 23.4,
                    'customer_fee': 22
                },
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

        self.assertEqual(
            response.data['status'],
            'PENDING'
        )

    def test_after_accept_could_not_send_another_request_for_service(self):
        re = RequestFactory(
            requirement=self.r1,
            service=self.s1,
            submitted_by=self.customer
        )

        RequestFlow(re).accept(self.traveler)

        u = UserFactory()

        r2 = ShippingRequirementFactory(user=u)

        RequirementFlow(r2).accept()

        self.login(u)

        url = self.reverse('requests-list')
        response = self.post(
            url,
            data={
                'requirement': r2.id,
                'service': self.s1.id,
                'deal': {
                    'cost': 1234,
                    'traveler_fee': 23.4,
                    'customer_fee': 22
                },
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

        url = self.reverse('requests-list')
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            1
        )

    def test_after_accept_could_send_another_request_for_requirement(self):
        re = RequestFactory(
            requirement=self.r1,
            service=self.s1,
            submitted_by=self.customer
        )

        RequestFlow(re).accept(self.traveler)

        u = UserFactory()

        t2 = TripFactory(user=u, flight=self.f1)
        s2 = ShippingVisibleLoadServiceFactory(trip=t2)

        ServiceFlow(s2).accept()

        self.login(u)

        url = self.reverse('requests-list')
        response = self.post(
            url,
            data={
                'requirement': self.r1.id,
                'service': s2.id,
                'deal': {
                    'cost': 1234,
                    'traveler_fee': 23.4,
                    'customer_fee': 22
                },
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data
        )

        url = self.reverse('requests-list')
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            1
        )

    def test_after_accept_request_would_not_return_in_orders(self):
        re = RequestFactory(
            requirement=self.r1,
            service=self.s1,
            submitted_by=self.customer
        )

        RequestFlow(re).accept(self.traveler)

        self.login(self.traveler)

        url = self.reverse('requests-list')
        response = self.get(
            url,
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            0
        )

class TestActivityRequestList(TestShippingRequestBase):
    def setUp(self):
        super().setUp()

        self.re1 = RequestFactory(
            service=self.s1,
            requirement=self.r1,
            submitted_by=self.customer
        )

    def test_get_list_inbox(self):
        self.login(self.traveler)
        
        url = self.reverse('activity_requests-list')
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertEqual(
            data['count'],
            1
        )

        data = data['results'][0]

        self.assertEqual(
            data['type'],
            'SERVICE'
        )

        self.assertIn(
            'activity',
            data
        )

        self.assertIn(
            'requests',
            data
        )

        response = self.get(url, data={'side': 'OUTBOX'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertEqual(
            data['count'],
            0
        )

    def test_get_list_outbox(self):
        self.login(self.customer)

        url = self.reverse('activity_requests-list')
        response = self.get(url, data={'side': 'OUTBOX'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertEqual(
            data['count'],
            1
        )

        data = data['results'][0]

        self.assertEqual(
            data['type'],
            'SHIPPING'
        )

        self.assertIn(
            'activity',
            data
        )

        self.assertIn(
            'requests',
            data
        )

        self.assertEqual(
            len(data['requests']),
            1
        )

    def test_get_list_by_type_service(self):
        self.login(self.customer)

        url = self.reverse('activity_requests-list')
        response = self.get(url, data={'activity': 'SERVICE'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertEqual(
            data['count'],
            0
        )

    def test_get_list_by_type_shipping(self):
        self.login(self.customer)

        url = self.reverse('activity_requests-list')
        response = self.get(url, data={'activity': 'SHIPPING'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertEqual(
            data['count'],
            1
        )

class TestRequestInteraction(TestShippingRequestBase):
    def test_related_request_return_for_requirement(self):
        re = RequestFactory(
            requirement=self.r1,
            service=self.s1,
        )

        self.login(self.customer)

        url = self.reverse('requirements-list')
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK)

        data = response.data['results'][0]

        self.assertIn(
            'requests',
            data
        )

        self.assertEqual(
            len(data['requests']),
            1
        )

        self.assertEqual(
            data['requests'][0]['id'],
            re.id
        )

    def test_related_request_return_for_services(self):
        re = RequestFactory(
            requirement=self.r1,
            service=self.s1
        )

        self.login(self.traveler)

        url = self.reverse('services-list')
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK)

        self.assertEqual(
            response.data['count'],
            1
        )

        data = response.data['results'][0]

        self.assertEqual(
            len(data['requests']),
            1
        )

        self.assertEqual(
            data['requests'][0]['id'],
            re.id
        )

    def test_user_able_to_see_other_side_when_request_applied(self):
        re = RequestFactory(
            requirement=self.r1,
            service=self.s1
        )

        self.login(self.customer)

        url = self.reverse('service-detail', kwargs={'pk': self.s1.id})
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        data = response.data

        self.assertEqual(
            data['role'],
            'CUSTOMER'
        )

    def test_user_could_not_change_other_side(self):
        re = RequestFactory(
            requirement=self.r1,
            service=self.s1
        )

        self.login(self.customer)

        url = self.reverse('service-detail', kwargs={'pk': self.s1.id})
        response = self.patch(url, data={'name': 'bar'})

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
            )

    def test_able_to_send_more_request_for_a_requirement(self):
        re = RequestFactory(
            requirement=self.r1,
            service=self.s1
        )

        u2 = UserFactory()

        f2 = FlightFactory(source__location=self.a1, destination__location=self.a2)

        t2 = TripFactory(user=u2, flight=f2)

        s2 = ShippingVisibleLoadServiceFactory(trip=t2)

        ServiceFlow(s2).accept()

        self.login(u2)

        url = self.reverse('requests-list')
        response = self.post(
            url,
            data={
                'requirement': self.r1.id,
                'service': s2.id,
                'deal': {
                    'cost': 1234,
                    'traveler_fee': 23.4,
                    'customer_fee': 22
                },
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )


class TestRequestDetail(TestShippingRequestBase):
    def setUp(self):
        super().setUp()

        self.r = RequestFactory(
            requirement=self.r1,
            service=self.s1,
            submitted_by=self.customer
        )

    def test_other_side_can_accept_request(self):
        self.login(self.traveler)

        url = self.reverse('request-detail', kwargs={'pk': self.r.id})
        response = self.patch(url, data={'status': 'ACCEPTED'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertEqual(
            data['status'],
            'ACCEPTED'
        )

        self.assertIn(
            'accept_time',
            data
        )

        self.assertEqual(
            self.email_send.call_count,
            2
        )


    def test_self_could_not_accept_request(self):
        self.login(self.customer)

        url = self.reverse('request-detail', kwargs={'pk': self.r.id})
        response = self.patch(url, data={'status': 'ACCEPTED'})

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )

    def test_self_can_cancel_a_request(self):
        self.login(self.customer)

        url = self.reverse('request-detail', kwargs={'pk': self.r.id})
        response = self.patch(url, data={'status': 'CANCELED'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        data = response.data

        self.assertEqual(
            data['status'],
            'CANCELED'
        )

    @unittest.expectedFailure
    def test_after_cancel_other_side_did_not_see_the_request(self):
        self.login(self.customer)

        url = self.reverse('request-detail', kwargs={'pk': self.r.id})
        response = self.patch(url, data={'status': 'CANCELED'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.login(self.traveler)
        
        url = self.reverse('requests-list')
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            0
        )

    def test_other_side_can_reject_request(self):
        self.login(self.traveler)

        url = self.reverse('request-detail', kwargs={'pk': self.r.id})
        response = self.patch(url, data={'status': 'REJECTED'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertEqual(
            data['status'],
            'REJECTED'
        )

        self.assertTrue(
            data['end_time']
        )

    def test_after_reject_see_rejected(self):
        self.login(self.traveler)

        url = self.reverse('request-detail', kwargs={'pk': self.r.id})
        response = self.patch(url, data={'status': 'REJECTED'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )
        
        self.login(self.customer)

        url = self.reverse('requests-list',)
        response = self.get(url,)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.assertEqual(
            response.data['count'],
            1
        )

        self.assertEqual(
            response.data['results'][0]['status'],
            'REJECTED'
        )
        
    def test_after_accept_request_return_in_orders(self):
        RequestFlow(self.r).accept(self.traveler)

        self.login(self.traveler)

        url = self.reverse('orders-list')
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
            'steps',
            data
        )

    def test_after_accept_request_return_in_orders_for_both_side(self):
        RequestFlow(self.r).accept(self.traveler)

        self.login(self.customer)

        url = self.reverse('orders-list')
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
            'steps',
            data
        )

    def test_before_accept_do_not_return_orders(self):
        self.login(self.customer)

        url = self.reverse('orders-list')
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            0
        )

    def test_before_accept_do_not_return_orders_for_traveler(self):
        s2 = ShoppingVisibleLoadServiceFactory(trip=self.t1)

        ServiceFlow(s2).accept()

        re2 = ShoppingRequirementFactory(user=self.customer)

        RequirementFlow(re2).accept()

        r2 = RequestFactory(
            requirement=re2,
            service=s2,
            submitted_by=self.customer
        )

        RequestFlow(r2).accept(self.traveler)

        self.login(self.traveler)

        url = self.reverse('orders-list')
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            1
        )

class TestOrderStepDetail(TestShippingRequestBase):
    def setUp(self):
        super().setUp()

        self.r = RequestFactory(
            requirement=self.r1,
            service=self.s1,
            submitted_by=self.customer
        )

        RequestFlow(self.r).accept(self.traveler)

    def test_do_not_return_in_requests_for_customer(self):
        self.login(self.customer)

        url = self.reverse('requests-list')
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            0
        )

    def test_do_not_return_in_requests_for_traveler(self):
        self.login(self.traveler)

        url = self.reverse('requests-list')
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            0
        )

    def test_get_different_steps_for_different_sides(self):
        self.login(self.customer)

        # orders/{id}
        url = self.reverse('order-detail', kwargs={'pk': self.r.id})
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            len(response.data['steps']),
            1
        )

        customer_step = response.data['steps'][0]

        self.login(self.traveler)

        url = self.reverse('order-detail', kwargs={'pk': self.r.id})
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            len(response.data['steps']),
            1
        )

        traveler_step = response.data['steps'][0]

        self.assertEqual(
            customer_step['type'],
            traveler_step['type']
        )

        self.assertNotEqual(
            customer_step['id'],
            traveler_step['id']
        )

    def test_different_sides_could_not_see_step_of_each_others(self):
        traveler_step = self.r.get_steps(self.traveler)[0]
        customer_step = self.r.get_steps(self.customer)[0]

        self.login(self.traveler)

        # orders_steps/{id}
        url = self.reverse('order_step-detail', kwargs={'pk': customer_step.id})
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND
        )

        self.login(self.customer)

        url = self.reverse('order_step-detail', kwargs={'pk': traveler_step.id})
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND
        )

    def test_patch_payment_by_customer(self):
        traveler_step = self.r.get_steps(self.traveler)[0]
        customer_step = self.r.get_steps(self.customer)[0]

        self.login(self.customer)

        url = self.reverse('order_step-detail', kwargs={'pk': customer_step.id})
        response = self.patch(url, data={'status': 'DONE'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.assertEqual(
            response.data['status'],
            'DONE'
        )

        self.assertTrue(
            response.data['end_time']
        )

    def test_patching_payment_make_traveler_step_done(self):
        traveler_step = self.r.get_steps(self.traveler)[0]
        customer_step = self.r.get_steps(self.customer)[0]

        self.login(self.customer)

        url = self.reverse('order_step-detail', kwargs={'pk': customer_step.id})
        response = self.patch(url, data={'status': 'DONE'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.login(self.traveler)

        url = self.reverse('order_step-detail', kwargs={'pk': traveler_step.id})
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.assertEqual(
            response.data['status'],
            'DONE'
        )

    def test_could_not_patch_payment_by_traveler(self):
        traveler_step = self.r.get_steps(self.traveler)[0]
        customer_step = self.r.get_steps(self.customer)[0]

        self.login(self.traveler)

        url = self.reverse('order_step-detail', kwargs={'pk': traveler_step.id})
        response = self.patch(url, data={'status': 'DONE'})

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )

    def test_patch_receive_by_traveler(self):
        traveler_step = self.r.get_steps(self.traveler)[0]
        customer_step = self.r.get_steps(self.customer)[0]

        PaymentStepFlow(customer_step, customer_step.properties).accept(self.customer)

        traveler_step = self.r.get_steps(self.traveler).latest('id')
        customer_step = self.r.get_steps(self.customer).latest('id')

        DeliverToAirportFlow(traveler_step, customer_step.properties).accept(self.traveler)

        traveler_step = self.r.get_steps(self.traveler).latest('id')
        customer_step = self.r.get_steps(self.customer).latest('id')

        self.login(self.traveler)

        url = self.reverse('order_step-detail', kwargs={'pk': traveler_step.id})
        response = self.patch(url, data={'status': 'DONE', 'properties': {'code': customer_step.properties.code}})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['status'],
            'DONE'
        )

        self.assertTrue(
            response.data['end_time']
        )

    def test_patch_incorrect_patch_receive_by_traveler(self):
        traveler_step = self.r.get_steps(self.traveler)[0]
        customer_step = self.r.get_steps(self.customer)[0]

        PaymentStepFlow(customer_step, customer_step.properties).accept(self.customer)

        traveler_step = self.r.get_steps(self.traveler).latest('id')
        customer_step = self.r.get_steps(self.customer).latest('id')

        DeliverToAirportFlow(traveler_step, customer_step.properties).accept(self.traveler)

        traveler_step = self.r.get_steps(self.traveler).latest('id')
        customer_step = self.r.get_steps(self.customer).latest('id')

        self.login(self.traveler)

        url = self.reverse('order_step-detail', kwargs={'pk': traveler_step.id})
        response = self.patch(url, data={'status': 'DONE',
                                         'properties': {'code': customer_step.properties.code + str(1)}})

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )

    def test_patch_done_by_traveler(self):
        traveler_step = self.r.get_steps(self.traveler)[0]
        customer_step = self.r.get_steps(self.customer)[0]

        PaymentStepFlow(customer_step, customer_step.properties).accept(self.customer)

        traveler_step = self.r.get_steps(self.traveler).latest('id')
        customer_step = self.r.get_steps(self.customer).latest('id')

        DeliverToAirportFlow(traveler_step, customer_step.properties).accept(self.traveler)

        traveler_step = self.r.get_steps(self.traveler).latest('id')
        customer_step = self.r.get_steps(self.customer).latest('id')

        ReceiveToCustomerFlow(traveler_step, customer_step.properties).accept(self.traveler)

        traveler_step = self.r.get_steps(self.traveler).latest('id')
        customer_step = self.r.get_steps(self.customer).latest('id')

        self.login(self.traveler)

        url = self.reverse('order_step-detail', kwargs={'pk': traveler_step.id})
        response = self.patch(url, data={'status': 'DONE', 'properties': {'rate': '2'}})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.assertEqual(
            response.data['status'],
            'DONE'
        )

        self.assertTrue(
            response.data['end_time']
        )

    def test_request_set_delivered_before_done_step(self):
        traveler_step = self.r.get_steps(self.traveler)[0]
        customer_step = self.r.get_steps(self.customer)[0]

        PaymentStepFlow(customer_step, customer_step.properties).accept(self.customer)

        traveler_step = self.r.get_steps(self.traveler).latest('id')
        customer_step = self.r.get_steps(self.customer).latest('id')

        DeliverToAirportFlow(traveler_step, customer_step.properties).accept(self.traveler)

        traveler_step = self.r.get_steps(self.traveler).latest('id')
        customer_step = self.r.get_steps(self.customer).latest('id')

        ReceiveToCustomerFlow(traveler_step, customer_step.properties).accept(self.traveler)

        self.login(self.traveler)

        url = self.reverse('order-detail', kwargs={'pk': self.r.id})
        response = self.get(url)

        data = response.data

        self.assertEqual(
            data['status'],
            'DELIVERED',
            response.data
        )

    def test_request_set_finished_after_all_steps(self):
        traveler_step = self.r.get_steps(self.traveler)[0]
        customer_step = self.r.get_steps(self.customer)[0]

        PaymentStepFlow(customer_step, customer_step.properties).accept(self.customer)

        traveler_step = self.r.get_steps(self.traveler).latest('id')
        customer_step = self.r.get_steps(self.customer).latest('id')

        DeliverToAirportFlow(traveler_step, customer_step.properties).accept(self.traveler)

        traveler_step = self.r.get_steps(self.traveler).latest('id')
        customer_step = self.r.get_steps(self.customer).latest('id')

        ReceiveToCustomerFlow(traveler_step, customer_step.properties).accept(self.traveler)

        traveler_step = self.r.get_steps(self.traveler).latest('id')
        customer_step = self.r.get_steps(self.customer).latest('id')

        DoneFlow(traveler_step, traveler_step.properties).accept(self.traveler)

        self.login(self.traveler)

        url = self.reverse('order-detail', kwargs={'pk': self.r.id})
        response = self.get(url)

        data = response.data

        self.assertEqual(
            data['status'],
            'FINISHED'
        )

        self.assertTrue(
            data['end_time']
        )

    def test_just_one_side_is_finished(self):
        traveler_step = self.r.get_steps(self.traveler)[0]
        customer_step = self.r.get_steps(self.customer)[0]

        PaymentStepFlow(customer_step, customer_step.properties).accept(self.customer)

        traveler_step = self.r.get_steps(self.traveler).latest('id')
        customer_step = self.r.get_steps(self.customer).latest('id')

        DeliverToAirportFlow(traveler_step, customer_step.properties).accept(self.traveler)

        traveler_step = self.r.get_steps(self.traveler).latest('id')
        customer_step = self.r.get_steps(self.customer).latest('id')

        ReceiveToCustomerFlow(traveler_step, customer_step.properties).accept(self.traveler)

        traveler_step = self.r.get_steps(self.traveler).latest('id')
        customer_step = self.r.get_steps(self.customer).latest('id')

        DoneFlow(traveler_step, traveler_step.properties).accept(self.traveler)

        self.login(self.customer)

        url = self.reverse('order-detail', kwargs={'pk': self.r.id})
        response = self.get(url)

        data = response.data

        self.assertNotEqual(
            data['status'],
            'FINISHED'
        )

        self.assertFalse(
            data['end_time']
        )

class TestOrderList(TestShippingRequestBase):
    def setUp(self):
        super().setUp()

        self.a3 = AirportFactory()
        self.a4 = AirportFactory()
        self.l3 = self.a3.location
        self.l4 = self.a4.location
        self.f2 = FlightFactory(source__location=self.a3, destination__location=self.a4)
        self.t2 = TripFactory(user=self.customer, flight=self.f1)
        self.s2 = ShippingVisibleLoadServiceFactory(trip=self.t1)

        self.r2 = ShippingRequirementFactory(user=self.traveler)

        ServiceFlow(self.s2).accept()
        RequirementFlow(self.r2).accept()

        self.u1 = self.traveler
        self.u2 = self.customer

        self.r = RequestFactory(
            requirement=self.r1,
            service=self.s1,
            submitted_by=self.customer
        )

        self.re2 = RequestFactory(
            requirement=self.r2,
            service=self.s2,
            submitted_by=self.traveler
        )

        RequestFlow(self.r).accept(self.traveler)
        RequestFlow(self.re2).accept(self.customer)

    def _set_order_status(self, r, status):
        traveler = r.service.trip.user
        customer = r.requirement.user

        if status in (ActionStatus.PAYED, ActionStatus.RECEIVED, ActionStatus.DELIVERED):
            traveler_step = self.r.get_steps(traveler)[0]
            customer_step = self.r.get_steps(customer)[0]

            PaymentStepFlow(customer_step, customer_step.properties).accept(customer)

            if status in (ActionStatus.RECEIVED, ActionStatus.DELIVERED):
                traveler_step = self.r.get_steps(self.traveler).latest('id')
                customer_step = self.r.get_steps(self.customer).latest('id')

                DeliverToAirportFlow(traveler_step, customer_step.properties).accept(self.traveler)

            if status == ActionStatus.DELIVERED:
                traveler_step = self.r.get_steps(self.traveler).latest('id')
                customer_step = self.r.get_steps(self.customer).latest('id')

                ReceiveToCustomerFlow(traveler_step, customer_step.properties).accept(self.traveler)

    def test_get_all_orders(self):
        self.login(self.u1)

        url = self.reverse('orders-list')
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            2
        )

    def test_get_my_services_order(self):
        self.login(self.u1)

        url = self.reverse('orders-list')
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
            response.data['results'][0]['role'],
            'TRAVELER'
        )

    def test_get_my_requirement_order(self):
        self.login(self.u1)

        url = self.reverse('orders-list')
        response = self.get(url, data={'role': 'CUSTOMER'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            1
        )

        self.assertEqual(
            response.data['results'][0]['role'],
            'CUSTOMER'
        )

    def test_get_order_by_service(self):
        self.login(self.u1)

        url = self.reverse('orders-list')
        response = self.get(url, data={'service': self.s1.id})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['count'],
            1
        )

        self.assertEqual(
            response.data['results'][0]['role'],
            'TRAVELER'
        )

    def test_get_order_by_requirement(self):
        self.login(self.u1)

        url = self.reverse('orders-list')
        response = self.get(url, data={'requirement': self.r2.id})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.assertEqual(
            response.data['count'],
            1
        )

        self.assertEqual(
            response.data['results'][0]['role'],
            'CUSTOMER'
        )

    def test_get_delivered_orders_when_non_exists(self):
        self.login(self.u1)

        url = self.reverse('orders-list')
        response = self.get(url, data={'status': 'DELIVERED'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.assertEqual(
            response.data['count'],
            0
        )

    def test_get_delivered_orders(self):
        self._set_order_status(self.r, ActionStatus.DELIVERED)

        self.login(self.u1)

        url = self.reverse('orders-list')
        response = self.get(url, data={'status': 'DELIVERED'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.assertEqual(
            response.data['count'],
            1
        )


class TestRequestIntegrity(TestShippingRequestBase):
    def test_able_to_patch_payment_step(self):
        # We have one service s1 and one requirement r1, first we create the request
        # POST /requests

        self.login(self.traveler)

        url = self.reverse('requests-list')
        response = self.post(
            url,
            data={
                'service': self.s1.id,
                'requirement': self.r1.id,
                'deal': {
                    'cost': 1234,
                    'traveler_fee': 23.4,
                    'customer_fee': 22
                },
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

        request_id = response.data['id']

        # Other side could accept the request
        # http -j PATCH requests/{request_id}  status=ACCEPTED

        self.login(self.customer)

        url = self.reverse('request-detail', kwargs={'pk': request_id})
        response = self.patch(
            url,
            data={
                'status': 'ACCEPTED'
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        # After accept both have this request as their orders with the first step
        # http -j GET orders

        self.login(self.traveler)

        url = self.reverse('orders-list')
        response = self.get(url)

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
            request_id
        )

        traveler_step_id = response.data['results'][0]['steps'][0]['id']

        self.login(self.customer)

        url = self.reverse('orders-list')
        response = self.get(url)

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
            request_id
        )

        customer_step_id = response.data['results'][0]['steps'][0]['id']

        self.assertNotEqual(
            traveler_step_id,
            customer_step_id
        )

        # Now customer can set the first step done
        # http -j PATCH order_steps/{customer_step_id} status=DONE

        url = self.reverse('order_step-detail', kwargs={'pk': customer_step_id})
        response = self.patch(url, data={'status': 'DONE'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

class TestShippingRequestBusinessBase(ViewTestBase):
    def setUp(self):
        super().setUp()

        self.traveler = UserFactory()
        self.customer = UserFactory()

        self.customer.set_business_profile(verified=True)

        self.a1 = AirportFactory()
        self.a2 = AirportFactory()
        self.l1 = self.a1.location
        self.l2 = self.a2.location
        self.f1 = FlightFactory(source__location=self.a1, destination__location=self.a2)
        self.t1 = TripFactory(user=self.traveler, flight=self.f1)
        self.s1 = ShippingVisibleLoadServiceFactory(trip=self.t1)

        self.r1 = ShippingRequirementFactory(user=self.customer)

        ServiceFlow(self.s1).accept()
        RequirementFlow(self.r1).accept()

class TestRequestListBusiness(TestShippingRequestBusinessBase):
    def setUp(self):
        super().setUp()

    def test_do_not_accept_without_login(self):
        url = self.reverse('requests-list')
        response = self.post(
            url,
            data={
                'requirement': self.r1.id,
                'service': self.s1.id,
                'deal': {
                    'cost': 1234,
                    'traveler_fee': 23.4,
                    'customer_fee': 22
                },
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
            response.data
        )

    def test_create(self):
        self.login(self.customer)
        
        url = self.reverse('requests-list')
        response = self.post(
            url,
            data={
                'requirement': self.r1.id,
                'service': self.s1.id,
                'deal': {
                    'cost': 1234,
                    'traveler_fee': 23.4,
                    'customer_fee': 22
                },
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data
        )

        self.assertIn(
            'submitted_by',
            response.data
        )

        self.assertEqual(
            response.data['submitted_by'],
            'CUSTOMER'
        )

        self.assertEqual(
            response.data['role'],
            'CUSTOMER'
        )


class TestShoppingRequestBase(ViewTestBase):
    def setUp(self):
        super().setUp()

        self.traveler = UserFactory()
        self.customer = UserFactory()

        self.a1 = AirportFactory()
        self.a2 = AirportFactory()
        self.l1 = self.a1.location
        self.l2 = self.a2.location
        self.f1 = FlightFactory(source__location=self.a1, destination__location=self.a2)
        self.t1 = TripFactory(user=self.traveler, flight=self.f1)
        self.s1 = ShoppingVisibleLoadServiceFactory(trip=self.t1)

        self.r1 = ShoppingRequirementFactory(user=self.customer)

        ServiceFlow(self.s1).accept()
        RequirementFlow(self.r1).accept()

class TestShoppingOrderStepDetail(TestShoppingRequestBase):
    def setUp(self):
        super().setUp()

        self.r = RequestFactory(
            requirement=self.r1,
            service=self.s1,
            submitted_by=self.customer
        )

        RequestFlow(self.r).accept(self.traveler)


    def test_get_different_steps_for_different_sides(self):
        self.login(self.customer)

        # orders/{id}
        url = self.reverse('order-detail', kwargs={'pk': self.r.id})
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            len(response.data['steps']),
            1
        )

        customer_step = response.data['steps'][0]

        self.login(self.traveler)

        url = self.reverse('order-detail', kwargs={'pk': self.r.id})
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            len(response.data['steps']),
            1
        )

        traveler_step = response.data['steps'][0]

        self.assertEqual(
            customer_step['type'],
            traveler_step['type']
        )

        self.assertNotEqual(
            customer_step['id'],
            traveler_step['id']
        )

    def test_patch_payment_by_customer(self):
        traveler_step = self.r.get_steps(self.traveler)[0]
        customer_step = self.r.get_steps(self.customer)[0]

        self.login(self.customer)

        url = self.reverse('order_step-detail', kwargs={'pk': customer_step.id})
        response = self.patch(url, data={'status': 'DONE'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.assertEqual(
            response.data['status'],
            'DONE'
        )

        self.assertTrue(
            response.data['end_time']
        )

    def test_patching_payment_make_traveler_step_done(self):
        traveler_step = self.r.get_steps(self.traveler)[0]
        customer_step = self.r.get_steps(self.customer)[0]

        self.login(self.customer)

        url = self.reverse('order_step-detail', kwargs={'pk': customer_step.id})
        response = self.patch(url, data={'status': 'DONE'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.login(self.traveler)

        url = self.reverse('order_step-detail', kwargs={'pk': traveler_step.id})
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.assertEqual(
            response.data['status'],
            'DONE'
        )

    def test_could_not_patch_payment_by_traveler(self):
        traveler_step = self.r.get_steps(self.traveler)[0]
        customer_step = self.r.get_steps(self.customer)[0]

        self.login(self.traveler)

        url = self.reverse('order_step-detail', kwargs={'pk': traveler_step.id})
        response = self.patch(url, data={'status': 'DONE'})

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )

    def test_after_pay_customer_can_get_steps(self):
        traveler_step = self.r.get_steps(self.traveler)[0]
        customer_step = self.r.get_steps(self.customer)[0]
        
        PaymentStepFlow(customer_step, customer_step.properties).accept(self.customer)

        self.login(self.customer)
        
        url = self.reverse('order-detail', kwargs={'pk': self.r.id})
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

    def test_patch_purchase_item(self):
        traveler_step = self.r.get_steps(self.traveler)[0]
        customer_step = self.r.get_steps(self.customer)[0]

        PaymentStepFlow(customer_step, customer_step.properties).accept(self.customer)

        traveler_step = self.r.get_steps(self.traveler).latest('id')
        customer_step = self.r.get_steps(self.customer).latest('id')

        self.login(self.traveler)

        f1 = SimpleUploadedFile("foo.jpg", self.generate_photo_file(), content_type="img/jpeg")

        url = self.reverse('order_step-detail', kwargs={'pk': traveler_step.id})
        response = self.patch(url, data=encode_nested_dict({'status': 'DONE', 'properties': {'image': f1}}), format='multipart')

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.assertEqual(
            response.data['status'],
            'WAITING'
        )

        self.assertFalse(
            response.data['end_time']
        )

    def test_after_traveler_patch_customer_pending(self):
        traveler_step = self.r.get_steps(self.traveler)[0]
        customer_step = self.r.get_steps(self.customer)[0]

        PaymentStepFlow(customer_step, customer_step.properties).accept(self.customer)

        traveler_step = self.r.get_steps(self.traveler).latest('id')
        customer_step = self.r.get_steps(self.customer).latest('id')
        f1 = SimpleUploadedFile("foo.jpg", self.generate_photo_file(), content_type="img/jpeg")

        PurchaseItemFlow(
            traveler_step,
            {'image': {'file': f1}}).accept(self.traveler)

        self.login(self.customer)

        url = self.reverse('order_step-detail', kwargs={'pk': customer_step.id})
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['status'],
            'PENDING'
        )

    def test_after_traveler_patch_customer_can_patch(self):
        traveler_step = self.r.get_steps(self.traveler)[0]
        customer_step = self.r.get_steps(self.customer)[0]

        PaymentStepFlow(customer_step, customer_step.properties).accept(self.customer)

        traveler_step = self.r.get_steps(self.traveler).latest('id')
        customer_step = self.r.get_steps(self.customer).latest('id')
        f1 = SimpleUploadedFile("foo.jpg", self.generate_photo_file(), content_type="img/jpeg")

        PurchaseItemFlow(
            traveler_step,
            {'image': {'file': f1}}).accept(self.traveler)

        self.login(self.customer)

        url = self.reverse('order_step-detail', kwargs={'pk': customer_step.id})
        response = self.patch(url, data={'status': 'DONE'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['status'],
            'DONE'
        )

    def test_after_customer_patch_new_step_created(self):
        traveler_step = self.r.get_steps(self.traveler)[0]
        customer_step = self.r.get_steps(self.customer)[0]

        PaymentStepFlow(customer_step, customer_step.properties).accept(self.customer)

        traveler_step = self.r.get_steps(self.traveler).latest('id')
        customer_step = self.r.get_steps(self.customer).latest('id')
        f1 = SimpleUploadedFile("foo.jpg", self.generate_photo_file(), content_type="img/jpeg")

        PurchaseItemFlow(
            traveler_step,
            {'image': {'file': f1}}).accept(self.traveler)

        self.login(self.customer)

        url = self.reverse('order_step-detail', kwargs={'pk': customer_step.id})
        response = self.patch(url, data={'status': 'DONE'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )
        

        url = self.reverse('order-detail', kwargs={'pk': self.r.id})
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            len(response.data['steps']),
            3
        )

