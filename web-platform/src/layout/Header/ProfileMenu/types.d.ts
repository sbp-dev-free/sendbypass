import { ReactNode } from "react";

import { ProfileResponse } from "@/services/profile/types";

export interface LoggedInMenuProps {
  profile: ProfileResponse;
}

export interface MenuItemProps {
  badge?: ReactNode;
  href: string;
  label: string;
  icon: string;
  onClick: () => void;
  hoverIcon?: string;
  isLastItem?: boolean;
  showIconAlways?: boolean;
}
