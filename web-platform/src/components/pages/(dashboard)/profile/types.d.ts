import { ClassValue } from "clsx";

import { ProfileCompletionTab } from "@/hooks";
import {
  ProfileResponse,
  TransformedBusinessProfile,
} from "@/services/profile/types";
import { BusinessProfile } from "@/types";

export interface EmptyStateProps {
  title: string;
}

export interface CurrentAddressFormProps {
  onClose: () => void;
}

export interface MoreMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  handleClose: () => void;
  handleClickMoreItem: (id: number) => void;
  businessProfile?: boolean;
}

export interface ProfileProcessProps {
  profile?: ProfileResponse | TransformedBusinessProfile;
  className?: ClassValue;
  onClick?: () => void;
}

export interface ProfileItemProps {
  title: string;
  status: "complete" | "incomplete";
  className?: ClassValue;
  onClick?: () => void;
}

export interface ProfileStatusDrawerProps {
  profile?: ProfileResponse | TransformedBusinessProfile;
  onClose: (tab: ProfileCompletionTab["tab"]) => void;
}
export interface TopSectionProps {
  step: number;
  title: string;
  subtitle: string;
  className?: ClassValue;
  max: number;
}
