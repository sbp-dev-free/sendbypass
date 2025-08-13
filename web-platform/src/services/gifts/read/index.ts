import { sendbypassApi } from "@/services/base";
import { PaginatedGiftList } from "@/types";

import { TransomedPaginatedGiftList } from "../types";
export const readGiftsApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getGifts: builder.query({
      query: (params) => {
        return {
          url: "/gifts",
          params,
        };
      },
      transformResponse: (
        response: PaginatedGiftList,
      ): TransomedPaginatedGiftList => ({
        ...response,
      }),
    }),
  }),
});
