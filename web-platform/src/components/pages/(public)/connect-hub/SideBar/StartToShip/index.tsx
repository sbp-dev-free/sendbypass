import Divider from "@mui/material/Divider";

import { Category } from "../Category";
import { FiltersActive } from "../FiltersActive";
import { Reward } from "../Reward";
import { Weight } from "../Weight";

export const StartToShipSidebar = () => {
  return (
    <div className="space-y-24">
      <FiltersActive />
      <Divider />
      <Category />
      <Divider />
      <Reward />
      <Divider />
      <Weight />
    </div>
  );
};
