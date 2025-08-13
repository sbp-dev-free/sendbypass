import { sendbypassApi } from "@/services/base";
import { TripResponse } from "@/services/types";

import { TripBody } from "./types";
interface UpdateTripRequest {
  id: string | number;
  body: Partial<TripBody>;
}
export const updateTripApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    updateTrip: builder.mutation<TripResponse, UpdateTripRequest>({
      query: ({ id, body }) => {
        return {
          url: `/trips/${id}`,
          method: "PATCH",
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
