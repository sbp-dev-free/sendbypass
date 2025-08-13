"use client";

import { useEffect, useState } from "react";

import FormHelperText from "@mui/material/FormHelperText";
import Image from "next/image";

import { Icon } from "@/components";

import { FileInputLabelProps } from "./types";

export const FileInputLabel = ({
  htmlFor,
  className = "",
  file,
  label,
  onDeleteImage,
  errorMessage,
  disabled,
}: FileInputLabelProps) => {
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (file) {
      if (file instanceof File) {
        const url = URL.createObjectURL(file);
        setImagePreview(url);
      } else {
        setImagePreview(file);
      }
    }
  }, [file]);

  function handleDeleteImage() {
    if (File) {
      setImagePreview("");
      onDeleteImage();
    }
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {!!imagePreview ? (
        <div
          className="block relative h-full border border-dashed cursor-pointer rounded-medium overflow-clip"
          onClick={handleDeleteImage}
        >
          <Image
            src={imagePreview}
            fill
            alt={htmlFor}
            className="object-cover w-full h-full"
          />
          <div className="grid absolute grid-rows-3 w-full h-full">
            <div></div>
            <div className="flex justify-center items-center">
              <Icon name="delete" className="text-[24px] text-primary" />
            </div>
            {label && (
              <div className="flex justify-center items-end pb-12">{label}</div>
            )}
          </div>
        </div>
      ) : (
        <label
          htmlFor={htmlFor}
          className={`border border-dashed ${!!errorMessage ? "border-[rgb(var(--error))]" : "border-outline-variant"} rounded-medium relative overflow-clip ${disabled ? "cursor-not-allowed bg-surface-dim" : "cursor-pointer"} block h-full`}
        >
          <div className="grid absolute grid-rows-3 w-full h-full">
            <div></div>
            <div className="flex justify-center items-center">
              <Icon
                name={!!file ? "delete" : "plus-2"}
                className={`text-[24px] ${!!errorMessage ? "text-[rgb(var(--error))]" : "text-primary"}`}
              />
            </div>
            {label && (
              <div className="flex justify-center items-end pb-12">{label}</div>
            )}
          </div>
        </label>
      )}

      <div className="pl-16">
        {errorMessage && (
          <FormHelperText error={true}>{errorMessage}</FormHelperText>
        )}
      </div>
    </div>
  );
};
