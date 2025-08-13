import { sendbypassApi } from "@/services/base";

import { ResetPasswordBody, SendResetPasswordLinkBody } from "./types";

export const resetPasswordApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    sendEmail: builder.mutation<void, SendResetPasswordLinkBody>({
      query: ({ type, ...body }) => {
        const url = `/account_requests`;
        return {
          url,
          method: "POST",
          body: {
            type,
            data: body,
          },
        };
      },
    }),
    resetPassword: builder.mutation<void, ResetPasswordBody>({
      query: ({ type, token, user, ...body }) => {
        const url = `/account_request/${user}/${token}`;
        return {
          url,
          method: "POST",
          body: {
            type,
            data: body,
          },
        };
      },
    }),
  }),
});

export const { useSendEmailMutation, useResetPasswordMutation } =
  resetPasswordApi;
