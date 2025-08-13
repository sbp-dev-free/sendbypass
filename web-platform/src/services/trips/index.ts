import { createTripApi } from "./create";
import { deleteTripApi } from "./delete";
import { readTripApi } from "./read";
import { updateTripApi } from "./update";

export const { useCreateTripMutation } = createTripApi;
export const { useGetTripsQuery, useGetTripQuery } = readTripApi;
export const { useUpdateTripMutation } = updateTripApi;
export const { useDeleteTripMutation } = deleteTripApi;
