import Divider from "@mui/material/Divider";

import { Icon } from "@/components";
import { cn } from "@/utils";

import { DimensionItem } from "../../../NeedsForm/NeedsFormPreview/PreviewDimension/DimensionItem";

import { NeedCardDimensionProps } from "./types";
export const NeedCardDimension = ({
  properties,
  className,
}: NeedCardDimensionProps) => {
  const hasDimension =
    Number(properties.length) > 0 &&
    Number(properties.width) > 0 &&
    Number(properties.height) > 0;
  return (
    <div className={cn("flex flex-wrap gap-8 md:flex-nowrap", className)}>
      <div className="flex justify-center p-8 border border-surface-container-high rounded-small grow">
        <DimensionItem
          icon="kettlebell"
          label="Weight"
          unit="kg"
          amount={String(properties.weight)}
        />
      </div>

      <div className="flex gap-6 justify-between p-8 border border-surface-container-high rounded-small grow">
        {hasDimension ? (
          <>
            <DimensionItem
              icon="arrows-diagonal-expand"
              label="Length"
              unit="cm"
              amount={String(properties.length)}
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
              amount={String(properties.width)}
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
              amount={String(properties.height)}
            />
          </>
        ) : (
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
