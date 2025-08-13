export interface Column {
  title: string;
  dataIndex: string;
}

export interface ServiceRow {
  key: string;
  services: React.ReactNode;
  max_weight: string | number;
  fee: number;
  description: React.ReactNode;
}

export interface TableProps {
  columns: Column[];
  dataSource: ServiceRow[];
  className?: string;
  expansionType?: string;
}

export interface ExpandIconProps {
  isExpanded: boolean;
  onClick: () => void;
}
export interface DescriptionCellProps {
  row: any;
  isMobile: boolean;
  onOpen: (row: any) => void;
}
