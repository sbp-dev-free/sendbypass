import { sendbypassApi } from "@/services/base";
import { OrderRequest, PaginatedOrderList } from "@/types";

export const createOrdersApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createOrder: builder.mutation<PaginatedOrderList, OrderRequest>({
      query: (body) => {
        return {
          url: "/orders",
          method: "POST",
          body,
        };
      },
    }),
  }),
});
