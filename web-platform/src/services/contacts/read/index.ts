import { sendbypassApi } from "@/services/base";

import { ContactsResponse } from "./types";

export const readContactsApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getContacts: builder.query<ContactsResponse, void>({
      query: () => {
        return {
          url: "/contacts",
        };
      },
      providesTags: ["contacts"],
    }),
  }),
});
