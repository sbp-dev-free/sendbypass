import { Gift, PaginatedGiftList } from "@/types";
export type TransformedGift = Gift;
export interface TransomedPaginatedGiftList
  extends Omit<PaginatedGiftList, "results"> {
  results: Array<TransformedGift>;
}
