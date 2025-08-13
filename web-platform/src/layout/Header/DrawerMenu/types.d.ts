import { BaseComponentProps } from "@/components/types";
import { MOBILE_MENU_ITEMS } from "@/constants/globals";

export interface MenuItemProps extends BaseComponentProps {
  item: (typeof MOBILE_MENU_ITEMS)[0];
}
export interface DrawerMenuProps {
  openNeedTypeModal: () => void;
  handleToggleMenu: () => void;
}
