import { sendbypassApi } from "@/services/base";
import { TripResponse } from "@/services/types";

export const createTripApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createTrip: builder.mutation<TripResponse, FormData>({
      query: (body) => {
        return {
          url: "/trips",
          method: "POST",
          body,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      },
      invalidatesTags: ["trips"],
    }),
  }),
});
