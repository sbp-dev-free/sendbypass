import { FC } from "react";

import Checkbox from "@mui/material/Checkbox";

import { FilterCheckBoxProps } from "./types";

export const FilterCheckBox: FC<FilterCheckBoxProps> = ({
  id,
  label,
  count,
  checked,
  onChange,
}) => {
  return (
    <span className="flex justify-between items-center h-32">
      <span>
        <Checkbox id={id} onChange={onChange} checked={checked} />
        <label
          htmlFor={id}
          className="cursor-pointer text-body-small text-on-surface capitalize"
        >
          {label.toLocaleLowerCase()}
        </label>
      </span>
      {count && (
        <span className="text-body-small text-on-surface-variant">
          ({count})
        </span>
      )}
    </span>
  );
};
