import { FC, useEffect, useState } from "react";

import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";

import { Icon, LocationAutocomplete } from "@/components/shared";
import { Option } from "@/components/shared/LocationAutocomplete/types";
import { LOCATION_TYPE } from "@/enums/location";
import { useLazyGetLocationsQuery } from "@/services/locations";
import { AddressFormValues } from "@/validations/profile";

import { FormRowProps } from "./types";

export const AddressFormRow: FC<FormRowProps> = ({
  index,
  country,
  city,
  onDelete,
}) => {
  const [currentCountry, setCurrentCountry] = useState<Option | null>(null);
  const [currentCity, setCurrentCity] = useState<Option | null>(null);

  const {
    setValue,
    control,
    formState: { errors },
  } = useFormContext<AddressFormValues>();

  const [getLocations, { isLoading, isFetching }] = useLazyGetLocationsQuery();

  useEffect(() => {
    const fillCountry = async () => {
      if (!country) return;
      const countries = await getLocations({
        type: LOCATION_TYPE.COUNTRY,
        object_name: country,
      }).unwrap();
      const currentCountry = countries?.results[0];
      const countryValue: Option = {
        id: currentCountry?.id || 0,
        value: currentCountry?.country_iso3 || "",
        label: {
          country: currentCountry?.country || "",
          city: "",
          airport: "",
        },
        type: "COUNTRY",
        tag: currentCountry?.tag,
      };
      setCurrentCountry(countryValue);
    };
    fillCountry();
  }, [country, index]);

  useEffect(() => {
    const fillCity = async () => {
      if (!city) return;
      const cities = await getLocations({
        type: LOCATION_TYPE.CITY,
        object_name: city,
        country: currentCountry?.tag,
      }).unwrap();
      const currentCity = cities?.results[0];
      const cityValue: Option = {
        id: currentCity?.id || 0,
        value: currentCity?.city || "",
        label: {
          country: "",
          city: currentCity?.city || "",
          airport: "",
        },
        type: "CITY",
      };
      setCurrentCity(cityValue);
    };
    fillCity();
  }, [city, index]);

  return (
    <div
      key={index}
      className="flex relative flex-row-reverse gap-16 items-center h-full md:flex-row"
    >
      <div className="flex flex-col gap-16 items-center w-full md:flex-row">
        <Controller
          name={`addresses.${index}.country`}
          control={control}
          render={({ field }) => (
            <LocationAutocomplete
              {...field}
              onChange={(option) => {
                setValue(`addresses.${index}.country`, option?.value || "", {
                  shouldDirty: true,
                });
                setCurrentCountry(option);
              }}
              value={currentCountry}
              type={LOCATION_TYPE.COUNTRY}
              isLoading={
                (isLoading || isFetching) &&
                !!country &&
                !Boolean(currentCountry?.id)
              }
              valueKey="country"
              placeholder="Country ✱"
              className="w-full md:w-[277px]"
            />
          )}
        />

        <Controller
          name={`addresses.${index}.city`}
          control={control}
          render={({ field }) => (
            <LocationAutocomplete
              {...field}
              onChange={(option) => {
                setValue(`addresses.${index}.city`, option?.value || "", {
                  shouldDirty: true,
                });
                setCurrentCity(option);
              }}
              tag={currentCountry?.tag}
              value={currentCity}
              type={LOCATION_TYPE.CITY}
              isLoading={
                (isLoading || isFetching) && !!city && !Boolean(currentCity?.id)
              }
              valueKey="city"
              placeholder="City ✱"
              className="w-full md:w-[277px]"
            />
          )}
        />

        <Controller
          name={`addresses.${index}.description`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Address ✱"
              className="w-full md:w-auto md:grow"
              error={!!errors?.addresses?.[index]?.description}
            />
          )}
        />
      </div>
      <IconButton
        color="standard"
        className="!size-32 md:!size-24"
        onClick={onDelete}
      >
        <Icon name="Delete" className="text-[24px]" />
      </IconButton>
    </div>
  );
};
