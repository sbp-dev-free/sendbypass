import React from "react";

import dayjs from "dayjs";
import { useSelector } from "react-redux";

import { NotificationBox } from "@/components/shared";
import { selectUser } from "@/store/slices/authSlice";

import InfoBadge from "./InfoBadge";

const VerificationBadge = () => {
  const profile = useSelector(selectUser);
  const verification = profile?.verification;
  return (
    <>
      <InfoBadge />

      <NotificationBox
        variant="transparent"
        className="justify-between flex w-full"
      >
        <div className="flex flex-col items-start">
          <span className="text-label-large md:text-start text-center">
            Identity verification{" "}
          </span>
          <span className="text-body-small text-outline">Government ID</span>
        </div>
        <div className="md:flex flex-col hidden items-start">
          <span className="text-label-large md:text-start text-center">
            Verification date{" "}
          </span>
          <span className="text-body-small text-outline">
            {verification?.verified_at &&
              dayjs(verification?.verified_at).format("DD/MM/YYYY")}
          </span>
        </div>
        <div className="rounded-large bg-positive-opacity-8 py-6 px-8 flex items-center justify-center">
          <span className="text-positive text-label-medium ">Completed</span>
        </div>
      </NotificationBox>
    </>
  );
};

export default VerificationBadge;
