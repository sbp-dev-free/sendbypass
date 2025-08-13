export * from "./needs";
export * from "./orders";

export const ACTIVITIES_TABS = [
  {
    label: "Trips",
    value: "trips",
  },
  {
    label: "Needs",
    value: "needs",
  },
  {
    label: "Requests",
    value: "requests",
  },
  {
    label: "Orders",
    value: "orders",
  },
] as const;
