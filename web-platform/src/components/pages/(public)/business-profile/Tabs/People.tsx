import Avatar from "@mui/material/Avatar";

import { Icon } from "@/components/shared";

import { PeopleProps } from "./types";

export const People = ({ first_name, last_name, image }: PeopleProps) => {
  return (
    <div className="rounded-medium bg-surface-container-lowest p-16">
      <div className="flex gap-x-16">
        <Avatar
          sx={{ width: 50, height: 50 }}
          className="border-2 border-outline-variant"
          src={image || ""}
        />
        <div>
          <div className="flex gap-x-4">
            <div className="text-on-surface text-label-large mb-2">
              {first_name} {last_name}
            </div>
            <Icon
              name="Check badge 2"
              className="text-[24px] text-informative"
            />
          </div>
          <div className="text-outline text-label-large">Admin</div>
        </div>
      </div>
    </div>
  );
};
