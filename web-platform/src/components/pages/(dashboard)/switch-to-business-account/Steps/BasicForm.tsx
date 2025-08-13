import { MouseEvent, useRef, useState } from "react";

import LoadingButton from "@mui/lab/LoadingButton";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { enqueueSnackbar } from "notistack";
import { useDropzone } from "react-dropzone";
import { Controller, useFormContext } from "react-hook-form";

import { Icon } from "@/components/shared";
import { ImageUploadModal } from "@/components/shared/ImageUploadModal";
import { INDUSTRY_OPTIONS, STORE_TYPE_OPTIONS } from "@/constants/profile";
import { useUpdateSearchParam } from "@/hooks";
import { useGetLanguagesQuery } from "@/services/language";
import { useUpdateProfileMutation } from "@/services/profile";
import { ProfilePatchBody } from "@/services/profile/types";
import { BizCategoryEnum, Social } from "@/types";
import { BusinessProfileFormValues } from "@/validations/profile";

import {
  BusinessAccountModal,
  BusinessAccountModalRefType,
} from "../BusinessAccountModal/BusinessAccountModal";

export const BasicForm = () => {
  const { updateSearchParam } = useUpdateSearchParam();
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<File | string | null>(null);
  const [cropMode, setCropMode] = useState<"profile" | "background">("profile");
  const businessAccountModalRef = useRef<BusinessAccountModalRefType>(null);
  const [updateProfile] = useUpdateProfileMutation();

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    noClick: true,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];

      if (file.size > 5 * 1024 * 1024) {
        enqueueSnackbar("File size must be under 5MB", {
          variant: "error",
        });
        return;
      }

      setImageToEdit(file);
      setCropMode("profile");
      setCropModalOpen(true);
    },
  });

  const handleCloseModal = () => {
    setCropModalOpen(false);
    setImageToEdit(null);
  };

  const handleSaveCroppedImage = (croppedFile: File) => {
    if (cropMode === "profile") {
      setValue("image", croppedFile, { shouldDirty: true });
    } else {
      setValue("background", croppedFile, { shouldDirty: true });
    }
    setCropModalOpen(false);
    setImageToEdit(null);
  };

  const { data: languages } = useGetLanguagesQuery();

  const {
    register,
    control,
    setValue,
    getValues,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useFormContext<BusinessProfileFormValues>();

  const profileImage = watch("image");

  const profileImageUrl =
    profileImage instanceof File
      ? URL.createObjectURL(profileImage)
      : profileImage;

  const availableLanguages =
    languages?.results.map((language) => ({
      label: language.name,
      value: language.iso,
    })) || [];

  const disabled = Object.keys(errors).length !== 0;

  const handleClearIconClick = (event: MouseEvent) => {
    event.stopPropagation();
    const speakLanguages = watch("speak_languages");
    if (!speakLanguages) {
      setValue("speak_languages", []);
    } else {
      setValue("speak_languages", [], { shouldDirty: true });
    }
  };

  const handleModalConfirmation = async () => {
    const values = getValues();

    if (businessAccountModalRef.current) {
      businessAccountModalRef.current.setLoadingBusinessAccountModal();
    }
    const data: Partial<ProfilePatchBody> = {
      type: "BUSINESS",
      biz_id: values.name,
      founded_at: `${values.founded_at}-01-01`,
      main_link: values.main_link as Social,
      speak_languages: values.speak_languages,
      biz_category: values.biz_category as BizCategoryEnum,
      name: values.name,
    };
    if (typeof values.image !== "string") {
      data.image = values.image;
    }
    try {
      await updateProfile(data).unwrap();

      enqueueSnackbar("Success! Under admin review.", {
        variant: "success",
        autoHideDuration: 10000,
      });
      if (businessAccountModalRef.current) {
        businessAccountModalRef.current.closeBusinessAccountModal();
      }
      updateSearchParam("step", "contact");
    } catch (error) {
      if (businessAccountModalRef.current) {
        businessAccountModalRef.current.closeBusinessAccountModal();
      }
    }
  };

  const onSubmit = async () => {
    const results = await trigger([
      "name",
      "biz_category",
      "founded_at",
      "main_link.link",
      "main_link.type",
      "speak_languages",
      "biz_category",
    ]);
    if (results) {
      if (businessAccountModalRef.current) {
        businessAccountModalRef.current.openBusinessAccountModal();
      }
    }
  };

  const handleDiscard = () => reset();

  return (
    <div className="flex flex-col w-full gap-20">
      <div className="flex justify-between items-center p-16 border rounded-large border-surface-container w-full">
        <div className="flex gap-24 items-center">
          <Avatar
            sx={{ width: 80, height: 80 }}
            className="border-2 border-outline-variant"
            src={profileImageUrl || ""}
          />
          <div>
            <p className="text-label-large text-on-surface">Profile photo</p>
            <span className="text-body-small text-outline">
              (PNG, JPEG) under 5MB
            </span>
          </div>
        </div>
        {profileImage ? (
          <IconButton color="standard" onClick={() => setValue("image", "")}>
            <Icon name="Delete" />
          </IconButton>
        ) : (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <Button variant="text" onClick={open}>
              Add
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-x-16 gap-y-20 pt-40 pb-16 md:grid-cols-2">
        <TextField
          label="Business name ✱"
          className="md:col-span-1"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
          slotProps={{
            inputLabel: {
              filled: !!watch("name"),
            },
          }}
        />
        <Controller
          name="founded_at"
          control={control}
          render={({ field }) => {
            const currentYear = new Date().getFullYear();
            const startYear = 1900;
            const YEAR_OPTIONS = Array.from(
              { length: currentYear - startYear + 1 },
              (_, index) => {
                const year = currentYear - index;
                return { label: year.toString(), value: year.toString() };
              },
            );

            return (
              <Autocomplete
                className="md:col-span-1"
                options={YEAR_OPTIONS}
                value={
                  field.value
                    ? YEAR_OPTIONS.find(
                        (option) => option.value === field.value,
                      ) || null
                    : null
                }
                onChange={(_, value) => {
                  field.onChange(value?.value || "");
                }}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) =>
                  option && value
                    ? option.value === value.value
                    : option === value
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Year founded ✱"
                    error={!!errors.founded_at}
                    helperText={errors.founded_at?.message}
                  />
                )}
              />
            );
          }}
        />

        <Controller
          name="main_link.type"
          control={control}
          render={({ field, fieldState }) => (
            <Autocomplete
              className="md:col-span-1"
              autoFocus
              options={STORE_TYPE_OPTIONS}
              value={
                STORE_TYPE_OPTIONS.find(
                  (option) => option.value === field.value,
                ) || null
              }
              onChange={(_, newValue) => {
                field.onChange(newValue ? newValue.value : "");
                if (newValue && newValue.value !== watch("main_link.type")) {
                  setValue("main_link.link", "", { shouldDirty: true });
                }
              }}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) =>
                option && value
                  ? option.value === value.value
                  : option === value
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Online store type ✱"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          )}
        />

        <Controller
          name="biz_category"
          control={control}
          render={({ field }) => (
            <Autocomplete
              className="md:col-span-1"
              autoFocus
              options={INDUSTRY_OPTIONS}
              value={
                field.value
                  ? INDUSTRY_OPTIONS.find(
                      (option) =>
                        typeof field.value === "string" &&
                        option.value === field.value,
                    ) || null
                  : null
              }
              onChange={(_, value) => {
                field.onChange(value?.value || "");
              }}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) =>
                option && value
                  ? option.value === value.value
                  : option === value
              }
              renderInput={(params: any) => (
                <TextField
                  {...params}
                  label="Industry ✱"
                  error={!!errors.biz_category}
                  helperText={errors.biz_category?.message}
                />
              )}
            />
          )}
        />
        <Controller
          name="speak_languages"
          control={control}
          render={({ field }) => (
            <Autocomplete
              sx={{
                width: "100%",
                "& .MuiAutocomplete-listbox": {
                  maxHeight: "400px",
                },
              }}
              className="md:col-span-1"
              multiple
              autoFocus
              options={availableLanguages}
              value={
                field.value?.map((iso) => {
                  const found = availableLanguages.find(
                    (lang) => lang.value === iso,
                  );
                  return found || { label: iso, value: iso };
                }) || []
              }
              onChange={(_, value) =>
                setValue(
                  "speak_languages",
                  value.map((lang) => lang.value),
                  { shouldDirty: true },
                )
              }
              renderTags={(options) =>
                options.map((option) => option?.label).join(", ")
              }
              renderOption={({ key, ...props }, option, { selected }) => (
                <li key={key} {...props}>
                  <span
                    className={`mr-2 ${
                      selected ? "text-primary" : "text-on-surface-variant"
                    }`}
                  >
                    {selected ? <Icon name="Check circle" /> : ""}
                  </span>
                  {option.label}
                </li>
              )}
              renderInput={(params: any) => (
                <TextField
                  {...params}
                  label="Languages you speak"
                  error={!!errors.speak_languages}
                  helperText={errors.speak_languages?.message}
                  slotProps={{
                    inputLabel: {
                      filled: Boolean(watch("speak_languages")?.length),
                    },
                  }}
                />
              )}
              clearIcon={
                <span onClick={handleClearIconClick}>
                  <Icon
                    name="Close Square"
                    className="text-[24px] text-primary"
                  />
                </span>
              }
              popupIcon={
                <Icon
                  name="Caret Down MD"
                  className="text-[24px] text-primary"
                />
              }
            />
          )}
        />
        <TextField
          label="Link/ID ✱"
          {...register("main_link.link")}
          error={!!errors.main_link?.link}
          className="md:col-span-1"
          helperText={errors.main_link?.link?.message}
          slotProps={{
            inputLabel: {
              filled: !!watch("main_link.link"),
            },
          }}
        />
      </div>
      <div className="flex gap-8 w-full md:w-auto md:justify-end">
        <Button
          variant="text"
          className="md:grow-0 grow"
          disabled={disabled}
          onClick={handleDiscard}
        >
          Discard Changes
        </Button>
        <LoadingButton
          className="md:grow-0 grow"
          variant="filled"
          type="button"
          disabled={disabled}
          onClick={onSubmit}
        >
          Switch to Business
        </LoadingButton>
      </div>
      <BusinessAccountModal
        ref={businessAccountModalRef}
        onApply={handleModalConfirmation}
      />
      <ImageUploadModal
        open={cropModalOpen}
        image={imageToEdit}
        onClose={handleCloseModal}
        onSave={handleSaveCroppedImage}
        aspectRatio={cropMode === "profile" ? 1 : 4}
      />
    </div>
  );
};
