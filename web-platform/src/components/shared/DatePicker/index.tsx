"use client";

import {
  ArrowLeftIcon,
  DatePicker as MuiDatePicker,
} from "@mui/x-date-pickers";

import { Icon } from "../Icon";

import { DatePickerProps } from "./types";
const generateUniqueId = () =>
  `date-picker-${Math.random().toString(36).substring(2, 9)}`;

export const DatePicker = (props: DatePickerProps) => {
  const pickerId = generateUniqueId();

  const openPicker = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    if (
      target.closest('button[class*="MuiPickersArrowSwitcher"]') ||
      target.closest('button[class*="switchView"]') ||
      target.closest('[class*="MuiPickersDay"]') ||
      target.closest('[class*="MuiPickersMonth"]') ||
      target.closest('[class*="MuiPickersYear"]')
    ) {
      return;
    }

    const pickerElement = document.getElementById(pickerId);
    if (pickerElement) {
      const button = pickerElement.querySelector("button");
      if (button) button.click();
    }
  };
  return (
    <div id={pickerId} onClick={openPicker} style={{ cursor: "pointer" }}>
      <MuiDatePicker
        {...props}
        slots={{
          openPickerIcon: () => <Icon name="Calendar" />,
          switchViewIcon: () => <ArrowLeftIcon className="-rotate-90" />,
        }}
        slotProps={{
          openPickerButton: {
            sx: {
              background: "transparent",
              color: "rgb(var(--on-surface-variant))",
              "&:hover": {
                background: "none",
              },
            },
          },
          nextIconButton: {
            sx: {
              background: "transparent",
              color: "rgb(var(--on-surface-variant))",
              "&:hover": {
                background: "none",
              },
            },
          },
          previousIconButton: {
            sx: {
              background: "transparent",
              color: "rgb(var(--on-surface-variant))",
              "&:hover": {
                background: "none",
              },
            },
          },
          switchViewButton: {
            sx: {
              background: "transparent",
              color: "rgb(var(--on-surface-variant))",
              "&:hover": {
                background: "none",
              },
            },
          },
        }}
      />
    </div>
  );
};
