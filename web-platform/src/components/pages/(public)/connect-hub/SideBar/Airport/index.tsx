import { FC } from "react";

import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

import { Icon } from "@/components/shared";

import { FilterCheckBox } from "../FilterCheckBox";

import { AirportProps } from "./types";

export const Airport: FC<AirportProps> = ({ isFromAirport = false }) => {
  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <span className="text-title-small text-on-surface">
          {isFromAirport ? "From" : "To"} Airport
        </span>
        <span className="text-body-small text-on-surface-variant">({12})</span>
      </div>
      <TextField
        fullWidth
        label="Search airport"
        sx={{
          "& .MuiInputBase-root": { height: "44px" },
          "& label": { transform: "translate(16px, 60%) scale(1)" },
        }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <Icon
                  name="Search"
                  className="text-[24px] cursor-pointer text-outline"
                />
              </InputAdornment>
            ),
          },
        }}
      />
      <div>
        <FilterCheckBox id="1" label="Airport 1" count={6} />
        <FilterCheckBox id="2" label="Airport 2" count={6} />
        <FilterCheckBox id="3" label="Airport 3" count={6} />
        <FilterCheckBox id="4" label="Airport 4" count={6} />
      </div>
      <div className="flex justify-center">
        <Button variant="text">Show all</Button>
      </div>
    </div>
  );
};
