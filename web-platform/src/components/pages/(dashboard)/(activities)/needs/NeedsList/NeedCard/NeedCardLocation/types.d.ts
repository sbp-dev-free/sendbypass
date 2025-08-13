import { Destination } from "@/services/types";

export interface NeedCardLocationProps {
  className?: string;
  origin: Destination;
  destination: Destination;
}

export interface NeedCardLocationInfoProps {
  title: string;
  destination: Destination;
  date: string;
}
