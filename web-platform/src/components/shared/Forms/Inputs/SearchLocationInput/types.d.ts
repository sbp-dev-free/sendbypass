import type {
  Path,
  UseFormRegister,
  UseFormRegisterReturn,
} from "react-hook-form";

import { LOCATION_TYPE } from "@/enums/location";

export interface SearchLocationInputProps {
  label: string | React.ReactNode;
  registerProps: UseFormRegisterReturn;
  error?: string;
  handleSetValue: (v: Option | null) => void;
  value: Option | null;
}

export interface Option {
  id: number;
  value?: string;
  label: { country: string; city: string; airport: string };
  type: keyof typeof LOCATION_TYPE;
}
