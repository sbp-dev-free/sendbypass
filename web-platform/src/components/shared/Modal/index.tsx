"use client";

import Dialog, { type DialogProps } from "@mui/material/Dialog";

import { useDevice } from "@/hooks";

import { BottomSheet } from "../BottomSheet";

export const Modal = ({
  children,
  ...rest
}: DialogProps & { onClose?: () => void }) => {
  const { isMobile } = useDevice();
  return isMobile ? (
    <BottomSheet {...rest}>{children}</BottomSheet>
  ) : (
    <Dialog {...rest}>{children}</Dialog>
  );
};
