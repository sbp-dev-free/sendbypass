import { ROUTES } from "../routes";

export const TABS_ENUM = {
  requestToPassengers: "request-to-passengers",
  startToShop: "start-to-shop",
  startToShip: "start-to-ship",
};

export const CONNECT_HUB_TABS = [
  {
    label: "Request to Passengers",
    value: TABS_ENUM.requestToPassengers,
    icon: "plane take off",
    href: ROUTES.connectHub.requestToPassengers,
  },
  {
    label: "Start to Ship",
    value: TABS_ENUM.startToShip,
    icon: "Delivery",
    href: ROUTES.connectHub.startToShip,
  },
  {
    label: "Start to Shop",
    value: TABS_ENUM.startToShop,
    icon: "Shopping bag remove",
    href: ROUTES.connectHub.startToShop,
  },
];

export const CONNECT_HUB_MOBILE_TABS = [
  {
    label: "Passengers",
    value: TABS_ENUM.requestToPassengers,
    icon: "plane take off",
    href: ROUTES.connectHub.requestToPassengers,
  },
  {
    label: "Shipping",
    value: TABS_ENUM.startToShip,
    icon: "Delivery",
    href: ROUTES.connectHub.startToShip,
  },
  {
    label: "Shopping",
    value: TABS_ENUM.startToShop,
    icon: "Shopping bag remove",
    href: ROUTES.connectHub.startToShop,
  },
];

export const SHOPPING_CATEGORIES = [
  {
    id: 1,
    name: "Cloth",
  },
  {
    id: 2,
    name: "Electronic Gadget",
  },
  {
    id: 3,
    name: "Food",
  },
  {
    id: 4,
    name: "Document",
  },
];

export const SORT_OPTIONS = [
  "Best reviewed and lowest price",
  "Price: Low to High",
  "Price: High to Low",
];
