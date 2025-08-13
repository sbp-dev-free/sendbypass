import { sendbypassApi } from "@/services/base";
import { AirportsResponse } from "@/services/types";

export const readAirportsApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAirports: builder.query<AirportsResponse, void>({
      query: () => ({
        url: "/airports",
      }),
    }),
  }),
});
