import { FC } from "react";

import { cn } from "@/utils";

import { Icon } from "../Icon";

import { ChipProps } from "./types";

export const Chip: FC<ChipProps> = ({
  label,
  icon,
  className,
  closeIcon,
  color,
  variant = "outlined",
  elevation = false,
  rounded = false,
  disabled = false,
  onClick,
  hideIcon,
}) => {
  const baseClasses =
    "flex gap-8 items-center justify-center w-fit px-12 py-6 transition-all duration-200 h-32";
  const variantClasses =
    variant === "outlined"
      ? `border border-outline-variant text-on-surface-variant bg-transparent ${onClick && !hideIcon && "hover:bg-on-surface-variant-opacity-8"}`
      : variant === "filled" && !disabled
        ? "border-none"
        : "";
  const colorClasses =
    color === "secondary"
      ? "bg-secondary-container text-on-secondary-container"
      : color === "surface"
        ? "bg-surface-container text-on-surface"
        : color === "active"
          ? "bg-primary-container text-primary"
          : "";
  const stateClasses = `${onClick ? "cursor-pointer" : ""} ${elevation ? "active:shadow-light-3" : ""}`;
  const shapeClasses = rounded ? "rounded-full" : "rounded-small";
  const disabledClasses = disabled
    ? "cursor-not-allowed border border-on-surface-variant-opacity-12 bg-transparent text-on-surface opacity-[.38]"
    : "";

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses,
        colorClasses,
        stateClasses,
        shapeClasses,
        disabledClasses,
        className,
      )}
      onClick={onClick}
    >
      {icon?.placement === "start" && icon?.element && (
        <div>{icon.element}</div>
      )}
      <div className="text-label-large text-on-surface-variant">{label}</div>
      {icon?.placement === "end" && icon?.element && <div>{icon.element}</div>}
      {onClick &&
        !hideIcon &&
        (closeIcon || (
          <Icon
            name="Close remove"
            className="text-[18px] text-on-surface-variant"
          />
        ))}
    </div>
  );
};
