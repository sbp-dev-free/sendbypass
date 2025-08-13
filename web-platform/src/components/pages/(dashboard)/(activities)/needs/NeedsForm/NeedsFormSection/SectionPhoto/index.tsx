"use client";

import { useState } from "react";

import { enqueueSnackbar } from "notistack";
import { Controller, useFormContext } from "react-hook-form";

import { ImageUploadModal } from "@/components/shared";

import { TitleWrapper } from "../TitleWrapper";

import { FileInputLabel } from "./FileInputLabel";

export const SectionPhoto = () => {
  const { control, setValue } = useFormContext();

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<File | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOpenCropModal = (file: File | null, index: number) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      enqueueSnackbar("File size must be under 5MB", {
        variant: "error",
      });
      return;
    }

    setImageToEdit(file);
    setCurrentIndex(index);
    setCropModalOpen(true);
  };

  const handleCloseCropModal = () => {
    setCropModalOpen(false);
    setImageToEdit(null);
  };

  const handleSaveCroppedImage = (croppedFile: File) => {
    setValue(`images.${currentIndex}`, croppedFile, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setCropModalOpen(false);
    setImageToEdit(null);
  };

  return (
    <TitleWrapper
      title="Product photo"
      subtitle="Upload clear product images (max 5MB each)."
    >
      <div className="grid grid-cols-4 gap-16 md:grid-cols-5">
        {([0, 1, 2, 3, 4] as const).map((index) => (
          <Controller
            key={index}
            name={`images.${index}` as `images.${typeof index}`}
            control={control}
            render={({ field: { value, ...field }, fieldState: { error } }) => (
              <>
                <input
                  {...field}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleOpenCropModal(file, index);
                    }
                  }}
                  type="file"
                  id={`needImage-${index}`}
                  className="hidden"
                  disabled={index > 0}
                />
                <FileInputLabel
                  onDeleteImage={() => field.onChange(null)}
                  htmlFor={`needImage-${index}`}
                  className={`${index === 0 ? "col-span-4 aspect-[9/4]" : "col-span-1 aspect-square"} md:col-span-1 md:aspect-square`}
                  file={value || null}
                  label={
                    index === 0 && (
                      <span className="text-label-medium text-on-surface-variant">
                        Main Image{" "}
                        <span className="text-body-small text-outline">
                          (Required)
                        </span>
                      </span>
                    )
                  }
                  disabled={index > 0}
                  errorMessage={error?.message}
                />
              </>
            )}
          />
        ))}
      </div>
      <ImageUploadModal
        open={cropModalOpen}
        image={imageToEdit}
        onClose={handleCloseCropModal}
        onSave={handleSaveCroppedImage}
      />
    </TitleWrapper>
  );
};
