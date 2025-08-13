"use client";

import React, { useRef, useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { Cropper } from "react-cropper";

import { ImageUploadModalProps } from "./types";
interface ReactCropperElement extends HTMLImageElement {
  cropper: Cropper;
}
import LoadingButton from "@mui/lab/LoadingButton";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";

import { Icon } from "@/components";
import { useDevice } from "@/hooks";

import "react-cropper/node_modules/cropperjs/dist/cropper.css";

export const ImageUploadModal = ({
  open,
  image,
  onClose,
  onSave,
  aspectRatio,
}: ImageUploadModalProps) => {
  const cropperRef = useRef<ReactCropperElement>(null);
  const [loading, setLoading] = useState(false);
  const { isMobile } = useDevice();

  const handleCrop = async () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      setLoading(true);
      try {
        const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();

        if (croppedCanvas) {
          croppedCanvas.toBlob(
            (blob) => {
              if (blob) {
                const croppedFile = new File(
                  [blob],
                  image instanceof File ? image.name : "cropped-image.jpg",
                  {
                    type: image instanceof File ? image.type : "image/jpeg",
                    lastModified: new Date().getTime(),
                  },
                );

                onSave(croppedFile);
              }
            },
            image instanceof File ? image.type : "image/jpeg",
          );
        }
      } catch (error) {
        console.error("Error during crop:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReady = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.reset();
      const imageData = cropper.getImageData();
      cropper.setCropBoxData({
        left: imageData.left,
        top: imageData.top,
        width: imageData.width,
        height: imageData.height,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen={isMobile}>
      <div className="md:w-[770px] rounded-large p-16 h-full flex flex-col justify-between overflow-x-hidden">
        <div>
          <div className="flex justify-between mb-16 items-center">
            <div className="text-on-surface text-title-medium">Crop Image</div>
            <IconButton
              color="outlined"
              className="!w-32 !h-32 rounded-full"
              onClick={onClose}
            >
              <Icon name="Close remove" className="text-[20px]" />
            </IconButton>
          </div>
          <div className="rounded-medium">
            {image && (
              <div>
                <Cropper
                  ref={cropperRef}
                  src={
                    typeof image === "string"
                      ? image
                      : URL.createObjectURL(image)
                  }
                  style={{
                    height: 400,
                    width: "100%",
                  }}
                  aspectRatio={aspectRatio ? aspectRatio : undefined}
                  guides={true}
                  preview=".preview"
                  viewMode={1}
                  dragMode="move"
                  scalable={true}
                  zoomable={true}
                  autoCropArea={1}
                  ready={handleReady}
                />
                <div className="flex items-center gap-4 mt-4 md:mr-[10px]">
                  <Slider
                    min={0.1}
                    max={3}
                    step={0.01}
                    defaultValue={1}
                    onChange={(_, value) => {
                      const zoom = Number(value);
                      if (cropperRef.current && cropperRef.current.cropper) {
                        cropperRef.current.cropper.zoomTo(zoom);
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-8 md:mt-16">
          <Button onClick={onClose} variant="text">
            Cancel
          </Button>
          <LoadingButton
            onClick={handleCrop}
            loading={loading}
            variant="filled"
          >
            Apply & Save
          </LoadingButton>
        </div>
      </div>
    </Dialog>
  );
};
