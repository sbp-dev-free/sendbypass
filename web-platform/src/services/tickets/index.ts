import { sendbypassApi } from "@/services/base";

import { TicketBody, TicketResponse } from "./types";

export const ticketsApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    ticket: builder.mutation<TicketResponse, TicketBody>({
      query: (body) => {
        return {
          url: "/tickets",
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const { useTicketMutation } = ticketsApi;
