import { FC } from "react";

import Button from "@mui/material/Button";

import { DEFAULT_CURRENCY } from "@/utils";

import { Features } from "../Features";
import { FlightInfo } from "../FlightInfo";
import { ProductInfo } from "../ProductInfo";

import { RequirementRequestProps } from "./types";

export const RequirementReview: FC<RequirementRequestProps> = ({
  flight,
  description,
  features,
  onClose,
  handleNext,
  ...productInfo
}) => {
  return (
    <div className="space-y-24">
      <div className="space-y-16">
        <ProductInfo {...productInfo} />
        <div className="flex flex-col gap-16 md:flex-row md:items-center md:gap-24 md:justify-between">
          <FlightInfo flight={flight} className="md:w-[75%]" />
          <Features {...features} />
        </div>
        <div className="space-y-4">
          <p className="text-label-medium text-outline">Service Description</p>
          <span className="text-body-small text-on-surface">{description}</span>
        </div>
      </div>
      <div className="flex flex-col gap-20 md:gap-0 md:flex-row md:justify-between md:items-center">
        <div className="flex flex-row justify-between items-center py-12 px-16 border md:items-start md:p-0 rounded-small md:flex-col md:rounded-none border-surface-container md:border-none">
          <p className="text-label-medium text-outline md:text-on-surface-variant">
            Reward
          </p>
          <span className="text-title-medium text-primary">
            {DEFAULT_CURRENCY.symbol}
            {productInfo.cost}
          </span>
        </div>
        <div className="flex gap-8 items-center">
          <Button variant="text" className="w-full md:w-auto" onClick={onClose}>
            Cancel
          </Button>
          <Button className="w-full md:w-auto" onClick={handleNext}>
            Confirm and Next
          </Button>
        </div>
      </div>
    </div>
  );
};
