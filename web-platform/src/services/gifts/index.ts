import { readGiftsApi } from "./read";
import { applyGiftsApi } from "./update";
export const { useGetGiftsQuery } = readGiftsApi;
export const { useApplyGiftMutation } = applyGiftsApi;
