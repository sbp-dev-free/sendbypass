import { sendbypassApi } from "@/services/base";

import { SignUpBody, SignUpResponse } from "./types";

export const signupApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    signUp: builder.mutation<SignUpResponse, SignUpBody>({
      query: (body) => {
        const url = `/users`;
        return {
          url,
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const { useSignUpMutation } = signupApi;
