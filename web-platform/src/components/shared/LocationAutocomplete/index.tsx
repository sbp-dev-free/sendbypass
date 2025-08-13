"use client";

import { useState } from "react";

import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { useDebounceValue } from "usehooks-ts";

import { ANY_LOCATION_OPTION } from "@/constants/globals";
import { useGetLocationsQuery } from "@/services/locations";

import { Icon } from "../Icon";

import { getOptionLabel, renderLocationIcon, renderOption } from "./renderers";
import { AutoCompleteLocationProps, Option } from "./types";

export const LocationAutocomplete = ({
  type,
  value,
  onChange,
  error,
  helperText,
  placeholder = "Search location...",
  className = "",
  showZipCode = false,
  valueKey = "tag",
  includeAnyLocationOption = true,
  tag,
  isLoading,
}: AutoCompleteLocationProps) => {
  const [query, setQuery] = useState<string | undefined>();
  const [debouncedQuery] = useDebounceValue(query, 300);

  const {
    data: locations,
    isLoading: locationLoading,
    isFetching: locationFetching,
  } = useGetLocationsQuery(
    {
      query: debouncedQuery,
      type,
      country: tag,
    },
    { skip: Boolean(value) || isLoading },
  );

  const locading = isLoading || locationLoading || locationFetching;

  const locationOptions = [
    ...(query || type || !includeAnyLocationOption
      ? []
      : [ANY_LOCATION_OPTION]),
    ...(locations?.results.map((location) => ({
      id: location.id,
      value: valueKey ? location[valueKey]?.toString() : location.tag,
      label: {
        country: location.country,
        city: location.city,
        airport: location.related_object.name,
      },
      type: location.type,
      zip_code: location.related_object.zip_code,
      tag: location.tag,
    })) ?? []),
  ];

  const handleInputChange = (_: unknown, newValue: string) => {
    setQuery(newValue.trim() === "" ? undefined : newValue);
  };

  const handleOnChange = (_: unknown, newValue: Option | null) => {
    onChange(newValue);
    setQuery(undefined);
  };

  const handleClear = () => {
    onChange(null);
    setQuery(undefined);
  };

  return (
    <Autocomplete
      sx={{
        "& .MuiAutocomplete-listbox": { maxHeight: "400px" },
      }}
      className={`w-full md:w-1/2 ${className}`}
      disablePortal
      options={locationOptions}
      onInputChange={handleInputChange}
      value={value}
      getOptionLabel={getOptionLabel(showZipCode)}
      filterOptions={(options) => options}
      onChange={handleOnChange}
      clearOnEscape
      clearOnBlur
      noOptionsText={`No ${type ? type.toLowerCase() : "location"} found`}
      renderOption={(props, option) => renderOption(props, option, showZipCode)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={placeholder}
          error={error}
          helperText={helperText}
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <>
                  {value && renderLocationIcon(value.type)}
                  {params.InputProps.startAdornment}
                </>
              ),
            },
          }}
        />
      )}
      clearIcon={
        <span onClick={handleClear}>
          <Icon name="Close Square" className="text-[24px] text-primary" />{" "}
        </span>
      }
      popupIcon={
        locading ? (
          <CircularProgress size="24px" />
        ) : (
          <Icon name="Caret Down MD" className="text-[24px] text-primary" />
        )
      }
    />
  );
};
