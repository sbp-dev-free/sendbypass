from api.models import *
from api.models.types import *

from factory.django import DjangoModelFactory
import factory
import factory.fuzzy

from random import random
from zoneinfo import ZoneInfo
import datetime
from datetime import timezone

class UserFactory(DjangoModelFactory):
    class Meta:
        model = User

    email = factory.Sequence(lambda n: 'foo{}@example.com'.format(str(n + 1)))
    password = factory.Sequence(lambda n: 'foo{}'.format(str(10000 * (n + 1))))
    first_name = factory.Sequence(lambda n: 'first_name_{}'.format(str(1000 * (n + 1))))
    last_name = factory.Sequence(lambda n: 'last_name_{}'.format(str(1000 * (n + 1))))

    _verified = factory.LazyFunction(lambda: True)

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        """Override the default ``_create`` with our custom call."""
        manager = cls._get_manager(model_class)
        # The default would use ``manager.create(*args, **kwargs)``

        verified = kwargs.pop('_verified')
        first_name = kwargs.pop('first_name')
        last_name = kwargs.pop('last_name')

        user = manager.create_user(*args, **kwargs)

        if verified:
            document = UserDocument.objects.create(
                user=user,
                type=UserDocumentType.EMAIL,
            )

            user.set_email_verified()

            user.change_profile(
                {
                    'first_name': first_name,
                    'last_name': last_name
                }
            )

            user.profile.set_verified()

        user._password = kwargs['password']

        return user

class AirportFactory(DjangoModelFactory):
    type = AirportType.LARGE
    name = factory.Sequence(lambda n: 'airport_{}'.format(str(n)))
    location = factory.RelatedFactory('api.tests.fixtures.LocationFactory', factory_related_name='related_object', type=LocationType.AIRPORT)
    iata_code = factory.Sequence(lambda n: 'iat_{}'.format(str(n)))

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        """Override the default ``_create`` with our custom call."""
        manager = cls._get_manager(model_class)

        airport = manager.create(*args, **kwargs)

        return airport

    class Meta():
        model = Airport

class CountryFactory(DjangoModelFactory):
    class Meta:
        model = Country

    name = factory.Sequence(lambda n: 'country_{}'.format(str(n + 1)))
    iso_2 = factory.Iterator(['{}{}'.format(str(n), str(n)) for n in range(10)])
    iso_3 = factory.Iterator(['{}{}{}'.format(str(n), str(n), str(n)) for n in range(10)])
    continent = factory.Sequence(lambda n: 'continent_{}'.format(str(n + 1)))

    zip_code = factory.Sequence(lambda n: n + 1)

class CityFactory(DjangoModelFactory):
    class Meta:
        model = City

    country = factory.SubFactory(CountryFactory)

    name = factory.Sequence(lambda n: 'city_{}'.format(str(n + 1)))
    iso = factory.Sequence(lambda n: 'iso_{}'.format(str(n + 1)))
    name_ascii = factory.Sequence(lambda n: 'city_{}'.format(str(n + 1)))

    province = factory.Sequence(lambda n: 'province_{}'.format(str(n + 1)))
    province_ascii = factory.Sequence(lambda n: 'province_{}'.format(str(n + 1)))

    area_code = factory.Sequence(lambda n: n + 1)

def create_related_object(o):
    if o.type == LocationType.COUNTRY:
        if o.country:
            return o.country

        return CountryFactory(location=o)
    elif o.type == LocationType.CITY:
        if o.city:
            return o.city

        return CityFactory(location=o)

    return AirportFactory(location=0)

class LocationFactory(DjangoModelFactory):
    class Meta():
        model = Location

    longitude = factory.LazyFunction(lambda: random() * 100)
    latitude = factory.LazyFunction(lambda: random() * 100)

    city = factory.SubFactory(CityFactory, location=None)
    country = factory.LazyAttribute(lambda o: o.city.country)

    type = LocationType.AIRPORT

    related_object = factory.LazyAttribute(
        create_related_object
    )

    @factory.post_generation
    def set_location(self, create, extracted, **kwargs):
        if create:
            if self.country and self.country.location is None:
                self.country.location = self

                self.country.save(update_fields=['location',])

            elif self.city and self.city.location is None:
                self.city.location = self

                self.set_new_parent(self.city.country.location)

                self.city.save(update_fields=['location',])
            else:
                self.set_new_parent(self.city.location)

class PositionFactory(factory.Factory):
    class Meta:
        model = Position

    location = factory.SubFactory(AirportFactory)

    since = factory.fuzzy.FuzzyDateTime(start_dt=datetime.datetime(2025, 2, 26, tzinfo=timezone.utc), end_dt=datetime.datetime(2025, 2, 27, tzinfo=timezone.utc))
    to = factory.fuzzy.FuzzyDateTime(start_dt=datetime.datetime(2025, 4, 27, tzinfo=timezone.utc), end_dt=datetime.datetime(2025, 4, 29, tzinfo=timezone.utc))

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        """Override the default ``_create`` with our custom call."""
        return super()._create(
            model_class,
            *args,
            location=kwargs.pop('location').location,
            **kwargs
        )

class AddressFactory(LocationFactory):
    pass

class CostFactory(factory.Factory):
    class Meta():
        model = Cost

    wage = factory.LazyFunction(lambda: random() * 10000 + 100)

class AirlineFactory(DjangoModelFactory):
    class Meta:
        model = Airline

    name = factory.Sequence(lambda n: 'airline_{}'.format(str(n)))

