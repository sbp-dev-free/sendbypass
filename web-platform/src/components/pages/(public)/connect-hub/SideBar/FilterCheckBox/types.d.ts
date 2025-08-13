import { ChangeEvent } from "react";

export interface FilterCheckBoxProps {
  id: string;
  label: string;
  count?: number;
  checked?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}
