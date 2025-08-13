import { Option } from "@/components/shared/LocationAutocomplete/types";

export interface SearchBoxProps {
  currentTab: string;
  handleChangeTab: (tab: string, shouldNavigate?: boolean) => void;
  from: Option | null;
  to: Option | null;
  setFrom: (from: Option | null) => void;
  setTo: (to: Option | null) => void;
}

export interface SearchBoxModalProps extends SearchBoxProps {
  toggle: () => void;
}
