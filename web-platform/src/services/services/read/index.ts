import { sendbypassApi } from "@/services/base";
import { ServiceResponse } from "@/services/types";

import { ServicesParams, ServicesResponse } from "./types";

export const readServiceApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getServices: builder.query<
      ServicesResponse,
      Partial<ServicesParams> | void
    >({
      query: (params) => {
        return {
          url: "/services",
          params,
        };
      },
      providesTags: ["services"],
    }),
    getService: builder.query<ServiceResponse, string | number>({
      query: (id) => {
        return {
          url: `/services/${id}`,
        };
      },
    }),
  }),
});
