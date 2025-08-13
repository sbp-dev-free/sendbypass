import { BaseComponentProps } from "@/components/types";
import { Destination, RequirementResponse, UserData } from "@/services/types";

export interface ProductCardProps {
  requirement: RequirementResponse;
  shipping?: boolean;
}

export interface ProductInfoProps {
  user: UserData;
  name: string;
  image: string;
  link: string | undefined;
  price: number;
  category: string;
  shipping?: boolean;
  show?: boolean;
}

export interface FlightInfoProps {
  flight: {
    destination?: Destination;
    source?: Destination;
  };
  className?: string;
}

export interface FeaturesProps {
  width?: number;
  height?: number;
  length?: number;
  weight?: number;
  images?: string[];
  flexible?: boolean;
  num?: number;
  size?: string;
  loadType?: string;
  type?: string;
}

export interface FeatureValue extends BaseComponentProps {
  value?: number;
}

export interface ActionBarProps {
  description: string;
  reward: number;
  onOpenReviewModal: () => void;
}
