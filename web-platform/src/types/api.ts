/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface AccountRequestRequest {
  type: AccountRequestTypeEnum;
  data: AccountRequestDataRequest;
}

export type AccountRequestTypeEnum =
  | "RESET_PASSWORD"
  | "VERIFY_EMAIL"
  | "DELETE_ACCOUNT";

export interface ActivityRequest {
  id: number;
  type: ActivityTypeEnum;
  activity: string;
  requests: string;
  side: SideEnum;
}

export type ActivityTypeEnum = "SERVICE" | "SHIPPING" | "SHOPPING";

export interface Airport {
  id: number;
  location: Location;
  name: string;
  type: AirportTypeEnum;
  iata_code: string;
  website: string;
  airport_code: string;
}

export interface AirportLocation {
  city: string;
  /** @format double */
  longitude?: number | null;
  /** @format double */
  latitude?: number | null;
  id: number;
  country_iso2: string;
  country_iso3: string;
  country: string;
  description?: string | null;
  type: string;
  tag: string;
  country_tag: string;
  city_tag: string;
  airport: Airport;
}

export interface AirportLocationRequest {
  city: string;
  /** @format double */
  longitude?: number | null;
  /** @format double */
  latitude?: number | null;
  country: string;
  description?: string | null;
  airport: AirportRequest;
}

export interface AirportPosition {
  location: number;
  location_data: AirportLocation;
  /** @format date-time */
  since?: string | null;
  /** @format date-time */
  to?: string | null;
  comment?: string | null;
}

export interface AirportPositionRequest {
  location: number;
  /** @format date-time */
  since?: string | null;
  /** @format date-time */
  to?: string | null;
  comment?: string | null;
}

export interface AirportRequest {
  location: LocationRequest;
  name: string;
  type: AirportTypeEnum;
  iata_code: string;
  website: string;
  airport_code: string;
}

export type AirportTypeEnum = "SMALL" | "MEDIUM" | "LARGE";

export interface AppliedGift {
  id: number;
  gift: number;
  epochs: AppliedGiftEpoch[];
  /** @format date */
  start_date: string;
  status: AppliedGiftStatusEnum;
}

export interface AppliedGiftEpoch {
  /** @format date */
  end_time: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,2}(?:\.\d{0,2})?$
   */
  discount: string;
}

export interface AppliedGiftRequest {
  status: AppliedGiftStatusEnum;
}

export type AppliedGiftStatusEnum =
  | "STARTED"
  | "ACTIVATED"
  | "EXPIRED"
  | "FINISHED";

/**
 * * `on` - ONLINE_RETAIL
 * `fa` - FASHION
 * `be` - BEAUTY
 * `ho` - HOME_DECOR
 * `el` - ELECTRIC
 * `he` - HEALTH
 * `fo` - FOOD
 * `pe` - PET
 * `ar` - ARTS
 * `tr` - TRAVEL
 * `ga` - GAMING
 * `us` - USER
 */
export type BizCategoryEnum =
  | "on"
  | "fa"
  | "be"
  | "ho"
  | "el"
  | "he"
  | "fo"
  | "pe"
  | "ar"
  | "tr"
  | "ga"
  | "us";

export interface BusinessProfile {
  register_time: string;
  addresses?: UserLocation[];
  email: string;
  stats: string;
  /** @format uri */
  image?: string;
  id: number;
  /** @format uri */
  background?: string;
  website?: string | null;
  current_location: string;
  speak_languages?: string[];
  status: Status764Enum;
  type?: Type593Enum;
  phone_number?: PhoneNumber | null;
  incomplete: string;
  socials?: Social[] | null;
  verification: Verification;
  name: string;
  main_link: Social;
  /** @format date */
  founded_at: string;
  /**
   * * `on` - ONLINE_RETAIL
   * * `fa` - FASHION
   * * `be` - BEAUTY
   * * `ho` - HOME_DECOR
   * * `el` - ELECTRIC
   * * `he` - HEALTH
   * * `fo` - FOOD
   * * `pe` - PET
   * * `ar` - ARTS
   * * `tr` - TRAVEL
   * * `ga` - GAMING
   * * `us` - USER
   */
  biz_category?: BizCategoryEnum;
  agent: string;
  biz_id?: string;
  tagline?: string | null;
  overview?: string | null;
}

export interface City {
  name: string;
  name_ascii: string;
  iso?: string;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  area_code?: number;
  /** @format double */
  longitude?: number | null;
  /** @format double */
  latitude?: number | null;
  type: string;
  province: string;
  province_ascii: string;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  population?: number;
  country: number;
  location?: number | null;
}

export interface Contact {
  type: ContactTypeEnum;
  data: ContactData;
}

export interface ContactRequest {
  type: ContactTypeEnum;
  data: ContactDataRequest;
}

export type ContactTypeEnum = "PHONE_NUMBER" | "SOCIAL";

export interface Cost {
  /** @format double */
  wage: number;
  /** @format double */
  fee?: number | null;
  /**
   * The estimated price of an item, whether it is a shipping or shopping. For shopping it is necessary.
   * @format double
   */
  item_price?: number | null;
  unit?: UnitEnum | null;
}

export interface CostRequest {
  /** @format double */
  wage: number;
  /** @format double */
  fee?: number | null;
  /**
   * The estimated price of an item, whether it is a shipping or shopping. For shopping it is necessary.
   * @format double
   */
  item_price?: number | null;
  unit?: UnitEnum | null;
}

export interface Country {
  long_name: string;
  name: string;
  iso_2: string;
  iso_3: string;
  continent: string;
  region: string;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  zip_code: number;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  population?: number;
  captial?: number | null;
  location?: number | null;
}

export interface CustomeTokenRequest {
  email: string;
  password: string;
}

export interface CustomerDeliverProperties {
  description?: string | null;
  code: string;
}

export interface CustomerDeliverPropertiesRequest {
  description?: string | null;
}

export interface CustomerPaymentProperties {
  description?: string | null;
  /** @format uri */
  link: string;
}

export interface CustomerPaymentPropertiesRequest {
  description?: string | null;
}

export interface CustomerReceiveProperties {
  description?: string | null;
  code: string;
}

export interface CustomerReceivePropertiesRequest {
  description?: string | null;
}

export interface DealSerialiezr {
  /** @format double */
  cost: number;
  /** @format double */
  traveler_fee?: number;
  /** @format double */
  requester_fee?: number;
}

export interface DealSerialiezrRequest {
  /** @format double */
  cost: number;
  /** @format double */
  traveler_fee?: number;
  /** @format double */
  requester_fee?: number;
}

export interface DoneProperties {
  description?: string | null;
  /**
   * @min 1
   * @max 5
   */
  rate: number;
  comment?: string | null;
}

export interface DonePropertiesRequest {
  description?: string | null;
  /**
   * @min 1
   * @max 5
   */
  rate: number;
  comment?: string | null;
}

export interface Flight {
  source: AirportPosition;
  destination: AirportPosition;
  number: string;
  airline: string;
}

export interface FlightRequest {
  source: AirportPositionRequest;
  destination: AirportPositionRequest;
  number: string;
  airline: string;
}

export interface GeneralPosition {
  location: number | null;
  location_data: Location;
  /** @format date-time */
  since?: string | null;
  /** @format date-time */
  to?: string | null;
  comment?: string | null;
}

export interface GeneralPositionRequest {
  location: number | null;
  /** @format date-time */
  since?: string | null;
  /** @format date-time */
  to?: string | null;
  comment?: string | null;
}

export interface Gift {
  id: number;
  /** @format date */
  start_date: string;
  /** @format date */
  expire_date?: string | null;
  title: string;
  description?: string | null;
  periods: GiftDiscountPeriod[];
  code: string;
  status: string;
}

export interface GiftDiscountPeriod {
  /**
   * @format decimal
   * @pattern ^-?\d{0,3}(?:\.\d{0,2})?$
   */
  discount: string;
  period: number;
}

export interface GiftRequest {
  /** @format date */
  expire_date?: string | null;
  title: string;
  description?: string | null;
  code: string;
}

export interface Language {
  name: string;
  iso: string;
}

export interface Location {
  city: string;
  /** @format double */
  longitude?: number | null;
  /** @format double */
  latitude?: number | null;
  id: number;
  country_iso2: string;
  country_iso3: string;
  country: string;
  description?: string | null;
  type: string;
  tag: string;
  country_tag: string;
  city_tag: string;
}

export interface LocationRequest {
  city: string;
  /** @format double */
  longitude?: number | null;
  /** @format double */
  latitude?: number | null;
  country: string;
  description?: string | null;
}

export interface Order {
  id: number;
  requirement: number;
  service: number;
  requirement_data: Requirement;
  service_data: Service;
  deal: DealSerialiezr;
  submitted_by: string;
  accepted_by: string;
  role: string;
  description?: string | null;
  status?: Status3AfEnum;
  /** @format date-time */
  accept_time: string;
  /** @format date-time */
  submit_time: string;
  /** @format date-time */
  end_time: string;
  traveler_data: Profile;
  customer_data: Profile;
  steps: OrderStep[];
}

export interface OrderRequest {
  requirement: number;
  service: number;
  deal: DealSerialiezrRequest;
  description?: string | null;
  status?: Status3AfEnum;
}

export interface OrderStep {
  id: number;
  /** @format date-time */
  timestamp: string;
  type: OrderStepTypeEnum;
  status: OrderStepStatusEnum;
  /** @format date-time */
  end_time: string;
  properties: StepProperties;
  role: RoleEnum;
  request: number;
  user: number;
  follow_step?: number | null;
}

export interface OrderStepRequest {
  /** @format date-time */
  timestamp: string;
  type: OrderStepTypeEnum;
  status: OrderStepStatusEnum;
  /** @format date-time */
  end_time: string;
  properties: StepPropertiesRequest;
  role: RoleEnum;
  request: number;
  user: number;
  follow_step?: number | null;
}

export type OrderStepStatusEnum = "WAITING" | "PENDING" | "FAILED" | "DONE";

export type OrderStepTypeEnum =
  | "PAYMENT"
  | "DELIVER"
  | "PURCHASE"
  | "RECEIVE"
  | "DONE";

export interface PaginatedActivityRequestList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=400&limit=100
   */
  next?: string | null;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=200&limit=100
   */
  previous?: string | null;
  results: ActivityRequest[];
}

export interface PaginatedAirportList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=400&limit=100
   */
  next?: string | null;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=200&limit=100
   */
  previous?: string | null;
  results: Airport[];
}

export interface PaginatedAppliedGiftList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=400&limit=100
   */
  next?: string | null;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=200&limit=100
   */
  previous?: string | null;
  results: AppliedGift[];
}

export interface PaginatedCityList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=400&limit=100
   */
  next?: string | null;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=200&limit=100
   */
  previous?: string | null;
  results: City[];
}

export interface PaginatedContactList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=400&limit=100
   */
  next?: string | null;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=200&limit=100
   */
  previous?: string | null;
  results: Contact[];
}

export interface PaginatedCountryList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=400&limit=100
   */
  next?: string | null;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=200&limit=100
   */
  previous?: string | null;
  results: Country[];
}

export interface PaginatedFlightList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=400&limit=100
   */
  next?: string | null;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=200&limit=100
   */
  previous?: string | null;
  results: Flight[];
}

export interface PaginatedGiftList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=400&limit=100
   */
  next?: string | null;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=200&limit=100
   */
  previous?: string | null;
  results: Gift[];
}

