"use client";

import IconButton from "@mui/material/IconButton";

import { Icon } from "@/components";

import { FormPageHeaderProps } from "./types";

export const FormPageHeader = ({
  title,
  subtitle,
  hasBackButton = true,
  onBack,
}: FormPageHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-8 items-center">
        {hasBackButton && (
          <IconButton color="standard" onClick={onBack} className="p-2">
            <Icon name="arrow right md" />
          </IconButton>
        )}
        <div>
          <h1 className="text-title-large text-on-surface">{title}</h1>
          <span className="mt-1 text-body-small text-on-surface-variant">
            {subtitle}
          </span>
        </div>
      </div>
    </div>
  );

  {
    /* {showAddButton && isDesktop && (
    <Button variant="filled" onClick={handleAddTrip}>
      Add trip
    </Button>
  )}

  {showAddButton && isMobile && (
    <IconButton
      onClick={handleAddTrip}
      className="md:hidden !fixed bottom-8 right-8 z-50 rounded-medium bg-primary shadow-lg"
      aria-label="Add new trip"
    >
      <Icon name="plus" />
    </IconButton>
  )} */
  }
  {
    /* </div> */
  }
};
