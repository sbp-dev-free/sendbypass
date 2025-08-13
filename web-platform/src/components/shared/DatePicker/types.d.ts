import {
  type DatePickerProps as MuiDatePickerProps,
  type PickerValidDate,
} from "@mui/x-date-pickers";

export type DatePickerProps<TDate extends PickerValidDate = PickerValidDate> =
  MuiDatePickerProps<TDate> & { label?: string };
