import Divider from "@mui/material/Divider";

import { Icon } from "@/components/shared/Icon";

import { DimensionItem } from "./DimensionItem";
import { PreviewDimensionProps } from "./types";

export default function PreviewDimension({
  weight,
  length,
  width,
  height,
}: PreviewDimensionProps) {
  const hasDimension =
    Number(length) > 0 && Number(width) > 0 && Number(height) > 0;

  return (
    <div className="flex gap-6 justify-between w-full h-full">
      <div className="grow justify-center p-8 h-full border border-surface-container-high flex rounded-small">
        <DimensionItem
          icon="kettlebell"
          label="Weight"
          unit="kg"
          amount={weight}
        />
      </div>
      <div className="flex gap-6 justify-between p-8 h-full border border-surface-container-high rounded-small">
        {hasDimension && (
          <>
            <DimensionItem
              icon="arrows-diagonal-expand"
              label="Length"
              unit="cm"
              amount={length}
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
              amount={height}
            />
          </>
        )}

        {!hasDimension && (
          <div className="flex flex-col justify-between items-center px-16 py-4 w-full h-[68px]">
            <Icon name="cube6" className="text-[24px] text-primary" />
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
}