class FlightFactory(DjangoModelFactory):
    class Meta:
        model = Flight

    source = factory.SubFactory(PositionFactory)
    destination = factory.SubFactory(PositionFactory)

    number = factory.Sequence(lambda n: 'foo{}'.format(str(n + 1)))
    airline = factory.SubFactory(AirlineFactory)

class TripFactory(DjangoModelFactory):
    class Meta:
        model = Trip

    flight = factory.SubFactory(FlightFactory)
    user = factory.SubFactory(UserFactory)
    ticket_number = factory.Sequence(lambda n: 'foo{}'.format(str(n + 1)))

class ServicePropertiesShippingFactory(factory.Factory):
    type = ServiceItemType.VISIBLE_LOAD
    weight = 2.0
    height = 3.9
    width = 4.0
    length = 2.3

    class Meta:
        model = ServicePropertiesShipping

class ServicePropertiesShoppingFactory(factory.Factory):
    type = ServiceItemType.VISIBLE_LOAD
    weight = 2.0

    class Meta:
        model = ServicePropertiesShopping

class ShippingVisibleLoadServiceFactory(DjangoModelFactory):
    class Meta():
        model = Service

    type = ServiceType.SHIPPING
    properties = factory.SubFactory(ServicePropertiesShippingFactory, type=ServiceItemType.VISIBLE_LOAD)
    trip = factory.SubFactory(TripFactory)
    cost = factory.SubFactory(CostFactory)

class ShippingDocumentServiceFactory(DjangoModelFactory):
    class Meta():
        model = Service

    type = ServiceType.SHIPPING
    properties = factory.SubFactory(ServicePropertiesShippingFactory, type=ServiceItemType.DOCUMENT)
    trip = factory.SubFactory(TripFactory)
    cost = factory.SubFactory(CostFactory)

class ShoppingVisibleLoadServiceFactory(DjangoModelFactory):
    class Meta():
        model = Service

    type = ServiceType.SHOPPING
    properties = factory.SubFactory(ServicePropertiesShoppingFactory)
    trip = factory.SubFactory(TripFactory)
    cost = factory.SubFactory(CostFactory)

class RequirementPropertiesShippingFactory(factory.Factory):
    type = factory.Iterator([item for item in ItemType if item!=ItemType.DOCUMENT])
    weight = 2.0
    height = 3.9
    width = 4.0
    length = 2.3

    class Meta:
        model = RequirementPropertiesShipping

class RequirementPropertiesShippingDocumentFactory(factory.Factory):
    type = ItemType.DOCUMENT
    weight = 0
    size = factory.Iterator(DocumentSizeType)
    width = 0
    length = 0
    num = 4

    class Meta:
        model = RequirementPropertiesShippingDocument

class RequirementPropertiesShoppingFactory(factory.Factory):
    type = factory.Iterator(ItemType)
    weight = 2.0
    height = 3.9
    width = 4.0
    length = 2.3
    link = 'http://foo.com/app'

    class Meta:
        model = RequirementPropertiesShopping

class ShippingRequirementFactory(DjangoModelFactory):
    class Meta():
        model = Requirement

    user = factory.SubFactory(UserFactory)
    type = ServiceType.SHIPPING
    source = factory.SubFactory(PositionFactory)
    destination = factory.SubFactory(PositionFactory)
    cost = factory.SubFactory(CostFactory)
    properties = factory.SubFactory(RequirementPropertiesShippingFactory)
    name = 'foo'

class ShippingDocumentRequirementFactory(ShippingRequirementFactory):
    properties = factory.SubFactory(RequirementPropertiesShippingDocumentFactory)

class ShoppingRequirementFactory(DjangoModelFactory):
    class Meta():
        model = Requirement

    user = factory.SubFactory(UserFactory)
    type = ServiceType.SHOPPING
    source = factory.SubFactory(PositionFactory)
    destination = factory.SubFactory(PositionFactory)
    cost = factory.SubFactory(CostFactory)
    properties = factory.SubFactory(RequirementPropertiesShoppingFactory)
    name = 'foo'

class DealFactory(factory.Factory):
    cost = 1000.0
    traveler_fee = 10.0
    requester_fee = 10.0

    class Meta():
        model = Deal


class RequestFactory(DjangoModelFactory):
    class Meta():
        model = Request

    requirement = factory.SubFactory(ShippingRequirementFactory)
    service = factory.SubFactory(ShippingVisibleLoadServiceFactory)
    deal = factory.SubFactory(DealFactory)

    submitted_by = factory.LazyAttribute(lambda o: o.requirement.user)

class SocialLinkFactory(DjangoModelFactory):
    class Meta():
        model = UserContact

    type = factory.Iterator(SocialType)
    link = factory.Sequence(lambda n: 'link_{}'.format(str(n)))

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        kwargs['contact'] = Social.objects.create(
            link=kwargs.pop('link'),
            type=kwargs.pop('type')
        )

        kwargs['type'] = ContactType.SOCIAL

        return super()._create(model_class, *args, **kwargs)

class PhoneNumberFactory(DjangoModelFactory):
    class Meta:
        model = UserContact

    zone_code = factory.SubFactory(CountryFactory)
    phone = factory.Sequence(lambda n: '12345{}'.format(str(n)))

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        kwargs['type'] = ContactType.PHONE_NUMBER
        kwargs['contact'] = PhoneNumber.objects.create(
            zone_code=kwargs.pop('zone_code'),
            phone=kwargs.pop('phone')
        )

        return super()._create(model_class, *args, **kwargs)

class LanguageFactory(DjangoModelFactory):
    class Meta:
        model = Language

    name = factory.Sequence(lambda n: 'languages_{}'.format(str(n)))
    iso = factory.Sequence(lambda n: 'lan_{}'.format(str(n)))
