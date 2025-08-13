import { FC } from "react";

import LoadingButton from "@mui/lab/LoadingButton";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Rating from "@mui/material/Rating";

import { Icon } from "@/components/shared";
import { RequestStatus } from "@/enums/requests";
import { useUpdateRequestMutation } from "@/services/requests";
import { cn, DEFAULT_CURRENCY } from "@/utils";

import { FlightInfo } from "../FlightInfo";

import { NeedPreviewProps } from "./types";

export const NeedPreview: FC<NeedPreviewProps> = ({
  type,
  request,
  activity,
  onClose,
}) => {
  const { activity: requestActivity, user } = request;

  const [updateRequest, { isLoading }] = useUpdateRequestMutation();

  const handleSubmit = async () => {
    try {
      await updateRequest({
        id: request.id,
        status: type,
      }).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      onClose();
    }
  };

  return (
    <div className="p-24 rounded-large bg-surface-container-lowest space-y-16 w-full lg:w-[938px]">
      <div className="flex justify-between items-center">
        <div className="flex gap-8 items-center">
          <div>
            <p className="text-title-medium text-on-surface">Request preview</p>
            <span className="text-body-small text-on-surface-variant">
              Review the information carefully{" "}
            </span>
          </div>
        </div>
        <IconButton color="tonal" onClick={onClose}>
          <Icon name="Close remove" className="text-[24px]" />
        </IconButton>
      </div>

      <div className="py-8 px-12 space-y-6 rounded-small lg:space-y-8 bg-surface-container-low">
        <div className="hidden text-label-medium text-outline lg:block">
          Your need
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-col gap-4 items-start lg:flex-row text-title-medium text-on-surface">
              <span className="hidden lg:block">Need:</span>
              <div>{activity.name}</div>
            </div>
            <div className="flex gap-12 items-center">
              {activity.cost.item_price && (
                <>
                  <div className="flex gap-2 items-center text-label-medium-prominent text-on-surface">
                    <div>Product Price</div>
                    <div>
                      {DEFAULT_CURRENCY.symbol}
                      {activity.cost.item_price}
                    </div>
                  </div>
                  <Divider flexItem orientation="vertical" />
                </>
              )}
              <span className="hidden text-label-medium-prominent text-outline lg:block capitalize">
                {activity.properties.type.toLowerCase()}
              </span>
              <div className="flex gap-4 items-center lg:hidden">
                <div className="whitespace-nowrap text-label-medium-prominent text-on-surface">
                  Proposed Reward
                </div>
                <div className="text-label-medium-prominent text-on-surface">
                  {DEFAULT_CURRENCY.symbol}
                  {parseFloat(activity.cost.wage.toString()).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          <div className="hidden flex-col items-start pr-16 lg:flex ">
            <div className="whitespace-nowrap text-label-small text-outline">
              Proposed Reward
            </div>
            <div className="text-label-medium-prominent text-on-surface">
              {DEFAULT_CURRENCY.symbol}
              {parseFloat(activity.cost.wage.toString()).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-16 items-center">
        <Avatar
          sx={{ width: 50, height: 50 }}
          className="border-2 border-outline-variant"
          src={user.image}
        />
        <div className="space-y-2">
          <div className="flex gap-4 items-center">
            <span className="text-label-large-prominent text-on-surface">
              {user.first_name} {user.last_name}
            </span>
            <Icon
              name="Check badge 2"
              className="text-[20px] text-informative"
            />
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
      <FlightInfo
        tripData={requestActivity.trip_data}
        serviceDescription={requestActivity.description}
      />
      <Divider className="!hidden lg:!block" />

      <div className="flex flex-col w-full lg:flex-row lg:items-center lg:justify-between">
        <div className="flex justify-between items-center py-12 px-16 lg:px-0 lg:py-0 rounded-small bg-surface-container-low lg:bg-transparent lg:gap-0 lg:items-start lg:flex-col md:pr-16">
          <div className="whitespace-nowrap text-title-small text-on-surface lg:text-label-small lg:text-outline">
            Proposed Price
          </div>
          <div className="text-title-medium text-on-surface">
            {DEFAULT_CURRENCY.symbol}
            {parseFloat(request.deal.cost.toString()).toFixed(2)}
          </div>
        </div>
        <Divider className="lg:!hidden !block !my-16" />
        <div className="flex gap-8 items-center w-full lg:justify-end">
          <Button variant="text" className="w-full lg:w-auto" onClick={onClose}>
            Cancel
          </Button>
          {type === RequestStatus.CANCELED && (
            <LoadingButton
              loading={isLoading}
              variant="error"
              className="w-full lg:w-auto"
              onClick={handleSubmit}
            >
              Withdraw
            </LoadingButton>
          )}
          {type === RequestStatus.ACCEPTED && (
            <LoadingButton
              loading={isLoading}
              variant="success"
              className="w-full lg:w-auto"
              onClick={handleSubmit}
            >
              Accept and Continue
            </LoadingButton>
          )}
          {type === RequestStatus.REJECTED && (
            <LoadingButton
              loading={isLoading}
              variant="error"
              className="w-full lg:w-auto"
              onClick={handleSubmit}
            >
              Reject
            </LoadingButton>
          )}
        </div>
      </div>
    </div>
  );
};