export interface PaginatedLanguageList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=400&limit=100
   */
  next?: string | null;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=200&limit=100
   */
  previous?: string | null;
  results: Language[];
}

export interface PaginatedLocationList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=400&limit=100
   */
  next?: string | null;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=200&limit=100
   */
  previous?: string | null;
  results: Location[];
}

export interface PaginatedOrderList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=400&limit=100
   */
  next?: string | null;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=200&limit=100
   */
  previous?: string | null;
  results: Order[];
}

export interface PaginatedRequestList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=400&limit=100
   */
  next?: string | null;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=200&limit=100
   */
  previous?: string | null;
  results: Request[];
}

export interface PaginatedRequirementList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=400&limit=100
   */
  next?: string | null;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=200&limit=100
   */
  previous?: string | null;
  results: Requirement[];
}

export interface PaginatedServiceList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=400&limit=100
   */
  next?: string | null;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=200&limit=100
   */
  previous?: string | null;
  results: Service[];
}

export interface PaginatedTripList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=400&limit=100
   */
  next?: string | null;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=200&limit=100
   */
  previous?: string | null;
  results: Trip[];
}

export interface PaginatedUserList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=400&limit=100
   */
  next?: string | null;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=200&limit=100
   */
  previous?: string | null;
  results: User[];
}

export interface PaginatedUserLocationList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=400&limit=100
   */
  next?: string | null;
  /**
   * @format uri
   * @example http://api.example.org/accounts/?offset=200&limit=100
   */
  previous?: string | null;
  results: UserLocation[];
}

export interface PasswordResetRequestRequest {
  /** @format email */
  email: string;
}

export interface PatchedContactRequest {
  type?: ContactTypeEnum;
  data?: ContactDataRequest;
}

export interface PatchedOrderRequest {
  requirement?: number;
  service?: number;
  deal?: DealSerialiezrRequest;
  description?: string | null;
  status?: Status3AfEnum;
}

export interface PatchedOrderStepRequest {
  /** @format date-time */
  timestamp?: string;
  type?: OrderStepTypeEnum;
  status?: OrderStepStatusEnum;
  /** @format date-time */
  end_time?: string;
  properties?: StepPropertiesRequest;
  role?: RoleEnum;
  request?: number;
  user?: number;
  follow_step?: number | null;
}

export interface PatchedRequestRequest {
  requirement?: number;
  service?: number;
  deal?: DealSerialiezrRequest;
  description?: string | null;
  status?: Status3AfEnum;
}

export interface PatchedRequirementRequest {
  type?: Type62BEnum;
  cost?: CostRequest;
  source?: GeneralPositionRequest;
  destination?: PositionRequest;
  properties?: PropertiesRequest;
  comment?: string | null;
  /** @format binary */
  image?: File;
  name?: string;
  visible?: boolean;
}

export interface PatchedServiceRequest {
  trip?: number;
  type?: Type62BEnum;
  properties?: ServicePropertiesRequest;
  cost?: CostRequest;
  description?: string | null;
}

export interface PatchedTripRequest {
  flight?: FlightRequest;
  ticket_number?: string;
  /** @format binary */
  image?: File;
  description?: string | null;
  visible?: boolean;
  source?: number;
  destination?: number;
}

export interface PatchedUserLocationRequest {
  city?: string;
  /** @format double */
  longitude?: number | null;
  /** @format double */
  latitude?: number | null;
  country?: string;
  description?: string | null;
  current?: boolean;
}

export interface PhoneNumber {
  zone_code: ZoneCode;
  phone: string;
  socials: string;
}

export interface PhoneNumberRequest {
  zone_code: ZoneCodeRequest;
  phone: string;
}

export interface Position {
  location: number;
  location_data: Location;
  /** @format date-time */
  since?: string | null;
  /** @format date-time */
  to?: string | null;
  comment?: string | null;
}

export interface PositionRequest {
  location: number;
  /** @format date-time */
  since?: string | null;
  /** @format date-time */
  to?: string | null;
  comment?: string | null;
}

export interface Profile {
  register_time: string;
  addresses?: UserLocation[];
  email: string;
  stats: string;
  first_name?: string | null;
  last_name?: string | null;
  /** @format uri */
  image?: string;
  id: number;
  bio?: string | null;
  /** @format uri */
  background?: string;
  website?: string | null;
  current_location: string;
  speak_languages?: string[];
  status: Status764Enum;
  type?: Type593Enum;
  phone_number: PhoneNumber;
  incomplete: string;
  socials: Social[];
  verification: Verification;
}

export interface ProfileRequest {
  addresses?: UserLocationRequest[];
  first_name?: string | null;
  last_name?: string | null;
  /** @format binary */
  image?: File;
  bio?: string | null;
  /** @format binary */
  background?: File;
  website?: string | null;
  speak_languages?: string[];
  type?: Type593Enum;
  socials: SocialRequest[];
}

export type PublishStatusEnum =
  | "PRIVATE"
  | "PENDING"
  | "PUBLISHED"
  | "FINISHED";

export interface Referral {
  code: string;
  stats: ReferralStats;
  /**
   * @format decimal
   * @pattern ^-?\d{0,6}(?:\.\d{0,4})?$
   */
  reward?: string;
  /** @format uri */
  qrcode: string;
}

export interface ReferralStats {
  num_registers: number;
  num_trips: number;
  num_needs: number;
  num_orders: number;
}

export interface Request {
  id: number;
  requirement: number;
  service: number;
  requirement_data: Requirement;
  service_data: Service;
  deal: DealSerialiezr;
  submitted_by: string;
  accepted_by: string;
  role: string;
  description?: string | null;
  status?: Status3AfEnum;
  /** @format date-time */
  accept_time: string;
  /** @format date-time */
  submit_time: string;
  /** @format date-time */
  end_time: string;
  traveler_data: Profile;
  customer_data: Profile;
}

export interface RequestRequest {
  requirement: number;
  service: number;
  deal: DealSerialiezrRequest;
  description?: string | null;
  status?: Status3AfEnum;
}

export interface Requirement {
  id: number;
  type: Type62BEnum;
  cost: Cost;
  source: GeneralPosition;
  destination: Position;
  user: number;
  user_data: Profile;
  properties: Properties;
  status: Status3AfEnum;
  comment?: string | null;
  /** @format uri */
  image?: string;
  name: string;
  role: string;
  publish_status: PublishStatusEnum;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
  visible?: boolean;
}

export interface RequirementPropertiesShipping {
  type: TypeEc9Enum;
  /**
   * @format double
   * @min 0
   * @max 60000
   */
  weight: number;
  /**
   * @format double
   * @min 0
   * @max 150
   */
  height?: number;
  /**
   * @format double
   * @min 0
   * @max 150
   */
  length?: number;
  /**
   * @format double
   * @min 0
   * @max 150
   */
  width?: number;
  flexible_dimensions?: boolean;
}

export interface RequirementPropertiesShippingDocument {
  type: TypeEc9Enum;
  /**
   * @format double
   * @min 0
   * @max 60000
   */
  weight: number;
  size?: SizeEnum;
  /**
   * @format double
   * @min 0
   * @max 150
   */
  length?: number;
  /**
   * @format double
   * @min 0
   * @max 150
   */
  width?: number;
  num: number;
}

export interface RequirementPropertiesShippingDocumentRequest {
  type: TypeEc9Enum;
  /**
   * @format double
   * @min 0
   * @max 60000
   */
  weight: number;
  size?: SizeEnum;
  /**
   * @format double
   * @min 0
   * @max 150
   */
  length?: number;
  /**
   * @format double
   * @min 0
   * @max 150
   */
  width?: number;
  num: number;
}

export interface RequirementPropertiesShippingRequest {
  type: TypeEc9Enum;
  /**
   * @format double
   * @min 0
   * @max 60000
   */
  weight: number;
  /**
   * @format double
   * @min 0
   * @max 150
   */
  height?: number;
  /**
   * @format double
   * @min 0
   * @max 150
   */
  length?: number;
  /**
   * @format double
   * @min 0
   * @max 150
   */
  width?: number;
  flexible_dimensions?: boolean;
}

export interface RequirementPropertiesShopping {
  type: TypeEc9Enum;
  /**
   * @format double
   * @min 0
   * @max 60000
   */
  weight: number;
  /**
   * @format double
   * @min 0
   * @max 150
   */
  height?: number;
  /**
   * @format double
   * @min 0
   * @max 150
   */
  length?: number;
  /**
   * @format double
   * @min 0
   * @max 150
   */
  width?: number;
  /** @format uri */
  link?: string | null;
  flexible_dimensions?: boolean;
}

export interface RequirementPropertiesShoppingRequest {
  type: TypeEc9Enum;
  /**
   * @format double
   * @min 0
   * @max 60000
   */
  weight: number;
  /**
   * @format double
   * @min 0
   * @max 150
   */
  height?: number;
  /**
   * @format double
   * @min 0
   * @max 150
   */
  length?: number;
  /**
   * @format double
   * @min 0
   * @max 150
   */
  width?: number;
  /** @format uri */
  link?: string | null;
  flexible_dimensions?: boolean;
}

export interface RequirementRequest {
  type: Type62BEnum;
  cost: CostRequest;
  source: GeneralPositionRequest;
  destination: PositionRequest;
  properties: PropertiesRequest;
  comment?: string | null;
  /** @format binary */
  image?: File;
  name: string;
  visible?: boolean;
}

export type RoleEnum = "TRAVELER" | "CUSTOMER";

export interface SendDeleteAccountRequest {
  /** @format email */
  email: string;
}

export interface Service {
  trip?: number;
  type: Type62BEnum;
  properties: ServiceProperties;
  cost: Cost;
  role: string;
  description?: string | null;
  user: number;
  id: number;
  user_data: Profile;
}

export interface ServicePropertiesShipping {
  type?: Type8F4Enum;
  /**
   * @format double
   * @min 0
   * @max 60000
   */
  weight: number;
}

export interface ServicePropertiesShippingRequest {
  type?: Type8F4Enum;
  /**
   * @format double
   * @min 0
   * @max 60000
   */
  weight: number;
}

export interface ServicePropertiesShopping {
  type?: Type8F4Enum;
  /**
   * @format double
   * @min 0
   * @max 60000
   */
  weight: number;
}

export interface ServicePropertiesShoppingRequest {
  type?: Type8F4Enum;
  /**
   * @format double
   * @min 0
   * @max 60000
   */
  weight: number;
}

export interface ServiceRequest {
  trip?: number;
  type: Type62BEnum;
  properties: ServicePropertiesRequest;
  cost: CostRequest;
  description?: string | null;
}

export type SideEnum = "INBOX" | "OUTBOX";

export type SizeEnum =
  | "A3"
  | "A4"
  | "A5"
  | "LEGAL"
  | "LETTER"
  | "TABLOID"
  | "CUSTOM";

export interface Social {
  type: SocialTypeEnum;
  link: string;
}

export interface SocialRequest {
  type: SocialTypeEnum;
  link: string;
}

export type SocialTypeEnum =
  | "telegram"
  | "instagram"
  | "viber"
  | "whatsapp"
  | "facebook"
  | "linkedin"
  | "wechat"
  | "line"
  | "WEBSITE";

