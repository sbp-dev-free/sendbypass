import LoadingButton from "@mui/lab/LoadingButton";
import dayjs from "dayjs";

import { useApplyGiftMutation } from "@/services/gifts";
import { remainingDays } from "@/utils";

import { GiftsCardProps } from "./types";
export const GiftsCard = ({
  start_date,
  expire_date,
  title,
  description,
  periods,
  code,
}: GiftsCardProps) => {
  const [applyGift, { isLoading }] = useApplyGiftMutation();

  const handleStartNow = async () => {
    try {
      await applyGift({ code });
    } catch (error) {
      console.error("Failed to apply gift:", error);
    }
  };
  return (
    <>
      <div className="bg-warning-opacity-8 rounded-t-medium p-16 md:p-24">
        <div className="space-y-20">
          <div className="space-y-4">
            <div className="text-on-surface text-title-medium">{title}</div>
            <div className="text-on-surface-variant text-body-small">
              {description}
            </div>
          </div>
          <div className="flex gap-2 md:w-full">
            {periods.map((item, index) => (
              <div
                key={index}
                className="gap-2 md:gap-4 border-l md:border-l-2 border-warning"
              >
                <div className="pl-8 mb-8">
                  <div className="text-outline text-label-medium">
                    {item.period} days
                  </div>
                  <div className="text-on-surface text-title-small">
                    {item.discount}
                  </div>
                </div>
                <div className="flex gap-2 md:gap-4 ml-2 md:ml-4">
                  {Array.from({ length: item.period }, (_, i) => (
                    <div
                      key={i}
                      className="w-[1px] md:w-2 bg-warning h-24"
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between mt-12">
          <div className="flex">
            <div className="text-on-surface text-label-medium">Start:</div>
            <div className="text-on-surface text-body-small">
              {dayjs(start_date).format("MMMM D")}
            </div>
          </div>
          <div className="flex">
            <div className="text-on-surface text-label-medium">Duration:</div>
            <div className="text-on-surface text-body-small">
              {remainingDays(start_date ?? "", expire_date ?? "")} days
            </div>
          </div>
          <div className="flex">
            <div className="text-on-surface text-label-medium">End:</div>
            <div className="text-on-surface text-body-small">
              {dayjs(expire_date).format("MMMM D")}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-warning-opacity-16 rounded-b-medium p-16 md:p-24">
        <div className="space-y-12 flex flex-col md:flex-row justify-between items-center">
          <div>
            <div className="text-on-surface text-title-small">
              Start your plan
            </div>
            <div className="text-on-surface-variant text-body-small">
              Activation of your plan will occur upon starting.
            </div>
          </div>
          <LoadingButton
            variant="filled"
            className="w-full md:w-auto"
            onClick={handleStartNow}
            loading={isLoading}
          >
            Start now
          </LoadingButton>
        </div>
      </div>
    </>
  );
};
