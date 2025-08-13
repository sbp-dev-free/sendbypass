"use client";

import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";

import { TitleWrapper } from "../TitleWrapper";

export const SectionDescription = () => {
  const { control } = useFormContext();

  return (
    <TitleWrapper
      title={
        <span>
          Description{" "}
          <span className="text-on-surface-variant text-label-medium">
            {"(optional)"}
          </span>
        </span>
      }
      subtitle="Add extra details or special instructions for the item."
      className="lg:col-span-2"
    >
      <Controller
        control={control}
        name="description"
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            className="w-full"
            label="Description"
            size="medium"
            error={!!error?.message}
            helperText={error?.message}
            autoComplete="off"
            multiline
            slotProps={{
              input: {
                endAdornment: (
                  <span className="text-body-medium text-outline">
                    {field.value?.length || 0}/200
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
