import { MouseEvent, useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@mui/lab/LoadingButton";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { enqueueSnackbar } from "notistack";
import { useDropzone } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import { useMediaQuery } from "usehooks-ts";

import { Icon } from "@/components/shared";
import { ImageUploadModal } from "@/components/shared/ImageUploadModal";
import { INDUSTRY_OPTIONS, STORE_TYPE_OPTIONS } from "@/constants/profile";
import { useUserProfileModal } from "@/hooks";
import { useGetLanguagesQuery } from "@/services/language";
import { useProfileQuery, useUpdateProfileMutation } from "@/services/profile";
import { cn } from "@/utils";
import {
  BusinessProfileFormValues,
  businessProfileSchema,
} from "@/validations/profile";

export const BusinessProfileForm = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<File | string | null>(null);
  const [cropMode, setCropMode] = useState<"profile" | "background">("profile");
  const [isEditingBizId, setIsEditingBizId] = useState(false);
  const [updatedBizId, setUpdatedBizId] = useState<string>("");

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

  const {
    getRootProps: getBgRootProps,
    getInputProps: getBgInputProps,
    open: openBg,
  } = useDropzone({
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
      setCropMode("background");
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

  const { data: profile } = useProfileQuery();

  const [updateBusinessProfile, { isLoading }] = useUpdateProfileMutation();
  const { data: languages } = useGetLanguagesQuery();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<BusinessProfileFormValues>({
    resolver: zodResolver(businessProfileSchema),
    mode: "onChange",
    defaultValues: {},
  });

  const { toggleProfile, UserProfile } = useUserProfileModal({
    user: profile,
  });

  const overview = watch("overview");
  const tagline = watch("tagline");
  const profileImage = watch("image");
  const backgroundImage = watch("background");

  const profileImageUrl =
    profileImage instanceof File
      ? URL.createObjectURL(profileImage)
      : profileImage;

  const backgroundImageUrl =
    backgroundImage instanceof File
      ? URL.createObjectURL(backgroundImage)
      : backgroundImage;

  const availableLanguages =
    languages?.results.map((language) => ({
      label: language.name,
      value: language.iso,
    })) || [];

  const disabled = Object.keys(dirtyFields).length === 0;

  useEffect(() => {
    if (!profile) {
      reset({
        name: "",
        tagline: "",
        overview: "",
        main_link: { type: "", link: "" },
        speak_languages: [],
        image: "",
        background: "",
        email: "",
        type: "BUSINESS",
        website: "",
        biz_category: "",
        biz_id: "",
        founded_at: "",
      });
    } else {
      reset({
        name: profile.name,
        tagline: profile.tagline,
        overview: profile.overview,
        main_link: profile.main_link || { type: "", link: "" },
        speak_languages: profile.speak_languages || [],
        image: profile.image,
        background: profile.background,
        email: profile.email,
        type: (profile.type as "PERSONAL" | "BUSINESS") || "BUSINESS",
        website: profile.website || "",
        biz_category: profile.biz_category,
        biz_id: profile.biz_id,
        founded_at: profile?.founded_at?.split("-")[0],
      });
    }
    setUpdatedBizId(watch("biz_id"));
  }, [profile]);

  const handleClearIconClick = (event: MouseEvent) => {
    event.stopPropagation();
    const speakLanguages = watch("speak_languages");
    if (!speakLanguages) {
      setValue("speak_languages", []);
    } else {
      setValue("speak_languages", [], { shouldDirty: true });
    }
  };

  const editingBizId = () => {
    setValue("biz_id", updatedBizId, { shouldDirty: true });
    setIsEditingBizId(false);
  };

  const onSubmit = async (values: BusinessProfileFormValues) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const { email, ...data } = values;

      const dirtyData = Object.entries(dirtyFields)
        .map(([key]) => key as keyof Omit<BusinessProfileFormValues, "email">)
        .reduce(
          (acc, key) => {
            if (data[key] !== undefined) {
              acc[key] = data[key];
            }
            return acc;
          },
          {} as Record<keyof Omit<BusinessProfileFormValues, "email">, any>,
        );
      if (Object.keys(dirtyData).length === 0) {
        return;
      }
      if (values.founded_at) {
        dirtyData.founded_at = `${values.founded_at}-01-01`;
      }
      dirtyData.biz_id = values.biz_id;

      await updateBusinessProfile({
        ...dirtyData,
      }).unwrap();

      enqueueSnackbar("Success! Under admin review.", {
        action: () => (
          <button
            onClick={() => {
              toggleProfile();
            }}
            type="button"
            className="py-[10px] px-12 rounded-full text-label-large text-primary transition-all duration-200 active:bg-inverse-primary-opacity-8"
          >
            Current profile{" "}
          </button>
        ),
        variant: "success",
        autoHideDuration: 10000,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDiscard = () => reset();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
      <div className="flex flex-col gap-16 items-center w-full md:flex-row">
        <div className="flex justify-between items-center p-16 w-full border rounded-large border-surface-container">
          <div className="flex gap-24 items-center">
            <Avatar
              sx={{ width: isMobile ? 50 : 80, height: isMobile ? 50 : 80 }}
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
        <div className="flex justify-between items-center p-16 w-full border rounded-large border-surface-container">
          <div className="flex gap-24 items-center">
            <Avatar
              sx={{
                width: isMobile ? 50 : 80,
                height: isMobile ? 50 : 80,
                borderRadius: "16px",
              }}
              className="border-2 border-outline-variant"
              src={backgroundImageUrl || ""}
            />
            <div>
              <p className="text-label-large text-on-surface">
                Background photo
              </p>
              <span className="text-body-small text-outline">
                (PNG, JPEG) under 5MB
              </span>
            </div>
          </div>
          {backgroundImage ? (
            <IconButton
              color="standard"
              onClick={() => setValue("background", "")}
            >
              <Icon name="Delete" />
            </IconButton>
          ) : (
            <div {...getBgRootProps()}>
              <input {...getBgInputProps()} />
              <Button variant="text" onClick={openBg}>
                Add
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-16 gap-y-20 pt-40 pb-16 md:grid-cols-3">
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

        <TextField
          label="Tagline"
          className="md:col-span-2"
          multiline
          maxRows={4}
          {...register("tagline")}
          error={!!errors.tagline}
          helperText={errors.tagline?.message}
          slotProps={{
            inputLabel: {
              filled: !!watch("tagline"),
            },
            input: {
              endAdornment: (
                <span className="text-body-medium text-outline">
                  {tagline?.length || 0}/200
                </span>
              ),
            },
          }}
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
          label="Email"
          value={watch("email") ?? ""}
          disabled
          slotProps={{
            inputLabel: {
              filled: !!watch("email"),
            },
            input: {
              endAdornment: (
                <Icon
                  name="Check circle"
                  className="text-[24px] text-on-surface opacity-40"
                />
              ),
            },
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

        <TextField
          label="Link/ID ✱"
          {...register("main_link.link")}
          error={!!errors.main_link?.link}
          helperText={errors.main_link?.link?.message}
          slotProps={{
            inputLabel: {
              filled: !!watch("main_link.link"),
            },
          }}
        />

        <TextField
          label="Overview"
          className="md:col-span-3"
          {...register("overview")}
          multiline
          sx={{
            "& .MuiInputBase-root": {
              alignItems: "baseline",
            },
          }}
          rows={5}
          error={!!errors.overview}
          helperText={
            errors.overview?.message || "Brief description for your profile"
          }
          slotProps={{
            inputLabel: {
              filled: !!watch("overview"),
            },
            input: {
              endAdornment: (
                <span className="text-body-medium text-outline">
                  {overview?.length || 0}/400
                </span>
              ),
            },
          }}
        />

        <div className="border border-surface-container-high rounded-large p-16 w-full md:col-span-3">
          <div className="flex flex-col space-y-12 md:space-y-0 md:flex-row justify-between md:items-center">
            <div className="flex justify-between">
              <div>
                <div className="text-on-surface text-label-large mb-4">
                  Custom Business ID
                </div>
                <div className="text-outline text-body-small">
                  Personalize the URL for your profile.
                </div>
              </div>
              <div className="flex md:!hidden">
                <IconButton
                  color="standard"
                  className="!w-32 !h-32"
                  onClick={() => setIsEditingBizId(true)}
                >
                  <Icon name="Edit" className="text-[16px]" />
                </IconButton>
                {isEditingBizId && (
                  <IconButton
                    color="standard"
                    className="!w-32 !h-32"
                    onClick={editingBizId}
                  >
                    <Icon name="Checkmark" className="text-[16px]" />
                  </IconButton>
                )}
              </div>
            </div>
            <div className="flex justify-center items-center">
              <div className="text-outline text-body-small md:text-body-medium whitespace-nowrap">
                https://sendbypass.com/business-profile/
              </div>
              <input
                className={cn(
                  "text-on-surface text-body-medium border-none outline-none bg-transparent px-1 w-[27px] md:w-[72px]",
                  {
                    "underline underline-offset-1": isEditingBizId,
                  },
                )}
                value={isEditingBizId ? updatedBizId : watch("biz_id") || ""}
                autoFocus
                readOnly={!isEditingBizId}
                onChange={(e) => {
                  if (isEditingBizId) {
                    setUpdatedBizId(e.target.value);
                  }
                }}
              />
              <div className="!hidden md:!flex">
                <IconButton
                  color="standard"
                  className="!w-32 !h-32"
                  onClick={() => setIsEditingBizId(true)}
                >
                  <Icon name="Edit" className="text-[16px]" />
                </IconButton>
                {isEditingBizId && (
                  <IconButton
                    color="standard"
                    className="!w-32 !h-32"
                    onClick={editingBizId}
                  >
                    <Icon name="Checkmark" className="text-[16px]" />
                  </IconButton>
                )}
              </div>
            </div>
          </div>
          {isEditingBizId && (
            <div className="bg-informative-opacity-8 rounded-small text-informative text-body-small p-12 flex justify-center items-center mt-16">
              Note: Your custom URL must contain 3-40 letters or numbers. Please
              do not use spaces, symbols, or special characters.
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-20 justify-between items-center md:gap-0 md:flex-row">
        <div className="flex gap-4 items-center">
          <Icon name="info circle" className="text-[20px]" />
          <p className="text-body-medium text-on-surface-variant">
            Your changes will be posted after approval
          </p>
        </div>
        <div className="flex gap-8 items-center w-full md:w-auto">
          <Button
            variant="text"
            className="!grow"
            disabled={disabled}
            onClick={handleDiscard}
          >
            Discard Changes
          </Button>
          <LoadingButton
            className="!grow"
            variant="filled"
            type="submit"
            disabled={disabled}
            loading={isLoading}
          >
            Update
          </LoadingButton>
        </div>
      </div>
      {UserProfile}
      <ImageUploadModal
        open={cropModalOpen}
        image={imageToEdit}
        onClose={handleCloseModal}
        onSave={handleSaveCroppedImage}
        aspectRatio={cropMode === "profile" ? 1 : 4}
      />
    </form>
  );
};
