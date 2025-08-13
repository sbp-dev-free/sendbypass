import { sendbypassApi } from "@/services/base";

import { EmailResponse, StoreEmailRequest, StoreEmailResponse } from "./types";

export const emailApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    storeEmail: builder.mutation<StoreEmailResponse, StoreEmailRequest>({
      query: ({ email, referred }: StoreEmailRequest) => {
        const url = `${process.env.NEXT_PUBLIC_LOCALHOST_API_URL}/api/auth`;
        const body = { email, ...(referred && { referred }) };
        return {
          url,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["email"],
    }),
    getEmail: builder.query<EmailResponse, void>({
      query: () => {
        const url = `${process.env.NEXT_PUBLIC_LOCALHOST_API_URL}/api/auth`;
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["email"],
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useStoreEmailMutation, useGetEmailQuery } = emailApi;
