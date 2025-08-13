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

import { ServiceInfo } from "../ServiceInfo";

import { ServicePreviewProps } from "./types";

export const ServicePreview: FC<ServicePreviewProps> = ({
  type,
  request,
  activity,
  onClose,
}) => {
  const { properties, trip_data } = activity;

  const { user_data } = request.activity;

  const activityOriginData = trip_data?.flight?.source?.location_data;
  const activityDestinationData = trip_data?.flight?.destination?.location_data;
  const activityOriginIata = activityOriginData?.related_object?.iata_code;
  const activityDestinationIata =
    activityDestinationData?.related_object?.iata_code;
  const activityOriginCity = activityOriginData?.city;
  const activityOriginCountry = activityOriginData?.country;
  const activityDestinationCity = activityDestinationData?.city;
  const activityDestinationCountry = activityDestinationData?.country;

  const rate = user_data.stats.avg_rate;

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
    <div className="p-24 rounded-large bg-surface-container-lowest space-y-16 w-full lg:w-[938px] max-h-[90vh]">
      <div className="flex justify-between items-center">
        <div className="flex gap-8 items-center">
          <div>
            <p className="text-title-medium text-on-surface">Request preview</p>
            <span className="text-body-small text-on-surface-variant">
              Review the information carefully
            </span>
          </div>
        </div>
        <IconButton color="tonal" onClick={onClose}>
          <Icon name="Close remove" className="text-[24px]" />
        </IconButton>
      </div>

      <div className="py-8 px-12 space-y-6 rounded-small lg:space-y-8 bg-surface-container-low">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex justify-between items-center w-full">
            <div>
              <div className="flex gap-4 items-center text-title-medium text-on-surface">
                <span>Service:</span>
                <div>
                  <span className="capitalize">
                    {properties.type.toLowerCase()}
                  </span>
                </div>
              </div>
              <div className="hidden gap-8 items-center lg:flex text-label-medium text-on-surface">
                <div className="space-x-4">
                  <span>
                    {activityOriginCity}, {activityOriginCountry}
                  </span>
                  <span>({activityOriginIata})</span>
                </div>
                <Icon name="Arrow Left MD" className="text-[16px]" />
                <div className="space-x-4">
                  <span>
                    {activityDestinationCity}, {activityDestinationCountry}
                  </span>
                  <span>({activityDestinationIata})</span>
                </div>
              </div>
            </div>
            <div className="hidden gap-24 items-center lg:flex">
              <div className="flex justify-between items-center md:items-start md:justify-start md:flex-col md:pr-16">
                <div className="whitespace-nowrap text-label-small text-outline">
                  Up to
                </div>
                <div className="flex space-x-2 text-title-medium text-on-surface">
                  <span>{properties.weight}</span>{" "}
                  <sub className="mt-12">Kg</sub>
                </div>
              </div>
              <div className="flex justify-between items-center md:items-start md:justify-start md:flex-col md:pr-16">
                <div className="whitespace-nowrap text-label-small text-outline">
                  Per Kilo
                </div>
                <div className="text-title-medium text-on-surface">
                  {DEFAULT_CURRENCY.symbol}
                  {parseFloat(activity.cost.wage.toString()).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-4 lg:hidden">
            <div className="flex justify-between items-center">
              <p className="text-label-medium text-outline">Origin:</p>
              <p className="text-label-medium-prominent text-on-surface">
                {activityOriginCity}, {activityOriginCountry} (
                {activityOriginIata})
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-label-medium text-outline">Destination:</p>
              <p className="text-label-medium-prominent text-on-surface">
                {activityDestinationCity}, {activityDestinationCountry} (
                {activityDestinationIata})
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-label-medium text-outline">Per Kilo</p>
              <p className="text-label-medium-prominent text-on-surface">
                {DEFAULT_CURRENCY.symbol}
                {parseFloat(activity.cost.wage.toString()).toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-label-medium text-outline">Up to</p>
              <p className="text-label-medium-prominent text-on-surface">
                <span>{properties.weight}</span> <sub className="mt-8">Kg</sub>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-16 items-center">
        <Avatar
          sx={{ width: 50, height: 50 }}
          className="border-2 border-outline-variant"
          src={user_data.image}
        />
        <div className="space-y-2">
          <div className="flex gap-4 items-center">
            <span className="text-label-large-prominent text-on-surface">
              {user_data.first_name} {user_data.last_name}
            </span>
            <Icon
              name="Check badge 2"
              className="text-[20px] text-informative"
            />
          </div>
          <div className="flex gap-4 items-center">
            {rate === 0 ? (
              <span className="text-outline-variant text-body-small">
                Not rated
              </span>
            ) : (
              <span className="text-on-surface-variant text-label-large">
                {rate}
              </span>
            )}
            <Rating
              value={rate}
              size="small"
              disabled
              icon={
                <Icon name="Star bold" className="text-warning text-[16px]" />
              }
              emptyIcon={
                <Icon
                  name={rate === 0 ? "Star bold" : "Star"}
                  className={cn("text-warning text-[16px]", {
                    "text-outline-variant": rate === 0,
                  })}
                />
              }
            />
          </div>
        </div>
      </div>
      <ServiceInfo activity={request.activity} />
      <Divider className="!hidden lg:!block" />

      <div className="flex flex-col w-full lg:flex-row lg:items-center lg:justify-between">
        <div className="flex justify-between items-center py-12 px-16 lg:px-0 lg:py-0 rounded-small bg-surface-container-low lg:bg-transparent lg:gap-0 lg:items-start lg:flex-col md:pr-16">
          <div className="whitespace-nowrap text-title-small text-on-surface lg:text-label-small lg:text-outline">
            Proposed Price
          </div>
          <div className="text-title-medium text-on-surface">
            {DEFAULT_CURRENCY.symbol}
            {parseFloat(activity.cost.wage.toString()).toFixed(2)}
          </div>
        </div>
        <Divider className="lg:!hidden !block !my-16" />
      </div>
      <div className="flex gap-8 items-center w-full lg:justify-end sticky bottom-0 py-12 bg-surface-container-lowest">
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
  );
};
