export const ORDERS_STATUS = [
  {
    value: "true",
    label: "In Progress",
    icon: "loading",
  },
  { value: "false", label: "History", icon: "folder file open" },
] as const;
export const ORDERS_TYPES = [
  {
    value: "all",
    label: "All",
  },
  { value: "trips", label: "Trips" },
  { value: "needs", label: "Needs" },
] as const;
