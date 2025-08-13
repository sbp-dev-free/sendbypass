import { sendbypassApi } from "@/services/base";

import { CitiesResponse, CityParams } from "./types";

export const readCitiesApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getCities: builder.query<CitiesResponse, Partial<CityParams> | void>({
      query: (params) => {
        return {
          url: "/cities",
          params,
        };
      },
    }),
  }),
});

export const { useGetCitiesQuery } = readCitiesApi;
