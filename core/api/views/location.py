#!/usr/bin/env python3

from api.serializers.location import \
    (LocationSerializer, CitySerializer, CountrySerializer,
     UserLocationSerializer, LocationQuerySerializer)
from .base import PeybarListCreateAPIView, PeybarListAPIView, PeybarRetrieveUpdateDestroyAPIView
from .permission import IsOwner
from api.models import Location, City, Country
from .base import PeybarBaseFilter, PeybarPatchListCreateAPIView

from django.db.models import F, Q
from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response
import django_filters
from rest_framework.utils.urls import remove_query_param, replace_query_param
from drf_spectacular.utils import extend_schema


class LocationList(PeybarListCreateAPIView):
    serializer_class = LocationSerializer
    queryset = Location.objects.all()

    @extend_schema(
        parameters=[LocationQuerySerializer]
    )
    def get(self, request, version, *args, **kwargs):
        if 'tag' in request.query_params.dict():
            tag = request.query_params['tag']

            locations = Location.objects.filter(readable_tag=tag, user__isnull=True)

            return Response(
                status=status.HTTP_200_OK,
                data={
                    'next': None,
                    'previous': None,
                    'results': LocationSerializer(instance=locations, many=True).data
                }
            )

        ser = LocationQuerySerializer(data=request.query_params.dict())

        ser.is_valid(raise_exception=True)

        data = ser.validated_data

        cur_offset = data['offset']

        results, new_offset = Location.objects.expr_filter(
            query=data['query'],
            offset=data['offset'],
            limit=data['limit'],
            type=data['type'],
            city=data['city'],
            country=data['country'],
            object_name=data['object_name']
        )

        if cur_offset.negative:
            next_offset = cur_offset.copy()
            next_offset.negative = False

            pre_offset = new_offset
        else:
            next_offset = new_offset
            pre_offset = cur_offset.copy()
            pre_offset.negative = True

        url = request.build_absolute_uri()
        url = replace_query_param(url, 'limit', data['limit'])

        if next_offset:
            next_url = replace_query_param(url, 'offset', next_offset.get_key())
        else:
            next_url = None

        if pre_offset:
            pre_url = replace_query_param(url, 'offset', pre_offset.get_key())
        else:
            pre_url = None


        return Response(
            status=status.HTTP_200_OK,
            data={
                'next': next_url,
                'previous': pre_url,
                'results': self.get_serializer(instance=results, many=True).data
            }
        )

        
class UserLocationList(PeybarPatchListCreateAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsOwner]

    serializer_class = UserLocationSerializer

    def get_queryset(self):
        return Location.objects.filter(
            user=self.request.user
        )

class UserLocationDetail(PeybarRetrieveUpdateDestroyAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsOwner]

    serializer_class = UserLocationSerializer

    def get_queryset(self):
        return Location.objects.filter(
            user=self.request.user
        )

class CityFilter(PeybarBaseFilter):
    country = django_filters.ModelChoiceFilter(
        queryset=Country.objects.all(),
        to_field_name='iso_3'
    )

    query = django_filters.CharFilter(method='get_by_query')

    def get_by_query(self, queryset, name, value):
        return queryset.filter(
               Q(name__icontains=value) |
               Q(iso__icontains=value) |
               Q(name_ascii__icontains=value) |
               Q(country__name__icontains=value) |
               Q(country__iso_2__icontains=value) |
               Q(country__iso_3__icontains=value) |
               Q(country__long_name__icontains=value))

    class Meta:
        model = City
        fields = ('country',)

class CityList(PeybarListAPIView):
    serializer_class = CitySerializer
    filterset_class = CityFilter

    def get_queryset(self):
        return City.objects.all()

class CountryList(PeybarListAPIView):
    serializer_class = CountrySerializer

    def get_queryset(self):
        return Country.objects.all()
