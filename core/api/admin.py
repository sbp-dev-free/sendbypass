from .models import Trip, Requirement, Service, Cost, Flight, User, Profile
from .models.user import UserFile
from .models.temp_object import TypedJSONField
from .models.trip import TripFlow
from .models.service import ServiceFlow
from .models.requirement import RequirementFlow

from django_json_widget.widgets import JSONEditorWidget
from django import forms
from django.contrib import admin
from django.db.models import JSONField, ForeignKey
from django_object_actions import DjangoObjectActions, action

import json

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            return str(obj)
        elif isinstance(obj, timedelta):
            return obj.days
        elif isinstance(obj, datetime):
            return get_datetime_str(obj)
        elif isinstance(obj, Enum):
            return obj.value
        elif isinstance(obj, Cost):
            return obj.get_dict()
        elif obj is None:
            import pdb; pdb.set_trace()
            return 'NONE'

        return super().default(obj)

from django import forms
from django.utils.safestring import mark_safe

class FileLinkFormField(forms.CharField):
    def __init__(self, obj, field_name, request, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.obj = obj
        self.field_name = field_name
        self.request = request
        self.widget = forms.HiddenInput()  # Hide the actual form field

    def clean(self, value):
        return None  # Prevent form from trying to save this field

    def as_p(self):
        file_obj = getattr(self.obj, self.field_name, None)
        if file_obj:
            absolute_url = self.request.build_absolute_uri(file_obj.file.url)

            return f'<p><a href="{absolute_url}">{file_obj.file.name}</a></p>'
        else:
            return '<p>No file</p>'

class SBPModelAdmin(DjangoObjectActions, admin.ModelAdmin):
    def __getattr__(self, name):
        if name.endswith('_link'):
            field_name = name[:-5]
            if isinstance(self.model._meta.get_field(field_name), ForeignKey) and \
                    self.model._meta.get_field(field_name).related_model == UserFile:
                def file_link(obj):
                    file_obj = getattr(obj, field_name, None)
                    if file_obj:
                        absolute_url = self.request.build_absolute_uri(file_obj.file.url)

                        return mark_safe(f'<p><a href="{absolute_url}">link</a></p>')
                    else:
                        return mark_safe(f"<p>No file</p>")
                file_link.short_description = f'{field_name.capitalize()} URL'
                return file_link
        return super().__getattr__(name)

    def get_readonly_fields(self, request, obj=None):
        self.request = request

        readonly_fields = super().get_readonly_fields(request, obj)
        new_fields = []

        for field in self.model._meta.fields:
            if isinstance(field, ForeignKey) and \
                field.related_model == UserFile:
                if f'{field.name}_link' not in readonly_fields:
                    #readonly_fields.append(f'{field.name}_link')
                    new_fields.append(f'{field.name}_link')

            new_fields.append(field.name)

        return tuple(new_fields)

class ProfileAdmin(SBPModelAdmin):
    list_display = ('user__email', 'status')
    readonly_fields = ('first_name', 'last_name', 'image', 'total_orders', 'speak_languages',
                       'bio', 'website', 'rates', 'current_location', 'email_verified',
                       'user', 'background')

    list_filter = ('status',)
    list_editable = ('status',)

    ordering = ('status', '-updated_at',)

    @action(label="Verify", )
    def verify(self, request, obj):
        obj.set_verified()

    change_actions = ['verify',]

class FlightAdmin(SBPModelAdmin):
    list_display = ('source', 'destination')

class ServiceInline(admin.TabularInline):
    list_display = ('trip', 'trip__user__email')
    list_editable = ('status',)
    extra = 0

    model = Service

class TripAdmin(SBPModelAdmin):
    list_display = ('created_at', 'user__email', 'status')
    readonly_fields = ('flight', 'user', 'ticket_number', 'image', 'description', 'visible')
    list_filter = ('status',)
    inlines = [
        ServiceInline
    ]

    ordering = ('status', '-updated_at',)
    change_actions = ['accept',]

    @action(label="Accept", )
    def accept(self, request, obj):
        for service in obj.services.all():
            ServiceFlow(service).accept(accept_trip=False)

        TripFlow(obj).accept()

class RequirementAdmin(SBPModelAdmin):
    list_display = ('created_at', 'user__email', 'status')
    list_filter = ('status',)
    list_editable = ('status',)
    readonly_fields = ('image', 'user', 'type', 'name', )

    ordering = ('status', '-updated_at',)

    change_actions = ['accept',]

    @action(label="Accept", )
    def accept(self, request, obj):
        RequirementFlow(obj).accept()

admin.site.register(Profile, ProfileAdmin)
admin.site.register(Trip, TripAdmin)
admin.site.register(Requirement, RequirementAdmin)
admin.site.register(Flight, FlightAdmin)

admin.site.unregister(User)
