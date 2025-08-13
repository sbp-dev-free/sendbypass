import { cn, formatIconName } from "@/utils";

import { IconProps } from "./types";

export const Icon = ({ className, name, ...props }: IconProps) => {
  const formattedIconName = formatIconName(name);

  return <i className={cn(formattedIconName, className)} {...props} />;
};
