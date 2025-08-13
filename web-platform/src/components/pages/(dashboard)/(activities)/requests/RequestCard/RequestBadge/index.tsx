"use client";

import { StatusShape } from "@/components/icons";
import { getColorsByStatus } from "@/utils";

import { RequestBadgeProps } from "./types";

export const RequestBadge = ({ status }: RequestBadgeProps) => {
  const { fill, text } = getColorsByStatus(status ?? "default");

  return (
    <div className="absolute top-0 right-0 w-fit">
      <StatusShape className={fill} width="116" />

      <span
        className={`absolute block inset-x-0 top-0 w-auto text-center pt-2 first-letter:uppercase text-label-small ${text}`}
      >
        {status}
      </span>
    </div>
  );
};
