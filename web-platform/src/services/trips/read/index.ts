import { sendbypassApi } from "@/services/base";
import { TripResponse, TripsResponse } from "@/services/types";

import { TripParams } from "./types";

export const readTripApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getTrips: builder.query<TripsResponse, Partial<TripParams> | void>({
      query: (params) => {
        return {
          url: "/trips",
          params,
        };
      },
      providesTags: ["trips"],
    }),
    getTrip: builder.query<TripResponse, string | number>({
      query: (id) => {
        return {
          url: `/trips/${id}`,
        };
      },
      providesTags: ["trips"],
    }),
  }),
});
