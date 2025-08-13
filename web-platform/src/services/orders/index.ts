import { createOrdersApi } from "./create";
import { readOrdersApi } from "./read";
import { updateOrderApi } from "./update";

export const { useCreateOrderMutation } = createOrdersApi;
export const { useGetOrdersQuery } = readOrdersApi;
export const { useUpdateOrderMutation } = updateOrderApi;
