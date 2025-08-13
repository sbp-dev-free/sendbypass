import { BaseComponentProps } from "@/components/types";

export interface RoundedTabListProps extends BaseComponentProps {
  value?: string;
  onChange?: (value: string) => void;
}

export interface TabProps extends BaseComponentProps {
  value: string;
  className?: string;
  "data-active"?: string;
  onClick?: () => void;
}
