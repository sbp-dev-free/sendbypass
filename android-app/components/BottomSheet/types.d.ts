import { INavbarItem } from '../Navbar/types';

export interface BottomSheetProps {
  handleNavigate: (route: `/${string}`) => void;
  isOpen: boolean;
  handleToggleBottomSheet: (value: boolean) => void;
}

export interface NavLinkProps {
  item: INavbarItem;
  onPress: () => void;
}
