import { LOCATION_TYPE } from "@/enums/location";

type LocationType = Exclude<keyof typeof LOCATION_TYPE, "GENERIC">;
export interface LocationParams {
  city: string;
  country: string;
  limit: number;
  offset: number;
  ordering: string;
  query: string;
  type: LocationType;
  tag: string;
  object_name: string;
}

export interface LocationsPaginatedResponse {
  next: string;
  previous: string;
  results: LocationResponse[];
}

export interface LocationResponse {
  city: string;
  longitude: number;
  latitude: number;
  id: number;
  country_iso2: string;
  country_iso3: string;
  country: string;
  description: null;
  type: LocationType;
  tag: string;
  related_object: RelatedObject;
}

export interface RelatedObject {
  type: LocationType;
  iata_code: string;
  website: string;
  airport_code: string;
  name: string;
  zip_code: number;
}
