#!/usr/bin/env python3

from django.db import models
from enum import Enum

class SocialType(models.TextChoices):
    TELEGRAM = 'te', 'telegram'
    INSTAGRAM = 'in', 'instagram'
    VIBER = 'vi', 'viber'
    WHATSAPP = 'wh', 'whatsapp'
    FACEBOKK = 'fa', 'facebook'
    LINKEDIN = 'li', 'linkedin'
    WECHAT = 'we', 'wechat'
    LINE = 'ln', 'line'

class LocationType(models.TextChoices):
    AIRPORT = 'ai', 'AIRPORT'
    HOME = 'ho', 'HOME'
    PRIVATE = 'pr', 'PRIVATE'
    COUNTRY = 'co', 'COUNTRY'
    CITY = 'ci', 'CITY'
    DISTRICT = 'di', 'DISTRICT'
    AREA = 'ar', 'AREA'

class ActivityType(models.TextChoices):
    SERVICE = 'se', 'SERVICE'
    SHIPPING = 'sh', 'SHIPPING'
    SHOPPING = 'so', 'SHOPPING'

class ServiceType(models.TextChoices):
    SHIPPING = 'sh', 'SHIPPING'
    SHOPPING = 'so', 'SHOPPING'

class ServiceItemType(models.TextChoices):
    VISIBLE_LOAD = 'vi', 'VISIBLE_LOAD'
    DOCUMENT = 'do', 'DOCUMENT'

class ActionStatus(models.TextChoices):
    SUBMITTED = 'su', 'SUBMITTED'
    ACCEPTED = 'ac', 'ACCEPTED'
    PENDING = 'pe', 'PENDING'
    PROCESSING = 'pr', 'PROCESSING'
    PAYED = 'pa', 'PAYED'
    DELIVERED = 'de', 'DELIVERED'
    RECEIVED = 're', 'RECEIVED'
    CANCELED = 'ca', 'CANCELED'
    FINISHED = 'fi', 'FINISHED'
    EXPIRED = 'ex', 'EXPIRED'
    REJECTED = 'rj', 'REJECTED'

class RequirementStatus(models.TextChoices):
    PENDING = 'pe', 'PENDING'
    SUBMITTED = 'su', 'SUBMITTED'
    ACCEPTED = 'ac', 'ACCEPTED'
    RECEIVED = 're', 'REJECTED'
    DELIVERED = 'de', 'DELIVERED'

class ItemType(models.TextChoices):
    DOCUMENT = 'do', 'DOCUMENT'
    CLOTH = 'cl', 'CLOTH'
    FOOD = 'fo', 'FOOD'
    ELECTRONIC_GADGET = 'el', 'ELECTRONIC_GADGET'
    OTHER = 'ot', 'OTHER'

class CurrencyType(models.TextChoices):
    USD = 'us', 'USD'
    EURO = 'eu', 'EURO'
    YEN = 'ye', 'YEN'

class RoleType(models.TextChoices):
    TRAVELER = 'tr', 'TRAVELER'
    CUSTOMER = 'cu', 'CUSTOMER'

class RequestSide(models.TextChoices):
    INBOX = 'in', 'INBOX'
    OUTBOX = 'ou', 'OUTBOX'

class StepType(models.TextChoices):
    PAYMENT = 'pa', 'PAYMENT'
    DELIVER = 'de', 'DELIVER'
    PURCHASE = 'pu', 'PURCHASE'
    RECEIVE = 're', 'RECEIVE'
    DONE = 'do', 'DONE'

class StepStatus(models.TextChoices):
    WAITING = 'wa', 'WAITING'
    PENDING = 'pe', 'PENDING'
    FAILED = 'fa', 'FAILED'
    DONE = 'do', 'DONE'

class UserDocumentType(models.TextChoices):
    EMAIL = 'em', 'EMAIL'
    PROFILE_NAME = 'pn', 'PROFILE_NAME'
    PROFILE_PICTURE = 'pp', 'PROFILE_PICTURE'
    REGISTER = 're', 'REGISTER'

class UserDocumentStatus(models.TextChoices):
    PENDING = 'pe', 'PENDING'
    VERIFIED = 've', 'VERIFIED'
    REJECTED = 're', 'REJECTED'
    FAILED = 'fa', 'FAILED'

class UserSubmitType(models.TextChoices):
    WEB = 'we', 'WEB'
    MOBILE = 'mo', 'MOBILE'
    GOOGLE = 'go', 'GOOGLE'

    def is_by_using_platform(self):
        return self in [UserSubmitType.WEB, UserSubmitType.MOBILE]

class AirportType(models.TextChoices):
    SMALL = 'sm', 'SMALL'
    MEDIUM = 'me', 'MEDIUM'
    LARGE = 'la', 'LARGE'

class FlightStatus(models.TextChoices):
    SUBMITTED = 'su', 'SUBMITTED'
    ACCEPTED = 'ac', 'ACCEPTED'
    PENDING = 'pe', 'PENDING'
    STARTED = 'st', 'STARTED'
    FINISHED = 'fi', 'FINISHED'

class ProfileStatus(models.TextChoices):
    PENDING = 'pe', 'PENDING'
    VERIFIED = 've', 'VERIFIED'
    BLOCKED = 'bl', 'BLOCKED'

class PublishStatus(models.TextChoices):
    PRIVATE = 'pr', 'PRIVATE'
    PENDING = 'pe', 'PENDING'
    PUBLISHED = 'pu', 'PUBLISHED'
    FINISHED = 'fi', 'FINISHED'

class ProfileType(models.TextChoices):
    PERSONAL = 'pe', 'PERSONAL'
    BUSINESS = 'bu', 'BUSINESS'

class TicketType(models.TextChoices):
    BUG = 'bu', 'BUG'
    HELP = 'he', 'HELP'
    FEATURE_REQUEST = 'fr', 'FEATURE_REQUEST'
    SECURITY = 'se', 'SECURITY_REPORT'
    BUSINESS = 'bi', 'BUSINESS'
    INVEST = 'in', 'INVEST'
    OTHER = 'ot', 'OTHER'

class SubscribeType(models.TextChoices):
    NEWSLETTER = 'nl', 'NEWSLETTER'

class AccountRequestType(models.TextChoices):
    RESET_PASSWORD = 'rs', 'RESET_PASSWORD'
    VERIFY_EMAIL = 've', 'VERIFY_EMAIL'

class ContactType(models.TextChoices):
    PHONE_NUMBER = 'pn', 'PHONE_NUMBER'
    SOCIAL = 'so', 'SOCIAL'

class DocumentSizeType(models.TextChoices):
    A3 = 'A3', 'A3'
    A4 = 'A4', 'A4'
    A5 = 'A5', 'A5'

    LEGAL = 'le', 'LEGAL'
    LETTER = 'lt', 'LETTER'
    TABLOID = 'ta', 'TABLOID'

    CUSTOM = 'cu', 'CUSTOM'

class DimensionUnit(models.TextChoices):
    M = 'm', 'm'
    CM = 'cm', 'cm'
