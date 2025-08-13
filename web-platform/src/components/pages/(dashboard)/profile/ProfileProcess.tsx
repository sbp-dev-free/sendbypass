import { CircleSegmentProgress, Icon } from "@/components/shared";
import { useProfile } from "@/hooks";
import { cn } from "@/utils";

import { ProfileProcessProps } from "./types";

export const ProfileProcess = ({
  className,
  profile,
  onClick,
}: ProfileProcessProps) => {
  const { hint, mainStep, mainStatus } = useProfile(profile);

  return (
    <button
      type="button"
      aria-label="Process"
      className={cn(
        " flex items-center h-[36px] rounded-full gap-8 pl-8 pr-4 md:mt-0 mt-12",
        { "bg-positive-opacity-8 text-positive": mainStatus === "complete" },
        { "bg-warning-opacity-8 text-warning": mainStatus === "incomplete" },
        className,
      )}
      onClick={onClick}
    >
      <CircleSegmentProgress
        currentStep={mainStep}
        isComplete={mainStatus === "complete"}
      />
      <span className="text-label-medium">{hint}</span>
      <Icon name="chevron right md" className="text-[25px] ml-auto " />
    </button>
  );
};
