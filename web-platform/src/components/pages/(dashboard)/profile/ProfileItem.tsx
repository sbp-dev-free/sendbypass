import { Icon } from "@/components/shared";
import { cn } from "@/utils";

import { ProfileItemProps } from "./types";

export const ProfileItem = ({
  status,
  title,
  onClick,
  className,
}: ProfileItemProps) => {
  return (
    <div
      className={cn(
        "flex items-center h-[44px] p-12 rounded-small my-4",
        {
          "text-positive bg-positive-opacity-8": status === "complete",
          "text-on-surface bg-surface-container-low cursor-pointer hover:bg-surface-container-low-opacity-50":
            status === "incomplete",
        },
        className,
      )}
      onClick={onClick}
    >
      {status === "complete" ? (
        <Icon name="Check circle" />
      ) : (
        <Icon name="Circle" />
      )}
      <span className="text-label-medium ml-8">{title}</span>

      {status === "incomplete" && (
        <Icon name="Chevron Right MD" className="ml-auto" />
      )}
    </div>
  );
};
