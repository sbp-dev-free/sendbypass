"use client";

import MuiBreadcrumbs from "@mui/material/Breadcrumbs";

import { Icon } from "@/components/shared";
import { useBreadcrumbs } from "@/hooks";

export const Breadcrumbs = () => {
  const { breadcrumbs } = useBreadcrumbs();

  return (
    <MuiBreadcrumbs
      separator={
        <Icon name="Chevron Right MD" className="text-[16px] mt-4 -mx-4" />
      }
      aria-label="breadcrumb"
    >
      {breadcrumbs.map((breadcrumb, index) => (
        <span key={index}>{breadcrumb}</span>
      ))}
    </MuiBreadcrumbs>
  );
};
