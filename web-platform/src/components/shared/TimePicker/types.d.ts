import type { TimePickerProps as MuiTimePickerProps } from "@mui/x-date-pickers";

export type TimePickerProps<TDate extends PickerValidDate = PickerValidDate> =
  MuiTimePickerProps<TDate> & {};
