import { LOCATION_TYPE } from "@/enums/location";
import { LocationResponse } from "@/services/locations/read/types";

export interface Option {
  id: number;
  value?: string;
  label: { country: string; city: string; airport: string };
  type: keyof typeof LOCATION_TYPE;
  zip_code?: number;
  tag?: string;
}

type LocationType = Exclude<keyof typeof LOCATION_TYPE, "GENERIC">;

export interface AutoCompleteLocationProps {
  type?: LocationType;
  value: Option | null;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  className?: string;
  showZipCode?: boolean;
  valueKey?: keyof LocationResponse;
  tag?: string;
  countryTag?: string;
  isLoading?: boolean;
  onChange: (value: Option | null) => void;
  includeAnyLocationOption?: boolean;
  disabled?: boolean;
}
