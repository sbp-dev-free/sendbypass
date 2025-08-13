from api.models.types import ContactType

from django.db import migrations


def add_phone_number(apps, schema_editor):
    Profile = apps.get_model('api', 'Profile')
    PhoneNumber = apps.get_model('api', 'PhoneNumber')
    UserContact = apps.get_model('api', 'UserContact')
    ContentType = apps.get_model('contenttypes', 'ContentType')

    phone_object_id = ContentType.objects.get_for_model(PhoneNumber).id

    for profile in Profile.objects.all():
        if not profile.phone_number:
            continue

        obj = PhoneNumber.objects.create(
            zone_code_id=profile.phone_number.zip_code.id,
            phone=profile.phone_number.phone
        )

        contact = UserContact.objects.create(
            user=profile.user,
            object_type_id=phone_object_id,
            object_id=obj.id,
            type=ContactType.PHONE_NUMBER
        )

def add_social_links(apps, schema_editor):
    Social = apps.get_model('api', 'Social')
    UserContact = apps.get_model('api', 'UserContact')
    ContentType = apps.get_model('contenttypes', 'ContentType')

    social_object_id = ContentType.objects.get_for_model(Social).id

    for social in Social.objects.all():
        contact = UserContact.objects.create(
            user=social.user,
            object_type_id=social_object_id,
            object_id=social.id,
            type=ContactType.SOCIAL
        )

def dummy(apps, schema_editor):
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0030_add_user_contacts'),
    ]

    operations = [
        migrations.RunPython(
            add_phone_number,
            dummy
        ),
        migrations.RunPython(
            add_social_links,
            dummy
        )
    ]
