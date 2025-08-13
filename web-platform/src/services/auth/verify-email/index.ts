import { sendbypassApi } from "@/services/base";

import { VerifyEmailBody } from "./types";

export const verifyEmailApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    verifyEmail: builder.mutation<void, VerifyEmailBody>({
      query: ({ token, user }) => {
        const url = `/user_documents/${user}/${token}/`;
        const controller = new AbortController();

        return {
          url,
          method: "POST",
          signal: controller.signal,
        };
      },
    }),
  }),
});

export const { useVerifyEmailMutation } = verifyEmailApi;
