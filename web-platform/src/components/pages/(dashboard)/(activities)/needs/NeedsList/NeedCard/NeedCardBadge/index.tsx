"use client";

import { type ReactNode } from "react";

import { StatusShape } from "@/components/icons";
import { getColorsByStatus } from "@/utils";

import { NeedCardBadgeProps } from "./types";

export const NeedCardBadge = ({ status }: NeedCardBadgeProps): ReactNode => {
  const { fill, text } = getColorsByStatus(status);

  return (
    <div className="absolute -top-2 left-[28px] w-fit">
      <StatusShape className={fill} width="116" />
      <span
        className={`absolute block top-0 left-0 right-0 w-auto text-center pt-2 first-letter:uppercase text-label-small ${text}`}
      >
        {status.toLowerCase()}
      </span>
    </div>
  );
};
