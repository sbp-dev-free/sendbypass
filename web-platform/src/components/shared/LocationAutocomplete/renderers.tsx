import { Icon } from "@/components/shared";
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

export const getOptionLabel = (showZipCode?: boolean) => (option: Option) => {
  if (!option || !option.label) {
    return "";
  }

  const typeToLabelMapping: Record<string, keyof typeof option.label> = {
    CITY: "city",
    AIRPORT: "airport",
    GENERIC: "airport",
  };
  const labelKey = typeToLabelMapping[option.type] || "country";
  let label = option.label[labelKey];

  if (labelKey === "country" && showZipCode && option.zip_code) {
    label = `(+${option.zip_code}) ${label}`;
  }

  return label;
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
  // eslint-disable-next-line no-unused-vars
  { key, ...props }: any,
  option: Option,
  showZipCode?: boolean,
) => (
  <li
    key={option.id}
    {...props}
    className={cn(
      "flex gap-8 items-center py-12 px-8 cursor-pointer text-on-surface transition-all duration-200 hover:bg-surface-container rounded-small",
      props.className,
    )}
  >
    {renderLocationIcon(option.type)}
    {showZipCode && (
      <span className="text-body-small text-outline">(+{option.zip_code})</span>
    )}
    {renderOptionValue(option)}
  </li>
);
