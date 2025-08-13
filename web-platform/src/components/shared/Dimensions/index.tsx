import React from "react";

import Divider from "@mui/material/Divider";

import { Properties } from "@/types";
import { cn } from "@/utils";

import { Icon } from "../Icon";

import { DimensionsProps } from "./types";

const DimensionItem = ({
  icon,
  label,
  amount = 0,
  unit,
  className,
  hasIcon,
}: DimensionsProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 px-16 py-4 w-full",
        className,
      )}
    >
      {hasIcon && <Icon name={icon} className="text-primary text-[24px]" />}{" "}
      <div className="text-center text-label-medium text-on-surface">
        {label}:
      </div>
      <div className="text-center text-label-medium flex gap-4">
        {amount}{" "}
        <span className="text-label-small text-on-surface-variant">{unit}</span>
      </div>
    </div>
  );
};
export const Dimensions = ({
  properties,
  itemClassName,
  className,
}: {
  properties: Properties;
  itemClassName?: string;
  className?: string;
}) => {
  if ("height" in properties) {
  }

  const { weight, length, width } = properties;

  const hasDimension = true;

  return (
    <div className={cn("flex gap-4", className)}>
      <div className="grow justify-center p-8 h-full border border-surface-container-high flex rounded-small">
        <DimensionItem
          icon="kettlebell"
          label="Weight"
          unit="kg"
          amount={weight}
          className={itemClassName}
        />
      </div>
      <div className="grow flex gap-6 justify-between p-8 h-full border border-surface-container-high rounded-small">
        {hasDimension && (
          <>
            <DimensionItem
              icon="arrows-diagonal-expand"
              label="Length"
              unit="cm"
              amount={length}
              className={itemClassName}
            />
            <div className="py-8">
              <Divider
                orientation="vertical"
                className="bg-surface-container-high"
              />
            </div>
            <DimensionItem
              icon="arrows-horizontal-expand"
              label="Width"
              unit="cm"
              amount={width}
              className={itemClassName}
            />
            <div className="py-8">
              <Divider
                orientation="vertical"
                className="bg-surface-container-high"
              />
            </div>
            <DimensionItem
              icon="arrows-vertical-expand"
              label="Height"
              unit="cm"
              amount={(properties as any).height}
              className={itemClassName}
            />
          </>
        )}

        {!hasDimension && (
          <div className="flex flex-col justify-between items-center px-16 py-4 w-full h-[68px]">
            <Icon name="Cube6" className="text-[24px] text-primary" />
            <div className="space-y-4 text-label-medium">
              <div className="capitalize text-on-surface-variant">
                Flexible Dimension
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
