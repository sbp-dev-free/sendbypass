import { Icon } from "@/components";
import { cn } from "@/utils";

import { DimensionItemProps } from "./types";

export const DimensionItem = ({
  icon,
  label,
  amount,
  unit,
  className,
}: DimensionItemProps) => {
  return (
    <div
      className={cn(
        "flex flex-col justify-between items-center px-16 py-4 w-full",
        className,
      )}
    >
      {Number(amount) > 0 && (
        <>
          <Icon name={icon} className="text-primary text-[24px]" />
          <div>
            <div className="mb-4 text-center text-label-medium text-on-surface">
              {label}
            </div>
            <div className="text-center text-label-medium">
              {amount}{" "}
              <span className="text-label-small text-on-surface-variant">
                {unit}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
