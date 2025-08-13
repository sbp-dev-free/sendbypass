import type { DeepPartial } from "react-hook-form";

import { sendbypassApi } from "@/services/base";
import { RequirementResponse } from "@/services/types";
import { makeFormData } from "@/utils";

import { RequirementBody } from "./types";

export const createRequirementApi = sendbypassApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createRequirement: builder.mutation<
      RequirementResponse,
      DeepPartial<RequirementBody>
    >({
      query: (data) => {
        const body = makeFormData(data);
        return {
          url: "/requirements",
          method: "POST",
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
