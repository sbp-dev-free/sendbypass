import { sendbypassApi } from "@/services/base";
import { getToken } from "@/utils";

import { SignInResponse } from "../signin/types";

export const refreshTokenApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    refreshToken: builder.mutation<SignInResponse, void>({
      query: () => {
        const url = `/login/refresh`;
        const refresh = getToken("refresh");
        return {
          url,
          method: "POST",
          body: { refresh },
        };
      },
      invalidatesTags: ["profile"],
    }),
  }),
});

export const { useRefreshTokenMutation } = refreshTokenApi;
