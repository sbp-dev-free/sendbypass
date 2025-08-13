import { FeaturesProps, FlightInfoProps, ProductInfoProps } from "../types";

export interface RequirementRequestProps
  extends FlightInfoProps,
    ProductInfoProps {
  features?: Omit<FeaturesProps, "images">;
  description: string;
  requirementId?: number;
  cost?: number;
  onClose?: () => void;
  handleNext?: () => void;
  callback?: () => void;
}

export interface RequestFormProps {
  cost?: number;
  requirementId?: number;
  onClose?: () => void;
  callback?: () => void;
}
