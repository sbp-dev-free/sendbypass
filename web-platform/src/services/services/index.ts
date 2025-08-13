import { createServiceApi } from "./create";
import { deleteServiceApi } from "./delete";
import { readServiceApi } from "./read";
import { updateServiceApi } from "./update";

export const { useCreateServiceMutation } = createServiceApi;
export const { useGetServicesQuery, useGetServiceQuery } = readServiceApi;
export const { useUpdateServiceMutation } = updateServiceApi;
export const { useDeleteServiceMutation } = deleteServiceApi;
