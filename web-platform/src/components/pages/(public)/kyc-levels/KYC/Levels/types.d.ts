export interface Feature {
  [key: string]: boolean;
}
export interface LevelProps {
  icon: string;
  color: string;
  bg: string;
  level: string;
  description: string;
  features_description: string;
  features: Feature[];
  verify: string;
  status?: boolean;
  kyc_level?: string;
}
