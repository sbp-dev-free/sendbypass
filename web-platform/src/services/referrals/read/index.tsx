import { sendbypassApi } from "@/services/base";

import { TransformedReferral } from "../types";
export const readReferralsApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getReferrals: builder.query<TransformedReferral, void>({
      query: () => ({
        url: "/referrals",
      }),
      transformResponse: (response): TransformedReferral => {
        return response as TransformedReferral;
      },
    }),
  }),
});
