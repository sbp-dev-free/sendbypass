export interface WebviewContainerProps {
  currentRoute: `/${string}`;
  handleToggleBottomSheet: (value: boolean) => void;
  handleNavigate: (route: `/${string}`) => void;
}
