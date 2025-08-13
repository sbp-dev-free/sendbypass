import { sendbypassApi } from "@/services/base";
import { Order, PatchedOrderRequest } from "@/types";

export const updateOrderApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    updateOrder: builder.mutation<Order, PatchedOrderRequest & { id: number }>({
      query: ({ id, ...body }) => {
        return {
          url: `/orders/${id}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["orders"],
    }),
  }),
});
