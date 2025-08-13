import { sendbypassApi } from "@/services/base";
import { RequirementResponse } from "@/services/types";
import { makeFormData } from "@/utils";

import { RequirementPatchBody } from "./types";

export const updateRequirementApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    updateRequirement: builder.mutation<
      RequirementResponse,
      RequirementPatchBody
    >({
      query: ({ id, ...data }) => {
        const body = makeFormData(data);
        return {
          url: `/requirements/${id}`,
          method: "PATCH",
          body,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      },
      invalidatesTags: ["requirements"],
    }),
  }),
});
