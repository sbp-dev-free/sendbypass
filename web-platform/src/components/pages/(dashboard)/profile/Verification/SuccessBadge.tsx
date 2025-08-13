import React from "react";

import { NotificationBox } from "@/components/shared";

import { SuccessBadgeProps } from "./types";

const SuccessBadge = ({ onActionClick }: SuccessBadgeProps) => {
  return (
    <NotificationBox
      variant="success"
      icon="check circle"
      actionText="Upgrade"
      className="md:flex-row flex-col"
      action={onActionClick}
    >
      <div className="flex flex-col">
        <span className="text-label-large md:text-start text-center">
          Your account is basically verified!{" "}
        </span>
        <span className="text-body-small">
          Your account has completed basic verification. Enhance user trust with
          advanced verification.
        </span>
      </div>
    </NotificationBox>
  );
};

export default SuccessBadge;
