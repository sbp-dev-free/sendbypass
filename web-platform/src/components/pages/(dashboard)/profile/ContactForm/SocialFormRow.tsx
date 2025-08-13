import { FC } from "react";

import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";

import { Icon } from "@/components/shared";
import { SOCIAL_PLATFORMS } from "@/constants/profile";
import { ContactFormValues } from "@/validations/profile";

import { FormRowProps } from "./types";

export const SocialFormRow: FC<FormRowProps> = ({ index, onDelete }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<ContactFormValues>();

  return (
    <div
      key={index}
      className="flex relative flex-row-reverse gap-16 items-center h-full md:flex-row"
    >
      <div className="flex flex-col gap-16 items-center w-full md:flex-row">
        <Controller
          name={`socials.${index}.type`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              slotProps={{
                select: {
                  renderValue: (selected) => {
                    const selectedPlatform = SOCIAL_PLATFORMS.find(
                      (platform) => platform.value === selected,
                    );
                    return selectedPlatform ? (
                      <span className="flex gap-6 items-center">
                        <Icon
                          name={selectedPlatform.icon}
                          className="text-[20px]"
                        />
                        {selectedPlatform.label}
                      </span>
                    ) : (
                      ""
                    );
                  },
                  MenuProps: {
                    sx: {
                      ".MuiList-root": {
                        maxWidth: "unset",
                        padding: "8px",
                      },
                    },
                  },
                  IconComponent: () => (
                    <Icon name="Caret Down MD" className="text-[20px] mr-6" />
                  ),
                },
              }}
              label="Platform ✱"
              className="w-full md:w-1/3"
              error={!!errors?.socials?.[index]?.type}
            >
              {SOCIAL_PLATFORMS.map((platform) => (
                <MenuItem key={platform?.value} value={platform?.value}>
                  <label
                    htmlFor={platform?.value}
                    className="flex justify-between items-center w-full"
                  >
                    <span>
                      <Radio
                        id={platform?.value}
                        checked={field.value === platform?.value}
                      />
                      <span className="text-body-medium">
                        {platform?.label}
                      </span>
                    </span>
                    <Icon name={platform?.icon} className="text-[24px]" />
                  </label>
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name={`socials.${index}.link`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Link/ID/Phone ✱"
              className="w-full md:w-auto grow"
              error={!!errors?.socials?.[index]?.link}
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
