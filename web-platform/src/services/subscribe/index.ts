import { sendbypassApi } from "@/services/base";

import { SubscribeResponse } from "./types";

export const subscriptionApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    subscribe: builder.mutation<SubscribeResponse, string>({
      query: (email) => {
        return {
          url: "/subscribes",
          method: "POST",
          body: { email },
        };
      },
    }),
  }),
});

export const { useSubscribeMutation } = subscriptionApi;
