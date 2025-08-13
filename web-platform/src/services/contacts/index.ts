import { readContactsApi } from "./read";
import { updateContactsApi } from "./update";

export const { useGetContactsQuery } = readContactsApi;
export const { useUpdateContactsMutation } = updateContactsApi;
