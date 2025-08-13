import { ReactNode } from "react";

export interface NavItemProps {
  href: string;
  label: string;
  children: ReactNode;
  isActive?: boolean;
}
