import { Profile } from "@/types";

export interface AppProfileProps {
  profile: Profile;
  hasEmail?: boolean;
  hasRating?: boolean;
  role?: string;
}
