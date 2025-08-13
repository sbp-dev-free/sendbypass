import { Stats } from "@/services/types";
import { BusinessProfile, Profile } from "@/types";

export interface ProfileResponse extends Profile, BusinessProfile {
  register_time: string;
  addresses: Address[];
  socials: Social[];
  phone_number: PhoneNumber;
  email: string;
  stats: Stats;
  first_name: string;
  last_name: string;
  image: string;
  id: number;
  bio: string;
  background: string;
  website?: string;
  current_location: number;
  speak_languages: string[];
  status: string;
  type: string;
  name?: string;
  incomplete: boolean;
  founded_at?: string;
  biz_category?: string;
  biz_id?: string;
  tagline?: string;
  main_link?: Social;
  agent?: any;
}

export interface Address {
  city: string;
  longitude: number;
  latitude: number;
  id: number;
  country_iso2: string;
  country_iso3: string;
  country: string;
  district: string;
  area: string;
  zone: string;
  description: string;
}

export interface PhoneNumber {
  zone_code: ZoneCode;
  phone: string;
  socials: any[];
}

export interface ZoneCode {
  country: string;
  zip_code: string;
}

export interface Social {
  type: string;
  link: string;
  id?: number;
}

export interface ProfilePatchBody extends Partial<BusinessProfile> {
  first_name: string;
  last_name: string;
  bio: string;
  image: string | File | null;
  background: string | File | null;
  speak_languages: string[];
  type?: string;
}

export interface TransformedBusinessProfile extends BusinessProfile {
  stats: Stats;
  phone_number: PhoneNumber;
  agent: any;
  detail?: string;
}
