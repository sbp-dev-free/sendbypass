import { sendbypassApi } from "@/services/base";

import { AddressesPatchBody } from "./types";

export const updateAddressesApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    updateAddresses: builder.mutation<void, AddressesPatchBody>({
      query: (body) => {
        return {
          url: "/user_locations",
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["addresses", "profile"],
    }),
    updateAddress: builder.mutation<void, number>({
      query: (id) => {
        return {
          url: `/user_locations/${id}`,
          method: "PATCH",
          body: {
            current: true,
          },
        };
      },
      invalidatesTags: ["addresses", "profile"],
    }),
  }),
});
