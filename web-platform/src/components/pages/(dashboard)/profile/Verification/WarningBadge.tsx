import React from "react";

import { NotificationBox } from "@/components/shared";

import { WarningBadgeProps } from "./types";

const WarningBadge = ({ onActionClick }: WarningBadgeProps) => {
  return (
    <NotificationBox
      variant="warning"
      icon="info-circle"
      actionText="Get Started"
      className="md:flex-row flex-col"
      action={onActionClick}
    >
      <div className="flex flex-col">
        <span className="text-label-large md:text-start text-center">
          Your account is not verified!
        </span>
        <span className="text-body-small">
          Complete your profile with your first name, last name, and more info
          to unlock all features.
        </span>
      </div>
    </NotificationBox>
  );
};

export default WarningBadge;
