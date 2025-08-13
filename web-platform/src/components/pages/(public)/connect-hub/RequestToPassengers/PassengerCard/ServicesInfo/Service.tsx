import { FC } from "react";

import { Icon } from "@/components/shared";
import { cn, DEFAULT_CURRENCY } from "@/utils";

import { ServiceServiceProps } from "./types";

const renderIcon = (type?: string) => {
  switch (type) {
    case "DOCUMENT":
      return "Document 2 lines";
    case "CARGO":
      return "bag";
    case "SHOPPING":
      return "Shopping bag remove";
    default:
      return "Document 2 lines";
  }
};

export const Service: FC<ServiceServiceProps> = ({
  wage,
  type,
  weight,
  isSelected = false,
  onClick,
}) => {
  const isDocument = type === "DOCUMENT";

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex relative w-full h-48 text-center cursor-pointer md:flex-col md:w-[110px] md:h-[134px]",
        {
          "outline outline-2 outline-primary rounded-small md:rounded-medium":
            isSelected,
        },
      )}
    >
      <div className="flex items-center border box-border md:border-b-0 md:border-x md:border-t md:pt-8 md:flex-col grow border-x border-surface-container-low rounded-l-small md:rounded-l-none md:rounded-t-medium">
        {onClick && (
          <Icon
            name={isSelected ? "Check circle" : "circle"}
            className={cn(
              "absolute left-8 top-1/3 md:top-6 md:left-6 text-outline-variant",
              {
                "text-primary": isSelected,
              },
            )}
          />
        )}
        <div
          className={cn("flex gap-8 items-center md:ml-0 md:flex-col", {
            "ml-32": onClick,
            "ml-12": !onClick,
          })}
        >
          <div className="flex gap-8 items-center md:flex-col">
            <Icon
              name={renderIcon(type)}
              className={cn("text-outline text-[20px] size-20", {
                "text-on-surface-variant": isSelected,
              })}
            />
            <div
              className={`capitalize text-label-medium-prominent ${isSelected ? "text-primary" : "text-on-surface"}`}
            >
              {type?.toLowerCase()}
            </div>
          </div>
          <div className="space-x-2">
            <span className="text-label-small text-outline">
              {type?.toLowerCase() === "document" && weight === 0
                ? "Under"
                : "Up to"}
            </span>
            <span className="text-label-medium text-on-surface">
              {type?.toLowerCase() === "document" && weight === 0
                ? "1"
                : weight}
              <span className="text-label-small">kg</span>
            </span>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "py-6 px-12 md:px-0 gap-4 rounded-r-small md:rounded-tr-none md:rounded-b-medium bg-surface-container-high flex md:flex-col items-center",
          {
            "bg-primary-opacity-16 bg-[url('/images/home/pattern.png')]":
              isSelected,
          },
        )}
      >
        <div className="text-label-small text-outline">
          {isDocument ? "Per Box" : "Per Kilo"}
        </div>
        <div
          className={`text-label-large ${isSelected ? "text-primary" : "text-on-surface"}`}
        >
          {DEFAULT_CURRENCY.symbol}
          {wage}
        </div>
      </div>
    </div>
  );
};
