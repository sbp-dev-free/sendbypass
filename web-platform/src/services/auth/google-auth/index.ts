import { sendbypassApi } from "@/services/base";

import { GoogleAuthRequest, GoogleAuthResponse } from "./types";

export const googleAuthApi = sendbypassApi.injectEndpoints({
  endpoints: (builder) => ({
    googleRedirect: builder.mutation<GoogleAuthResponse, GoogleAuthRequest>({
      query: (credentials) => ({
        url: "/google_login/redirect",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: GoogleAuthResponse, meta) => {
        return { token: response.token, status: meta?.response?.status };
      },
      invalidatesTags: ["profile"],
    }),
  }),
});

export const { useGoogleRedirectMutation } = googleAuthApi;
