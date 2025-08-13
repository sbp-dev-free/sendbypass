"use client";

import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";

import { DEFAULT_CURRENCY } from "@/utils";

import { TitleWrapper } from "../TitleWrapper";

export const SectionReward = () => {
  const { control } = useFormContext();
  return (
    <TitleWrapper
      title="Reward"
      subtitle="Set the amount you’re offering for the delivery service."
    >
      <Controller
        control={control}
        name="proposedPrice"
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Proposed Price ✱"
            className="w-full text-on-surface-variant"
            size="medium"
            error={!!error?.message}
            helperText={error?.message}
            autoComplete="off"
            slotProps={{
              input: {
                endAdornment: (
                  <span className="text-body-medium text-outline">
                    {DEFAULT_CURRENCY.code}
                  </span>
                ),
              },
            }}
          />
        )}
      />
    </TitleWrapper>
  );
};
