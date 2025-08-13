import { sendbypassApi } from "@/services/base";

export const deleteRequirementApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    deleteRequirement: builder.mutation<void, string | number>({
      query: (id) => {
        return {
          url: `/requirements/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["requirements"],
    }),
  }),
});
