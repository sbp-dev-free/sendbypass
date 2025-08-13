import { createApi } from "@reduxjs/toolkit/query/react";

import { customBaseQuery } from "./baseQuery";

export const sendbypassApi = createApi({
  reducerPath: "sendbypassApi",
  tagTypes: [
    "email",
    "trips",
    "requirements",
    "requests",
    "services",
    "profile",
    "contacts",
    "addresses",
    "orders",
    "businessProfile",
  ],
  baseQuery: customBaseQuery,
  endpoints: () => ({}),
  refetchOnFocus: process.env.NODE_ENV !== "development",
  refetchOnReconnect: process.env.NODE_ENV !== "development",
  refetchOnMountOrArgChange: process.env.NODE_ENV !== "development",
});
