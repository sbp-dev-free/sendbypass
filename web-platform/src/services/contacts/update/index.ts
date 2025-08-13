import { sendbypassApi } from "@/services/base";

import { ContactPatchBody } from "./types";

export const updateContactsApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    updateContacts: builder.mutation<void, ContactPatchBody>({
      query: (body) => {
        return {
          url: "/contacts",
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["contacts", "profile"],
    }),
  }),
});
