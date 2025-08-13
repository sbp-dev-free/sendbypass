#!/usr/bin/env python3

from .base import PeybarBaseModel, SBPForeignKey, PeybarEnumField, PeybarBaseModelManager
from .user import User
from .temp_object import PeybarTempObjectModel, TempObject
from .types import *

from django.db import models
from django.db.models import Q, Exists, OuterRef
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey


class LocationExprFilterOffset:
    Q0 = 'q0'
    Q1 = 'q1'
    Q2 = 'q2'

    P0 = 'L0'
    P1 = 'L1'
    P2 = 'L2'

    def __init__(
            self,
            index=None,
            query_level=None,
            parent_level=None,
            negative=False,
            layer_search=True):
        self.index = index if index else 0
        self.query_level = query_level if query_level else LocationExprFilterOffset.Q0
        self.parent_level = parent_level if parent_level else LocationExprFilterOffset.P0
        self.negative = negative
        self.layer_search = layer_search

    def copy(self):
        return LocationExprFilterOffset(
            index=self.index,
            query_level=self.query_level,
            parent_level=self.parent_level,
            negative=self.negative,
            layer_search=self.layer_search
        )

    @staticmethod
    def parse_key(data):
        if data[0] == '-':
            negative = True
        else:
            negative = False

        if data[1] == 'T':
            layer_search = True
        elif data[1] == 'F':
            layer_search = False

        keys = data[2:].split(':')

        index = int(keys[0])

        return LocationExprFilterOffset(
            index=index,
            query_level=keys[1],
            parent_level=keys[2],
            negative=negative,
            layer_search=layer_search
        )

    def get_key(self):
        return '{}{}{}:{}:{}'.format(
            '-' if self.negative else '+',
            'T' if self.layer_search else 'F',
            str(self.index),
            self.query_level,
            self.parent_level
        )

    def next_step(self):
        def get_next_parent():
            if self.parent_level == LocationExprFilterOffset.P0:
                return LocationExprFilterOffset.P1
            elif self.parent_level == LocationExprFilterOffset.P1:
                return LocationExprFilterOffset.P2

        def get_next_query_level():
            if self.query_level == LocationExprFilterOffset.Q0:
                return LocationExprFilterOffset.Q1
            elif self.query_level == LocationExprFilterOffset.Q1:
                return LocationExprFilterOffset.Q2

        if self.query_level == LocationExprFilterOffset.Q2:
            query_level = LocationExprFilterOffset.Q0
            parent_level = get_next_parent()
        else:
            parent_level = self.parent_level
            query_level = get_next_query_level()

        if not parent_level:
            if self.layer_search:
                layer_search = False
                query_level = LocationExprFilterOffset.Q1
                parent_level = LocationExprFilterOffset.P2
            else:
                raise StopIteration()
        else:
            layer_search = self.layer_search

        index = 0

        return LocationExprFilterOffset(
            index=index,
            query_level=query_level,
            parent_level=parent_level,
            negative=False,
            layer_search=layer_search
        )

    def pre_step(self):
        def get_pre_parent():
            if self.parent_level == LocationExprFilterOffset.P2:
                return LocationExprFilterOffset.P1
            elif self.parent_level == LocationExprFilterOffset.P1:
                return LocationExprFilterOffset.P0

        def get_pre_query_level():
            if self.query_level == LocationExprFilterOffset.Q2:
                return LocationExprFilterOffset.Q1
            elif self.query_level == LocationExprFilterOffset.Q1:
                return LocationExprFilterOffset.Q0

        if self.query_level == LocationExprFilterOffset.Q0:
            query_level = LocationExprFilterOffset.Q2
            parent_level = get_pre_parent()
        else:
            parent_level = self.parent_level
            query_level = get_pre_query_level()

        if not parent_level:
            if not self.layer_search:
                layer_search = True
                query_level = LocationExprFilterOffset.Q2
                parent_level = LocationExprFilterOffset.P0
            else:
                raise StopIteration()
        else:
            layer_search = self.layer_search

        index = 0

        return LocationExprFilterOffset(
            index=index,
            query_level=query_level,
            parent_level=parent_level,
            negative=True,
            layer_search=layer_search
        )


