"use client";

import { useEffect } from "react";

import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";

import { Icon } from "@/components";

import { TitleWrapper } from "../TitleWrapper";

import { DocumentFields } from "./DocumentFields";
import { SectionDimensionProps } from "./types";

export const SectionDimension = ({ type }: SectionDimensionProps) => {
  const { control, watch, clearErrors, setValue } = useFormContext();
  const isFlexible = watch("dimension.isFlexible") || false;
  const loadType = watch("loadType");
  const isDocumentType = loadType?.value === "DOCUMENT" && type === "shipping";
  const fields = [
    { key: "weight", label: "Weight", endAdornment: "kg", disabled: false },
    {
      key: "width",
      label: "Width",
      endAdornment: "cm",
      disabled: isFlexible,
    },
    {
      key: "length",
      label: "Length",
      endAdornment: "cm",
      disabled: isFlexible,
    },
    {
      key: "height",
      label: "Height",
      endAdornment: "cm",
      disabled: isFlexible,
    },
  ];
  useEffect(() => {
    if (isFlexible) {
      clearErrors(["dimension.width", "dimension.height", "dimension.length"]);
      setValue("dimension.width", "");
      setValue("dimension.height", "");
      setValue("dimension.length", "");
    }
    if (isDocumentType) {
      setValue("dimension.weight", "0");
      clearErrors("dimension.weight");
    }
  }, [isFlexible, isDocumentType, clearErrors, setValue]);

  return (
    <TitleWrapper
      title={
        <span>
          Dimension{" "}
          <span className="text-on-surface-variant text-label-medium">
            {"(optional)"}
          </span>
        </span>
      }
      extraRender={
        !isDocumentType && (
          <div className="flex gap-16 justify-between items-center">
            <label
              htmlFor="flexibleDimension"
              className="flex items-center text-on-surface text-label-large"
            >
              Flexible Dimension
              <Icon name="info-circle" className="text-[20px] pl-2" />
            </label>
            <Controller
              control={control}
              name="dimension.isFlexible"
              defaultValue={false}
              render={({ field }) => (
                <Switch
                  id="flexibleDimension"
                  checked={field.value}
                  onChange={(_, checked) => field.onChange(checked)}
                />
              )}
            />
          </div>
        )
      }
      subtitle='Enter the weight and size of the item. Enable "Flexible Dimension" if values can vary.'
    >
      <div
        className={`grid grid-cols-1 gap-16 mb-24 ${isDocumentType ? "md:grid-cols-2" : "md:grid-cols-4"}`}
      >
        {isDocumentType ? (
          <DocumentFields />
        ) : (
          fields.map(({ key, label, endAdornment, disabled }) => (
            <Controller
              key={key}
              control={control}
              name={`dimension.${key}`}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label={label}
                  className="text-on-surface-variant"
                  size="medium"
                  error={!!error?.message}
                  helperText={error?.message}
                  autoComplete="off"
                  disabled={disabled}
                  type="number"
                  slotProps={{
                    input: {
                      endAdornment: endAdornment && (
                        <span className="text-body-medium text-outline">
                          {endAdornment}
                        </span>
                      ),
                    },
                  }}
                />
              )}
            />
          ))
        )}
      </div>
    </TitleWrapper>
  );
};
