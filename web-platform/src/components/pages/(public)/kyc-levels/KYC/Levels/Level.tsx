"use client";
import { RemoveCircle } from "@/components/icons";
import { Icon } from "@/components/shared";
import { cn } from "@/utils";

import { CurrentStatus } from "./CurrentStatus";
import { LevelProps } from "./types";
export const Level = ({
  icon,
  color,
  bg,
  level,
  description,
  features_description,
  features,
  verify,
  status,
}: LevelProps) => {
  return (
    <div
      className={cn(
        "relative bg-surface-container-lowest rounded-large col-span-1 md:mt-12",
        { "border border-secondary-opacity-8": status },
      )}
    >
      {status && <CurrentStatus />}
      <div className="p-16">
        <Icon
          name={icon}
          className={cn("p-8 mb-8 rounded-small text-[24px]", `${color} ${bg}`)}
        />
        <div className="text-on-surface text-title-medium">{level}</div>
        <p className="text-on-surface-variant text-body-small md:h-48">
          {description}
        </p>
      </div>

      <div className="p-16 space-y-16 border-b-2 border-t-2 border-dashed border-outline-variant">
        <div>
          <div className="text-on-surface text-title-small">Features</div>
          <p className="text-on-surface-variant text-body-small">
            {features_description}
          </p>
        </div>

        <ul className="space-y-4">
          {Object.entries(features[0]).map(([key, value], index) => (
            <li key={index} className="flex gap-4 items-center ">
              {value ? (
                <Icon name="Check circle" className="text-primary" />
              ) : (
                <RemoveCircle />
              )}
              <span className="text-on-surface-variant text-label-medium">
                {key}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-16">
        <span className="block text-center text-on-surface-variant text-label-medium h-16">
          {verify}
        </span>
      </div>
    </div>
  );
};
