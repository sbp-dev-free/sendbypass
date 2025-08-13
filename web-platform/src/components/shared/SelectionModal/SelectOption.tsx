import { FC } from "react";

import Link from "next/link";

import { Icon, StatusShape } from "@/components";
import { cn } from "@/utils";

import { SelectOptionProps } from "./types";
export const SelectOption: FC<SelectOptionProps> = ({
  title,
  icon,
  description,
  href,
  onClick,
  onClose,
  showBadge,
  badgeText,
  disabled = false,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (onClose) onClose();
  };
  const content = (
    <div
      className={cn(
        "flex flex-row gap-12 items-center py-16 px-24 border-2 border-surface-container-highest transition-all duration-300 rounded-medium md:p-32 md:flex-col md:justify-center",
        {
          "hover:border-primary": !disabled,
        },
      )}
    >
      <Icon
        name={icon}
        className={cn("text-[24px] md:mb-4", {
          "text-outline": disabled,
          "text-on-surface-variant": !disabled,
        })}
      />

      <div>
        <div
          className={cn("!text-title-medium md:mb-6 md:text-center", {
            "text-outline": disabled,
            "text-on-surface": !disabled,
          })}
        >
          {title}
        </div>

        <div
          className={cn("!text-body-small md:text-center", {
            "text-outline": disabled,
            "text-on-surface-variant": !disabled,
          })}
        >
          {description}
        </div>
      </div>
      {showBadge && (
        <div className="absolute top-0 left-auto right-8 md:top-auto md:bottom-0 md:left-auto md:right-auto">
          <div className="md:rotate-180">
            <StatusShape className="text-positive-opacity-8" />
          </div>
          <span
            className="absolute block top-0 mx-auto left-0 right-0
                       text-center pt-2 first-letter:uppercase text-label-small text-positive"
          >
            {badgeText}
          </span>
        </div>
      )}
    </div>
  );
  if (href) {
    return (
      <Link href={href} onClick={handleClick} className="md:w-[245px] relative">
        {content}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className="md:w-[245px] relative"
    >
      {content}
    </button>
  );
};