export type Status3AfEnum =
  | "SUBMITTED"
  | "ACCEPTED"
  | "PENDING"
  | "PROCESSING"
  | "PAYED"
  | "DELIVERED"
  | "RECEIVED"
  | "CANCELED"
  | "FINISHED"
  | "EXPIRED"
  | "REJECTED";

export type Status764Enum = "PENDING" | "VERIFIED" | "BLOCKED";

export interface Subscribe {
  /** @format email */
  email: string;
  /** @format date-time */
  timestamp: string;
}

export interface SubscribeRequest {
  /** @format email */
  email: string;
}

export interface Ticket {
  name: string;
  /** @format email */
  email: string;
  phone_number: string;
  message: string;
  topic: TopicEnum;
  subscribe?: boolean;
}

export interface TicketRequest {
  name: string;
  /** @format email */
  email: string;
  phone_number: string;
  message: string;
  topic: TopicEnum;
  subscribe?: boolean;
}

export interface TokenRefresh {
  access: string;
  refresh: string;
}

export interface TokenRefreshRequest {
  refresh: string;
}

export type TopicEnum =
  | "BUG"
  | "HELP"
  | "FEATURE_REQUEST"
  | "SECURITY_REPORT"
  | "BUSINESS"
  | "INVEST"
  | "OTHER";

export interface TravelerDeliverProperties {
  description?: string | null;
  code: string | null;
}

export interface TravelerDeliverPropertiesRequest {
  description?: string | null;
  code: string | null;
}

export interface TravelerPaymentProperties {
  description?: string | null;
}

export interface TravelerPaymentPropertiesRequest {
  description?: string | null;
}

export interface TravelerReceiveProperties {
  description?: string | null;
  code: string | null;
}

export interface TravelerReceivePropertiesRequest {
  description?: string | null;
  code: string | null;
}

export interface Trip {
  id: number;
  flight: Flight;
  ticket_number: string;
  services: string;
  /** @format uri */
  image?: string;
  description?: string | null;
  status: Status3AfEnum;
  user_data: Profile;
  visible?: boolean;
  publish_status: PublishStatusEnum;
  source?: number;
  source_data: Location;
  destination?: number;
  destination_data: Location;
}

export interface TripRequest {
  flight: FlightRequest;
  ticket_number: string;
  /** @format binary */
  image?: File;
  description?: string | null;
  visible?: boolean;
  source?: number;
  destination?: number;
}

export type Type593Enum = "PERSONAL" | "BUSINESS";

export type Type62BEnum = "SHIPPING" | "SHOPPING";

export type Type8F4Enum = "VISIBLE_LOAD" | "DOCUMENT";

export type TypeEc9Enum =
  | "DOCUMENT"
  | "CLOTH"
  | "FOOD"
  | "ELECTRONIC_GADGET"
  | "OTHER";

export type UnitEnum = "USD" | "EURO" | "YEN";

export interface User {
  id: number;
  /** @format email */
  email: string;
  /** @format date-time */
  register_time: string;
  token: string;
}

export interface UserLocation {
  city: string;
  /** @format double */
  longitude?: number | null;
  /** @format double */
  latitude?: number | null;
  id: number;
  country_iso2: string;
  country_iso3: string;
  country: string;
  description?: string | null;
  current?: boolean;
}

export interface UserLocationRequest {
  city: string;
  /** @format double */
  longitude?: number | null;
  /** @format double */
  latitude?: number | null;
  country: string;
  description?: string | null;
  current?: boolean;
}

export interface UserRequest {
  /** @format email */
  email: string;
  password: string;
  referred: string;
}

export interface Verification {
  type: VerificationTypeEnum;
  status: VerificationStatusEnum;
  /** @format date-time */
  verified_at: string;
  /** @format date-time */
  expired_at: string;
}

export type VerificationStatusEnum =
  | "PENDING"
  | "VERIFIED"
  | "REJECTED"
  | "FAILED"
  | "FINISHED";

export type VerificationTypeEnum = "BEGINNER" | "BASIC" | "ADVANCED";

export interface ZoneCode {
  country: string;
  country_tag: string;
  zone_code: string;
}

export interface ZoneCodeRequest {
  country: string;
}

export type AccountRequestDataRequest =
  | PasswordResetRequestRequest
  | SendDeleteAccountRequest;

export type ContactData = PhoneNumber | Social;

export type ContactDataRequest = PhoneNumberRequest | SocialRequest;

export type ProfileSerializer = Profile | BusinessProfile;

export type Properties =
  | RequirementPropertiesShopping
  | RequirementPropertiesShipping
  | RequirementPropertiesShippingDocument;

export type PropertiesRequest =
  | RequirementPropertiesShoppingRequest
  | RequirementPropertiesShippingRequest
  | RequirementPropertiesShippingDocumentRequest;

export type ServiceProperties =
  | ServicePropertiesShopping
  | ServicePropertiesShipping;

export type ServicePropertiesRequest =
  | ServicePropertiesShoppingRequest
  | ServicePropertiesShippingRequest;

export type StepProperties =
  | TravelerPaymentProperties
  | CustomerPaymentProperties
  | CustomerDeliverProperties
  | TravelerReceiveProperties
  | CustomerReceiveProperties
  | TravelerDeliverProperties
  | DoneProperties;

export type StepPropertiesRequest =
  | TravelerPaymentPropertiesRequest
  | CustomerPaymentPropertiesRequest
  | CustomerDeliverPropertiesRequest
  | TravelerReceivePropertiesRequest
  | CustomerReceivePropertiesRequest
  | TravelerDeliverPropertiesRequest
  | DonePropertiesRequest;

