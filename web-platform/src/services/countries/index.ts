import { sendbypassApi } from "@/services/base";

import { CountriesResponse } from "./types";

export const readCountriesApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getCountries: builder.query<CountriesResponse, void>({
      query: () => {
        return {
          url: "/countries",
        };
      },
    }),
  }),
});

export const { useGetCountriesQuery } = readCountriesApi;
