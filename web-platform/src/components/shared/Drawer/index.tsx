"use client";

import { type DialogProps } from "@mui/material/Dialog";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

import { useDevice } from "@/hooks";

import { BottomSheet } from "../BottomSheet";

export const Drawer = ({
  children,
  ...rest
}: DialogProps & { onClose?: () => void; onOpen?: () => void }) => {
  const { isMobile } = useDevice();
  return isMobile ? (
    <BottomSheet {...rest}>{children}</BottomSheet>
  ) : (
    <SwipeableDrawer
      PaperProps={{ sx: { borderRadius: "16px 0 0 16px" } }}
      anchor="right"
      {...rest}
      onClose={() => rest.onClose?.()}
      onOpen={() => rest.onOpen?.()}
    >
      {children}
    </SwipeableDrawer>
  );
};
