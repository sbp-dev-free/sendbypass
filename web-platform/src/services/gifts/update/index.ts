import { sendbypassApi } from "@/services/base";
export const applyGiftsApi = sendbypassApi.injectEndpoints({
  endpoints: (builder) => ({
    applyGift: builder.mutation<any, { code: string }>({
      query: (body) => ({
        url: "/gifts/apply",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: true,
});
