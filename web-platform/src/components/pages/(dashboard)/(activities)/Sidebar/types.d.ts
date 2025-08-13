export type StatusKey = "all" | "active" | "history";
export type NeedType = "shipping" | "shopping";

export interface StatusCounts {
  all: number;
  active: number;
  history: number;
}

export interface ActivityStats {
  trips: StatusCounts;
  needs: Record<NeedType, StatusCounts>;
}
