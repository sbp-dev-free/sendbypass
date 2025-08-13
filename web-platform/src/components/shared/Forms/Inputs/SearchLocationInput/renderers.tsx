import { Icon } from "@/components";
import { LOCATION_TYPE } from "@/enums/location";
import { cn } from "@/utils";

import { Option } from "./types";

export const renderLocationIcon = (type: keyof typeof LOCATION_TYPE) => {
  switch (type) {
    case "AIRPORT":
      return <Icon name="plane take off line" className="text-[20px]" />;
    case "COUNTRY":
      return <Icon name="Pin" className="text-[20px]" />;
    case "CITY":
      return <Icon name="Building office" className="text-[20px]" />;
    default:
      return <Icon name="World location" className="text-[20px]" />;
  }
};

export const getOptionLabel = (option: Option) => {
  if (option.type === "CITY") {
    return option.label.city;
  }
  if (option.type === "AIRPORT") {
    return option.label.airport;
  }
  if (option.type === "GENERIC") {
    return option.label.airport;
  }
  return option.label.country;
};

export const renderOptionValue = (option: Option) => (
  <div>
    {option.type === "COUNTRY" && (
      <p className="text-label-large">{option.label.country}</p>
    )}
    {option.type === "CITY" && (
      <div>
        <p className="text-label-large">{option.label.city}</p>
        <span className="text-body-small text-outline">
          {option.label.country}
        </span>
      </div>
    )}
    {(option.type === "AIRPORT" || option.type === "GENERIC") && (
      <div>
        <p className="text-label-large">{option.label.airport}</p>
        <span className="space-x-4 text-body-small text-outline">
          <span>{option.label.city}</span>,<span>{option.label.country}</span>
        </span>
      </div>
    )}
  </div>
);

export const renderOption = (
  props: React.HTMLAttributes<HTMLLIElement> & { key: string },
  option: Option,
) => (
  <li
    {...props}
    key={option.id}
    className={cn(
      "flex gap-8 items-center py-12 px-8 cursor-pointer text-on-surface",
      props.className,
    )}
  >
    {renderLocationIcon(option.type)}
    {renderOptionValue(option)}
  </li>
);
