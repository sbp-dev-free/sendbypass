import { FC } from "react";

import Divider from "@mui/material/Divider";

import { cn } from "@/utils";

import { Dimension } from "./Dimension";
import { FlexibleDimension } from "./FlexibleDimension";
import { DimensionsProps } from "./types";

export const Dimensions: FC<DimensionsProps> = ({
  length,
  width,
  height,
  flexible,
}) => {
  return (
    <div
      className={cn(
        "h-[90px] border border-surface-container-high rounded-small flex items-center gap-6 group transition-colors duration-200",
        flexible && "hover:border-outline",
      )}
    >
      {flexible ? (
        <FlexibleDimension description="Flexible Dimension" />
      ) : (
        <>
          <Dimension
            type="length"
            icon="arrows diagonal expand"
            value={length}
          />
          <Divider flexItem orientation="vertical" className="!my-8" />
          <Dimension
            type="width"
            icon="arrows horizontal expand"
            value={width}
          />
          <Divider flexItem />
          <Divider flexItem orientation="vertical" className="!my-8" />
          <Dimension
            type="height"
            icon="arrows vertical expand"
            value={height}
          />
        </>
      )}
    </div>
  );
};
