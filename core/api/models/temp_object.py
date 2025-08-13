from .base import PeybarBaseModel
from api.utils import DecimalEncoder

from django.db import models
from django.db.models import JSONField
from django.db import transaction as db_transaction
from django.db.models import Q

import json

class TempObjectManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(~Q(object_id=0))

    def filter_key(self, d, key, value):
        pos = key.find('__')

        if pos == -1:
            if key == 'in':
                return d in value
            elif key == 'gt':
                return d > value
            elif key == 'gte':
                return d >= value
            elif key == 'lt':
                return d < value
            elif key == 'lte':
                return d <= value
            elif key == 'ne':
                return d != value

            return getattr(d, key) == value
        else:
            d = getattr(d, key[:pos])

            return self.filter_key(d, key[pos + 2:], value)

    def get_filtered_queryset(self, model, queryset, items):
        all_temp_objects = list(queryset)
        ids = []

        def check_item(obj, items):
            for name, value in items.items():
                if not value:
                    continue
                
                if name == 'or':
                    one_true = False
                    
                    for q in value:
                        if check_item(obj, q):
                            one_true = True

                            break

                    if not one_true:
                        return False
                elif not self.filter_key(obj, name, value):
                    return False

            return True

        for temp_object in all_temp_objects:
            m = model(**temp_object.data)

            m.clean_fields()

            if check_item(m, items):
                ids.append(temp_object.id)

        return queryset.filter(id__in=ids)

class TypedJSONFieldBase(JSONField):
    def validate(self, v, m):
        if isinstance(v, PeybarTempObjectModel):
            return v

        return super().validate(v, m)

    def clean(self, data, m):
        if isinstance(data, PeybarTempObjectModel):
            return data

        return super().clean(data, m)

    def to_python(self, value):
        if isinstance(value, PeybarTempObjectModel):
            return value

        if isinstance(value, str):
            value = json.loads(value, cls=self.decoder)

        if self._many:
            l = []

            for info in value:
                l.append(self._to_python(info))

            return l
        else:
            return self._to_python(value)

    def _to_python_obj(self, value, obj):
        data = super().to_python(value)

        if isinstance(data, obj):
            return data

        if data:
            if issubclass(obj, PeybarTempObjectModel):
                o = obj(**data)
                o.full_clean()
            else:
                o = retrieve(data)
                o.full_clean()

            return o

        return data

    def from_db_value(self, value, *args, **kwargs):
        if not value:
            return value

        value = super().from_db_value(value, *args, **kwargs)

        if self._many:
            l = []

            for info in value:
                l.append(self._from_db_value(info, *args, **kwargs))

            return l
        else:
             return self._from_db_value(value, *args, **kwargs)

    def _from_db_value_obj(self, value, obj, *args, **kwargs):
        if isinstance(value, str):
            value = super().from_db_value(value, *args, **kwargs)

        data = value

        if data:
            if issubclass(obj, PeybarTempObjectModel):
                o = obj(**data)
                o.full_clean()
            else:
                o = self._retrieve(data)
                o.full_clean()

            return o

        return data

    def get_prep_value(self, instance):
        if self._many:
            l = []

            for ins in instance:
                l.append(self._get_prep_value(ins))

            return l

        if not isinstance(instance, PeybarTempObjectModel):
            return super().get_prep_value(instance)

        data = self._get_prep_value(instance)

        return data

    def _get_prep_value(self, instance):
        if isinstance(instance, PeybarTempObjectModel):
            return instance.get_dict()
        else:
            return super().get_prep_value(instance)

    def pre_save(self, obj, add=True):
        value = getattr(obj, self.name)

        data = self._get_prep_value(value)

        return data

class TypedJSONEncoder(DecimalEncoder):
    def default(self, obj):
        if isinstance(obj, PeybarTempObjectModel):
            d = obj.get_dict()

            d['__model_type'] = type(obj).__name__

            return d

        return super().default(obj)

class MultipleTypedJSONField(TypedJSONFieldBase):
    def __init__(self, objs=None, many=False, retrieve=None, store=None, encoder=None, *args, **kwargs):
        if objs:
            self._objs = {
                obj.__name__: obj for obj in objs
            }
        else:
            self._objs = {}

        self._many = many
        self._retrieve = retrieve
        self._store = store

        super().__init__(
            encoder=TypedJSONEncoder if not encoder else encoder,
            *args,
            **kwargs)
        
    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()

        kwargs['objs'] = list(self._objs.values())
        kwargs['many'] = self._many
        kwargs['retrieve'] = self._retrieve
        kwargs['store'] = self._store

        return name, path, args, kwargs

    def _to_python(self, value):
        if not value:
            return value

        obj_type = value.pop('__model_type')
        
        model_type = self._objs[obj_type]

        data = super()._to_python_obj(value, model_type)

        value['__model_type'] = obj_type

        return data

    def _from_db_value(self, value, obj, *args, **kwargs):
        obj_type = value.pop('__model_type')
        
        model_type = self._objs[obj_type]
        
        data = super()._from_db_value_obj(value, model_type, *args, **kwargs)

        value['__model_type'] = obj_type

        return data

    def _get_prep_value(self, instance):
        if isinstance(instance, PeybarTempObjectModel):
            data = instance.get_dict()

            data['__model_type'] = type(instance).__name__

            return data
        else:
            return super().get_prep_value(instance)

