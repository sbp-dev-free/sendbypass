import Divider from "@mui/material/Divider";

import { Budget } from "../Budget";
import { FiltersActive } from "../FiltersActive";
import { ServiceType } from "../ServiceType";
import { Weight } from "../Weight";

export const PassengersSidebar = () => {
  return (
    <div className="space-y-24">
      <FiltersActive />
      <Divider />
      <ServiceType />
      <Divider />
      <Budget />
      <Divider />
      <Weight />
    </div>
  );
};
