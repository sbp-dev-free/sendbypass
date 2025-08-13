import { TimePicker as MuiTimePicker } from "@mui/x-date-pickers";

import { Icon } from "../Icon";

import { TimePickerProps } from "./types";
const generateUniqueId = () =>
  `time-picker-${Math.random().toString(36).substring(2, 9)}`;

export const TimePicker = (props: TimePickerProps) => {
  const pickerId = generateUniqueId();

  const openPicker = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    if (
      target.closest('[class*="MuiClock-"]') ||
      target.closest('[role="dialog"]')?.contains(target)
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
      <MuiTimePicker
        {...props}
        timeSteps={{ minutes: 1 }}
        ampm={false}
        slots={{
          openPickerIcon: () => <Icon name="Circle Clock" />,
          actionBar: () => <></>,
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
        }}
      />
    </div>
  );
};
