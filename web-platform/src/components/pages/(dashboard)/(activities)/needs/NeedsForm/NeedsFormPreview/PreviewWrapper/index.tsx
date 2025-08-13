"use client";

import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Icon, Modal } from "@/components";

import { PreviewWrapperProps } from "./types";

export const PreviewWrapper = ({
  children,
  title,
  subtitle,
  onClose,
}: PreviewWrapperProps) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  return (
    <Modal open onClose={onClose}>
      <div className="px-16 pb-16 lg:p-24 lg:w-[974px]">
        <div className="flex justify-between mb-16">
          <div>
            <div className="text-title-medium text-on-surface">{title}</div>
            <div className="mb-16 text-body-small text-on-surface-variant">
              {subtitle}
            </div>
          </div>
          {!isMobile && (
            <IconButton color="standard" onClick={onClose}>
              <Icon name="Close remove" className="text-[20px]" />
            </IconButton>
          )}
        </div>
        {children}
      </div>
    </Modal>
  );
};
