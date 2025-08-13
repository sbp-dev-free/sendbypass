"use client";

import { forwardRef } from "react";

import {
  closeSnackbar,
  type CustomContentProps,
  SnackbarContent,
} from "notistack";

import { useDevice } from "@/hooks";
import { cn } from "@/utils";

import { Icon } from "../Icon";

interface CustomSnackbarProps extends CustomContentProps {
  hasClose?: boolean;
  longerAction?: boolean;
}
export const CustomSnackbar = forwardRef<HTMLDivElement, CustomSnackbarProps>(
  (
    {
      message,
      variant,
      id,
      iconVariant,
      action,
      hideIconVariant,
      className,
      style,
      hasClose = true,
      longerAction = false,
    },
    ref,
  ) => {
    const { isMobile } = useDevice();
    let actions: (React.ReactNode | null)[] = [null, null];
    if (typeof action === "function") {
      actions = [action(id), null];

      if (longerAction && isMobile) {
        actions = [null, action(id)];
      }
    }

    return (
      <SnackbarContent
        ref={ref}
        style={style}
        role="alert"
        className={cn(
          "text-on-surface py-12 text-body-medium relative flex items-center gap-6 justify-between w-full min-h-48 px-8 md:px-16 rounded-small border-2 border-solid",
          { "bg-[#EBF3F3]": variant === "success" },
          { "bg-[#FAEBEE]": variant === "error" },
          { "border-positive-opacity-16": variant === "success" },
          { "border-error-opacity-16": variant === "error" },
          className,
        )}
      >
        {!hideIconVariant && iconVariant[variant]}
        <div className="flex flex-1">{message}</div>
        {actions[0]}
        {hasClose && (
          <Icon
            name="Close remove"
            className="text-[18px] cursor-pointer md:mt-[3px]"
            onClick={() => closeSnackbar(id)}
          />
        )}
        {actions[1] && (
          <div className="w-full flex justify-end mt-8">{actions[1]}</div>
        )}
      </SnackbarContent>
    );
  },
);

CustomSnackbar.displayName = "CustomSnackbar";
