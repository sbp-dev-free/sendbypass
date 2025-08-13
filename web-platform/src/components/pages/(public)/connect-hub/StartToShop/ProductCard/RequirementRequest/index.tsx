import { FC, useState } from "react";

import IconButton from "@mui/material/IconButton";

import { Icon } from "@/components/shared";
import { cn } from "@/utils";

import { RequestForm } from "./RequestForm";
import { RequirementReview } from "./RequirementReview";
import { RequirementRequestProps } from "./types";

export const RequirementRequest: FC<RequirementRequestProps> = ({
  flight,
  description,
  onClose,
  features,
  requirementId,
  cost,
  callback,
  ...productInfo
}) => {
  const [tab, setTab] = useState(1);

  const handleChangeTab = (value: number) => setTab(value);

  return (
    <div className="p-24 rounded-large bg-surface-container-lowest space-y-16 lg:w-[800px] relative">
      <Icon
        name="Close remove"
        className="text-[24px] absolute -top-32 right-16 cursor-pointer md:hidden"
        onClick={onClose}
      />

      <div className="flex flex-col-reverse gap-16 items-center md:gap-0 md:flex-row md:justify-between">
        <div className="flex gap-8 items-center self-start">
          {tab === 2 && (
            <IconButton color="standard" onClick={() => handleChangeTab(1)}>
              <Icon
                name="Arrow Right MD"
                className="text-[24px] text-on-surface"
              />
            </IconButton>
          )}
          <div>
            <p className="text-title-medium text-on-surface">
              Submit your request
            </p>
            <span className="text-body-small text-on-surface-variant">
              Review the information carefully
            </span>
          </div>
        </div>
        <div className="flex gap-32 items-center">
          <div className="flex gap-6 items-center">
            <div
              className={cn("flex items-center gap-4", {
                "text-primary": tab === 1,
                "text-outline-variant": tab !== 1,
              })}
            >
              <Icon name="Number 1 Circle" className="text-[20px]" />
              <p className="text-label-medium-prominent">Review</p>
              <Icon name="Chevron Right MD" className="text-[20px]" />
            </div>
            <div
              className={cn("flex items-center gap-4", {
                "text-primary": tab === 2,
                "text-outline-variant": tab !== 2,
              })}
            >
              <Icon name="Number 2 Circle" className="text-[20px]" />
              <p className="text-label-medium-prominent">Select Trip</p>
            </div>
          </div>
          <IconButton
            color="tonal"
            onClick={onClose}
            className="!hidden md:!flex"
          >
            <Icon name="Close remove" className="text-[24px]" />
          </IconButton>
        </div>
      </div>
      {tab === 1 && (
        <RequirementReview
          {...productInfo}
          flight={flight}
          description={description}
          features={features}
          cost={cost}
          onClose={onClose}
          handleNext={() => handleChangeTab(2)}
        />
      )}
      {tab === 2 && (
        <RequestForm
          requirementId={requirementId}
          cost={cost}
          onClose={onClose}
          callback={callback}
        />
      )}
    </div>
  );
};
