import { sendbypassApi } from "@/services/base";

export const readStatsApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getVisitorStats: builder.query<{ daily: number; monthly: number }, void>({
      query: () => ({
        url: "/stats/visitors",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetVisitorStatsQuery } = readStatsApi;
