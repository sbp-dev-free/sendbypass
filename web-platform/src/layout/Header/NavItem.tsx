import { FC } from "react";

import Link from "next/link";

import { NavItemProps } from "./types";

export const NavItem: FC<NavItemProps> = ({ name, href, isActive }) => {
  return (
    <Link
      href={href ?? ""}
      className={`transition-all text-body-medium text-on-surface hover:text-primary hover:font-medium duration-200 ${isActive && "text-primary font-medium"}`}
    >
      {name}
    </Link>
  );
};
