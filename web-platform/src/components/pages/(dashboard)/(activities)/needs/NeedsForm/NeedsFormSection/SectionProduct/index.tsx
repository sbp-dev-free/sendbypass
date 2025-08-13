"use client";

import { useMemo } from "react";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { usePathname } from "next/navigation";
import { Controller, useFormContext } from "react-hook-form";

import { LOAD_TYPE_SELECT_ITEMS } from "@/constants";
import { DEFAULT_CURRENCY } from "@/utils";

import { TitleWrapper } from "../TitleWrapper";

import { SectionProductProps } from "./types";

export const SectionProduct = ({ type }: SectionProductProps) => {
  const { control, setValue, trigger } = useFormContext();

  const pathname = usePathname();
  const isEditMode = useMemo(() => {
    const lastSegment = pathname.split("/").at(-1);
    return lastSegment !== "create";
  }, [pathname]);

  return (
    <TitleWrapper
      title="Product"
      subtitle="Provide the item's name, price, and optional link for more details"
    >
      <div className="grid grid-cols-1 gap-x-16 gap-y-16 mb-24 md:grid-cols-4">
        <Controller
          control={control}
          name="productName"
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Product Name ✱"
              className={`text-on-surface-variant ${type === "shipping" ? "md:col-span-3" : "md:col-span-1"}`}
              size="medium"
              error={!!error?.message}
              autoComplete="off"
              helperText={
                error?.message ||
                "Provide a clear and concise name for the product."
              }
            />
          )}
        />

        {type === "shopping" && (
          <>
            <Controller
              control={control}
              name="productPrice"
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Product Price ✱"
                  className="text-on-surface-variant"
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

            <Controller
              control={control}
              name="productLink"
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Product Link"
                  className="text-on-surface-variant"
                  size="medium"
                  error={!!error?.message}
                  helperText={error?.message}
                  autoComplete="off"
                />
              )}
            />
          </>
        )}

        <Controller
          control={control}
          name="loadType"
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              {...field}
              onChange={(_, newValue) => {
                setValue("loadType", newValue);
                trigger("loadType");
              }}
              options={LOAD_TYPE_SELECT_ITEMS}
              disabled={isEditMode}
              renderInput={(props) => (
                <TextField
                  {...props}
                  label="Load Type ✱"
                  helperText={error?.message}
                  error={!!error?.message}
                />
              )}
            />
          )}
        />
      </div>
    </TitleWrapper>
  );
};
