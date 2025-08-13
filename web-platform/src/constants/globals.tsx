import { Option } from "@/components/shared/LocationAutocomplete/types";

import { PRIVATE_ROUTES, ROUTES } from "./routes";

export const PUBLIC_HEADER_ITEMS = [
  {
    id: 1,
    name: "Home",
    href: ROUTES.home,
  },
  {
    id: 2,
    name: "Connect Hub",
    href: ROUTES.connectHub.requestToPassengers,
  },
  {
    id: 3,
    name: "Security",
    href: ROUTES.security,
  },
  {
    id: 4,
    name: "FAQ",
    href: `${ROUTES.faq}?category=All`,
  },
];

export const MOBILE_MENU_ITEMS = [
  {
    id: 1,
    name: "Home",
    icon: "Home",
    href: ROUTES.home,
  },
  {
    id: 2,
    name: "Connect hub",
    icon: "Delivery",
    href: ROUTES.connectHub.requestToPassengers,
  },
  {
    id: 3,
    name: "About us",
    icon: "Building office",
    href: ROUTES.aboutUs,
  },
  {
    id: 4,
    name: "FAQ",
    icon: "question mark circle",
    href: ROUTES.faq,
  },
  {
    id: 5,
    name: "Security",
    icon: "Shield done",
    href: ROUTES.security,
  },
  {
    id: 6,
    name: "Blog",
    icon: "Calendar 2 line",
    href: ROUTES.blog,
  },
];

export const SOCIAL_ICONS = [
  {
    name: "x-com",
    link: "https://x.com/sendbypass_co",
  },
  {
    name: "Facebook Circle",
    link: "https://www.facebook.com/share/1ALJ919RC2/",
  },
  {
    name: "Instagram",
    link: "https://www.instagram.com/sendbypass?igsh=MWpyNDB3enBmaWFtcA==",
  },
  {
    name: "Linkedin Square",
    link: "https://www.linkedin.com/company/sendbypass",
  },
  {
    name: "youtube",
    link: "https://www.youtube.com/@Sendbypass",
  },
];

export const BOTTOM_NAVIGATION_ITEMS = [
  {
    id: 1,
    label: "Trips",
    href: PRIVATE_ROUTES.trips.index,
    icon: "plane add",
  },
  {
    id: 2,
    label: "Needs",
    icon: "Grid interface add plus",
    href: PRIVATE_ROUTES.needs.index,
  },
  {
    id: 3,
    label: "Connect hub",
    icon: "share 4",
    href: ROUTES.connectHub.requestToPassengers,
  },
  {
    id: 4,
    label: "Requests",
    icon: "send message",
    href: PRIVATE_ROUTES.requests,
  },
  {
    id: 5,
    label: "Orders",
    icon: "Delivery Clock Time",
    href: PRIVATE_ROUTES.orders,
  },
];

export const PROFILE_MENU_ITEMS_DESKTOP = [
  {
    id: 1,
    icon: "Profile",
    label: "Profile",
    href: PRIVATE_ROUTES.profile,
    badge: (
      <div className="py-6 px-8 rounded-full bg-warning-opacity-8 text-warning text-label-medium">
        Incomplete
      </div>
    ),
  },
  {
    id: 2,
    icon: "user star",
    label: "Referral Program",
    href: PRIVATE_ROUTES.referral,
  },
  {
    id: 3,
    icon: "plane add",
    label: "Trips",
    href: PRIVATE_ROUTES.trips.index,
  },
  {
    id: 4,
    icon: "Grid interface add plus",
    label: "Needs",
    href: PRIVATE_ROUTES.needs.index,
  },
  {
    id: 5,
    icon: "Delivery Clock Time",
    label: "Requests",
    href: PRIVATE_ROUTES.requests,
  },
  {
    id: 6,
    icon: "Send message",
    label: "Orders",
    href: PRIVATE_ROUTES.orders,
  },
  {
    id: 7,
    icon: "Logout",
    label: "Logout",
    href: "#",
  },
];

export const PROFILE_MENU_ITEMS_MOBILE = [
  {
    id: 1,
    icon: "Profile",
    label: "Profile",
    href: PRIVATE_ROUTES.profile,
    badge: (
      <div className="py-6 px-8 rounded-full bg-warning-opacity-8 text-warning text-label-medium">
        Incomplete
      </div>
    ),
  },
  {
    id: 2,
    icon: "user star",
    label: "Referral Program",
    href: PRIVATE_ROUTES.referral,
  },
  {
    id: 3,
    icon: "Logout",
    label: "Logout",
    href: "#",
  },
];

export const NEED_OPTIONS = [
  {
    title: "Trip",
    icon: "plane add",
    description: "Clothes, Electronic gadget, etc.",
    href: PRIVATE_ROUTES.trips.create,
  },
  {
    title: "Shipping",
    icon: "Delivery",
    description: "Document, clothes, food, etc.",
    href: PRIVATE_ROUTES.needs.shipping.create,
  },
  {
    title: "Shopping",
    icon: "Shopping bag remove",
    description: "Clothes, Electronic gadget, etc.",
    href: PRIVATE_ROUTES.needs.shopping.create,
  },
];

export const ANY_LOCATION_OPTION: Option = {
  id: -1,
  value: undefined,
  label: {
    country: "City or Airport",
    city: "Country",
    airport: "Any locations",
  },
  type: "GENERIC",
};

export const createKycOptions = (
  handleGlobalProvider: () => void,
  handleLocalProvider: () => void,
) => [
  {
    title: "Global provider",
    icon: "World location",
    description: "Passport, National ID Card, etc.",
    onClick: handleGlobalProvider,
    showBadge: true,
    badgeText: "More trustful",
    disabled: true,
  },
  {
    title: "Local provider",
    icon: "Pin",
    description: "Mobile, National ID, etc.",
    onClick: handleLocalProvider,
    disabled: false,
  },
];
