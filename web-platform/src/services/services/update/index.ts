import { sendbypassApi } from "@/services/base";
import { ServiceResponse } from "@/services/types";

import { ServicePatchBody } from "./types";

export const updateServiceApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    updateService: builder.mutation<ServiceResponse, ServicePatchBody>({
      query: ({ id, ...body }) => {
        return {
          url: `/services/${id}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["services"],
    }),
  }),
});
