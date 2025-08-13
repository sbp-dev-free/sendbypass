import { sendbypassApi } from "@/services/base";
import { RequestResponse } from "@/services/types";

import { RequestPatchBody } from "./types";

export const updateRequestApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    updateRequest: builder.mutation<RequestResponse, RequestPatchBody>({
      query: ({ id, ...body }) => {
        return {
          url: `/requests/${id}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["requests"],
    }),
  }),
});
