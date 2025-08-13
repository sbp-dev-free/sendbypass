import { usePathname } from "next/navigation";

import { Icon } from "@/components";
import { BOTTOM_NAVIGATION_ITEMS } from "@/constants/globals";
import { useFilteredMenuItems } from "@/hooks";
import { useProfileQuery } from "@/services/profile";
import { getToken } from "@/utils";

import { NavItem } from "./NavItem";

export const BottomNavigation = () => {
  const pathname = usePathname();
  const token = getToken("access");

  const { data: profile } = useProfileQuery(undefined, { skip: !token });

  const menuItems = useFilteredMenuItems(
    profile?.type ?? "PERSONAL",
    BOTTOM_NAVIGATION_ITEMS,
  );
  return (
    <div className="flex fixed right-0 bottom-0 left-0 z-50 items-center px-8 md:hidden bg-surface-container-low">
      {menuItems.map((item) => (
        <NavItem
          key={item.id}
          label={item.label}
          href={item.href ?? ""}
          isActive={pathname === item.href}
        >
          <Icon
            name={item.icon}
            className={`text-[24px] px-20 py-4 rounded-full ${
              pathname === item.href
                ? "bg-primary-container"
                : "text-on-surface-variant"
            }`}
          />
        </NavItem>
      ))}
    </div>
  );
};