class LocationManager(PeybarBaseModelManager):
    def expr_filter(self, query, offset, limit, **kwargs):
        locations = Location.objects.filter(user__isnull=True)

        if 'type' in kwargs and kwargs['type']:
            locations = locations.filter(type=kwargs['type'])

        if 'city' in kwargs and kwargs['city']:
            locations = locations.filter(city=kwargs['city'].related_object)

        if 'country' in kwargs and kwargs['country']:
            locations = locations.filter(country=kwargs['country'].related_object)

        if 'object_name' in kwargs and kwargs['object_name']:
            from .reference import City, Country
            from .flight import Airport
            locations = locations.filter(
                (Q(object_type_id=City.get_content_type().id) & Q(Exists(City.objects.filter(name__contains=kwargs['object_name'], id=OuterRef('object_id'))))) | \
                (Q(object_type_id=Country.get_content_type().id) & Q(Exists(Country.objects.filter(name__contains=kwargs['object_name'], id=OuterRef('object_id'))))) | \
                (Q(object_type_id=Airport.get_content_type().id) & Q(Exists(Airport.objects.filter(name__contains=kwargs['object_name'], id=OuterRef('object_id')))))
                )

        if not query:
            results = locations[offset.index:offset.index + limit]

            return results, \
                LocationExprFilterOffset(
                    index=offset.index + limit,
                ) if len(results) >= limit else None

        def next_serach():
            try:
                new_offset = offset.pre_step() if offset.negative else offset.next_step()

                return self.expr_filter(query, new_offset, limit, **kwargs)
            except StopIteration as e:
                return [], None

        if offset.layer_search:
            layer_str = offset.parent_level

            expr = '%{}'.format(layer_str)
        else:
            expr = '%L0'

        ignored_exprs = []

        if offset.query_level == LocationExprFilterOffset.Q0:
            if not offset.layer_search:
                return next_serach()

            if len(query) <= 4:
                expr += '%:{}%'.format(query)
            else:
                expr += ':%{}%'.format(query)
        elif offset.query_level == LocationExprFilterOffset.Q1:
            if offset.layer_search:
                if len(query) <= 4:
                    return next_serach()
                else:
                    keys = query.split(' ')

                    if len(keys) == 1:
                        return next_serach()

                    keys = [key.strip() for key in keys]

                    ignored_exprs.append(expr + ':%{}%:{}:%'.format(query, layer_str))

                    expr += ':%{}%'.format('%'.join(keys))
            else:
                if len(query) <= 4:
                    return next_serach()

                keys = query.split(' ')

                if len(keys) == 1:
                    return next_serach()

                keys = [key.strip() for key in keys]

                expr += ':%{}%'.format('%'.join(keys))
        else:
            if offset.layer_search:
                keys = query.split(' ')
                keys = [key.strip() for key in keys]

                if len(query) <= 4:
                    return next_serach()
                else:
                    if len(keys) <= 1:
                        return next_serach()

                    reverse_keys = list(reversed(keys))

                    ignored_exprs.append(expr + ':%{}%:{}:%'.format(query, layer_str))

                    ignored_exprs.append(expr + ':%{}%:{}:%'.format('%'.join(keys), layer_str))

                expr += ':%{}%'.format('%'.join(reverse_keys))
            else:
                keys = query.split(' ')
                keys = [key.strip() for key in keys]

                if len(query) <= 4:
                    return next_serach()

                if len(keys) <= 1:
                    return next_serach()

                reverse_keys = list(reversed(keys))

                ignored_exprs.append(expr + ':%{}%:L1:'.format('%'.join(keys)))
                ignored_exprs.append(expr + ':%{}%:L2:'.format('%'.join(keys)))

                expr += ':%{}%'.format('%'.join(reverse_keys))

        if offset.layer_search:
            expr += ':{}:%'.format(layer_str)

            exprs = [expr]

            where_expr = ["tag like %s",]
        else:
            exprs = [
                expr + ':L1:',
                expr + ':L2:'
            ]

            where_expr = ["tag like %s Or tag like %s",]


        for iexpr in ignored_exprs:
            where_expr.append("tag not like %s")

        if offset.negative:
            if limit > offset.index:
                results = list(locations.extra(
                    where=where_expr, params=[*exprs, *ignored_exprs]
                ).order_by('id')[offset.index:offset - limit:offset.index])
            else:
                results = list(locations.extra(
                    where=where_expr, params=[*exprs, *ignored_exprs]
                ).order_by('id')[0:limit])
        else:
            results = list(
                locations.extra(
                    where=where_expr, params=[*exprs, *ignored_exprs]
                ).order_by('id')[offset.index:offset.index + limit]
            )

        if len(results) >= limit:
            offset.index += limit

            return results, offset

        if offset.negative:
            try:
                new_offset = offset.pre_step()
            except StopIteration as e:
                return results, None

            pre_results, new_offset = self.expr_filter(query, new_offset, limit=limit - len(results), **kwargs)

            # This check needed because it is difficult to remove
            # duplicate results when we are iterating through
            # different levels.

            if not new_offset or new_offset.parent_level != offset.parent_level:
                for res in results:
                    if res in pre_results:
                        pre_results.remove(res)

            return pre_results + results, new_offset
        else:
            try:
                new_offset = offset.next_step()
            except StopIteration as e:
                return results, None

            next_results, new_offset = self.expr_filter(query, new_offset, limit=limit - len(results), **kwargs)

            if not new_offset or new_offset.parent_level != offset.parent_level:
                for res in results:
                    if res in next_results:
                        next_results.remove(res)

            return results + next_results, new_offset

    def get_queryset(self):
        return super().get_queryset().filter(
            deleted=False
        )

