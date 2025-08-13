from .test_base import ViewTestBase
from .fixtures import UserFactory

from rest_framework import status


class TestTicket(ViewTestBase):
    def test_post_request_without_login(self):
        url = self.reverse('tickets-list')
        response = self.post(
            url,
            data={
                'name': 'foo',
                'email': 'foo@foo.com',
                'phone_number': '+9812194242',
                'message': 'It is correct',
                'topic': 'BUSINESS',
                'subscribe': True,
                'consent': True
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data
        )

        self.assertTrue(
            self.email_send.called
        )

        self.assertTrue(
            self.email_connection.called
        )

    def test_post_request_with_login(self):
        u = UserFactory()

        self.login(u)

        url = self.reverse('tickets-list')
        response = self.post(
            url,
            data={
                'name': 'foo',
                'email': 'foo@foo.com',
                'phone_number': '+9812194242',
                'message': 'It is correct',
                'topic': 'BUSINESS',
                'subscribe': False,
                'consent': True
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

        self.assertTrue(
            self.email_send.called
        )

        self.assertTrue(
            self.email_connection.called
        )

    def test_post_request_without_consent(self):
        url = self.reverse('tickets-list')
        response = self.post(
            url,
            data={
                'name': 'foo',
                'email': 'foo@foo.com',
                'phone_number': '+9812194242',
                'message': 'It is correct',
                'topic': 'BUSINESS',
                'subscribe': True,
                'consent': False
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

    def test_post_request_when_consent_missed(self):
        url = self.reverse('tickets-list')
        response = self.post(
            url,
            data={
                'name': 'foo',
                'email': 'foo@foo.com',
                'phone_number': '+9812194242',
                'message': 'It is correct',
                'topic': 'BUSINESS',
                'subscribe': True,
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

class TestSubscribe(ViewTestBase):
    def test_post_subscribe_without_login(self):
        url = self.reverse('subscribes-list')
        response = self.post(
            url,
            data={
                'email': 'foo@foo.com',
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data
        )

    def test_post_subscrive_with_login(self):
        u = UserFactory()

        self.login(u)

        url = self.reverse('subscribes-list')
        response = self.post(
            url,
            data={
                'email': 'foo@foo.com',
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data
        )
