export interface NavbarItemProps {
  isActive: boolean;
  item: INavbarItem;
  handleNavigate: (route: `/${string}`) => void;
}

export interface INavbarItem {
  key: string;
  title: string;
  route: `/${string}`;
  icon: string;
}

export interface NavbarProps {
  currentRoute: `/${string}`;
  handleToggleBottomSheet: (value: boolean) => void;
  handleNavigate: (route: `/${string}`) => void;
}
