import { sendbypassApi } from "@/services/base";
import { RequestResponse } from "@/services/types";

import { RequestBody } from "./types";

export const createRequestApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createRequest: builder.mutation<RequestResponse, RequestBody>({
      query: (body) => {
        return {
          url: "/requests",
          method: "POST",
          body,
        };
      },
    }),
  }),
});
