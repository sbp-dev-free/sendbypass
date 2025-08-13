import { createRequestApi } from "./create";
import { readRequestsApi } from "./read";
import { updateRequestApi } from "./update";

export const { useCreateRequestMutation } = createRequestApi;
export const { useGetRequestsQuery } = readRequestsApi;
export const { useUpdateRequestMutation } = updateRequestApi;
