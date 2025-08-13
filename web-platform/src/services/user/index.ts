import { sendbypassApi } from "@/services/base";

export const userApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    deleteAccount: builder.mutation<void, void>({
      query: () => {
        return {
          url: `/user`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const { useDeleteAccountMutation } = userApi;
