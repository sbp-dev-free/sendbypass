import { FC, useEffect, useState } from "react";

import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";

import { Icon, LocationAutocomplete } from "@/components/shared";
import { Option } from "@/components/shared/LocationAutocomplete/types";
import { LOCATION_TYPE } from "@/enums/location";
import { useLazyGetLocationsQuery } from "@/services/locations";
import { ContactFormValues } from "@/validations/profile";

import { FormRowProps } from "./types";

export const MobileFormRow: FC<FormRowProps> = ({
  index,
  onDelete,
  countryTag,
  showToast,
}) => {
  const [currentCountry, setCurrentCountry] = useState<Option | null>(null);

  const {
    setValue,
    control,
    formState: { errors },
  } = useFormContext<ContactFormValues>();

  const [getLocations, { isLoading, isFetching }] = useLazyGetLocationsQuery();

  useEffect(() => {
    const fillCountry = async () => {
      if (!countryTag) return;
      const countries = await getLocations({
        type: LOCATION_TYPE.COUNTRY,
        tag: countryTag,
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
        zip_code: currentCountry?.related_object.zip_code,
      };
      setCurrentCountry(countryValue);
    };
    fillCountry();
  }, [countryTag, index]);

  useEffect(() => {
    if (errors?.mobiles?.[index]?.phone) {
      if (showToast) {
        showToast(
          errors.mobiles[index].phone.message || "Invalid phone number",
        );
      }
    }
  }, [errors, index, showToast]);

  return (
    <div
      key={index}
      className="flex relative flex-row-reverse gap-16 items-center h-full md:flex-row"
    >
      <div className="flex flex-col gap-16 items-center w-full md:flex-row">
        <Controller
          name={`mobiles.${index}.zone_code`}
          control={control}
          render={({ field }) => (
            <LocationAutocomplete
              {...field}
              onChange={(option) => {
                setValue(`mobiles.${index}.zone_code`, option?.value || "", {
                  shouldDirty: true,
                });
                setCurrentCountry(option);
              }}
              value={currentCountry}
              valueKey="country_iso3"
              type={LOCATION_TYPE.COUNTRY}
              showZipCode
              isLoading={isLoading || isFetching}
              placeholder="Zone code ✱"
              className="w-full md:w-1/3"
            />
          )}
        />
        <Controller
          name={`mobiles.${index}.phone`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Mobile ✱"
              className="w-full md:w-auto grow"
              error={!!errors?.mobiles?.[index]?.phone}
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
