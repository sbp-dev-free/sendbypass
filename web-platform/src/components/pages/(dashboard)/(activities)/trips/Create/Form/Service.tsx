"use client";
import { useEffect, useState } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { Controller, useForm } from "react-hook-form";

import { Icon } from "@/components";
import { DEFAULT_CURRENCY } from "@/utils";
import { serviceSchema } from "@/validations/trip";

import { ServicePropsType } from "./types";

export const Service = ({ type, services, setService }: ServicePropsType) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const {
    control,
    setValue,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      maxWeight: "",
      fee: "",
      description: "",
    },
    mode: "onChange",
  });

  const underOneKg = "< 1";
  const maxWeightValue = watch("maxWeight");
  const feeValue = watch("fee");

  const tripType =
    type === "Cargo" || type === "DOCUMENT" ? "shipping" : "shopping";
  const serviceType =
    type === "Cargo"
      ? "shipping:visible_load"
      : `${tripType}:${type === "SHOPPING" ? "visible_load" : "document"}`;

  useEffect(() => {
    setValue(
      "maxWeight",
      Number(services?.[serviceType]?.properties?.weight) === 0
        ? underOneKg
        : services?.[serviceType]?.properties?.weight || "",
    );
    setValue("fee", services?.[serviceType]?.cost?.wage || "");
    setValue("description", services?.[serviceType]?.description || "");
  }, [services, serviceType, setValue]);

  const handleApply = () => {
    const values = {
      maxWeight: watch("maxWeight"),
      fee: watch("fee"),
      description: watch("description"),
    };

    if (values.maxWeight === underOneKg) {
      values.maxWeight = "0";
    }

    const result = serviceSchema.safeParse(values);
    if (!result.success) {
      result.error.errors.forEach((error) => {
        setError(error.path[0] as keyof typeof values, {
          type: "manual",
          message: error.message,
        });
      });
      return;
    }
    clearErrors();

    const service = {
      type: tripType.toUpperCase(),
      properties: {
        type:
          type === "SHOPPING" || type === "Cargo" ? "VISIBLE_LOAD" : "DOCUMENT",
        weight: values.maxWeight,
      },
      cost: { wage: values.fee },
      description: values.description,
    };

    setService({
      ...services,
      [serviceType]: service,
    });
    setExpanded(false);
  };

  const handleResetForm = () => {
    reset();
    setExpanded(false);
    const filteredServices = { ...services };
    delete filteredServices[serviceType];
    setService(filteredServices);
  };

  const handleAccordionChange = () => {
    setExpanded((prev) => !prev);
  };

  const ExpandIcon = ({ expanded }: { expanded: boolean }) => (
    <div className="flex justify-center items-center w-40 h-40 rounded-small bg-surface-container-high">
      <Icon
        name="plus"
        className={`text-[24px] text-primary transition-transform duration-300 ${
          expanded ? "rotate-45" : ""
        }`}
      />
    </div>
  );

  return (
    <Accordion expanded={expanded} onChange={handleAccordionChange}>
      <AccordionSummary
        expandIcon={<ExpandIcon expanded={expanded} />}
        aria-controls="service-content"
        id="service-header"
        className="px-0"
      >
        <div className="flex items-center">
          {type === "DOCUMENT" && (
            <Icon
              name="Document 2 lines"
              className="text-[24px] text-on-surface-variant"
            />
          )}
          {type === "Cargo" && (
            <Icon name="bag" className="text-[24px] text-on-surface-variant" />
          )}
          {type === "SHOPPING" && (
            <Icon
              name="shopping bag remove"
              className="text-[24px] text-on-surface-variant"
            />
          )}
          <span className="ml-8 capitalize text-label-large text-on-surface">
            {type?.toLowerCase()}
          </span>
          <div className="flex flex-col gap-4 md:gap-0 md:flex-row ms-40 md:ms-0">
            {maxWeightValue && (
              <div className="md:ml-40 text-label-medium text-on-surface">
                Max weight:{" "}
                {Number(maxWeightValue) === 0 ? underOneKg : maxWeightValue}
                <span className="ml-2 text-label-small text-outline inline-block transform translate-y-[2px]">
                  kg
                </span>
              </div>
            )}
            {feeValue && (
              <div className="md:ml-20 text-label-medium text-on-surface">
                Fee: {feeValue} {DEFAULT_CURRENCY.symbol}
                <span className="ml-2 text-label-small text-outline inline-block transform translate-y-[2px]">
                  {type === "DOCUMENT" ? "Per box" : "Per kilo"}
                </span>
              </div>
            )}
          </div>
        </div>
      </AccordionSummary>

      <AccordionDetails>
        <div className="grid grid-cols-1 gap-y-12 md:gap-x-[10px] md:grid-cols-6 py-16">
          {type === "DOCUMENT" ? (
            <Controller
              name="maxWeight"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  value={
                    field.value
                      ? { label: field.value, value: field.value }
                      : null
                  }
                  options={[{ label: underOneKg, value: underOneKg }]}
                  getOptionLabel={(option) => {
                    if (typeof option === "string") return option;
                    if (!option) return "";
                    return String(option.label || "");
                  }}
                  freeSolo
                  onInputChange={(event, newInputValue) =>
                    field.onChange(newInputValue)
                  }
                  onChange={(event, newValue) =>
                    field.onChange(
                      typeof newValue === "object" && newValue !== null
                        ? newValue.value
                        : "",
                    )
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className="md:col-span-1"
                      label="Max Weight"
                      autoComplete="off"
                      fullWidth
                      error={!!errors.maxWeight}
                      helperText={errors.maxWeight?.message}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <InputAdornment position="end">kg</InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              )}
            />
          ) : (
            <Controller
              name="maxWeight"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="md:col-span-1"
                  label="Max Weight(kg)"
                  fullWidth
                  autoComplete="off"
                  type="number"
                  error={!!errors.maxWeight}
                  helperText={errors.maxWeight?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">kg</InputAdornment>
                    ),
                  }}
                />
              )}
            />
          )}

          <Controller
            name="fee"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="md:col-span-1"
                label={`Fee(${DEFAULT_CURRENCY.symbol})`}
                fullWidth
                autoComplete="off"
                error={!!errors.fee}
                helperText={errors.fee?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <span className="text-outline text-body-medium">
                        {type === "DOCUMENT" ? "Per box" : "Per kilo"}
                      </span>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                autoComplete="off"
                error={!!errors.description}
                helperText={errors.description?.message}
                className="md:col-span-4"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <span className="text-outline text-body-medium">
                        {field.value?.length || 0}/200
                      </span>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </div>

        <div className="flex gap-8 justify-between md:justify-end">
          <Button
            variant="text"
            className="w-full lg:w-auto"
            onClick={handleResetForm}
          >
            Remove
          </Button>
          <Button
            variant="tonal"
            className="w-full lg:w-auto"
            onClick={handleApply}
          >
            Apply
          </Button>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};
