import React from "react";

import { ClassValue } from "clsx";

import { cn } from "@/utils";

export const Dot = ({ className }: { className?: ClassValue }) => {
  return (
    <span
      className={cn(
        "inline-block rounded-full size-4 bg-outline-variant",
        className,
      )}
    />
  );
};
