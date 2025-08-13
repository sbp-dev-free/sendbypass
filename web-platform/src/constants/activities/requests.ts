import { Request, RequestSide } from "@/enums/requests";

export const REQUESTS_TABS = [
  {
    label: "Trip",
    value: Request.SERVICE,
    icon: "plane take off",
  },
  {
    label: "Shipping",
    value: Request.SHIPPING,
    icon: "plane take off",
  },
  {
    label: "Shopping",
    value: Request.SHOPPING,
    icon: "shopping-bag-remove",
  },
];

export const REQUETS_STATUSES = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Inbox",
    value: RequestSide.INBOX,
  },
  {
    label: "Outbox",
    value: RequestSide.OUTBOX,
  },
];
