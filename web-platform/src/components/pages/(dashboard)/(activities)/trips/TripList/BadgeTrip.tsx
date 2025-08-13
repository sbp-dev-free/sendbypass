"use client";
import { type ReactNode } from "react";

import { StatusShape } from "@/components/icons";
import { getColorsByStatus } from "@/utils";

import { BadgeTripProps } from "./types";

export const BadgeTrip = ({
  status,
  className = "",
}: BadgeTripProps): ReactNode => {
  const { fill, text } = getColorsByStatus(status);

  return (
    <div className={`relative ${className}`}>
      <StatusShape className={fill} width="116" />
      <span
        className={`absolute block top-0 mx-auto left-0 right-0 w-auto 
                           text-center pt-2 first-letter:uppercase text-label-small ${text}`}
      >
        {status.toLowerCase()}
      </span>
    </div>
  );
};
