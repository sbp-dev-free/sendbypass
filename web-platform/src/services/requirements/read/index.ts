import { sendbypassApi } from "@/services/base";
import { RequirementResponse } from "@/services/types";

import { RequirementsParams, RequirementsResponse } from "./types";

export const readRequirementApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getRequirements: builder.query<
      RequirementsResponse,
      Partial<RequirementsParams> | void
    >({
      query: (params) => {
        return {
          url: "/requirements",
          params,
        };
      },
      providesTags: ["requirements"],
    }),
    getRequirement: builder.query<RequirementResponse, string | number>({
      query: (id) => {
        return {
          url: `/requirements/${id}`,
        };
      },
    }),
  }),
});
