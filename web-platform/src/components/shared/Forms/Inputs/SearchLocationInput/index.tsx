"use client";

import { useMemo, useState } from "react";

import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { useDebounceValue } from "usehooks-ts";

import { Icon } from "@/components";
import { useGetLocationsQuery } from "@/services/locations";

import { getOptionLabel, renderOption } from "./renderers";
import { Option, SearchLocationInputProps } from "./types";

const anyLocationOption: Option = {
  id: -1,
  value: undefined,
  label: {
    country: "City or Airport",
    city: "Country",
    airport: "Any locations",
  },
  type: "GENERIC",
};

export const SearchLocationInput = ({
  label,
  registerProps,
  error,
  handleSetValue,
  value,
}: SearchLocationInputProps) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounceValue(query, 300);
  const {
    data: locations,
    isLoading,
    isFetching,
  } = useGetLocationsQuery({
    query:
      !!debouncedQuery && debouncedQuery !== value?.label.airport
        ? debouncedQuery
        : undefined,
  });

  const autocompleteOptions = useMemo<Option[]>(
    () => [
      ...(query ? [] : [anyLocationOption]),
      ...(locations?.results.map((loc) => ({
        id: loc.id,
        value: loc.tag,
        label: {
          country: loc.country,
          city: loc.city,
          airport: loc.related_object.name,
        },
        type: loc.type,
      })) ?? []),
    ],
    [query, locations],
  );

  return (
    <Autocomplete
      {...registerProps}
      value={value}
      options={autocompleteOptions ?? []}
      onInputChange={(_, value) => setQuery(value)}
      getOptionLabel={getOptionLabel}
      filterOptions={(options) => options}
      onChange={(_, value) => {
        handleSetValue(value);
      }}
      renderOption={renderOption}
      renderInput={(props) => (
        <TextField
          {...props}
          label={label}
          helperText={error}
          error={!!error}
        />
      )}
      popupIcon={
        isFetching || isLoading ? (
          <CircularProgress size="24px" />
        ) : (
          <Icon name="Caret Down MD" className="text-[24px] text-primary" />
        )
      }
    />
  );
};
