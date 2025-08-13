"use client";

import { FC, useState } from "react";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Rating from "@mui/material/Rating";
import { useToggle } from "usehooks-ts";

import { Icon, Modal } from "@/components/shared";
import { PROFILE_STATUS } from "@/enums/globals";
import { RequestStatus } from "@/enums/requests";
import { useUserProfileModal } from "@/hooks";
import { cn, DEFAULT_CURRENCY } from "@/utils";

import { FlightInfo } from "../FlightInfo";
import { NeedPreview } from "../NeedPreview";
import { ServiceInfo } from "../ServiceInfo";
import { ServicePreview } from "../ServicePreview";

import { Status } from "./Status";
import { RequestTripProps } from "./types";

export const RequestTrip: FC<RequestTripProps> = ({
  request,
  activity,
  isService,
  inbox,
}) => {
  const [previewType, setPreviewType] = useState<RequestStatus | undefined>();
  const [isExpanded, toggleExpanded] = useToggle();
  const [showDescriptionModal, toggleDescriptionModal] = useToggle(false);

  const {
    user,
    deal,
    activity: requestActivity,
    status,
    description,
  } = request;

  const { toggleProfile, UserProfile } = useUserProfileModal({ user });

  const isPending = status === "PENDING";

  const handleWithdraw = () => {
    setPreviewType(RequestStatus.CANCELED);
  };

  const handleAccept = () => {
    setPreviewType(RequestStatus.ACCEPTED);
  };

  const handleReject = () => {
    setPreviewType(RequestStatus.REJECTED);
  };

  const handleClose = () => {
    setPreviewType(undefined);
  };

  const isLongDescription = description.length > 40;

  return (
    <div className="py-12 px-12 rounded-medium bg-surface-container-lowest lg:px-16">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-16 lg:w-[300px]">
          <Avatar
            src={user.image}
            sx={{ width: 50, height: 50 }}
            className="border-2 border-outline-variant cursor-pointer"
            onClick={toggleProfile}
          />
          <div className="space-y-2">
            <div className="flex gap-4 items-center">
              <span className="text-label-large-prominent text-on-surface">
                {user.first_name} {user.last_name}
              </span>
              {user.status === PROFILE_STATUS.VERIFIED && (
                <Icon
                  name="Check badge 2"
                  className="text-[20px] text-informative"
                />
              )}
            </div>
            <div className="flex gap-4 items-center">
              {user.stats.avg_rate === 0 ? (
                <span className="text-outline-variant text-body-small">
                  Not rated
                </span>
              ) : (
                <span className="text-on-surface-variant text-label-large">
                  {user.stats.avg_rate}
                </span>
              )}
              <Rating
                value={user.stats.avg_rate}
                size="small"
                disabled
                icon={
                  <Icon name="Star bold" className="text-warning text-[16px]" />
                }
                emptyIcon={
                  <Icon
                    name={user.stats.avg_rate === 0 ? "Star bold" : "Star"}
                    className={cn("text-warning text-[16px]", {
                      "text-outline-variant": user.stats.avg_rate === 0,
                    })}
                  />
                }
              />
            </div>
          </div>
        </div>
        <div className="hidden pr-16 lg:block space-y-4">
          <div className="flex items-center gap-4">
            <div className="whitespace-nowrap text-label-medium text-on-surface">
              Proposed Price:
            </div>
            <div className="text-label-medium text-on-surface">
              {DEFAULT_CURRENCY.symbol}
              {parseFloat(deal.cost.toString()).toFixed(2)}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-label-medium text-on-surface">
              Description:
            </div>
            <div className="flex gap-8">
              <div className="text-body-small text-on-surface truncate max-w-[150px]">
                {description}
              </div>
              {isLongDescription && (
                <Button
                  variant="text-plain"
                  className="!text-label-medium"
                  onClick={toggleDescriptionModal}
                >
                  More
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="hidden pr-16 lg:block">
          <Status status={status} />
        </div>
        <div className="flex gap-20 items-center">
          {isPending && (
            <div className="hidden gap-12 items-center lg:flex">
              <IconButton
                color="outlined"
                sx={{ width: 32, height: 32 }}
                className="!border-surface-dim"
                onClick={inbox ? handleReject : handleWithdraw}
              >
                <Icon
                  name="Close remove"
                  className="text-[20px] text-primary"
                />
              </IconButton>
              {inbox && (
                <IconButton
                  color="outlined"
                  sx={{ width: 32, height: 32 }}
                  className="!border-surface-dim"
                  onClick={handleAccept}
                >
                  <Icon name="Checkmark" className="text-[20px] text-primary" />
                </IconButton>
              )}
            </div>
          )}
          <IconButton
            color="standard"
            sx={{ width: 32, height: 32 }}
            className="!border-surface-dim transition-transform duration-300"
            onClick={toggleExpanded}
          >
            <Icon
              name="Caret Down MD"
              className={`text-[20px] text-primary transform transition-transform duration-300 ${isExpanded ? "rotate-180" : "rotate-0"}`}
            />
          </IconButton>
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        {isService ? (
          <ServiceInfo
            activity={requestActivity}
            description={requestActivity.description}
          />
        ) : (
          <FlightInfo
            tripData={requestActivity?.trip_data}
            serviceDescription={requestActivity?.description}
          />
        )}
      </div>
      <div className="lg:hidden">
        <Divider className="!my-12" />
        <div className="">
          <div className="pr-16 space-y-4">
            <div className="flex gap-4 items-center">
              <div className="whitespace-nowrap text-label-medium text-on-surface">
                Proposed Price:
              </div>
              <div className="text-label-medium text-on-surface">
                {DEFAULT_CURRENCY.symbol}
                {parseFloat(deal.cost.toString()).toFixed(2)}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-label-medium text-on-surface">
                Description:
              </div>
              <div className="flex gap-8">
                <div className="text-body-small text-on-surface truncate max-w-[155px]">
                  {description}
                </div>
                {isLongDescription && (
                  <Button
                    variant="text-plain"
                    className="!text-label-medium"
                    onClick={toggleDescriptionModal}
                  >
                    More
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-12">
            <Status status={status} />
            {isPending && (
              <div className="flex gap-12 items-center">
                <IconButton
                  color="outlined"
                  sx={{ width: 32, height: 32 }}
                  className="!border-surface-dim"
                  onClick={handleWithdraw}
                >
                  <Icon
                    name="Close remove"
                    className="text-[20px] text-primary"
                  />
                </IconButton>
                {inbox && (
                  <IconButton
                    color="outlined"
                    sx={{ width: 32, height: 32 }}
                    className="!border-surface-dim"
                    onClick={handleAccept}
                  >
                    <Icon
                      name="Checkmark"
                      className="text-[20px] text-primary"
                    />
                  </IconButton>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal open={!!previewType} onClose={handleClose}>
        {previewType &&
          (isService ? (
            <ServicePreview
              type={previewType}
              request={request}
              activity={activity}
              onClose={handleClose}
            />
          ) : (
            <NeedPreview
              type={previewType}
              request={request}
              activity={activity}
              onClose={handleClose}
            />
          ))}
      </Modal>
      <Modal open={showDescriptionModal} onClose={toggleDescriptionModal}>
        <div className="lg:w-[800px] p-24 space-y-16">
          <div className="flex justify-between items-center">
            <div className="text-title-medium text-on-surface">Description</div>
            <IconButton
              color="outlined"
              onClick={toggleDescriptionModal}
              sx={{
                width: 32,
                height: 32,
                borderColor: "rgb(var(--surface-dim))",
              }}
            >
              <Icon name="Close remove" className="text-[20px]" />
            </IconButton>
          </div>
          <div className="text-body-medium text-on-surface-variant">
            {description}
          </div>
        </div>
      </Modal>
      {UserProfile}
    </div>
  );
};
