import React from "react";

import { NotificationBox } from "@/components/shared";

const InfoBadge = () => {
  return (
    <NotificationBox
      variant="info"
      icon="check badge 2"
      className="md:flex-row flex-col"
      onClick={() => {}}
    >
      <div className="flex flex-col">
        <span className="text-label-large md:text-start text-center">
          Your account is verified!{" "}
        </span>
        <span className="text-body-small">
          You have completed all verification steps and now have full access to
          all features.
        </span>
      </div>
    </NotificationBox>
  );
};

export default InfoBadge;
