import { sendbypassApi } from "@/services/base";

import { LanguagesResponse } from "./types";

export const readLanguageApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getLanguages: builder.query<LanguagesResponse, void>({
      query: (params) => {
        return {
          url: "/languages",
          params,
        };
      },
    }),
  }),
});

export const { useGetLanguagesQuery } = readLanguageApi;
