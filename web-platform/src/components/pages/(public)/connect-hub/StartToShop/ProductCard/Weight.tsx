import { FC } from "react";

import { Icon } from "@/components/shared";
import { cn } from "@/utils";

import { FeatureValue } from "./types";

export const Weight: FC<FeatureValue> = ({ value, className }) => {
  return (
    <div
      className={cn(
        "md:w-80 space-y-6 h-[90px] xs:px-14 md:px-20 py-12 rounded-small border border-surface-container-high text-center",
        className,
      )}
    >
      <Icon name="Kettlebell" className="text-[24px] text-primary" />
      <div className="space-y-4 text-label-medium">
        <div className="text-on-surface-variant">Weight</div>
        <div className="text-on-surface">
          {value}{" "}
          <span className="text-label-small text-on-surface-variant">kg</span>
        </div>
      </div>
    </div>
  );
};
