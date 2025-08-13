from .base import PeybarBaseModel, SBPForeignKey, PeybarEnumField
from .user import User
from .types import TicketType, SubscribeType
from api.utils import send_email

from django.db import models
from django.template.loader import render_to_string


class Ticket(PeybarBaseModel):
    timestamp = models.DateTimeField(
        auto_now_add=True
    )

    user = SBPForeignKey(
        User,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )

    name = models.CharField(
        max_length=30,
    )

    email = models.EmailField(
        max_length=50
    )

    phone_number = models.CharField(
        max_length=20
    )

    message = models.CharField(
        max_length=400
    )

    topic = PeybarEnumField(
        TicketType,
        default=TicketType.OTHER
    )

    subscribe = models.BooleanField(
        default=False
    )

    def save(self, *args, **kwargs):
        create = False

        if not self.id:
            create = True

        super().save(*args, **kwargs)

        if self.subscribe:
            EventSubscribe.objects.create(
                email=self.email,
                user=self.user,
            )

        subject = "Ticket"
        message = render_to_string('ticket.txt', {
            'user': self.user,
            'name': self.name,
            'email': self.email,
            'phone_number': self.phone_number,
            'message': self.message
        })

        send_email(
            subject,
            message,
            to=['sendbypass@gmail.com'],
            headers={'Reply-To': self.email},
            sender='{}<ticket@sendbypass.com>'.format(self.name)
        )

    class Meta:
        db_table = 'Ticket'

class EventSubscribe(PeybarBaseModel):
    user = SBPForeignKey(
        User,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )

    timestamp = models.DateTimeField(auto_now_add=True)

    email = models.EmailField(
        max_length=50
    )

    subscribe_type = PeybarEnumField(
        SubscribeType,
        default=SubscribeType.NEWSLETTER
    )

    class Meta:
        db_table = 'EventSubscribe'
