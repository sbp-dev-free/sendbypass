import { BaseComponentProps } from "@/components/types";
import { LOCATION_TYPE } from "@/enums/location";

export type SearchHistoryItem = {
  from: Option;
  to: Option;
  tab: string;
};
export interface SearchBoxProps {
  onTabChange: (value: string) => void;
}

export interface HeroBannerProps {
  activeTabIndex: 0 | 1 | 2;
}
