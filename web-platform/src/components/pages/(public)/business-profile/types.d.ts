import { ReactElement } from "react";

import { TransformedBusinessProfile } from "@/services/profile/types";
import { BusinessProfile, Profile } from "@/types";

export interface businessProfilePageProps {
  profile: TransformedBusinessProfile;
}
export interface BusinessProfileTabsProps {
  tabComponents: {
    [key in TabKey]?: ReactElement;
  };
}
