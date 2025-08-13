import { sendbypassApi } from "@/services/base";
import { PaginatedOrderList, Trip } from "@/types";

import { TransomedPaginatedOrderList } from "../types";

export const readOrdersApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: (params) => {
        return {
          url: "/orders",
          params,
        };
      },
      providesTags: ["orders"],
      transformResponse: (
        response: PaginatedOrderList,
      ): TransomedPaginatedOrderList => ({
        ...response,
        results: response.results.map((order) => ({
          ...order,
          order_type: order.requirement_data.type,
          order_status: order.requirement_data.status,
          order_id: order.id,
          order_name: order.requirement_data.name,
          order_role: order.role === "TRAVELER" ? "Sender" : "Traveler",
          order_destination: (order as any)?.service_data?.trip_data
            .destination_data.country_iso3,
          order_origin: (order as any)?.service_data?.trip_data?.source_data
            .country_iso3,
          order_traveler_sender:
            order.role === "TRAVELER"
              ? order.customer_data
              : order.traveler_data,

          order_properties: order.requirement_data.properties,

          order_flight_data: (order as any)?.service_data?.trip_data as Trip,
          order_deal: order.deal,
        })),
      }),
    }),
  }),
});
