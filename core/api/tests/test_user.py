#!/usr/bin/env python3

from api.models import User
from api.models.request import *
from api.models.service import ServiceFlow
from api.models.requirement import RequirementFlow
from api.tests.fixtures import *
from api.views.errors import APIErrorCode
from .test_base import ViewTestBase

from rest_framework import status
import responses
from django.core.files.base import ContentFile
from django.core.files.storage import InMemoryStorage
from django.test import override_settings
from django.core.files.uploadedfile import SimpleUploadedFile
from freezegun import freeze_time
from django.conf import settings

from unittest.mock import patch
from urllib.parse import urlparse, unquote_plus, parse_qs
import json
import quopri
from datetime import timedelta


INITIAL_TIME = "2012-01-11 12:00:00+00:00"

class TestUserList(ViewTestBase):
    def test_create(self):
        url = self.reverse('users-list')
        response = self.post(
            url,
            data={
                'email': 'foo@example.com',
                'password': 'foo123',
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data
        )

        data = response.data

        self.assertIn(
            'id',
            data
        )

        self.assertIn(
            'register_time',
            data
        )

        self.assertNotIn(
            'password',
            data
        )

        self.assertIn(
            'token',
            data
        )

        self.assertTrue(
            self.email_send.called
        )

    def test_verify_email(self):
        u = UserFactory()
        url = self.reverse('users-list')
        response = self.post(
            url,
            data={
                'email': 'foo@example.com',
                'password': 'foo123',
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

        u = User.objects.get(id=response.data['id'])

        u._password = 'foo123'

        from bs4 import BeautifulSoup as Soup
        data = str(self.email_send.call_args[0][0].message())

        data = quopri.decodestring(data)
        soup = Soup(data, features='html.parser')

        t = soup.select('a.button')[0]
        h = t['href']
        ur = urlparse(h)

        qs = parse_qs(ur.query)

        token = qs['token'][0]
        uid = qs['user'][0]

        self.login(u)

        url = self.reverse('user_document_detail', kwargs={'token': token, 'uidb64': uid})
        response = self.post(
            url
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data
        )

    def test_resend_verify_without_login_possible(self):
        with freeze_time(INITIAL_TIME) as tf:
            u = UserFactory(_verified=False)

            self.email_send.reset_mock()

            url = self.reverse('account-requests')
            response = self.post(
                url,
                data={
                    'type': 'VERIFY_EMAIL',
                    'data': {
                        'email': u.email
                    }
                }
            )

            self.assertEqual(
                response.status_code,
                status.HTTP_201_CREATED
            )

    def test_resend_verify_not_able_when_verify_has_not_sent(self):
        with freeze_time(INITIAL_TIME) as tf:
            u = UserFactory(_verified=False)

            self.email_send.reset_mock()

            self.login(u)

            url = self.reverse('account-requests')
            response = self.post(
                url,
                data={
                    'type': 'VERIFY_EMAIL',
                    'data': {
                        'email': u.email
                    }
                }
            )

            self.assertEqual(
                response.status_code,
                status.HTTP_201_CREATED
            )

    def test_resend_verify_not_able_when_time_has_not_passed(self):
        with freeze_time(INITIAL_TIME) as tf:
            u = UserFactory(_verified=False)

            self.email_send.reset_mock()

            self.login(u)

            url = self.reverse('account-requests')
            response = self.post(
                url,
                data={
                    'type': 'VERIFY_EMAIL',
                    'data': {
                        'email': u.email
                    }
                }
            )

            self.assertEqual(
                response.status_code,
                status.HTTP_201_CREATED
            )

            url = self.reverse('account-requests')
            response = self.post(
                url,
                data={
                    'type': 'VERIFY_EMAIL',
                    'data': {
                    }
                }
            )

            self.assertEqual(
                response.status_code,
                status.HTTP_400_BAD_REQUEST
            )

    def test_resend_verify_able_to_send_after_time(self):
        with freeze_time(INITIAL_TIME) as tf:
            u = UserFactory(_verified=False)

            self.email_send.reset_mock()

            self.login(u)

            url = self.reverse('account-requests')
            response = self.post(
                url,
                data={
                    'type': 'VERIFY_EMAIL',
                    'data': {
                        'email': u.email
                    }
                }
            )

            self.assertEqual(
                response.status_code,
                status.HTTP_201_CREATED
            )

            tf.tick(timedelta(seconds=settings.API_SETTINGS['VERIFY_EMAIL_RESEND_TIMEOUT']))

            url = self.reverse('account-requests')
            response = self.post(
                url,
                data={
                    'type': 'VERIFY_EMAIL',
                    'data': {
                        'email': u.email
                    }
                }
            )

            self.assertEqual(
                response.status_code,
                status.HTTP_201_CREATED
            )

    def test_check_correct_token(self):
        url = self.reverse('users-list')
        response = self.post(
            url,
            data={
                'email': 'foo@example.com',
                'password': 'foo123',
            }
        )

        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + response.data['token']['access'])

        url = self.reverse('trips-list')
        response = self.get(
            url,
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

    def test_login(self):
        u1 = UserFactory()

        url = self.reverse('login')
        response = self.post(
            url,
            data={
                'email': u1.email,
                'password': u1._password
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.assertIn(
            'refresh',
            response.data
        )

        self.assertIn(
            'access',
            response.data
        )

    def test_invalid_login_return_correct_error(self):
        u1 = UserFactory()

        url = self.reverse('login')
        response = self.post(
            url,
            data={
                'email': u1.email,
                'password': u1._password + 'foo'
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

        data = response.data

        detail = self.assertErrorSchema(
            data
        )

        self.assertEqual(
            detail['code'],
            APIErrorCode.LOGIN_INVALID_AUTH.value
        )

    def test_delete_user(self):
        u = UserFactory()

        self.login(u)

        url = self.reverse('user-detail')
        response = self.delete(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT
        )

    def test_reset_password(self):
        u = UserFactory()
        self.email_send.reset_mock()

        url = self.reverse('account-requests')
        response = self.post(
            url,
            data={
                'type': 'RESET_PASSWORD',
                'data': {
                    'email': u.email,
                    'redirect': 'https://foo.com/bar'
                }
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data
        )

        self.assertEqual(
            self.email_send.call_count,
            1
        )

        from bs4 import BeautifulSoup as Soup
        data = str(self.email_send.call_args[0][0].message())

        data = quopri.decodestring(data)
        soup = Soup(data, features='html.parser')

        t = soup.select('a#link')[0]
        h = t['href']
        ur = urlparse(h)

        qs = parse_qs(ur.query)

        token = qs['token'][0]
        uid = qs['user'][0]

        url = self.reverse('account-request', kwargs={'token': token, 'uidb64': uid})
        response = self.post(
            url,
            data={
                'password': 'foo123',
                'confirm_password': 'foo123'
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data
        )

        url = self.reverse('login')
        response = self.post(
            url,
            data={
                'email': u.email,
                'password': 'foo123'
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

class TestGoogleUserList(ViewTestBase):
    def setUp(self):
        super().setUp()

        self.google_login_patcher = patch('api.views.login.GoogleLoginRedirectApi.get', autospec=True)

        from api.views.login import GoogleLoginRedirectApi

        self.google_login_orig = GoogleLoginRedirectApi.get

        self.google_login = self.google_login_patcher.start()

        def _redirect_to_google(obj, *args, **kwargs):
            response = self.google_login_orig(obj, *args, **kwargs)

            self._last_redirect_url = urlparse(unquote_plus(response.url))

            params = [param.split('=') for param in self._last_redirect_url.query.split('&')]

            self._last_redirect_params = {
                param[0]: param[1] for param in params
            }

            return response

        self._google_users = {}

        def _post_method(request):
            data = unquote_plus(request.body)

            params = [param.split('=') for param in data.split('&')]

            params = {
                param[0]: param[1] for param in params
            }

            code = params['code']
            import jwt

            return (
                201,
                {},
                json.dumps(
                    {
                        'id_token': jwt.encode({'email': self._google_users[code]['email']}, key='hi'),
                        'access_token': self._google_users[code]['access_token']
                    }
                )
            )

        responses.add_callback(
            responses.POST,
            "https://oauth2.googleapis.com/token",
            callback=_post_method,
            content_type="application/json"
        )

        def _get_method(request):
            data = request.params

            user = next(user for user in self._google_users.values() if user['access_token']==data['access_token'])

            return (
                200,
                {},
                json.dumps(
                    {
                        'given_name': user['first_name'],
                        'family_name': user['last_name'],
                        'email': user['email']
                    }
                )
            )

        responses.add_callback(
            responses.GET,
            "https://www.googleapis.com/oauth2/v3/userinfo",
            callback=_get_method
        )

        self.google_login.side_effect = _redirect_to_google

        # self.requests_get_patcher = patch('requests.get', autospec=True)
        # self.requests_get = self.requests_get_patcher.start()

        # self.requests_post_patcher = patch('requests.post', autospec=True)
        # self.requests_post = self.requests_post_patcher.start()

        # def _get_method(*args, **kwargs):
        #     import pdb; pdb.set_trace()

        #     print('here')

        # self.requests_get.side_effect = _get_method

        # def _post_method(*args, **kwargs):
        #     url = args[0]
        #     data = kwargs['data']

        #     return Response(
        #         status=status.HTTP_200_OK,
        #         data={
        #             'id_token': self._google_users[data['code']]['id_token'],
        #             'access_token': self._google_users[data['code']]['access_token']
        #         }
        #     )

        # self.requests_post.side_effect = _post_method

    def tearDown(self):
        super().tearDown()

        self.google_login_patcher.stop()

    @responses.activate
    def test_create_using_google(self):
        self._google_users['foo'] = {
            'email': 'foo@foo.com',
            'access_token': 'foo_access',
            'first_name': 'foo',
            'last_name': 'bar',
        }

        url = self.reverse('google-login')
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_302_FOUND
        )

        url = self.reverse('google-redirect')
        response = self.post(url, data={
            'state': self._last_redirect_params['state'],
            'error': '',
            'code': 'foo'
        })

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data
        )

    @responses.activate
    def test_login_after_create(self):
        self._google_users['foo'] = {
            'email': 'foo@foo.com',
            'access_token': 'foo_access',
            'first_name': 'foo',
            'last_name': 'bar',
        }

        url = self.reverse('google-login')
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_302_FOUND
        )

        url = self.reverse('google-redirect')
        response = self.post(url, data={
            'state': self._last_redirect_params['state'],
            'error': '',
            'code': 'foo'
        })

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

        url = self.reverse('google-login')
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_302_FOUND
        )

        url = self.reverse('google-redirect')
        response = self.post(url, data={
            'state': self._last_redirect_params['state'],
            'error': '',
            'code': 'foo'
        })

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

class TestProfile(ViewTestBase):
    def setUp(self):
        super().setUp()

        self.l1 = LanguageFactory()

        self.u1 = UserFactory()
        self.co1 = CountryFactory()
        self.ci1 = CityFactory()

    def test_could_not_call_without_login(self):
        url = self.reverse('profile')
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )

    def test_return_correct_user_profile(self):
        self.login(self.u1)

        url = self.reverse('profile')
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data['email'],
            self.u1.email
        )

    def test_add_image_to_profile(self):
        self.login(self.u1)

        f1 = SimpleUploadedFile("foo.jpg", self.generate_photo_file(), content_type="img/jpeg")

        f2 = SimpleUploadedFile("bar.jpg", self.generate_photo_file(), content_type="img/jpeg")

        url = self.reverse('profile')
        response = self.patch(
            url,
            data={
                'image': f1,
                'background': f2
            },
            format='multipart'
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.assertIn(
            'image',
            response.data
        )

    def test_add_new_address(self):
        self.login(self.u1)

        url = self.reverse('user_locations-list')
        response = self.patch(
            url,
            {
                'add': [
                    {
                        'country': self.co1.name,
                        'city': self.ci1.name,
                        'district': 'Tehran',
                        'area': '23'
                    }
                ]
            })

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        data = response.data

        self.assertIn(
            'added',
            data
        )

    def test_add_new_address_return_from_profile(self):
        self.login(self.u1)

        url = self.reverse('user_locations-list')
        response = self.patch(
            url,
            data={
                'add': [
                    {'country': self.co1.name,
                     'city': self.ci1.name,
                     'district': 'Tehran',
                     'area': '23'}]
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        address_id = response.data['added'][0]['id']

        url = self.reverse('profile')
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertIn(
            'addresses',
            data
        )

        self.assertEqual(
            len(data['addresses']),
            1
        )

        self.assertEqual(
            data['addresses'][0]['id'],
            address_id
        )

    def test_modify_address(self):
        address = AddressFactory(user=self.u1)
        ci2 = CityFactory()

        self.login(self.u1)

        url = self.reverse('user_locations-list')
        response = self.patch(
            url,
            data={
                'update': [
                    {'id': address.id, 'city': ci2.name}
                ]
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        data = response.data

        self.assertIn(
            'updated',
            data
        )

        self.assertEqual(
            data['updated'][0]['city'],
            ci2.name
        )

    def test_able_to_delete_address(self):
        c = CityFactory()

        address = AddressFactory(user=self.u1, city=c)

        self.login(self.u1)

        url = self.reverse('user_locations-list')
        response = self.patch(url, data={
            'delete':
            [
                {
                    'id': address.id
                }
            ]
        })

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        data = response.data

        self.assertEqual(
            len(data['deleted']),
            1
        )

    def test_set_location_as_current_return_in_profile(self):
        self.login(self.u1)

        url = self.reverse('user_locations-list')
        response = self.patch(
            url,
            data={
                'add': [
                    {
                        'country': self.co1.name,
                        'city': self.ci1.name,
                        'address': 'foo',
                        'current': True,
                    }
                ]
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        id = response.data['added'][0]['id']

        url = self.reverse('profile')
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertEqual(
            data['current_location'],
            id
        )

    def test_change_previous_current_location_return_in_profile(self):
        self.login(self.u1)

        address1 = AddressFactory(user=self.u1)

        self.u1.profile.set_cur_location(address1)

        address2 = AddressFactory(user=self.u1)

        url = self.reverse('user_locations-list')
        response = self.patch(
            url,
            data={
                'update':[
                    {
                        'id': address2.id,
                        'current': True
                    }
                ]
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        url = self.reverse('profile')
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertEqual(
            data['current_location'],
            address2.id
        )

    def test_last_set_address_return_as_current_address(self):
        address = AddressFactory(user=self.u1)

        self.login(self.u1)

        url = self.reverse('profile')
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertTrue(
            data['current_location']
        )

        self.assertEqual(
            data['current_location'],
            address.id
        )

    def test_setting_another_last_addres_as_current_location(self):
        address1 = AddressFactory(user=self.u1)

        address2 = AddressFactory(user=self.u1)

        self.login(self.u1)

        url = self.reverse('profile')
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertTrue(
            data['current_location']
        )

        self.assertEqual(
            data['current_location'],
            address2.id
        )

    def test_when_current_location_set_last_address_has_not_effect(self):
        address1 = AddressFactory(user=self.u1)

        self.login(self.u1)

        self.u1.profile.set_cur_location(address1)

        address2 = AddressFactory(user=self.u1)

        url = self.reverse('profile')
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertTrue(
            data['current_location']
        )

        self.assertEqual(
            data['current_location'],
            address1.id
        )

    def test_set_preferred_languages(self):
        self.login(self.u1)

        url = self.reverse('profile')
        response = self.patch(url, data={'speak_languages': [self.l1.iso]})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertEqual(
            len(data['speak_languages']),
            1
        )

    def test_remove_preferred_languages(self):
        self.login(self.u1)

        self.u1.profile.speak_languages.add(self.l1)

        url = self.reverse('profile')
        response = self.patch(url, data={'speak_languages': []})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertEqual(
            len(data['speak_languages']),
            0
        )

    def test_change_preferred_language(self):
        self.login(self.u1)

        l2 = LanguageFactory()

        self.u1.profile.speak_languages.add(self.l1)

        url = self.reverse('profile')
        response = self.patch(url, data={'speak_languages': [l2.iso]})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertEqual(
            len(data['speak_languages']),
            1
        )

        self.assertEqual(
            data['speak_languages'][0],
            l2.iso
        )

    def test_append_preferred_language(self):
        self.login(self.u1)

        l2 = LanguageFactory()

        self.u1.profile.speak_languages.add(self.l1)

        url = self.reverse('profile')
        response = self.patch(url, data={'speak_languages': [self.l1.iso, l2.iso]})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertEqual(
            len(data['speak_languages']),
            2
        )

    def test_change_to_business_profile(self):
        self.login(self.u1)

        url = self.reverse('profile')
        response = self.patch(url, data={'type': 'BUSINESS'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        data = response.data

        self.assertEqual(
            data['status'],
            'PENDING'
        )

        self.assertEqual(
            data['type'],
            'BUSINESS'
        )

    def test_change_to_business_profile_change_field_name(self):
        self.u1.set_business_profile()

        self.login(self.u1)

        url = self.reverse('profile')
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertIn(
            'business_name',
            data
        )

        self.assertNotIn(
            'last_name',
            data
        )

    def test_able_to_change_business_name(self):
        self.u1.set_business_profile()

        self.login(self.u1)

        url = self.reverse('profile')
        response = self.patch(url, data={'business_name': 'foo1'})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertEqual(
            data['business_name'],
            'foo1'
        )

        self.assertEqual(
            data['type'],
            'BUSINESS'
        )

class TestUserContactInfo(ViewTestBase):
    def setUp(self):
        super().setUp()

        self.u1 = UserFactory()
        self.co1 = CountryFactory()

    def test_add_phone_number(self):
        self.login(self.u1)

        url = self.reverse('contacts-list')
        response = self.patch(
            url,
            data={
                'add': [
                    {
                        'type': 'PHONE_NUMBER',
                        'data': {
                            'zone_code': {
                                'country': self.co1.iso_3
                            },
                            'phone': '31340239',
                        }
                    }
                ]
            })

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        data = response.data

        self.assertIn(
            'added',
            data
        )

        self.assertEqual(
            len(data['added']),
            1
        )

    def test_change_phone_number(self):
        phone = PhoneNumberFactory(
            user=self.u1,
            phone='124323'
        )

        self.login(self.u1)

        url = self.reverse('contacts-list')
        response = self.patch(
            url,
            data={
                'update': [
                    {
                        'id': phone.id,
                        'data': {
                            'phone': '12345'
                        }
                    }
                ]
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        data = response.data

        self.assertIn(
            'updated',
            data
        )

        self.assertEqual(
            data['updated'][0]['data']['phone'],
            '12345'
        )

    def test_add_social_link(self):
        self.login(self.u1)

        url = self.reverse('contacts-list')
        response = self.patch(
            url,
            data={
                'add': [
                    {
                        'type': 'SOCIAL',
                        'data': {
                            'type': 'telegram',
                            'link': '4132451'
                        }
                    }
                ]
            })

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        data = response.data

        self.assertIn(
            'added',
            data
        )

        self.assertEqual(
            len(data['added']),
            1
        )

    def test_change_social_links(self):
        link = SocialLinkFactory(
            user=self.u1,
        )

        self.login(self.u1)

        url = self.reverse('contacts-list')
        response = self.patch(
            url,
            data={
                'update': [
                    {
                        'id': link.id,
                        'data': {
                            'link': 'foo'
                        }
                    }
                ]
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertIn(
            'updated',
            data
        )

        self.assertEqual(
            data['updated'][0]['data']['link'],
            'foo'
        )

    def test_add_multiple_contacts(self):
        self.login(self.u1)

        url = self.reverse('contacts-list')
        response = self.patch(
            url,
            data={
                'add': [
                    {
                        'type': 'PHONE_NUMBER',
                        'data': {
                            'zone_code': {
                                'country': self.co1.iso_3,
                            },
                            'phone': '31340239',
                        }
                    },
                    {
                        'type': 'SOCIAL',
                        'data': {
                            'type': 'telegram',
                            'link': '4132451'
                        }
                    }
                ]
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        data = response.data

        self.assertEqual(
            len(data['added']),
            2
        )

    def test_list_contacts_info(self):
        phone = PhoneNumberFactory(
            user=self.u1
        )

        link = SocialLinkFactory(
            user=self.u1
        )

        self.login(self.u1)

        url = self.reverse('contacts-list')
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertEqual(
            data['count'],
            2
        )

        self.assertIn(
            'id',
            data['results'][0]
        )

    def test_remove_a_contact(self):
        phone = PhoneNumberFactory(
            user=self.u1
        )

        link = SocialLinkFactory(
            user=self.u1
        )

        self.login(self.u1)

        url = self.reverse('contacts-list')
        response = self.patch(
            url,
            data={
                'delete': [
                    {
                        'id': phone.id
                    }
                ]
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertIn(
            'deleted',
            data
        )


        url = self.reverse('contacts-list')
        response = self.get(
            url,
        )

        self.assertEqual(
            response.data['count'],
            1
        )

    def test_phone_number_return_in_profile(self):
        phone = PhoneNumberFactory(
            user=self.u1,
            phone='124323'
        )

        self.login(self.u1)

        url = self.reverse('profile')
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertEqual(
            data['phone_number']['phone'],
            '124323'
        )

    def test_phone_number_with_associated_social(self):
        phone = PhoneNumberFactory(
            user=self.u1,
            phone='124323'
        )

        SocialLinkFactory(
            user=self.u1,
            type=SocialType.TELEGRAM,
            link='124323'
        )

        self.login(self.u1)

        url = self.reverse('profile')
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

class TestUserValuation(ViewTestBase):
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

        self.r = RequestFactory(
            requirement=self.r1,
            service=self.s1,
            submitted_by=self.customer
        )

        RequestFlow(self.r).accept(self.traveler)

        traveler_step = self.r.get_steps(self.traveler)[0]
        customer_step = self.r.get_steps(self.customer)[0]

        PaymentStepFlow(customer_step, customer_step.properties).accept(self.customer)

        traveler_step = self.r.get_steps(self.traveler).latest('id')
        customer_step = self.r.get_steps(self.customer).latest('id')

        DeliverToAirportFlow(traveler_step, customer_step.properties).accept(self.traveler)

        traveler_step = self.r.get_steps(self.traveler).latest('id')
        customer_step = self.r.get_steps(self.customer).latest('id')

        ReceiveToCustomerFlow(traveler_step, customer_step.properties).accept(self.traveler)

        self.traveler_done = self.r.get_steps(self.traveler).latest('id')
        self.customer_done = self.r.get_steps(self.customer).latest('id')

    def test_send_rate_and_comment_in_done(self):
        self.login(self.traveler)

        url = self.reverse('order_step-detail', kwargs={'pk': self.traveler_done.id})
        response = self.patch(url, data={'status': 'DONE', 'properties': {'rate': 4, 'comment': 'foo'}})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

    def test_rate_avg_return_in_profile(self):
        self.login(self.traveler)

        url = self.reverse('order_step-detail', kwargs={'pk': self.traveler_done.id})
        response = self.patch(url, data={'status': 'DONE', 'properties': {'rate': 4, 'comment': 'foo'}})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        url = self.reverse('profile')
        response = self.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        data = response.data

        self.assertIn(
            'stats',
            data
        )

        stats = data['stats']

        self.assertEqual(
            stats['total_successful_orders'],
            1
        )

        self.assertEqual(
            stats['avg_rate'],
            4
        )
