import { FC, Fragment, MouseEvent, useMemo, useState } from "react";

import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import { useDispatch } from "react-redux";

import { Icon } from "@/components";
import { PROFILE_MENU_ITEMS_DESKTOP } from "@/constants/globals";
import { PROFILE_STATUS } from "@/enums/globals";
import { useFilteredMenuItems } from "@/hooks";
import { logout } from "@/store/slices/authSlice";
import { checkProfileType, destroyToken } from "@/utils";

import { MenuItem } from "../MenuItem";
import { LoggedInMenuProps } from "../types";

export const ProfileMenuDesktop: FC<LoggedInMenuProps> = ({ profile }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const openMenu = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const dispatch = useDispatch();
  const handleLogout = () => {
    destroyToken();
    handleClose();
    dispatch(logout());
    window.location.reload();
  };

  const menuItems = useFilteredMenuItems(
    profile?.type,
    PROFILE_MENU_ITEMS_DESKTOP,
  );

  const shortName = useMemo(() => {
    return profile.type === "BUSINESS"
      ? (profile.name ?? "")
      : (profile.first_name ?? "");
  }, [profile.type, profile.name, profile.first_name]);

  const fullName = useMemo(() => {
    if (profile.type === "PERSONAL") {
      return `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
    } else {
      return profile.name || "";
    }
  }, [profile.type, profile.name, profile.first_name, profile.last_name]);

  return (
    <div className="flex gap-8 items-center">
      <IconButton color="standard">
        <Icon name="Ringing" className="text-[24px] text-on-surface hidden" />
      </IconButton>

      <button className="flex gap-6 items-center pr-6" onClick={handleClick}>
        <Avatar
          sx={{ width: 32, height: 32 }}
          src={profile.image}
          className="border-2 border-outline-variant"
        />
        <div className="flex items-center">
          {shortName && (
            <span className="text-body-medium text-on-surface">
              Hi, {shortName}
            </span>
          )}
          <Icon name="caret down md" className="text-[24px] text-outline" />
        </div>
      </button>
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        sx={{
          "& .MuiMenu-paper": {
            borderRadius: "12px",
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div className="w-[260px]">
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
              <div className="text-label-medium text-on-surface-variant truncate max-w-[184px]">
                {profile.email}
              </div>
            </div>
          </div>
          <Divider />
          <div className="px-16 pt-8 pb-16">
            {menuItems.map((item, index) => {
              if (index === 0) {
                return (
                  <Fragment key={item.id}>
                    <MenuItem
                      {...item}
                      badge={!profile.incomplete && item.badge}
                      onClick={handleClose}
                    />
                  </Fragment>
                );
              }
              if (index === 2) {
                return (
                  <Fragment key={item.id}>
                    <Divider className="!my-6" />
                    <div className="pl-8 mb-4 text-label-large-prominent text-on-surface-variant">
                      My Activities
                    </div>
                    <MenuItem {...item} onClick={handleClose} />
                  </Fragment>
                );
              }
              if (index === menuItems.length - 1) {
                return (
                  <Fragment key={item.id}>
                    <Divider className="!my-6" />

                    <MenuItem
                      {...item}
                      onClick={handleLogout}
                      isLastItem={true}
                    />
                  </Fragment>
                );
              }
              return <MenuItem key={item.id} {...item} onClick={handleClose} />;
            })}
          </div>
        </div>
      </Menu>
      <Divider orientation="vertical" className="!h-24 !w-2" />
    </div>
  );
};
