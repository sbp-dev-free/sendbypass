import { ClassValue } from "clsx";

import { BaseComponentProps } from "../../types";

export interface TabListProps extends BaseComponentProps {
  value?: string;
  onChange?: (value: string) => void;
}

export interface TabProps extends BaseComponentProps {
  isSelected?: boolean;
  icon?: string;
  value: string;
  className?: string;
  onClick?: () => void;
  classes?: { icon?: ClassValue };
}
