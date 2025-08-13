#!/usr/bin/env python3

from django.db import models
from viewflow.fsm import State
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone


class SBPError(Exception):
    def __init__(self, type, reason):
        self._type = type
        self._reason = reason

    @property
    def type(self):
        return self._type

    @property
    def detail(self):
        return self._reason

class ActionError(SBPError):
    DELETE = 0
    UPDATE = 1

    def __init__(self, action, obj, type, reason):
        self._action = action
        self._obj = obj

        super().__init__(type, reason)

    @property
    def type(self):
        return self._type

    @property
    def detail(self):
        return self._reason
    
class PeybarBaseModelManager(models.Manager):
    pass

class PeybarBaseModel(models.Model):
    objects = PeybarBaseModelManager()

    _CONTENT_TYPE = None

    @classmethod
    def get_content_type(cls):
        if not cls._CONTENT_TYPE:
            cls._CONTENT_TYPE = ContentType.objects.get_for_model(cls)

        return cls._CONTENT_TYPE

    class Meta:
        abstract=True

class PeybarBaseModelTimed(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.id:
            super().save(*args, **kwargs)

            return

        self.updated_at = timezone.now()

        if 'update_fields' in kwargs and kwargs['update_fields']:
            kwargs['update_fields'].append('updated_at')

        super().save(*args, **kwargs)

    class Meta():
        abstract = True
    
class PeybarEntity(PeybarBaseModel):
    class Meta:
        abstract=True

    created_at = models.DateTimeField(auto_now_add=True)

class PeybarEnumField(models.CharField):
    def __init__(self, enum_class=None, **kwargs):
        max_length = kwargs.pop('max_length', 2)

        self.enum_class = enum_class
        if 'choices' not in kwargs and enum_class:
            kwargs['choices'] = enum_class

        super().__init__(
            max_length=max_length,
            **kwargs)

    def to_python(self, value):
        if isinstance(value, models.TextChoices):
            return value

        return self.enum_class(value)

    def from_db_value(self, value, *args, **kwargs):
        return self.enum_class(value)

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        # Only include kwarg if it's not the default

        kwargs["enum_class"] = self.enum_class

        return name, path, args, kwargs


class PeybarState(State):
    pass

class SBPForeignKey(models.ForeignKey):
    pass

class SBPOneToOneField(models.OneToOneField):
    pass
