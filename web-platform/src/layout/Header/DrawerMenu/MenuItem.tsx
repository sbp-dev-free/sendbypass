import Link from "next/link";

import { Icon } from "@/components";

import { MenuItemProps } from "./types";

export const MenuItem = ({ item, children }: MenuItemProps) => {
  return (
    <div className="flex justify-between items-center py-12 px-8 w-full">
      <Link href={item.href ?? ""} className="flex gap-8 items-center grow">
        {item.icon && <Icon name={item.icon} className="text-[24px]" />}
        {item.name}
      </Link>
      {children}
    </div>
  );
};
