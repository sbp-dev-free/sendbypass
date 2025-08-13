import { sendbypassApi } from "@/services/base";

import { LocationParams, LocationsPaginatedResponse } from "./types";

export const readLocationsApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getLocations: builder.query<
      LocationsPaginatedResponse,
      Partial<LocationParams> | void
    >({
      query: (params) => {
        return {
          url: "/locations",
          params,
        };
      },
    }),
  }),
});
