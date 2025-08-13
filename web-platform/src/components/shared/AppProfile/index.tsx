import Avatar from "@mui/material/Avatar";

import { PROFILE_STATUS } from "@/enums/globals";
import { checkProfileType } from "@/utils";

import { Icon } from "../Icon";

import { AppProfileProps } from "./types";

export const AppProfile = ({
  profile,
  hasEmail = false,
  role,
}: AppProfileProps) => {
  return (
    <div className="flex gap-8 items-center p-4">
      <Avatar
        sx={{ width: 40, height: 40 }}
        src={profile.image}
        className="border-2 border-outline-variant"
      />
      <div className="justify-between flex flex-col space-y-2">
        {role && (
          <span className="first-letter:uppercase text-label-medium text-outline">
            {role.toLowerCase()}
          </span>
        )}
        <span className="space-x-2 text-label-large-prominent text-on-surface">
          <span>
            {profile.first_name} {profile.last_name}
          </span>
          {profile.status === PROFILE_STATUS.VERIFIED && (
            <Icon
              name="check badge 2"
              className={`text-[16px] ${checkProfileType(profile.type)}`}
            />
          )}
        </span>
        {hasEmail && (
          <div className="text-label-medium text-on-surface-variant truncate max-w-[230px]">
            {profile.email}
          </div>
        )}
      </div>
    </div>
  );
};
