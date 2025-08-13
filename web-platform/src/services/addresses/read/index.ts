import { sendbypassApi } from "@/services/base";

import { AddressesResponse } from "./types";

export const readAddressesApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAddresses: builder.query<AddressesResponse, void>({
      query: () => {
        return {
          url: "/user_locations",
        };
      },
      providesTags: ["addresses"],
    }),
  }),
});
