import { sendbypassApi } from "@/services/base";

import { RequestParams, RequestsResponse } from "./types";

export const readRequestsApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getRequests: builder.query<RequestsResponse, Partial<RequestParams> | void>(
      {
        query: (params) => {
          return {
            url: "/activity_requests",
            params,
          };
        },
        providesTags: ["requests"],
      },
    ),
  }),
});
