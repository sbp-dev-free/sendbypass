import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";

import { ROUTES } from "@/constants";
import { setCustomCookiesSelected } from "@/store/slices/cookieConsentSlice";

import logo from "../../../public/images/logo.svg";

import { type FooterLink } from "./types";

const Section = ({ title, links }: { title: string; links: FooterLink[] }) => (
  <div className="space-y-16 lg:min-w-[300px]">
    <h4 className="text-title-large">{title}</h4>
    <div>
      {links.map(({ href, label, onClick }) => (
        <div key={label} className="flex gap-8 items-center group">
          <div className="size-[5px] rounded-full bg-outline-variant group-hover:bg-primary transition-colors" />
          {!href ? (
            <span
              onClick={onClick}
              className="text-body-medium text-on-surface hover:text-primary cursor-pointer"
            >
              {label}
            </span>
          ) : (
            <Link
              href={href}
              className="text-body-medium text-on-surface hover:text-primary"
            >
              {label}
            </Link>
          )}
        </div>
      ))}
    </div>
  </div>
);

export const CompanyInfo = () => {
  const dispatch = useDispatch();
  const supportsInfo = [
    { href: ROUTES.legalConsiderations, label: "Legal considerations" },
    { href: ROUTES.security, label: "Security" },
    { href: ROUTES.aboutUs, label: "About us" },
    { href: ROUTES.contactUs, label: "Contact us" },
    { href: `${ROUTES.faq}?category=All`, label: "FAQ" },

    {
      onClick: () => {
        dispatch(setCustomCookiesSelected(true));
      },
      label: "Manage cookies",
    },
  ];

  const platformsInfo = [
    { href: ROUTES.connectHub.requestToPassengers, label: "Connect Hub" },
    { href: ROUTES.whatsNew, label: "What's new" },
    { href: ROUTES.roadmap, label: "Roadmap" },
    { href: ROUTES.feedBack, label: "FeedBack" },
    { href: ROUTES.kycLevel, label: "KYC Levels" },
    { href: ROUTES.blog, label: "Blog" },
  ];

  return (
    <div className="flex flex-col gap-24 px-16 lg:justify-between lg:items-start lg:gap-20 lg:w-full lg:flex-row">
      <div className="space-y-16 w-auto lg:max-w-[340px]">
        <Image
          src={logo}
          alt="logo"
          width={170}
          height={24}
          className="block"
        />
        <div className="text-body-medium text-on-surface-variant">
          You can use the services you need while traveling. Send your packages
          at a reasonable price and in the shortest time, buy from outside your
          country and receive them at your destination.
        </div>
      </div>
      <div className="flex flex-row gap-16">
        <Section title="Support" links={supportsInfo} />
        <Section title="Platform" links={platformsInfo} />
      </div>
    </div>
  );
};
