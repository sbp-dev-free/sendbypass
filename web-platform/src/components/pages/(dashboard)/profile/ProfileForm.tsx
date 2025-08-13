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
import { useUserProfileModal } from "@/hooks";
import { useGetLanguagesQuery } from "@/services/language";
import { useProfileQuery, useUpdateProfileMutation } from "@/services/profile";
import { ProfileFormValues, profileSchema } from "@/validations/profile";

export const ProfileForm = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<File | string | null>(null);
  const [cropMode, setCropMode] = useState<"profile" | "background">("profile");

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
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const { data: languages } = useGetLanguagesQuery();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {},
  });

  const { toggleProfile, UserProfile } = useUserProfileModal({ user: profile });

  const bio = watch("bio");
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
        first_name: "",
        last_name: "",
        bio: "",
        speak_languages: [],
        image: "",
        background: "",
        email: "",
        type: "PERSONAL",
      });
    } else {
      reset({
        first_name: profile.first_name,
        last_name: profile.last_name,
        bio: profile.bio,
        speak_languages: profile.speak_languages || [],
        image: profile.image,
        background: profile.background,
        email: profile.email,
        type: (profile.type as "PERSONAL" | "BUSINESS") || "PERSONAL",
      });
    }
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

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const { email, ...data } = values;
      const dirtyData = Object.entries(dirtyFields)
        .map(([key]) => key as keyof Omit<ProfileFormValues, "email">)
        .reduce(
          (acc, key) => {
            if (data[key] !== undefined) {
              acc[key] = data[key];
            }
            return acc;
          },
          {} as Record<keyof Omit<ProfileFormValues, "email">, any>,
        );
      if (Object.keys(dirtyData).length === 0) {
        return;
      }
      await updateProfile(dirtyData).unwrap();

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

      <div className="grid grid-cols-1 gap-x-16 gap-y-20 pt-40 pb-16 md:grid-cols-2">
        <TextField
          label="First name ✱"
          {...register("first_name")}
          error={!!errors.first_name}
          helperText={errors.first_name?.message}
          slotProps={{
            inputLabel: {
              filled: !!watch("first_name"),
            },
          }}
        />
        <TextField
          label="Last name ✱"
          {...register("last_name")}
          error={!!errors.last_name}
          helperText={errors.last_name?.message}
          slotProps={{
            inputLabel: {
              filled: !!watch("last_name"),
            },
          }}
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
              className="w-full"
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
          label="Bio"
          className="md:col-span-2"
          multiline
          maxRows={4}
          {...register("bio")}
          error={!!errors.bio}
          helperText={
            errors.bio?.message || "Brief description for your profile"
          }
          slotProps={{
            inputLabel: {
              filled: !!watch("bio"),
            },
            input: {
              endAdornment: (
                <span className="text-body-medium text-outline">
                  {bio?.length || 0}/200
                </span>
              ),
            },
          }}
        />
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
