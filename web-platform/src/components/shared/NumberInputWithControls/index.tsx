"use client";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";

import { Icon } from "@/components";

import { NumberInputWithControlsProps } from "./types";

export const NumberInputWithControls = ({
  name,
  label,
  minValue = 1,
  defaultValue,
}: NumberInputWithControlsProps) => {
  const { control, watch, setValue } = useFormContext();

  const handleValueChange = (change: number) => {
    const currentValue = watch(name) || minValue;
    const newValue = Math.max(minValue, Number(currentValue) + change);
    setValue(name, newValue);
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue || minValue}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col w-full">
          <TextField
            {...field}
            label={label}
            className="text-on-surface-variant"
            size="medium"
            error={!!error?.message}
            helperText={error?.message}
            type="number"
            value={field.value}
            onChange={(e) => {
              const parsedValue = parseInt(e.target.value);
              field.onChange(isNaN(parsedValue) ? "" : parsedValue);
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <>
                    <div className="flex items-center justify-center gap-4">
                      <IconButton
                        onClick={() => handleValueChange(-1)}
                        color="standard"
                        className="!w-[22px] !h-[22px] !rounded-full"
                      >
                        <Icon
                          name="minus-2"
                          className="text-on-surface text-[24px]"
                        />
                      </IconButton>
                      <IconButton
                        onClick={() => handleValueChange(1)}
                        color="standard"
                        className="!w-[22px] !h-[22px] !rounded-full"
                      >
                        <Icon
                          name="plus-2"
                          className="text-on-surface  text-[24px]"
                        />
                      </IconButton>
                    </div>
                  </>
                ),
              },
            }}
          />
        </div>
      )}
    />
  );
};
