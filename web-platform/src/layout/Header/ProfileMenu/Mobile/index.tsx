import { FC, Fragment, useMemo } from "react";

import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import { useDispatch } from "react-redux";

import { Icon } from "@/components";
import { PROFILE_MENU_ITEMS_MOBILE } from "@/constants/globals";
import { PROFILE_STATUS } from "@/enums/globals";
import { logout } from "@/store/slices/authSlice";
import { checkProfileType, destroyToken } from "@/utils";

import { MenuItem } from "../MenuItem";
import { LoggedInMenuProps } from "../types";

export const ProfileMenuMobile: FC<
  LoggedInMenuProps & { toggleBottomSheet: () => void }
> = ({ profile, toggleBottomSheet }) => {
  const handleClose = () => {
    toggleBottomSheet();
  };
  const dispatch = useDispatch();
  const handleLogout = () => {
    destroyToken();
    handleClose();
    dispatch(logout());
    window.location.reload();
  };

  const fullName = useMemo(() => {
    if (profile.type === "PERSONAL") {
      return `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
    } else {
      return profile.name || "";
    }
  }, [profile.type, profile.name, profile.first_name, profile.last_name]);

  return (
    <div className="px-16 pb-16">
      <div className="flex gap-8 items-center p-16">
        <Avatar
          sx={{ width: 40, height: 40 }}
          src={profile.image}
          className="border-2 border-outline-variant"
        />
        <div className="space-x-2">
          <span className="space-x-2 text-label-large-prominent text-on-surface">
            <span>{fullName}</span>
            {profile.status === PROFILE_STATUS.VERIFIED && (
              <Icon
                name="check badge 2"
                className={`text-[16px] ${checkProfileType(profile.type)}`}
              />
            )}
          </span>
          <div className="text-label-medium text-on-surface-variant truncate max-w-[230px]">
            {profile.email}
          </div>
        </div>
      </div>
      <Divider className="!my-6" />
      <div className="flex gap-8 items-center">
        <div className="px-16 pt-8 pb-16 w-full">
          {PROFILE_MENU_ITEMS_MOBILE.map((item) => {
            if (item.id === 1) {
              return (
                <Fragment key={item.id}>
                  <MenuItem
                    {...item}
                    badge={!profile.incomplete && item.badge}
                    onClick={handleClose}
                    showIconAlways={true}
                  />
                </Fragment>
              );
            }
            if (item.id === 3) {
              return (
                <Fragment key={item.id}>
                  <MenuItem
                    {...item}
                    onClick={handleLogout}
                    isLastItem={true}
                    showIconAlways={true}
                  />
                </Fragment>
              );
            }
            return (
              <MenuItem
                key={item.id}
                {...item}
                onClick={handleClose}
                showIconAlways={true}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
