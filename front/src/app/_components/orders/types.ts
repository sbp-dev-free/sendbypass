import { GetProfileType } from '../Profile/types';

export interface OrderItemProps {
  order: Order;
  mutate: () => void;
}

export type Order = {
  title: string;
  user: GetProfileType;
  requirement: string;
  destination: string;
  current: number;
  stepId: number;
  role: string;
  properties?: Partial<Properties>[];
  status: string;
};

type Properties = {
  date: string;
  time: string;
  code: string;
  comment: string;
  rate: number;
  image: string;
};