class Location(PeybarBaseModel):
    objects = LocationManager()

    longitude = models.FloatField(blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)

    country = SBPForeignKey(
        'Country',
        on_delete=models.CASCADE,
        blank=False,
        null=False,
        related_name='locations'
    )

    city = SBPForeignKey(
        'City',
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='locations'
    )

    description = models.CharField(max_length=200, blank=True, null=True)
    postal_code = models.CharField(max_length=100, blank=True, null=True)

    user = SBPForeignKey(
        'User',
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='addresses'
    )

    type = PeybarEnumField(LocationType, default=LocationType.AIRPORT)

    deleted = models.BooleanField(default=False)

    object_type = SBPForeignKey(
        ContentType,
        on_delete=models.PROTECT,
        db_index=False,
        db_constraint=False,
        blank=True,
        null=True)
    object_id = models.PositiveBigIntegerField(
        blank=True,
        null=True)

    related_object = GenericForeignKey(
        'object_type',
        'object_id')

    parent = SBPForeignKey(
        'Location',
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='children'
    )

    tag = models.CharField(
        max_length=500
    )

    level = models.PositiveIntegerField(default=0)

    readable_tag = models.CharField(
        max_length=200,
        null=True,
        default=None,
        unique=True
    )

    def delete(self, *args, **kwargs):
        if self.id and not TempObject.objects.filter(
                object_type='Position',
                data__location_id=self.id
        ).exists():
            return super().delete(*args, **kwargs)

        self.deleted = True

        self.save(update_fields=['deleted',])

    def _add_parent_tag(self, parent):
        self.level += 1

        txt = ':L{}:{}:L{}:'.format(str(self.level), ':'.join(parent.related_object.ident_keys()), str(self.level))

        self.tag += txt

        if parent.parent:
            self._add_parent_tag(parent.parent)

    def add_new_ancestor(self, parent):
        self._add_parent_tag(parent)

        self.save(update_fields=['tag', 'level'])

        for child in self.children.all():
            child.add_new_ancestor(parent)

    def set_new_parent(self, parent):
        self.parent = parent

        self.add_new_ancestor(parent)

        self.save(update_fields=['parent',])

    def renew_tag(self):
        self.level = 0

        self.tag = ':L0:{}:L0:'.format(':'.join(self.related_object.ident_keys()))

        if self.parent:
            self._add_parent_tag(self.parent)

        self.save(update_fields=['tag', 'level'])

    def renew_readable_tag(self):
        if self.user:
            return

        tag = ''

        if self.country:
            tag += 'co:{}:'.format(self.country.iso_3)

        if self.city:
            tag += 'ci:{}:'.format(self.city.name_ascii)

        if self.type == LocationType.AIRPORT and self.related_object:
            tag += 'ai:{}:'.format(self.related_object.iata_code)

        self.readable_tag = tag

        self.save(update_fields=['readable_tag',])

    def save(self, *args, **kwargs):
        if not self.id and self.related_object:
            self.tag = ':L0:{}:L0:'.format(':'.join(self.related_object.ident_keys()))
            self.level = 0

            if self.parent:
                self._add_parent_tag(self.parent)

        super().save(*args, **kwargs)

        if 'update_fields' not in kwargs or \
           'country' in kwargs or \
           'city' in kwargs or \
           'object' in kwargs:
            self.renew_readable_tag()


    def __str__(self):
        if self.city:
            return '{}, {}'.format(self.country.name, self.city.name)

        return self.country.name

    class Meta():
        db_table = 'Location'

class Position(PeybarTempObjectModel):
    location = SBPForeignKey(
        Location,
        on_delete=models.DO_NOTHING,
        blank=True,
        null=True)

    since = models.DateTimeField(null=True, blank=True)
    to = models.DateTimeField(null=True, blank=True)

    comment = models.TextField(null=True, blank=True)

    user = SBPForeignKey(
        'User',
        on_delete=models.DO_NOTHING,
        blank=True,
        null=True,
        related_name='positions'
    )

    def update(self, validated_data):
        updated = False

        for k, v in validated_data.items():
            if v != getattr(self, k):
                setattr(self, k, v)
                updated = True

        return updated

    def __str__(self):
        if self.since:
            return '{}-{}: {}'.format(str(self.since), str(self.to), str(self.location))

        return '{}: {}'.format(str(self.to), str(self.location))

class LocationBaseModel(PeybarBaseModel):
    def ident_keys(self):
        return []

    class Meta():
        abstract = True
