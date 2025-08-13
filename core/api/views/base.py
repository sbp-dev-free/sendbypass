from api.models.temp_object import TempObject

from rest_framework import generics
from rest_framework.renderers import JSONRenderer
from django_filters import rest_framework as filters
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.exceptions import APIException
from rest_framework import serializers, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import models
from viewflow.fsm import TransitionNotAllowed
from django.http.request import QueryDict
from django.db import transaction as db_transaction

import logging
import json


logger = logging.getLogger('')

request_logger = logging.getLogger('request')

NULL_QUERY_VALUE = 'null'

class APITransitionNotAllowed(APIException):
    status_code = 400
    default_detail = 'Transition not allowed'
    default_code = 'not_allowed_transition'

class SBPBaseViewException(APIException):
    status_code = 400

    def __init__(self, type, detail=None, code=None):
        self._type = self._get_api_code(type)

        data = {'code': self._type.value,
                'type': self._type.name.lower(),
                'message': detail if detail else str(self.default_detail)}

        detail = json.dumps(data)

        super().__init__(detail=detail)

def print_request(request):
    return '{} {}?{} {}'.format(
        request.method,
        request.META['PATH_INFO'],
        request.META['QUERY_STRING'],
        request.data if hasattr(request, 'data') else request.body,)

class PeybarBaseView(generics.GenericAPIView):
    renderer_classes = [JSONRenderer]

    def handle_exception(self, exc):
         if type(exc) is TransitionNotAllowed:
             return super().handle_exception(APITransitionNotAllowed())

         return super().handle_exception(exc)

    def dispatch(self, request, version, *args, **kwargs):
        try:
            processed_query_dict = QueryDict(mutable=True)

            for key in request.GET:
                cleaned_key = key.rstrip('[]')
                values = request.GET.getlist(key)  # Get all values for this key
                for value in values:
                    processed_query_dict.appendlist(cleaned_key, value)

            request.GET = processed_query_dict

            res = super().dispatch(request, version, *args, **kwargs)

            if hasattr(res, 'data'):
                if res.data:
                    body_size = len(res.data)
                else:
                    body_size = 0

                request_logger.info('Request {} get res {}: {}'.format(
                    print_request(self.request),
                    res.status_code,
                    res.data if body_size < 100 else body_size
                ))

            return res
        except Exception as e:
            logger.critical('Request {} has error: {}'.format(
                print_request(self.request),
                str(e)),
                            exc_info=True)

            raise e

def peybar_base_view_func(fcn):
    pass

class PeybarCreateAPIView(
        PeybarBaseView,
        generics.CreateAPIView):

    def post(self, request, version, *args, **kwargs):
        try:
            return super().post(request, version, *args, **kwargs)
        except APIException as e:
            logger.error('Request {} has error: {}'.format(
                print_request(self.request),
                e.detail))

            raise e


class PeybarListAPIView(
        PeybarBaseView,
        generics.ListAPIView
):
    pass

class PeybarPatchAPIView(
        PeybarBaseView,
        generics.UpdateAPIView
):
    def _create_item_ser(self, item_data):
        ser = self.get_serializer(data=item_data)

        ser.is_valid(raise_exception=True)

        return ser

    def _update_item_ser(self, item_data):
        item = self._get_object(item_data['id'])

        ser = self.get_serializer(instance=item, data=item_data, partial=True)

        ser.is_valid(raise_exception=True)

        return ser

    def _get_object(self, item_id):
        return get_object_or_404(self.get_queryset(), pk=item_id)

    def patch(self, request, version, *args, **kwargs):
        data = request.data
        added_ser = []
        update_ser = []
        delete_item = []

        for item in data.get('add', []):
            added_ser.append(self._create_item_ser(item))

        for item in data.get('update', []):
            update_ser.append(self._update_item_ser(item))

        for item in data.get('delete', []):
            delete_item.append(item['id'])

        with db_transaction.atomic():
            added = []
            updated = []
            deleted = []

            for ser in added_ser:
                added.append(ser.create(ser.validated_data))

            for ser in update_ser:
                updated.append(ser.update(ser.instance, ser.validated_data))

            for item_id in delete_item:
                obj = self._get_object(item_id)

                obj.delete()

                deleted.append(item_id)

            return Response(
                status=status.HTTP_200_OK,
                data={
                    'added': self.get_serializer(instance=added, many=True).data,
                    'updated': self.get_serializer(instance=updated, many=True).data,
                    'deleted': [
                        {
                            'id': item_id
                        } for item_id in deleted
                    ]
                }
            )

