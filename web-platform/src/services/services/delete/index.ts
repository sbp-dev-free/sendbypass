import { sendbypassApi } from "@/services/base";

export const deleteServiceApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    deleteService: builder.mutation<void, string | number>({
      query: (id) => {
        return {
          url: `/services/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["services"],
    }),
  }),
});