export namespace Api {
  /**
   * No description
   * @tags account_request
   * @name AccountRequestCreate
   * @request POST:/api/{version}/account_request/{uidb64}/{token}/
   * @secure
   * @response `200` `void` No response body
   */
  export namespace AccountRequestCreate {
    export type RequestParams = {
      /** @pattern ^[^/]+$ */
      token: string;
      /** @pattern ^[^/]+$ */
      uidb64: string;
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
  /**
   * No description
   * @tags account_requests
   * @name AccountRequestsCreate
   * @request POST:/api/{version}/account_requests/
   * @secure
   * @response `200` `void` No response body
   */
  export namespace AccountRequestsCreate {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = AccountRequestRequest;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
  /**
   * No description
   * @tags activity_requests
   * @name ActivityRequestsList
   * @request GET:/api/{version}/activity_requests/
   * @secure
   * @response `200` `PaginatedActivityRequestList`
   */
  export namespace ActivityRequestsList {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {
      /** Number of results to return per page. */
      limit?: number;
      /** The initial index from which to return the results. */
      offset?: number;
      /** Which field to use when ordering the results. */
      ordering?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PaginatedActivityRequestList;
  }
  /**
   * No description
   * @tags airports
   * @name AirportsList
   * @request GET:/api/{version}/airports/
   * @secure
   * @response `200` `PaginatedAirportList`
   */
  export namespace AirportsList {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {
      /** Number of results to return per page. */
      limit?: number;
      /** The initial index from which to return the results. */
      offset?: number;
      /** Which field to use when ordering the results. */
      ordering?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PaginatedAirportList;
  }
  /**
   * No description
   * @tags airports
   * @name AirportsCreate
   * @request POST:/api/{version}/airports/
   * @secure
   * @response `201` `Airport`
   */
  export namespace AirportsCreate {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = AirportRequest;
    export type RequestHeaders = {};
    export type ResponseBody = Airport;
  }
  /**
   * No description
   * @tags applied_gifts
   * @name AppliedGiftsList
   * @request GET:/api/{version}/applied_gifts/
   * @secure
   * @response `200` `PaginatedAppliedGiftList`
   */
  export namespace AppliedGiftsList {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {
      /** Number of results to return per page. */
      limit?: number;
      /** The initial index from which to return the results. */
      offset?: number;
      /** Which field to use when ordering the results. */
      ordering?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PaginatedAppliedGiftList;
  }
  /**
   * No description
   * @tags applied_gifts
   * @name AppliedGiftsCreate
   * @request POST:/api/{version}/applied_gifts/
   * @secure
   * @response `201` `AppliedGift`
   */
  export namespace AppliedGiftsCreate {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = AppliedGiftRequest;
    export type RequestHeaders = {};
    export type ResponseBody = AppliedGift;
  }
  /**
   * No description
   * @tags businesses
   * @name BusinessesRetrieve
   * @request GET:/api/{version}/businesses/{biz_id}/
   * @secure
   * @response `200` `BusinessProfile`
   */
  export namespace BusinessesRetrieve {
    export type RequestParams = {
      /** @pattern ^[^/]+$ */
      bizId: string;
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = BusinessProfile;
  }
  /**
   * No description
   * @tags cities
   * @name CitiesList
   * @request GET:/api/{version}/cities/
   * @secure
   * @response `200` `PaginatedCityList`
   */
  export namespace CitiesList {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {
      country?: number;
      /** Number of results to return per page. */
      limit?: number;
      /** The initial index from which to return the results. */
      offset?: number;
      /** Which field to use when ordering the results. */
      ordering?: string;
      query?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PaginatedCityList;
  }
  /**
   * No description
   * @tags contacts
   * @name ContactsList
   * @request GET:/api/{version}/contacts/
   * @secure
   * @response `200` `PaginatedContactList`
   */
  export namespace ContactsList {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {
      /** Number of results to return per page. */
      limit?: number;
      /** The initial index from which to return the results. */
      offset?: number;
      /** Which field to use when ordering the results. */
      ordering?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PaginatedContactList;
  }
  /**
   * No description
   * @tags contacts
   * @name ContactsCreate
   * @request POST:/api/{version}/contacts/
   * @secure
   * @response `201` `Contact`
   */
  export namespace ContactsCreate {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ContactRequest;
    export type RequestHeaders = {};
    export type ResponseBody = Contact;
  }
  /**
   * No description
   * @tags contacts
   * @name ContactsUpdate
   * @request PUT:/api/{version}/contacts/
   * @secure
   * @response `200` `Contact`
   */
  export namespace ContactsUpdate {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ContactRequest;
    export type RequestHeaders = {};
    export type ResponseBody = Contact;
  }
  /**
   * No description
   * @tags contacts
   * @name ContactsPartialUpdate
   * @request PATCH:/api/{version}/contacts/
   * @secure
   * @response `200` `Contact`
   */
  export namespace ContactsPartialUpdate {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PatchedContactRequest;
    export type RequestHeaders = {};
    export type ResponseBody = Contact;
  }
  /**
   * No description
   * @tags countries
   * @name CountriesList
   * @request GET:/api/{version}/countries/
   * @secure
   * @response `200` `PaginatedCountryList`
   */
  export namespace CountriesList {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {
      /** Number of results to return per page. */
      limit?: number;
      /** The initial index from which to return the results. */
      offset?: number;
      /** Which field to use when ordering the results. */
      ordering?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PaginatedCountryList;
  }
  /**
   * No description
   * @tags flights
   * @name FlightsList
   * @request GET:/api/{version}/flights/
   * @secure
   * @response `200` `PaginatedFlightList`
   */
  export namespace FlightsList {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {
      /** Number of results to return per page. */
      limit?: number;
      /** The initial index from which to return the results. */
      offset?: number;
      /** Which field to use when ordering the results. */
      ordering?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PaginatedFlightList;
  }
  /**
   * No description
   * @tags flights
   * @name FlightsCreate
   * @request POST:/api/{version}/flights/
   * @secure
   * @response `201` `Flight`
   */
  export namespace FlightsCreate {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = FlightRequest;
    export type RequestHeaders = {};
    export type ResponseBody = Flight;
  }
  /**
   * No description
   * @tags gifts
   * @name GiftsList
   * @request GET:/api/{version}/gifts/
   * @secure
   * @response `200` `PaginatedGiftList`
   */
  export namespace GiftsList {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {
      /** Number of results to return per page. */
      limit?: number;
      /** The initial index from which to return the results. */
      offset?: number;
      /** Which field to use when ordering the results. */
      ordering?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PaginatedGiftList;
  }
  /**
   * No description
   * @tags gifts
   * @name GiftsCreate
   * @request POST:/api/{version}/gifts/
   * @secure
   * @response `201` `Gift`
   */
  export namespace GiftsCreate {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = GiftRequest;
    export type RequestHeaders = {};
    export type ResponseBody = Gift;
  }
  /**
   * No description
   * @tags google_login
   * @name GoogleLoginRetrieve
   * @request GET:/api/{version}/google_login/
   * @response `200` `void` No response body
   */
  export namespace GoogleLoginRetrieve {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
  /**
   * No description
   * @tags google_login
   * @name GoogleLoginCreate
   * @request POST:/api/{version}/google_login/
   * @response `201` `void` No response body
   */
  export namespace GoogleLoginCreate {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
  /**
   * No description
   * @tags google_login
   * @name GoogleLoginRedirectRetrieve
   * @request GET:/api/{version}/google_login/redirect/
   * @response `200` `void` No response body
   */
  export namespace GoogleLoginRedirectRetrieve {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
  /**
   * No description
   * @tags google_login
   * @name GoogleLoginRedirectCreate
   * @request POST:/api/{version}/google_login/redirect/
   * @response `201` `void` No response body
   */
  export namespace GoogleLoginRedirectCreate {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
  /**
   * No description
   * @tags languages
   * @name LanguagesList
   * @request GET:/api/{version}/languages/
   * @secure
   * @response `200` `PaginatedLanguageList`
   */
  export namespace LanguagesList {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {
      /** Number of results to return per page. */
      limit?: number;
      /** The initial index from which to return the results. */
      offset?: number;
      /** Which field to use when ordering the results. */
      ordering?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PaginatedLanguageList;
  }
  /**
   * No description
   * @tags locations
   * @name LocationsList
   * @request GET:/api/{version}/locations/
   * @secure
   * @response `200` `PaginatedLocationList`
   */
  export namespace LocationsList {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {
      city?: string | null;
      country?: string | null;
      /** @min 1 */
      limit?: number;
      object_name?: string;
      /** The initial index from which to return the results. */
      offset?: number;
      /** Which field to use when ordering the results. */
      ordering?: string;
      query?: string;
      type?:
        | "AIRPORT"
        | "HOME"
        | "PRIVATE"
        | "COUNTRY"
        | "CITY"
        | "DISTRICT"
        | "AREA";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PaginatedLocationList;
  }
  /**
   * No description
   * @tags locations
   * @name LocationsCreate
   * @request POST:/api/{version}/locations/
   * @secure
   * @response `201` `Location`
   */
  export namespace LocationsCreate {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = LocationRequest;
    export type RequestHeaders = {};
    export type ResponseBody = Location;
  }
  /**
   * @description Takes a set of user credentials and returns an access and refresh JSON web token pair to prove the authentication of those credentials.
   * @tags login
   * @name LoginCreate
   * @request POST:/api/{version}/login/
   * @response `200` `void` No response body
   */
  export namespace LoginCreate {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = CustomeTokenRequest;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
  /**
   * @description Takes a refresh type JSON web token and returns an access type JSON web token if the refresh token is valid.
   * @tags login
   * @name LoginRefreshCreate
   * @request POST:/api/{version}/login/refresh
   * @response `200` `TokenRefresh`
   */
  export namespace LoginRefreshCreate {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = TokenRefreshRequest;
    export type RequestHeaders = {};
    export type ResponseBody = TokenRefresh;
  }
  /**
   * No description
   * @tags order_steps
   * @name OrderStepsRetrieve
   * @request GET:/api/{version}/order_steps/{id}/
   * @secure
   * @response `200` `OrderStep`
   */
  export namespace OrderStepsRetrieve {
    export type RequestParams = {
      /** @pattern ^[0-9]+$ */
      id: string;
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = OrderStep;
  }
  /**
   * No description
   * @tags order_steps
   * @name OrderStepsUpdate
   * @request PUT:/api/{version}/order_steps/{id}/
   * @secure
   * @response `200` `OrderStep`
   */
  export namespace OrderStepsUpdate {
    export type RequestParams = {
      /** @pattern ^[0-9]+$ */
      id: string;
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = OrderStepRequest;
    export type RequestHeaders = {};
    export type ResponseBody = OrderStep;
  }
  /**
   * No description
   * @tags order_steps
   * @name OrderStepsPartialUpdate
   * @request PATCH:/api/{version}/order_steps/{id}/
   * @secure
   * @response `200` `OrderStep`
   */
  export namespace OrderStepsPartialUpdate {
    export type RequestParams = {
      /** @pattern ^[0-9]+$ */
      id: string;
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PatchedOrderStepRequest;
    export type RequestHeaders = {};
    export type ResponseBody = OrderStep;
  }
  /**
   * No description
   * @tags orders
   * @name OrdersList
   * @request GET:/api/{version}/orders/
   * @secure
   * @response `200` `PaginatedOrderList`
   */
  export namespace OrdersList {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {
      /** Number of results to return per page. */
      limit?: number;
      /** The initial index from which to return the results. */
      offset?: number;
      /** Which field to use when ordering the results. */
      ordering?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PaginatedOrderList;
  }
  /**
   * No description
   * @tags orders
   * @name OrdersCreate
   * @request POST:/api/{version}/orders/
   * @secure
   * @response `201` `Order`
   */
  export namespace OrdersCreate {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = OrderRequest;
    export type RequestHeaders = {};
    export type ResponseBody = Order;
  }
  /**
   * No description
   * @tags orders
   * @name OrdersRetrieve
   * @request GET:/api/{version}/orders/{id}/
   * @secure
   * @response `200` `Order`
   */
  export namespace OrdersRetrieve {
    export type RequestParams = {
      /** @pattern ^[0-9]+$ */
      id: string;
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Order;
  }
  /**
   * No description
   * @tags orders
   * @name OrdersUpdate
   * @request PUT:/api/{version}/orders/{id}/
   * @secure
   * @response `200` `Order`
   */
  export namespace OrdersUpdate {
    export type RequestParams = {
      /** @pattern ^[0-9]+$ */
      id: string;
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = OrderRequest;
    export type RequestHeaders = {};
    export type ResponseBody = Order;
  }
  /**
   * No description
   * @tags orders
   * @name OrdersPartialUpdate
   * @request PATCH:/api/{version}/orders/{id}/
   * @secure
   * @response `200` `Order`
   */
  export namespace OrdersPartialUpdate {
    export type RequestParams = {
      /** @pattern ^[0-9]+$ */
      id: string;
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PatchedOrderRequest;
    export type RequestHeaders = {};
    export type ResponseBody = Order;
  }
  /**
   * No description
   * @tags profile
   * @name ProfileRetrieve
   * @request GET:/api/{version}/profile/
   * @secure
   * @response `200` `ProfileSerializer`
   */
  export namespace ProfileRetrieve {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ProfileSerializer;
  }
  /**
   * No description
   * @tags profile
   * @name ProfileUpdate
   * @request PUT:/api/{version}/profile/
   * @secure
   * @response `200` `ProfileSerializer`
   */
  export namespace ProfileUpdate {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ProfileSerializer;
  }
  /**
   * No description
   * @tags profile
   * @name ProfilePartialUpdate
   * @request PATCH:/api/{version}/profile/
   * @secure
   * @response `200` `ProfileSerializer`
   */
  export namespace ProfilePartialUpdate {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ProfileSerializer;
  }
  /**
   * No description
   * @tags referrals
   * @name ReferralsRetrieve
   * @request GET:/api/{version}/referrals/
   * @secure
   * @response `200` `Referral`
   */
  export namespace ReferralsRetrieve {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Referral;
  }
  /**
   * No description
   * @tags requests
   * @name RequestsList
   * @request GET:/api/{version}/requests/
   * @secure
   * @response `200` `PaginatedRequestList`
   */
  export namespace RequestsList {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {
      /** Number of results to return per page. */
      limit?: number;
      /** The initial index from which to return the results. */
      offset?: number;
      /** Which field to use when ordering the results. */
      ordering?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PaginatedRequestList;
  }
  /**
   * No description
   * @tags requests
   * @name RequestsCreate
   * @request POST:/api/{version}/requests/
   * @secure
   * @response `201` `Request`
   */
  export namespace RequestsCreate {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = RequestRequest;
    export type RequestHeaders = {};
    export type ResponseBody = Request;
  }
  /**
   * No description
   * @tags requests
   * @name RequestsRetrieve
   * @request GET:/api/{version}/requests/{id}/
   * @secure
   * @response `200` `Request`
   */
  export namespace RequestsRetrieve {
    export type RequestParams = {
      /** @pattern ^[0-9]+$ */
      id: string;
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Request;
  }
  /**
   * No description
   * @tags requests
   * @name RequestsUpdate
   * @request PUT:/api/{version}/requests/{id}/
   * @secure
   * @response `200` `Request`
   */
  export namespace RequestsUpdate {
    export type RequestParams = {
      /** @pattern ^[0-9]+$ */
      id: string;
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = RequestRequest;
    export type RequestHeaders = {};
    export type ResponseBody = Request;
  }
  /**
   * No description
   * @tags requests
   * @name RequestsPartialUpdate
   * @request PATCH:/api/{version}/requests/{id}/
   * @secure
   * @response `200` `Request`
   */
  export namespace RequestsPartialUpdate {
    export type RequestParams = {
      /** @pattern ^[0-9]+$ */
      id: string;
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PatchedRequestRequest;
    export type RequestHeaders = {};
    export type ResponseBody = Request;
  }
  /**
   * No description
   * @tags requirements
   * @name RequirementsList
   * @request GET:/api/{version}/requirements/
   * @secure
   * @response `200` `PaginatedRequirementList`
   */
  export namespace RequirementsList {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {
      active?: boolean;
      biz_id?: string;
      cost?: number;
      from_city?: string;
      from_location?: string;
      /**
       * * `DOCUMENT` - DOCUMENT
       * * `CLOTH` - CLOTH
       * * `FOOD` - FOOD
       * * `ELECTRONIC_GADGET` - ELECTRONIC_GADGET
       * * `OTHER` - OTHER
       */
      item_types?: (
        | "CLOTH"
        | "DOCUMENT"
        | "ELECTRONIC_GADGET"
        | "FOOD"
        | "OTHER"
      )[];
      /** Number of results to return per page. */
      limit?: number;
      /** The initial index from which to return the results. */
      offset?: number;
      /** Which field to use when ordering the results. */
      ordering?: string;
      /**
       * * `TRAVELER` - TRAVELER
       * * `CUSTOMER` - CUSTOMER
       */
      role?: "CUSTOMER" | "TRAVELER";
      service?: string;
      /**
       * * `VISIBLE_LOAD` - VISIBLE_LOAD
       * * `DOCUMENT` - DOCUMENT
       */
      service_types?: ("DOCUMENT" | "VISIBLE_LOAD")[];
      to_city?: string;
      to_location?: string;
      /**
       * * `SHIPPING` - SHIPPING
       * * `SHOPPING` - SHOPPING
       */
      types?: ("SHIPPING" | "SHOPPING")[];
      weight?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PaginatedRequirementList;
  }
  /**
   * No description
   * @tags requirements
   * @name RequirementsCreate
   * @request POST:/api/{version}/requirements/
   * @secure
   * @response `201` `Requirement`
   */
  export namespace RequirementsCreate {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = RequirementRequest;
    export type RequestHeaders = {};
    export type ResponseBody = Requirement;
  }
  /**
   * No description
   * @tags requirements
   * @name RequirementsRetrieve
   * @request GET:/api/{version}/requirements/{id}/
   * @secure
   * @response `200` `Requirement`
   */
  export namespace RequirementsRetrieve {
    export type RequestParams = {
      /** @pattern ^[0-9]+$ */
      id: string;
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Requirement;
  }
  /**
   * No description
   * @tags requirements
   * @name RequirementsUpdate
   * @request PUT:/api/{version}/requirements/{id}/
   * @secure
   * @response `200` `Requirement`
   */
  export namespace RequirementsUpdate {
    export type RequestParams = {
      /** @pattern ^[0-9]+$ */
      id: string;
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = RequirementRequest;
    export type RequestHeaders = {};
    export type ResponseBody = Requirement;
  }
  /**
   * No description
   * @tags requirements
   * @name RequirementsPartialUpdate
   * @request PATCH:/api/{version}/requirements/{id}/
   * @secure
   * @response `200` `Requirement`
   */
  export namespace RequirementsPartialUpdate {
    export type RequestParams = {
      /** @pattern ^[0-9]+$ */
      id: string;
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PatchedRequirementRequest;
    export type RequestHeaders = {};
    export type ResponseBody = Requirement;
  }
  /**
   * No description
   * @tags requirements
   * @name RequirementsDestroy
   * @request DELETE:/api/{version}/requirements/{id}/
   * @secure
   * @response `204` `void` No response body
   */
  export namespace RequirementsDestroy {
    export type RequestParams = {
      /** @pattern ^[0-9]+$ */
      id: string;
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
  /**
   * No description
   * @tags services
   * @name ServicesList
   * @request GET:/api/{version}/services/
   * @secure
   * @response `200` `PaginatedServiceList`
   */
  export namespace ServicesList {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {
      /** Number of results to return per page. */
      limit?: number;
      /** The initial index from which to return the results. */
      offset?: number;
      /** Which field to use when ordering the results. */
      ordering?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PaginatedServiceList;
  }
  /**
   * No description
   * @tags services
   * @name ServicesCreate
   * @request POST:/api/{version}/services/
   * @secure
   * @response `201` `Service`
   */
  export namespace ServicesCreate {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ServiceRequest;
    export type RequestHeaders = {};
    export type ResponseBody = Service;
  }
  /**
   * No description
   * @tags services
   * @name ServicesRetrieve
   * @request GET:/api/{version}/services/{id}/
   * @secure
   * @response `200` `Service`
   */
  export namespace ServicesRetrieve {
    export type RequestParams = {
      /** @pattern ^[0-9]+$ */
      id: string;
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Service;
  }
  /**
   * No description
   * @tags services
   * @name ServicesUpdate
   * @request PUT:/api/{version}/services/{id}/
   * @secure
   * @response `200` `Service`
   */
  export namespace ServicesUpdate {
    export type RequestParams = {
      /** @pattern ^[0-9]+$ */
      id: string;
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ServiceRequest;
    export type RequestHeaders = {};
    export type ResponseBody = Service;
  }
  /**
   * No description
   * @tags services
   * @name ServicesPartialUpdate
   * @request PATCH:/api/{version}/services/{id}/
   * @secure
   * @response `200` `Service`
   */
  export namespace ServicesPartialUpdate {
    export type RequestParams = {
      /** @pattern ^[0-9]+$ */
      id: string;
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PatchedServiceRequest;
    export type RequestHeaders = {};
    export type ResponseBody = Service;
  }
  /**
   * No description
   * @tags services
   * @name ServicesDestroy
   * @request DELETE:/api/{version}/services/{id}/
   * @secure
   * @response `204` `void` No response body
   */
  export namespace ServicesDestroy {
    export type RequestParams = {
      /** @pattern ^[0-9]+$ */
      id: string;
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
  /**
   * No description
   * @tags stats
   * @name StatsVisitorsRetrieve
   * @request GET:/api/{version}/stats/visitors/
   * @secure
   * @response `200` `void` No response body
   */
  export namespace StatsVisitorsRetrieve {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
  /**
   * No description
   * @tags subscribes
   * @name SubscribesCreate
   * @request POST:/api/{version}/subscribes/
   * @secure
   * @response `201` `Subscribe`
   */
  export namespace SubscribesCreate {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = SubscribeRequest;
    export type RequestHeaders = {};
    export type ResponseBody = Subscribe;
  }
  /**
   * No description
   * @tags tickets
   * @name TicketsCreate
   * @request POST:/api/{version}/tickets/
   * @secure
   * @response `201` `Ticket`
   */
  export namespace TicketsCreate {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = TicketRequest;
    export type RequestHeaders = {};
    export type ResponseBody = Ticket;
  }
  /**
   * No description
   * @tags trips
   * @name TripsList
   * @request GET:/api/{version}/trips/
   * @secure
   * @response `200` `PaginatedTripList`
   */
  export namespace TripsList {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {
      active?: boolean;
      cost?: number;
      from_city?: string;
      from_location?: string;
      /** Number of results to return per page. */
      limit?: number;
      /** The initial index from which to return the results. */
      offset?: number;
      /** Which field to use when ordering the results. */
      ordering?: string;
      /**
       * * `TRAVELER` - TRAVELER
       * * `CUSTOMER` - CUSTOMER
       */
      role?: "CUSTOMER" | "TRAVELER";
      /**
       * * `VISIBLE_LOAD` - VISIBLE_LOAD
       * * `DOCUMENT` - DOCUMENT
       */
      service_types?: ("DOCUMENT" | "VISIBLE_LOAD")[];
      to_city?: string;
      to_location?: string;
      /**
       * * `SHIPPING` - SHIPPING
       * * `SHOPPING` - SHOPPING
       */
      type?: "SHIPPING" | "SHOPPING";
      weight?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PaginatedTripList;
  }
  /**
   * No description
   * @tags trips
   * @name TripsCreate
   * @request POST:/api/{version}/trips/
   * @secure
   * @response `201` `Trip`
   */
  export namespace TripsCreate {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = TripRequest;
    export type RequestHeaders = {};
    export type ResponseBody = Trip;
  }
  /**
   * No description
   * @tags trips
   * @name TripsRetrieve
   * @request GET:/api/{version}/trips/{id}/
   * @secure
   * @response `200` `Trip`
   */
  export namespace TripsRetrieve {
    export type RequestParams = {
      /** @pattern ^[0-9]+$ */
      id: string;
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Trip;
  }
  /**
   * No description
   * @tags trips
   * @name TripsUpdate
   * @request PUT:/api/{version}/trips/{id}/
   * @secure
   * @response `200` `Trip`
   */
  export namespace TripsUpdate {
    export type RequestParams = {
      /** @pattern ^[0-9]+$ */
      id: string;
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = TripRequest;
    export type RequestHeaders = {};
    export type ResponseBody = Trip;
  }
  /**
   * No description
   * @tags trips
   * @name TripsPartialUpdate
   * @request PATCH:/api/{version}/trips/{id}/
   * @secure
   * @response `200` `Trip`
   */
  export namespace TripsPartialUpdate {
    export type RequestParams = {
      /** @pattern ^[0-9]+$ */
      id: string;
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PatchedTripRequest;
    export type RequestHeaders = {};
    export type ResponseBody = Trip;
  }
  /**
   * No description
   * @tags trips
   * @name TripsDestroy
   * @request DELETE:/api/{version}/trips/{id}/
   * @secure
   * @response `204` `void` No response body
   */
  export namespace TripsDestroy {
    export type RequestParams = {
      /** @pattern ^[0-9]+$ */
      id: string;
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
  /**
   * No description
   * @tags user
   * @name UserDestroy
   * @request DELETE:/api/{version}/user/
   * @secure
   * @response `204` `void` No response body
   */
  export namespace UserDestroy {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
  /**
   * No description
   * @tags user_documents
   * @name UserDocumentsCreate
   * @request POST:/api/{version}/user_documents/{uidb64}/{token}/
   * @secure
   * @response `200` `void` No response body
   */
  export namespace UserDocumentsCreate {
    export type RequestParams = {
      /** @pattern ^[^/]+$ */
      token: string;
      /** @pattern ^[^/]+$ */
      uidb64: string;
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
  /**
   * No description
   * @tags user_locations
   * @name UserLocationsList
   * @request GET:/api/{version}/user_locations/
   * @secure
   * @response `200` `PaginatedUserLocationList`
   */
  export namespace UserLocationsList {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {
      /** Number of results to return per page. */
      limit?: number;
      /** The initial index from which to return the results. */
      offset?: number;
      /** Which field to use when ordering the results. */
      ordering?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PaginatedUserLocationList;
  }
  /**
   * No description
   * @tags user_locations
   * @name UserLocationsCreate
   * @request POST:/api/{version}/user_locations/
   * @secure
   * @response `201` `UserLocation`
   */
  export namespace UserLocationsCreate {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UserLocationRequest;
    export type RequestHeaders = {};
    export type ResponseBody = UserLocation;
  }
  /**
   * No description
   * @tags user_locations
   * @name UserLocationsUpdate
   * @request PUT:/api/{version}/user_locations/
   * @secure
   * @response `200` `UserLocation`
   */
  export namespace UserLocationsUpdate {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UserLocationRequest;
    export type RequestHeaders = {};
    export type ResponseBody = UserLocation;
  }
  /**
   * No description
   * @tags user_locations
   * @name UserLocationsPartialUpdate
   * @request PATCH:/api/{version}/user_locations/
   * @secure
   * @response `200` `UserLocation`
   */
  export namespace UserLocationsPartialUpdate {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PatchedUserLocationRequest;
    export type RequestHeaders = {};
    export type ResponseBody = UserLocation;
  }
  /**
   * No description
   * @tags user_locations
   * @name UserLocationsRetrieve
   * @request GET:/api/{version}/user_locations/{id}/
   * @secure
   * @response `200` `UserLocation`
   */
  export namespace UserLocationsRetrieve {
    export type RequestParams = {
      /** @pattern ^[0-9]+$ */
      id: string;
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = UserLocation;
  }
  /**
   * No description
   * @tags user_locations
   * @name UserLocationsUpdate2
   * @request PUT:/api/{version}/user_locations/{id}/
   * @secure
   * @response `200` `UserLocation`
   */
  export namespace UserLocationsUpdate2 {
    export type RequestParams = {
      /** @pattern ^[0-9]+$ */
      id: string;
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UserLocationRequest;
    export type RequestHeaders = {};
    export type ResponseBody = UserLocation;
  }
  /**
   * No description
   * @tags user_locations
   * @name UserLocationsPartialUpdate2
   * @request PATCH:/api/{version}/user_locations/{id}/
   * @secure
   * @response `200` `UserLocation`
   */
  export namespace UserLocationsPartialUpdate2 {
    export type RequestParams = {
      /** @pattern ^[0-9]+$ */
      id: string;
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PatchedUserLocationRequest;
    export type RequestHeaders = {};
    export type ResponseBody = UserLocation;
  }
  /**
   * No description
   * @tags user_locations
   * @name UserLocationsDestroy
   * @request DELETE:/api/{version}/user_locations/{id}/
   * @secure
   * @response `204` `void` No response body
   */
  export namespace UserLocationsDestroy {
    export type RequestParams = {
      /** @pattern ^[0-9]+$ */
      id: string;
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
  /**
   * No description
   * @tags users
   * @name UsersList
   * @request GET:/api/{version}/users/
   * @secure
   * @response `200` `PaginatedUserList`
   */
  export namespace UsersList {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {
      /** Number of results to return per page. */
      limit?: number;
      /** The initial index from which to return the results. */
      offset?: number;
      /** Which field to use when ordering the results. */
      ordering?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PaginatedUserList;
  }
  /**
   * No description
   * @tags users
   * @name UsersCreate
   * @request POST:/api/{version}/users/
   * @secure
   * @response `201` `User`
   */
  export namespace UsersCreate {
    export type RequestParams = {
      /** @pattern ^(v1)$ */
      version: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UserRequest;
    export type RequestHeaders = {};
    export type ResponseBody = User;
  }
  /**
   * @description OpenApi3 schema for this API. Format can be selected via content negotiation. - YAML: application/vnd.oai.openapi - JSON: application/vnd.oai.openapi+json
   * @tags schema
   * @name SchemaRetrieve
   * @request GET:/api/schema/
   * @secure
   * @response `200` `Record<string, any>`
   */
  export namespace SchemaRetrieve {
    export type RequestParams = {};
    export type RequestQuery = {
      format?: "json" | "yaml";
      lang?:
        | "af"
        | "ar"
        | "ar-dz"
        | "ast"
        | "az"
        | "be"
        | "bg"
        | "bn"
        | "br"
        | "bs"
        | "ca"
        | "ckb"
        | "cs"
        | "cy"
        | "da"
        | "de"
        | "dsb"
        | "el"
        | "en"
        | "en-au"
        | "en-gb"
        | "eo"
        | "es"
        | "es-ar"
        | "es-co"
        | "es-mx"
        | "es-ni"
        | "es-ve"
        | "et"
        | "eu"
        | "fa"
        | "fi"
        | "fr"
        | "fy"
        | "ga"
        | "gd"
        | "gl"
        | "he"
        | "hi"
        | "hr"
        | "hsb"
        | "hu"
        | "hy"
        | "ia"
        | "id"
        | "ig"
        | "io"
        | "is"
        | "it"
        | "ja"
        | "ka"
        | "kab"
        | "kk"
        | "km"
        | "kn"
        | "ko"
        | "ky"
        | "lb"
        | "lt"
        | "lv"
        | "mk"
        | "ml"
        | "mn"
        | "mr"
        | "ms"
        | "my"
        | "nb"
        | "ne"
        | "nl"
        | "nn"
        | "os"
        | "pa"
        | "pl"
        | "pt"
        | "pt-br"
        | "ro"
        | "ru"
        | "sk"
        | "sl"
        | "sq"
        | "sr"
        | "sr-latn"
        | "sv"
        | "sw"
        | "ta"
        | "te"
        | "tg"
        | "th"
        | "tk"
        | "tr"
        | "tt"
        | "udm"
        | "ug"
        | "uk"
        | "ur"
        | "uz"
        | "vi"
        | "zh-hans"
        | "zh-hant";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Record<string, any>;
  }
}

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: Iterable<any> =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData
          ? { "Content-Type": type }
          : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title No title
 * @version 0.0.0
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags account_request
     * @name AccountRequestCreate
     * @request POST:/api/{version}/account_request/{uidb64}/{token}/
     * @secure
     * @response `200` `void` No response body
     */
    accountRequestCreate: (
      token: string,
      uidb64: string,
      version: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/${version}/account_request/${uidb64}/${token}/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags account_requests
     * @name AccountRequestsCreate
     * @request POST:/api/{version}/account_requests/
     * @secure
     * @response `200` `void` No response body
     */
    accountRequestsCreate: (
      version: string,
      data: AccountRequestRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/${version}/account_requests/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags activity_requests
     * @name ActivityRequestsList
     * @request GET:/api/{version}/activity_requests/
     * @secure
     * @response `200` `PaginatedActivityRequestList`
     */
    activityRequestsList: (
      version: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number;
        /** The initial index from which to return the results. */
        offset?: number;
        /** Which field to use when ordering the results. */
        ordering?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedActivityRequestList, any>({
        path: `/api/${version}/activity_requests/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags airports
     * @name AirportsList
     * @request GET:/api/{version}/airports/
     * @secure
     * @response `200` `PaginatedAirportList`
     */
    airportsList: (
      version: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number;
        /** The initial index from which to return the results. */
        offset?: number;
        /** Which field to use when ordering the results. */
        ordering?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedAirportList, any>({
        path: `/api/${version}/airports/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags airports
     * @name AirportsCreate
     * @request POST:/api/{version}/airports/
     * @secure
     * @response `201` `Airport`
     */
    airportsCreate: (
      version: string,
      data: AirportRequest,
      params: RequestParams = {},
    ) =>
      this.request<Airport, any>({
        path: `/api/${version}/airports/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags applied_gifts
     * @name AppliedGiftsList
     * @request GET:/api/{version}/applied_gifts/
     * @secure
     * @response `200` `PaginatedAppliedGiftList`
     */
    appliedGiftsList: (
      version: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number;
        /** The initial index from which to return the results. */
        offset?: number;
        /** Which field to use when ordering the results. */
        ordering?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedAppliedGiftList, any>({
        path: `/api/${version}/applied_gifts/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags applied_gifts
     * @name AppliedGiftsCreate
     * @request POST:/api/{version}/applied_gifts/
     * @secure
     * @response `201` `AppliedGift`
     */
    appliedGiftsCreate: (
      version: string,
      data: AppliedGiftRequest,
      params: RequestParams = {},
    ) =>
      this.request<AppliedGift, any>({
        path: `/api/${version}/applied_gifts/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags businesses
     * @name BusinessesRetrieve
     * @request GET:/api/{version}/businesses/{biz_id}/
     * @secure
     * @response `200` `BusinessProfile`
     */
    businessesRetrieve: (
      bizId: string,
      version: string,
      params: RequestParams = {},
    ) =>
      this.request<BusinessProfile, any>({
        path: `/api/${version}/businesses/${bizId}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags cities
     * @name CitiesList
     * @request GET:/api/{version}/cities/
     * @secure
     * @response `200` `PaginatedCityList`
     */
    citiesList: (
      version: string,
      query?: {
        country?: number;
        /** Number of results to return per page. */
        limit?: number;
        /** The initial index from which to return the results. */
        offset?: number;
        /** Which field to use when ordering the results. */
        ordering?: string;
        query?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedCityList, any>({
        path: `/api/${version}/cities/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags contacts
     * @name ContactsList
     * @request GET:/api/{version}/contacts/
     * @secure
     * @response `200` `PaginatedContactList`
     */
    contactsList: (
      version: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number;
        /** The initial index from which to return the results. */
        offset?: number;
        /** Which field to use when ordering the results. */
        ordering?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedContactList, any>({
        path: `/api/${version}/contacts/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags contacts
     * @name ContactsCreate
     * @request POST:/api/{version}/contacts/
     * @secure
     * @response `201` `Contact`
     */
    contactsCreate: (
      version: string,
      data: ContactRequest,
      params: RequestParams = {},
    ) =>
      this.request<Contact, any>({
        path: `/api/${version}/contacts/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags contacts
     * @name ContactsUpdate
     * @request PUT:/api/{version}/contacts/
     * @secure
     * @response `200` `Contact`
     */
    contactsUpdate: (
      version: string,
      data: ContactRequest,
      params: RequestParams = {},
    ) =>
      this.request<Contact, any>({
        path: `/api/${version}/contacts/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags contacts
     * @name ContactsPartialUpdate
     * @request PATCH:/api/{version}/contacts/
     * @secure
     * @response `200` `Contact`
     */
    contactsPartialUpdate: (
      version: string,
      data: PatchedContactRequest,
      params: RequestParams = {},
    ) =>
      this.request<Contact, any>({
        path: `/api/${version}/contacts/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags countries
     * @name CountriesList
     * @request GET:/api/{version}/countries/
     * @secure
     * @response `200` `PaginatedCountryList`
     */
    countriesList: (
      version: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number;
        /** The initial index from which to return the results. */
        offset?: number;
        /** Which field to use when ordering the results. */
        ordering?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedCountryList, any>({
        path: `/api/${version}/countries/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags flights
     * @name FlightsList
     * @request GET:/api/{version}/flights/
     * @secure
     * @response `200` `PaginatedFlightList`
     */
    flightsList: (
      version: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number;
        /** The initial index from which to return the results. */
        offset?: number;
        /** Which field to use when ordering the results. */
        ordering?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedFlightList, any>({
        path: `/api/${version}/flights/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags flights
     * @name FlightsCreate
     * @request POST:/api/{version}/flights/
     * @secure
     * @response `201` `Flight`
     */
    flightsCreate: (
      version: string,
      data: FlightRequest,
      params: RequestParams = {},
    ) =>
      this.request<Flight, any>({
        path: `/api/${version}/flights/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags gifts
     * @name GiftsList
     * @request GET:/api/{version}/gifts/
     * @secure
     * @response `200` `PaginatedGiftList`
     */
    giftsList: (
      version: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number;
        /** The initial index from which to return the results. */
        offset?: number;
        /** Which field to use when ordering the results. */
        ordering?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedGiftList, any>({
        path: `/api/${version}/gifts/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags gifts
     * @name GiftsCreate
     * @request POST:/api/{version}/gifts/
     * @secure
     * @response `201` `Gift`
     */
    giftsCreate: (
      version: string,
      data: GiftRequest,
      params: RequestParams = {},
    ) =>
      this.request<Gift, any>({
        path: `/api/${version}/gifts/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags google_login
     * @name GoogleLoginRetrieve
     * @request GET:/api/{version}/google_login/
     * @response `200` `void` No response body
     */
    googleLoginRetrieve: (version: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/${version}/google_login/`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags google_login
     * @name GoogleLoginCreate
     * @request POST:/api/{version}/google_login/
     * @response `201` `void` No response body
     */
    googleLoginCreate: (version: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/${version}/google_login/`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags google_login
     * @name GoogleLoginRedirectRetrieve
     * @request GET:/api/{version}/google_login/redirect/
     * @response `200` `void` No response body
     */
    googleLoginRedirectRetrieve: (
      version: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/${version}/google_login/redirect/`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags google_login
     * @name GoogleLoginRedirectCreate
     * @request POST:/api/{version}/google_login/redirect/
     * @response `201` `void` No response body
     */
    googleLoginRedirectCreate: (version: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/${version}/google_login/redirect/`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags languages
     * @name LanguagesList
     * @request GET:/api/{version}/languages/
     * @secure
     * @response `200` `PaginatedLanguageList`
     */
    languagesList: (
      version: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number;
        /** The initial index from which to return the results. */
        offset?: number;
        /** Which field to use when ordering the results. */
        ordering?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedLanguageList, any>({
        path: `/api/${version}/languages/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags locations
     * @name LocationsList
     * @request GET:/api/{version}/locations/
     * @secure
     * @response `200` `PaginatedLocationList`
     */
    locationsList: (
      version: string,
      query?: {
        city?: string | null;
        country?: string | null;
        /** @min 1 */
        limit?: number;
        object_name?: string;
        /** The initial index from which to return the results. */
        offset?: number;
        /** Which field to use when ordering the results. */
        ordering?: string;
        query?: string;
        type?:
          | "AIRPORT"
          | "HOME"
          | "PRIVATE"
          | "COUNTRY"
          | "CITY"
          | "DISTRICT"
          | "AREA";
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedLocationList, any>({
        path: `/api/${version}/locations/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags locations
     * @name LocationsCreate
     * @request POST:/api/{version}/locations/
     * @secure
     * @response `201` `Location`
     */
    locationsCreate: (
      version: string,
      data: LocationRequest,
      params: RequestParams = {},
    ) =>
      this.request<Location, any>({
        path: `/api/${version}/locations/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Takes a set of user credentials and returns an access and refresh JSON web token pair to prove the authentication of those credentials.
     *
     * @tags login
     * @name LoginCreate
     * @request POST:/api/{version}/login/
     * @response `200` `void` No response body
     */
    loginCreate: (
      version: string,
      data: CustomeTokenRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/${version}/login/`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Takes a refresh type JSON web token and returns an access type JSON web token if the refresh token is valid.
     *
     * @tags login
     * @name LoginRefreshCreate
     * @request POST:/api/{version}/login/refresh
     * @response `200` `TokenRefresh`
     */
    loginRefreshCreate: (
      version: string,
      data: TokenRefreshRequest,
      params: RequestParams = {},
    ) =>
      this.request<TokenRefresh, any>({
        path: `/api/${version}/login/refresh`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags order_steps
     * @name OrderStepsRetrieve
     * @request GET:/api/{version}/order_steps/{id}/
     * @secure
     * @response `200` `OrderStep`
     */
    orderStepsRetrieve: (
      id: string,
      version: string,
      params: RequestParams = {},
    ) =>
      this.request<OrderStep, any>({
        path: `/api/${version}/order_steps/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags order_steps
     * @name OrderStepsUpdate
     * @request PUT:/api/{version}/order_steps/{id}/
     * @secure
     * @response `200` `OrderStep`
     */
    orderStepsUpdate: (
      id: string,
      version: string,
      data: OrderStepRequest,
      params: RequestParams = {},
    ) =>
      this.request<OrderStep, any>({
        path: `/api/${version}/order_steps/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags order_steps
     * @name OrderStepsPartialUpdate
     * @request PATCH:/api/{version}/order_steps/{id}/
     * @secure
     * @response `200` `OrderStep`
     */
    orderStepsPartialUpdate: (
      id: string,
      version: string,
      data: PatchedOrderStepRequest,
      params: RequestParams = {},
    ) =>
      this.request<OrderStep, any>({
        path: `/api/${version}/order_steps/${id}/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags orders
     * @name OrdersList
     * @request GET:/api/{version}/orders/
     * @secure
     * @response `200` `PaginatedOrderList`
     */
    ordersList: (
      version: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number;
        /** The initial index from which to return the results. */
        offset?: number;
        /** Which field to use when ordering the results. */
        ordering?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedOrderList, any>({
        path: `/api/${version}/orders/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags orders
     * @name OrdersCreate
     * @request POST:/api/{version}/orders/
     * @secure
     * @response `201` `Order`
     */
    ordersCreate: (
      version: string,
      data: OrderRequest,
      params: RequestParams = {},
    ) =>
      this.request<Order, any>({
        path: `/api/${version}/orders/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags orders
     * @name OrdersRetrieve
     * @request GET:/api/{version}/orders/{id}/
     * @secure
     * @response `200` `Order`
     */
    ordersRetrieve: (id: string, version: string, params: RequestParams = {}) =>
      this.request<Order, any>({
        path: `/api/${version}/orders/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags orders
     * @name OrdersUpdate
     * @request PUT:/api/{version}/orders/{id}/
     * @secure
     * @response `200` `Order`
     */
    ordersUpdate: (
      id: string,
      version: string,
      data: OrderRequest,
      params: RequestParams = {},
    ) =>
      this.request<Order, any>({
        path: `/api/${version}/orders/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags orders
     * @name OrdersPartialUpdate
     * @request PATCH:/api/{version}/orders/{id}/
     * @secure
     * @response `200` `Order`
     */
    ordersPartialUpdate: (
      id: string,
      version: string,
      data: PatchedOrderRequest,
      params: RequestParams = {},
    ) =>
      this.request<Order, any>({
        path: `/api/${version}/orders/${id}/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags profile
     * @name ProfileRetrieve
     * @request GET:/api/{version}/profile/
     * @secure
     * @response `200` `ProfileSerializer`
     */
    profileRetrieve: (version: string, params: RequestParams = {}) =>
      this.request<ProfileSerializer, any>({
        path: `/api/${version}/profile/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags profile
     * @name ProfileUpdate
     * @request PUT:/api/{version}/profile/
     * @secure
     * @response `200` `ProfileSerializer`
     */
    profileUpdate: (version: string, params: RequestParams = {}) =>
      this.request<ProfileSerializer, any>({
        path: `/api/${version}/profile/`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags profile
     * @name ProfilePartialUpdate
     * @request PATCH:/api/{version}/profile/
     * @secure
     * @response `200` `ProfileSerializer`
     */
    profilePartialUpdate: (version: string, params: RequestParams = {}) =>
      this.request<ProfileSerializer, any>({
        path: `/api/${version}/profile/`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags referrals
     * @name ReferralsRetrieve
     * @request GET:/api/{version}/referrals/
     * @secure
     * @response `200` `Referral`
     */
    referralsRetrieve: (version: string, params: RequestParams = {}) =>
      this.request<Referral, any>({
        path: `/api/${version}/referrals/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requests
     * @name RequestsList
     * @request GET:/api/{version}/requests/
     * @secure
     * @response `200` `PaginatedRequestList`
     */
    requestsList: (
      version: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number;
        /** The initial index from which to return the results. */
        offset?: number;
        /** Which field to use when ordering the results. */
        ordering?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedRequestList, any>({
        path: `/api/${version}/requests/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requests
     * @name RequestsCreate
     * @request POST:/api/{version}/requests/
     * @secure
     * @response `201` `Request`
     */
    requestsCreate: (
      version: string,
      data: RequestRequest,
      params: RequestParams = {},
    ) =>
      this.request<Request, any>({
        path: `/api/${version}/requests/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requests
     * @name RequestsRetrieve
     * @request GET:/api/{version}/requests/{id}/
     * @secure
     * @response `200` `Request`
     */
    requestsRetrieve: (
      id: string,
      version: string,
      params: RequestParams = {},
    ) =>
      this.request<Request, any>({
        path: `/api/${version}/requests/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requests
     * @name RequestsUpdate
     * @request PUT:/api/{version}/requests/{id}/
     * @secure
     * @response `200` `Request`
     */
    requestsUpdate: (
      id: string,
      version: string,
      data: RequestRequest,
      params: RequestParams = {},
    ) =>
      this.request<Request, any>({
        path: `/api/${version}/requests/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requests
     * @name RequestsPartialUpdate
     * @request PATCH:/api/{version}/requests/{id}/
     * @secure
     * @response `200` `Request`
     */
    requestsPartialUpdate: (
      id: string,
      version: string,
      data: PatchedRequestRequest,
      params: RequestParams = {},
    ) =>
      this.request<Request, any>({
        path: `/api/${version}/requests/${id}/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requirements
     * @name RequirementsList
     * @request GET:/api/{version}/requirements/
     * @secure
     * @response `200` `PaginatedRequirementList`
     */
    requirementsList: (
      version: string,
      query?: {
        active?: boolean;
        biz_id?: string;
        cost?: number;
        from_city?: string;
        from_location?: string;
        /**
         * * `DOCUMENT` - DOCUMENT
         * * `CLOTH` - CLOTH
         * * `FOOD` - FOOD
         * * `ELECTRONIC_GADGET` - ELECTRONIC_GADGET
         * * `OTHER` - OTHER
         */
        item_types?: (
          | "CLOTH"
          | "DOCUMENT"
          | "ELECTRONIC_GADGET"
          | "FOOD"
          | "OTHER"
        )[];
        /** Number of results to return per page. */
        limit?: number;
        /** The initial index from which to return the results. */
        offset?: number;
        /** Which field to use when ordering the results. */
        ordering?: string;
        /**
         * * `TRAVELER` - TRAVELER
         * * `CUSTOMER` - CUSTOMER
         */
        role?: "CUSTOMER" | "TRAVELER";
        service?: string;
        /**
         * * `VISIBLE_LOAD` - VISIBLE_LOAD
         * * `DOCUMENT` - DOCUMENT
         */
        service_types?: ("DOCUMENT" | "VISIBLE_LOAD")[];
        to_city?: string;
        to_location?: string;
        /**
         * * `SHIPPING` - SHIPPING
         * * `SHOPPING` - SHOPPING
         */
        types?: ("SHIPPING" | "SHOPPING")[];
        weight?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedRequirementList, any>({
        path: `/api/${version}/requirements/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requirements
     * @name RequirementsCreate
     * @request POST:/api/{version}/requirements/
     * @secure
     * @response `201` `Requirement`
     */
    requirementsCreate: (
      version: string,
      data: RequirementRequest,
      params: RequestParams = {},
    ) =>
      this.request<Requirement, any>({
        path: `/api/${version}/requirements/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requirements
     * @name RequirementsRetrieve
     * @request GET:/api/{version}/requirements/{id}/
     * @secure
     * @response `200` `Requirement`
     */
    requirementsRetrieve: (
      id: string,
      version: string,
      params: RequestParams = {},
    ) =>
      this.request<Requirement, any>({
        path: `/api/${version}/requirements/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requirements
     * @name RequirementsUpdate
     * @request PUT:/api/{version}/requirements/{id}/
     * @secure
     * @response `200` `Requirement`
     */
    requirementsUpdate: (
      id: string,
      version: string,
      data: RequirementRequest,
      params: RequestParams = {},
    ) =>
      this.request<Requirement, any>({
        path: `/api/${version}/requirements/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requirements
     * @name RequirementsPartialUpdate
     * @request PATCH:/api/{version}/requirements/{id}/
     * @secure
     * @response `200` `Requirement`
     */
    requirementsPartialUpdate: (
      id: string,
      version: string,
      data: PatchedRequirementRequest,
      params: RequestParams = {},
    ) =>
      this.request<Requirement, any>({
        path: `/api/${version}/requirements/${id}/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requirements
     * @name RequirementsDestroy
     * @request DELETE:/api/{version}/requirements/{id}/
     * @secure
     * @response `204` `void` No response body
     */
    requirementsDestroy: (
      id: string,
      version: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/${version}/requirements/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags services
     * @name ServicesList
     * @request GET:/api/{version}/services/
     * @secure
     * @response `200` `PaginatedServiceList`
     */
    servicesList: (
      version: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number;
        /** The initial index from which to return the results. */
        offset?: number;
        /** Which field to use when ordering the results. */
        ordering?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedServiceList, any>({
        path: `/api/${version}/services/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags services
     * @name ServicesCreate
     * @request POST:/api/{version}/services/
     * @secure
     * @response `201` `Service`
     */
    servicesCreate: (
      version: string,
      data: ServiceRequest,
      params: RequestParams = {},
    ) =>
      this.request<Service, any>({
        path: `/api/${version}/services/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags services
     * @name ServicesRetrieve
     * @request GET:/api/{version}/services/{id}/
     * @secure
     * @response `200` `Service`
     */
    servicesRetrieve: (
      id: string,
      version: string,
      params: RequestParams = {},
    ) =>
      this.request<Service, any>({
        path: `/api/${version}/services/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags services
     * @name ServicesUpdate
     * @request PUT:/api/{version}/services/{id}/
     * @secure
     * @response `200` `Service`
     */
    servicesUpdate: (
      id: string,
      version: string,
      data: ServiceRequest,
      params: RequestParams = {},
    ) =>
      this.request<Service, any>({
        path: `/api/${version}/services/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags services
     * @name ServicesPartialUpdate
     * @request PATCH:/api/{version}/services/{id}/
     * @secure
     * @response `200` `Service`
     */
    servicesPartialUpdate: (
      id: string,
      version: string,
      data: PatchedServiceRequest,
      params: RequestParams = {},
    ) =>
      this.request<Service, any>({
        path: `/api/${version}/services/${id}/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags services
     * @name ServicesDestroy
     * @request DELETE:/api/{version}/services/{id}/
     * @secure
     * @response `204` `void` No response body
     */
    servicesDestroy: (
      id: string,
      version: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/${version}/services/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags stats
     * @name StatsVisitorsRetrieve
     * @request GET:/api/{version}/stats/visitors/
     * @secure
     * @response `200` `void` No response body
     */
    statsVisitorsRetrieve: (version: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/${version}/stats/visitors/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags subscribes
     * @name SubscribesCreate
     * @request POST:/api/{version}/subscribes/
     * @secure
     * @response `201` `Subscribe`
     */
    subscribesCreate: (
      version: string,
      data: SubscribeRequest,
      params: RequestParams = {},
    ) =>
      this.request<Subscribe, any>({
        path: `/api/${version}/subscribes/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags tickets
     * @name TicketsCreate
     * @request POST:/api/{version}/tickets/
     * @secure
     * @response `201` `Ticket`
     */
    ticketsCreate: (
      version: string,
      data: TicketRequest,
      params: RequestParams = {},
    ) =>
      this.request<Ticket, any>({
        path: `/api/${version}/tickets/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags trips
     * @name TripsList
     * @request GET:/api/{version}/trips/
     * @secure
     * @response `200` `PaginatedTripList`
     */
    tripsList: (
      version: string,
      query?: {
        active?: boolean;
        cost?: number;
        from_city?: string;
        from_location?: string;
        /** Number of results to return per page. */
        limit?: number;
        /** The initial index from which to return the results. */
        offset?: number;
        /** Which field to use when ordering the results. */
        ordering?: string;
        /**
         * * `TRAVELER` - TRAVELER
         * * `CUSTOMER` - CUSTOMER
         */
        role?: "CUSTOMER" | "TRAVELER";
        /**
         * * `VISIBLE_LOAD` - VISIBLE_LOAD
         * * `DOCUMENT` - DOCUMENT
         */
        service_types?: ("DOCUMENT" | "VISIBLE_LOAD")[];
        to_city?: string;
        to_location?: string;
        /**
         * * `SHIPPING` - SHIPPING
         * * `SHOPPING` - SHOPPING
         */
        type?: "SHIPPING" | "SHOPPING";
        weight?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedTripList, any>({
        path: `/api/${version}/trips/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags trips
     * @name TripsCreate
     * @request POST:/api/{version}/trips/
     * @secure
     * @response `201` `Trip`
     */
    tripsCreate: (
      version: string,
      data: TripRequest,
      params: RequestParams = {},
    ) =>
      this.request<Trip, any>({
        path: `/api/${version}/trips/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags trips
     * @name TripsRetrieve
     * @request GET:/api/{version}/trips/{id}/
     * @secure
     * @response `200` `Trip`
     */
    tripsRetrieve: (id: string, version: string, params: RequestParams = {}) =>
      this.request<Trip, any>({
        path: `/api/${version}/trips/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags trips
     * @name TripsUpdate
     * @request PUT:/api/{version}/trips/{id}/
     * @secure
     * @response `200` `Trip`
     */
    tripsUpdate: (
      id: string,
      version: string,
      data: TripRequest,
      params: RequestParams = {},
    ) =>
      this.request<Trip, any>({
        path: `/api/${version}/trips/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags trips
     * @name TripsPartialUpdate
     * @request PATCH:/api/{version}/trips/{id}/
     * @secure
     * @response `200` `Trip`
     */
    tripsPartialUpdate: (
      id: string,
      version: string,
      data: PatchedTripRequest,
      params: RequestParams = {},
    ) =>
      this.request<Trip, any>({
        path: `/api/${version}/trips/${id}/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags trips
     * @name TripsDestroy
     * @request DELETE:/api/{version}/trips/{id}/
     * @secure
     * @response `204` `void` No response body
     */
    tripsDestroy: (id: string, version: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/${version}/trips/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserDestroy
     * @request DELETE:/api/{version}/user/
     * @secure
     * @response `204` `void` No response body
     */
    userDestroy: (version: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/${version}/user/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user_documents
     * @name UserDocumentsCreate
     * @request POST:/api/{version}/user_documents/{uidb64}/{token}/
     * @secure
     * @response `200` `void` No response body
     */
    userDocumentsCreate: (
      token: string,
      uidb64: string,
      version: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/${version}/user_documents/${uidb64}/${token}/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user_locations
     * @name UserLocationsList
     * @request GET:/api/{version}/user_locations/
     * @secure
     * @response `200` `PaginatedUserLocationList`
     */
    userLocationsList: (
      version: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number;
        /** The initial index from which to return the results. */
        offset?: number;
        /** Which field to use when ordering the results. */
        ordering?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedUserLocationList, any>({
        path: `/api/${version}/user_locations/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user_locations
     * @name UserLocationsCreate
     * @request POST:/api/{version}/user_locations/
     * @secure
     * @response `201` `UserLocation`
     */
    userLocationsCreate: (
      version: string,
      data: UserLocationRequest,
      params: RequestParams = {},
    ) =>
      this.request<UserLocation, any>({
        path: `/api/${version}/user_locations/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user_locations
     * @name UserLocationsUpdate
     * @request PUT:/api/{version}/user_locations/
     * @secure
     * @response `200` `UserLocation`
     */
    userLocationsUpdate: (
      version: string,
      data: UserLocationRequest,
      params: RequestParams = {},
    ) =>
      this.request<UserLocation, any>({
        path: `/api/${version}/user_locations/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user_locations
     * @name UserLocationsPartialUpdate
     * @request PATCH:/api/{version}/user_locations/
     * @secure
     * @response `200` `UserLocation`
     */
    userLocationsPartialUpdate: (
      version: string,
      data: PatchedUserLocationRequest,
      params: RequestParams = {},
    ) =>
      this.request<UserLocation, any>({
        path: `/api/${version}/user_locations/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user_locations
     * @name UserLocationsRetrieve
     * @request GET:/api/{version}/user_locations/{id}/
     * @secure
     * @response `200` `UserLocation`
     */
    userLocationsRetrieve: (
      id: string,
      version: string,
      params: RequestParams = {},
    ) =>
      this.request<UserLocation, any>({
        path: `/api/${version}/user_locations/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user_locations
     * @name UserLocationsUpdate2
     * @request PUT:/api/{version}/user_locations/{id}/
     * @secure
     * @response `200` `UserLocation`
     */
    userLocationsUpdate2: (
      id: string,
      version: string,
      data: UserLocationRequest,
      params: RequestParams = {},
    ) =>
      this.request<UserLocation, any>({
        path: `/api/${version}/user_locations/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user_locations
     * @name UserLocationsPartialUpdate2
     * @request PATCH:/api/{version}/user_locations/{id}/
     * @secure
     * @response `200` `UserLocation`
     */
    userLocationsPartialUpdate2: (
      id: string,
      version: string,
      data: PatchedUserLocationRequest,
      params: RequestParams = {},
    ) =>
      this.request<UserLocation, any>({
        path: `/api/${version}/user_locations/${id}/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user_locations
     * @name UserLocationsDestroy
     * @request DELETE:/api/{version}/user_locations/{id}/
     * @secure
     * @response `204` `void` No response body
     */
    userLocationsDestroy: (
      id: string,
      version: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/${version}/user_locations/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersList
     * @request GET:/api/{version}/users/
     * @secure
     * @response `200` `PaginatedUserList`
     */
    usersList: (
      version: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number;
        /** The initial index from which to return the results. */
        offset?: number;
        /** Which field to use when ordering the results. */
        ordering?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedUserList, any>({
        path: `/api/${version}/users/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersCreate
     * @request POST:/api/{version}/users/
     * @secure
     * @response `201` `User`
     */
    usersCreate: (
      version: string,
      data: UserRequest,
      params: RequestParams = {},
    ) =>
      this.request<User, any>({
        path: `/api/${version}/users/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description OpenApi3 schema for this API. Format can be selected via content negotiation. - YAML: application/vnd.oai.openapi - JSON: application/vnd.oai.openapi+json
     *
     * @tags schema
     * @name SchemaRetrieve
     * @request GET:/api/schema/
     * @secure
     * @response `200` `Record<string, any>`
     */
    schemaRetrieve: (
      query?: {
        format?: "json" | "yaml";
        lang?:
          | "af"
          | "ar"
          | "ar-dz"
          | "ast"
          | "az"
          | "be"
          | "bg"
          | "bn"
          | "br"
          | "bs"
          | "ca"
          | "ckb"
          | "cs"
          | "cy"
          | "da"
          | "de"
          | "dsb"
          | "el"
          | "en"
          | "en-au"
          | "en-gb"
          | "eo"
          | "es"
          | "es-ar"
          | "es-co"
          | "es-mx"
          | "es-ni"
          | "es-ve"
          | "et"
          | "eu"
          | "fa"
          | "fi"
          | "fr"
          | "fy"
          | "ga"
          | "gd"
          | "gl"
          | "he"
          | "hi"
          | "hr"
          | "hsb"
          | "hu"
          | "hy"
          | "ia"
          | "id"
          | "ig"
          | "io"
          | "is"
          | "it"
          | "ja"
          | "ka"
          | "kab"
          | "kk"
          | "km"
          | "kn"
          | "ko"
          | "ky"
          | "lb"
          | "lt"
          | "lv"
          | "mk"
          | "ml"
          | "mn"
          | "mr"
          | "ms"
          | "my"
          | "nb"
          | "ne"
          | "nl"
          | "nn"
          | "os"
          | "pa"
          | "pl"
          | "pt"
          | "pt-br"
          | "ro"
          | "ru"
          | "sk"
          | "sl"
          | "sq"
          | "sr"
          | "sr-latn"
          | "sv"
          | "sw"
          | "ta"
          | "te"
          | "tg"
          | "th"
          | "tk"
          | "tr"
          | "tt"
          | "udm"
          | "ug"
          | "uk"
          | "ur"
          | "uz"
          | "vi"
          | "zh-hans"
          | "zh-hant";
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, any>({
        path: `/api/schema/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