class PeybarListCreateAPIView(
        PeybarCreateAPIView,
        PeybarListAPIView,
        generics.ListCreateAPIView):
    pass

class PeybarPatchListCreateAPIView(
        PeybarCreateAPIView,
        PeybarListAPIView,
        PeybarPatchAPIView,
        generics.ListCreateAPIView
):
    pass


class PeybarRetrieveAPIView(
        PeybarBaseView,
        generics.RetrieveAPIView):
    pass

class PeybarUpdateAPIView(
        PeybarBaseView,
        generics.UpdateAPIView):
    pass

class PeybarDestroyAPIView(
        PeybarBaseView,
        generics.DestroyAPIView):
    pass

class PeybarRetrieveUpdateAPIView(
        PeybarRetrieveAPIView,
        PeybarUpdateAPIView):
    pass

class PeybarRetrieveUpdateDestroyAPIView(
        PeybarRetrieveAPIView,
        PeybarUpdateAPIView,
        PeybarDestroyAPIView):
    pass


class CustomEnumChoiceFilter(filters.TypedChoiceFilter):
    def __init__(self, enum_class, **kwargs):
        super().__init__(choices=[(choice[1], choice[1]) for choice in enum_class.choices],
                         coerce=lambda o: enum_class[o],
                         **kwargs)

class MultipleCustomEnumChoiceFilter(filters.TypedMultipleChoiceFilter):
    def __init__(self, enum_class, **kwargs):
        super().__init__(choices=[(choice[1], choice[1]) for choice in enum_class.choices],
                         coerce=lambda o: enum_class[o],
                         **kwargs)


class PeybarBaseFilter(
        filters.FilterSet):
    def filter_queryset(self, queryset):
        # TODO: not a correct place for setting similar parent may not be called
        if 'similar' in self.request.query_params:
            similar = serializers.BooleanField().to_internal_value(self.request.query_params['similar'])

            self.similar = similar
        else:
            self.similar = False

        return super().filter_queryset(queryset)

class PeybarTempObjectListCreate(PeybarListCreateAPIView):
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        return TempObject.objects.filter(object_type=self.object_type.__name__).order_by('id')

class PeybarTempObjectRetrieveUpdateDestroyAPIView(PeybarRetrieveUpdateDestroyAPIView):
    def get_queryset(self):
        return TempObject.objects.filter(object_type=self.object_type.__name__).order_by('id')

    def get_object(self):
        obj = get_object_or_404(self.get_queryset(), object_id=self.kwargs['pk'])

        obj = self.object_type(**obj.data)

        obj.full_clean()

        self.check_object_permissions(self.request, obj)

        return obj

class PeybarTempObjectFilterSet(PeybarBaseFilter):
    def filter_queryset(self, queryset):
        items = {}

        for name, value in self.form.cleaned_data.items():
            if not value:
                continue

            filter = self.filters[name]

            if filter.method:
                ret = getattr(self, filter.method)(queryset, name, value)

                if isinstance(ret, models.QuerySet):
                    queryset = ret
                else:
                    items.update(
                        ret
                    )
            else:
                field_name = filter.field_name

                items[field_name] = value

        return TempObject.objects.get_filtered_queryset(self.PeybarMeta.model, queryset, items)

class AuthenticatedObjectMixin:
    def get_queryset(self):
        queryset = super().get_queryset()

        queryset = queryset.filter(user_id=self.request.user.id)

        return queryset

class TempObjectAuthenticatedObjectMixin:
    def get_queryset(self):
        queryset = super().get_queryset()

        queryset = queryset.filter(data__user_id=self.request.user.id)

        return queryset
