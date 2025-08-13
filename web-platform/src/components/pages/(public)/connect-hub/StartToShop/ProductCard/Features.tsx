import { FC } from "react";

import { getSizeDimensions } from "@/utils";

import { Dimensions } from "./Dimensions";
import { DocumentInfo } from "./DocumentInfo";
import { ImagesSlider } from "./ImagesSlider";
import { FeaturesProps } from "./types";
import { Weight } from "./Weight";

export const Features: FC<FeaturesProps> = (features) => {
  const { weight, images, loadType, type, size, num, width, length } = features;
  const isDocumentType = loadType === "DOCUMENT" && type === "SHIPPING";
  const dimensionsText = size
    ? getSizeDimensions({ size, width, length })
    : "Size not specified";
  return (
    <div className="flex gap-6 items-center w-full md:w-auto justify-end">
      {isDocumentType ? (
        <DocumentInfo
          size={size}
          num={num || 0}
          dimensionsText={dimensionsText}
        />
      ) : (
        <>
          <Weight value={weight} className="w-full md:w-auto" />
          <Dimensions {...features} />
        </>
      )}

      {!!images?.length && <ImagesSlider images={images} />}
    </div>
  );
};
