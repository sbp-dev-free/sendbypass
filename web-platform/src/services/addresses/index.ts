import { readAddressesApi } from "./read";
import { updateAddressesApi } from "./update";

export const { useGetAddressesQuery } = readAddressesApi;
export const { useUpdateAddressesMutation, useUpdateAddressMutation } =
  updateAddressesApi;
