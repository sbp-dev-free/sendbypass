"use client";

import { PropsWithChildren } from "react";

import { SnackbarProvider } from "notistack";

import { Icon } from "@/components/shared";
import { CustomSnackbar } from "@/components/shared/CustomSnackBar";
import { BaseComponentProps } from "@/components/types";
import { useDevice } from "@/hooks";

const AppSnackbarProvider = ({
  children,
}: PropsWithChildren<BaseComponentProps>) => {
  const { isMobile } = useDevice();

  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={4000}
      Components={{
        success: CustomSnackbar,
        error: CustomSnackbar,
      }}
      hideIconVariant={false}
      iconVariant={{
        success: (
          <Icon name="Check circle" className="text-[20px] text-secondary" />
        ),
        error: <Icon name="close square" className="text-[20px] text-error" />,
      }}
      anchorOrigin={{
        vertical: isMobile ? "top" : "bottom",
        horizontal: "center",
      }}
    >
      {children}
    </SnackbarProvider>
  );
};

export default AppSnackbarProvider;
