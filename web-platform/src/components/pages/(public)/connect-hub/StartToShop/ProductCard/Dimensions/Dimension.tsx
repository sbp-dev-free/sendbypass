import { FC } from "react";

import { Icon } from "@/components/shared";

import { DimensionProps } from "./types";

export const Dimension: FC<DimensionProps> = ({ type, icon, value }) => {
  return (
    <div className="space-y-6 min-w-48 md:min-w-64 h-[90px] xs:px-4 md:px-16 py-12 flex flex-col justify-center text-center">
      <Icon name={icon} className="text-[24px] text-primary" />
      <div className="space-y-4 text-label-medium">
        <div className="capitalize text-on-surface-variant">{type}</div>
        <div className="text-on-surface">
          {value}{" "}
          <span className="text-label-small text-on-surface-variant">cm</span>
        </div>
      </div>
    </div>
  );
};