class TypedJSONField(TypedJSONFieldBase):
    def __init__(self, obj=None, many=False, retrieve=None, store=None, encoder=None, *args, **kwargs):
        self._obj = obj
        self._many = many
        self._retrieve = retrieve
        self._store = store

        super().__init__(
            encoder=TypedJSONEncoder if not encoder else encoder,
            *args,
            **kwargs)

    def _to_python(self, value):
        if '__model_type' in value:
            value.pop('__model_type')
            
        return super()._to_python_obj(value, self._obj)

    def _from_db_value(self, value, *args, **kwargs):
        if '__model_type' in value:
            value.pop('__model_type')
            
        return super()._from_db_value_obj(value, self._obj, *args, **kwargs)

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()

        kwargs['obj'] = self._obj
        kwargs['many'] = self._many
        kwargs['retrieve'] = self._retrieve
        kwargs['store'] = self._store

        return name, path, args, kwargs

class TempObject(PeybarBaseModel):
    objects = TempObjectManager()
    internal = models.Manager()

    object_type = models.CharField(
        max_length=50
    )

    object_id = models.PositiveIntegerField()

    data = JSONField(blank=True,
                     default=dict)

    def save(self, *args, **kwargs):

        if self.object_id is None or (self.id is None and self.object_id):
            with db_transaction.atomic():
                try:
                    max_temp = TempObject.internal.filter(
                        object_type=self.object_type,
                        object_id=0
                    ).select_for_update().latest('id')

                    if self.object_id and self.object_id < max_temp.data['last_id']:
                        # TODO: Now it seems impossible
                        raise Exception('error')
                    elif self.object_id:
                        max_id = self.object_id - 1
                        max_temp.data['last_id'] = self.object_id
                    else:
                        max_id = max_temp.data['last_id'] 
                        max_temp.data['last_id'] = max_temp.data['last_id'] + 1

                    max_temp.save(update_fields=['data',])
                except TempObject.DoesNotExist:
                    temp, _ = TempObject.internal.get_or_create(
                        object_type=self.object_type,
                        object_id=0
                    )

                    temp = TempObject.internal.filter(pk=temp.id).select_for_update().latest('id')

                    if self.object_id:
                        max_id = self.object_id - 1
                        temp.data['last_id'] = self.object_id
                    else:
                        max_id = 0
                        temp.data['last_id'] = 1

                    temp.save(update_fields=['data',])

                self.object_id = max_id + 1
            
        super().save(*args, **kwargs)

    @classmethod
    def from_db(cls, *args, **kwargs):
        o = super().from_db(*args, **kwargs)

        if o.object_id:
            o.data['id'] = o.object_id

        return o
    
    class Meta:
        db_table = 'TempObject'

from django.db import connection
import pytz
from datetime import datetime

class PeybarTempObjectModel(models.Model):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self._object_type = self._meta.model.__name__
        self._object_type_cls = self._meta.model

    def get_dict(self):
        self.full_clean()

        o = {}

        for field in self._meta.fields:
            if field.name == 'id':
                continue

            value = field.pre_save(self, add=True)

            o[field.get_attname()] = value

        return o

    def full_clean(self):
        object_id = None

        if self.id:
            object_id = self.id
            self.id = None

        super().full_clean()

        for field in self._meta.fields:
            value = getattr(self, field.get_attname())

            if isinstance(value, datetime) and not value.tzinfo:
                setattr(self, field.get_attname(), pytz.utc.localize(value))

        self.id = object_id

    def save(self, *args, **kwargs):
        o = self.get_dict()

        if not self.id:
            t = TempObject.objects.create(
                object_type=self._object_type,
                data=o
            )

            t.save(update_fields=['data'])
        else:
            t = TempObject.objects.get(
                object_type=self._object_type,
                object_id=self.id
            )

            t.data.update(o)

            t.save(update_fields=['data',])

        self.id = t.object_id

    def refresh_from_db(self, *args, **kwargs):
        d = TempObject.objects.get(
            object_type=self._object_type,
            object_id=self.id
        )

        m = self._object_type_cls(**d.data)

        m.full_clean()

        for k in d.data.keys():
            setattr(self, k, getattr(m, k))

    def __eq__(self, other):
        if type(self) is not type(other):
            return False
        
        if self.id or other.id:
            return self.id == other.id

        for field in self._meta.fields:
            if getattr(self, field.name) != getattr(other, field.name):
                return False

        return True
    
    class Meta:
        managed = False
        abstract = True

class PeybarTempObjectTimedModel(PeybarTempObjectModel):
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        abstract = True

class TempObjectForeignKey(models.PositiveIntegerField):
    def __init__(self, obj=None, *args, **kwargs):
        self._obj = obj
        self._related_model = None

        super().__init__(
            *args,
            **kwargs)

    @property
    def related_model(self):
        if not self._related_model:
            if isinstance(self._obj, str):
                from django.apps import apps

                obj = apps.get_model('api', self._obj)

                self._related_model = obj
            else:
                obj = self._obj

                self._related_model = obj

        return self._related_model


    def validate(self, v, m):
        if isinstance(v, self.related_model):
            return v

        return super().validate(v, m)

    def clean(self, data, m):
        if isinstance(data, int):
            return self.to_python(data)

        if isinstance(data, self.related_model):
            return data

        return data

    def to_python(self, value):
        if isinstance(value, self.related_model):
            return value

        data = super().to_python(value)

        m = TempObject.objects.filter(
            object_type=self.related_model.__name__,
            object_id=data
        )

        if not m:
            return None

        m = m[0]

        m = self.related_model(**m.data)

        m.full_clean()

        return m

    def get_prep_value(self, instance):
        if not instance:
            return instance

        return instance.id
