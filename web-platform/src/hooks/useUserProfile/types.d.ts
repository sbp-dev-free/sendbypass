import { TransformedBusinessProfile } from "@/services/profile/types";
import { UserData } from "@/services/types";

export interface UseUserProfileModal {
  id?: number;
  user?: UserData;
}
export interface BusinessUserProfileModalProps {
  id?: number;
  user?: TransformedBusinessProfile;
}

export interface ProfileModalProps {
  id?: number;
  user?: UserData | TransformedBusinessProfile;
}

export interface UseUserProfileModalResult {
  isOpen: boolean;
  toggleProfile: () => void;
  UserProfile: JSX.Element;
}
