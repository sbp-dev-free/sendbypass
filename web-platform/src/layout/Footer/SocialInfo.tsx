import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Link from "next/link";

import { Icon } from "@/components";
import { getConfigs } from "@/configs";
import { ROUTES } from "@/constants";
import { SOCIAL_ICONS } from "@/constants/globals";
import { cn } from "@/utils";

import packageJson from "../../../package.json";

import { CopyrightInfoProps } from "./types";

const FOOTER_LINKS = [
  { href: ROUTES.contactUs, label: "Contact us" },
  { href: ROUTES.termsOfService, label: "Terms of service" },
  { href: ROUTES.privacyPolicy, label: "Privacy policy" },
];

const SocialIcons = () => (
  <div className="flex gap-4">
    {SOCIAL_ICONS.map((socialIcon, index) => (
      <IconButton
        key={index}
        color="standard"
        href={socialIcon.link || "#"}
        target="_blank"
        aria-label={socialIcon.name}
      >
        <Icon name={socialIcon.name} />
      </IconButton>
    ))}
  </div>
);

const FooterLinks = () => (
  <div className="flex gap-16 items-center">
    {FOOTER_LINKS.map((link, index) => (
      <Link
        key={index}
        href={link.href}
        className="xs:text-[10px] sm:text-body-small text-on-surface hover:text-primary"
      >
        {link.label}
      </Link>
    ))}
  </div>
);

const CopyrightInfo = ({ className }: CopyrightInfoProps) => (
  <span className={cn("!text-body-small text-outline", className)}>
    © 2025 SendByPass
  </span>
);
export const SocialInfo = () => {
  const isDev = getConfigs().isDev;
  const version = isDev
    ? packageJson.version
    : packageJson.version.split("-")[0];

  const versionInfo = (
    <>
      <Typography
        variant="caption"
        className="xs:text-[10px] sm:text-body-small text-on-surface flex items-center"
      >
        {process.env.NEXT_PUBLIC_ORIGIN} v{version}
      </Typography>
      <Divider orientation="vertical" flexItem />
    </>
  );

  return (
    <div className="flex flex-col gap-16 items-center p-16 lg:px-12 lg:py-4 lg:gap-0 lg:flex-row lg:justify-between bg-surface-container rounded-small">
      <SocialIcons />

      <div className="flex gap-16 items-center">
        <div className="lg:flex hidden gap-16">{versionInfo}</div>

        <FooterLinks />
        <Divider
          orientation="vertical"
          flexItem
          className="hidden lg:inline-flex"
        />

        <CopyrightInfo className="hidden lg:inline-flex" />
      </div>

      <div className="lg:hidden flex gap-16">
        {versionInfo}
        <CopyrightInfo className="lg:hidden" />
      </div>
    </div>
  );
};
