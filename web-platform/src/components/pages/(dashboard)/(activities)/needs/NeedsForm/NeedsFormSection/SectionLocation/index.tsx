"use client";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { usePathname } from "next/navigation";
import { Controller, useFormContext } from "react-hook-form";

import { DatePicker, LocationAutocomplete } from "@/components";

import { TitleWrapper } from "../TitleWrapper";

export const SectionLocation = () => {
  const { control } = useFormContext();
  const pathName = usePathname();
  const isShopping = pathName.split("/").includes("shopping");

  return (
    <TitleWrapper
      title="Location"
      subtitle="Specify the origin and destination cities, and add a delivery due date."
    >
      <div className="grid grid-cols-1 gap-16 mb-24 md:grid-cols-3">
        <Controller
          control={control}
          name="origin"
          render={({ field, fieldState: { error } }) => (
            <LocationAutocomplete
              {...field}
              includeAnyLocationOption={isShopping}
              placeholder="Origin ✱"
              onChange={(val) => {
                field.onChange(val);
              }}
              error={!!error?.message}
              helperText={error?.message}
              className="md:w-full"
            />
          )}
        />

        <Controller
          control={control}
          name="destination"
          render={({ field, fieldState: { error } }) => (
            <LocationAutocomplete
              {...field}
              placeholder="Destination ✱"
              onChange={(val) => {
                field.onChange(val);
              }}
              includeAnyLocationOption={false}
              error={!!error?.message}
              helperText={error?.message}
              className="md:w-full"
            />
          )}
        />

        <Controller
          control={control}
          name="douDate"
          render={({ field: { value, ...field } }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                {...field}
                label="Due date"
                className="w-full"
                onChange={(date) => field.onChange(date?.toDate() || null)}
                value={value ? dayjs(value) : null}
              />
            </LocalizationProvider>
          )}
        />
      </div>
    </TitleWrapper>
  );
};
