import { FC } from "react";

import Link from "next/link";

import { NavItemProps } from "./types";

export const NavItem: FC<NavItemProps> = ({
  children,
  label,
  href,
  isActive,
}) => {
  return (
    <Link
      href={href}
      className="flex flex-col gap-4 items-center pt-12 pb-16 w-full"
    >
      <span className="flex justify-center">{children}</span>
      <span
        className={`xs:text-[10px] xs:font-medium sm:text-label-medium-prominent ${
          isActive ? "text-on-surface" : "text-outline"
        }`}
      >
        {label}
      </span>
    </Link>
  );
};
