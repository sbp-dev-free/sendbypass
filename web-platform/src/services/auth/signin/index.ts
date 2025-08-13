import { getConfigs } from "@/configs";
import { ROUTES } from "@/constants";
import { sendbypassApi } from "@/services/base";
import { setTokens } from "@/utils";
import { deepLink } from "@/utils/deepLink";

import { SignInBody, SignInResponse } from "./types";

export const signinApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    signIn: builder.mutation<void, { body: SignInBody; redirectUrl?: string }>({
      query: ({ body }) => {
        const url = `/login`;
        return {
          url,
          method: "POST",
          body,
        };
      },
      transformResponse: (response: SignInResponse, _meta, arg) => {
        if (getConfigs().isApp) deepLink(response);
        else {
          window.location.href = arg.redirectUrl ?? ROUTES.home;
          setTokens(response);
        }
      },
    }),
  }),
});

export const { useSignInMutation } = signinApi;
