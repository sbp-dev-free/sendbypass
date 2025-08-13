export interface BadgeTripProps {
  status: TripStatus;
  className?: string;
}

export interface CollapsibleTableProps {
  columns: string[];
  data: any[];
  renderRowDetails: (row: any) => React.ReactNode;
  expandColumn?: string;
}

export interface TripItemProps {
  trip: TripResponse;
}
