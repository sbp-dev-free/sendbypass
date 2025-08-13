import { sendbypassApi } from "@/services/base";

export const deleteTripApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    deleteTrip: builder.mutation<void, string | number>({
      query: (id) => {
        return {
          url: `/trips/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["trips"],
    }),
  }),
});
