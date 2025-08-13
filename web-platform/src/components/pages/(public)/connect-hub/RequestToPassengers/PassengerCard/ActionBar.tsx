"use client";

import { FC } from "react";

import Button from "@mui/material/Button";
import { useToggle } from "usehooks-ts";

import { Icon } from "@/components/shared";
import { cn } from "@/utils";

import { DescriptionAccordion } from "../../DescriptionAccordion";

import { ActionBarProps } from "./types";

export const ActionBar: FC<ActionBarProps> = ({
  selectedServiceInfo,
  onOpenReviewModal,
}) => {
  const [isOpenDescription, toggleDescription] = useToggle();

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <button
          onClick={toggleDescription}
          className="inline-flex gap-2 items-center text-on-surface"
        >
          <span className="text-label-large">Description</span>
          <Icon
            name="Caret Down MD"
            className={cn("text-[20px] pt-2 transition-all duration-200", {
              "rotate-180": isOpenDescription,
            })}
          />
        </button>
        <div className="flex gap-12 items-center">
          {/* <IconButton color="standard">
            <Icon
              name="Pin 1"
              className="text-[24px] text-on-surface-variant"
            />
          </IconButton> */}
          <Button onClick={onOpenReviewModal}>Select</Button>
        </div>
      </div>
      <DescriptionAccordion isExpanded={isOpenDescription}>
        <div className="space-y-16">
          <div>
            <p className="capitalize text-label-large-prominent text-on-surface">
              {selectedServiceInfo.type}
            </p>
            <div className="text-body-medium text-on-surface-variant">
              {selectedServiceInfo.description}
            </div>
          </div>
        </div>
      </DescriptionAccordion>
    </div>
  );
};
