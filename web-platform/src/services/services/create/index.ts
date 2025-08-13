import { sendbypassApi } from "@/services/base";
import { ServiceResponse } from "@/services/types";

import { ServiceBody } from "./types.d";

export const createServiceApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createService: builder.mutation<ServiceResponse, ServiceBody>({
      query: (body) => {
        return {
          url: "/services",
          method: "POST",
          body,
        };
      },
    }),
  }),
});
