import { BaseComponentProps } from "../../types";

export interface BottomSheetProps extends BaseComponentProps {
  open: boolean;
  toggle: (value?: boolean) => void;
  initialHeight?: number | string;
  sheetClassName?: string;
}
