import { type DialogProps } from "@mui/material/";
import IconButton from "@mui/material/IconButton";

import { CircleSegmentProgress, Icon } from "@/components/shared";
import { useDevice, useProfile } from "@/hooks";
import { cn } from "@/utils";

import { ProfileItem } from "./ProfileItem";
import { ProfileStatusDrawerProps, TopSectionProps } from "./types";

const TopSection = ({
  step,
  title,
  subtitle,
  className,
  max,
}: TopSectionProps) => (
  <div className={cn("w-full flex mb-8", className)}>
    <div className="flex w-full items-center">
      <CircleSegmentProgress
        currentStep={step}
        isComplete={step === max}
        steps={max}
      />
      <div className="flex flex-col ml-8">
        <span className="text-on-surface text-label-large">{title}</span>
        <span className="text-on-surface-variant text-body-small">
          {subtitle}
        </span>
      </div>
      <span className="text-label-medium text-outline ml-auto">
        {step}/{max}
      </span>
    </div>
  </div>
);

export const ProfileStatusDrawer = ({
  onClose,
  profile,
}: ProfileStatusDrawerProps & Partial<DialogProps>) => {
  const { isMobile } = useDevice();
  const title = "Profile status";

  const { necessaryStep, necessaryItems, optionalItems, optionalStep } =
    useProfile(profile);
  return (
    <div className="flex flex-col w-full md:w-[400px] md:p-24 pt-0 px-24 pb-24">
      {isMobile ? (
        <div className="flex w-full justify-center mb-10">
          <span className="text-title-medium">{title}</span>
        </div>
      ) : (
        <div className="flex w-full justify-between ">
          <span className="text-title-medium">{title}</span>
          <IconButton
            color="outlined"
            className="!w-32 !h-32 rounded-full"
            onClick={(event) => onClose?.(event, "backdropClick")}
          >
            <Icon name="Close remove" className="text-[20px]" />
          </IconButton>
        </div>
      )}
      <TopSection
        title="Necessary"
        subtitle="Essential for site functionality."
        step={necessaryStep}
        className="md:mt-24 mt-0"
        max={necessaryItems.length}
      />
      {necessaryItems.map((item) => (
        <ProfileItem
          key={item.title}
          title={item.title}
          status={item.isComplete ? "complete" : "incomplete"}
          onClick={() => onClose?.({ tab: item.tab }, "backdropClick")}
        />
      ))}
      <TopSection
        title="Optional"
        subtitle="Makes you stand out more."
        step={optionalStep}
        className="mt-24"
        max={optionalItems.length}
      />
      {optionalItems.map((item) => (
        <ProfileItem
          key={item.title}
          title={item.title}
          onClick={() => onClose?.({ tab: item.tab }, "backdropClick")}
          status={item.isComplete ? "complete" : "incomplete"}
        />
      ))}
    </div>
  );
};
