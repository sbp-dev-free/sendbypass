import { ClassValue } from "clsx";

export type CopyrightInfoProps = {
  className?: ClassValue;
};

export interface FooterLink {
  href?: string;
  onClick?: () => void;
  label: string;
}
