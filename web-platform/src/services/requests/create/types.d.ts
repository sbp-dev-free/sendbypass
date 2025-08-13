import { Deal } from "@/services/types";

export interface RequestBody {
  requirement: number;
  service: string;
  deal: Pick<Deal, "cost">;
  description?: string;
}
