"use client";
import { useMemo } from "react";

export const useFilteredMenuItems = (
  profileType: string,
  PROFILE_MENU_ITEMS_DESKTOP: {
    id: number | string;
    icon: string;
    label: string;
    href: string;
    badge?: JSX.Element;
  }[],
) => {
  const filteredMenuItems = useMemo(() => {
    return PROFILE_MENU_ITEMS_DESKTOP.filter((item) => {
      return !(item.label === "Trips" && profileType === "BUSINESS");
    });
  }, [profileType, PROFILE_MENU_ITEMS_DESKTOP]);

  return filteredMenuItems;
};
