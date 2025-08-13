import { createRequirementApi } from "./create";
import { deleteRequirementApi } from "./delete";
import { readRequirementApi } from "./read";
import { updateRequirementApi } from "./update";

export const { useCreateRequirementMutation } = createRequirementApi;
export const {
  useGetRequirementsQuery,
  useGetRequirementQuery,
  useLazyGetRequirementQuery,
} = readRequirementApi;
export const { useUpdateRequirementMutation } = updateRequirementApi;
export const { useDeleteRequirementMutation } = deleteRequirementApi;
