import Menu from "@mui/material/Menu";

import { Icon } from "@/components/shared";
import { MORE_MENU_ITEMS } from "@/constants/profile";

import { MoreMenuProps } from "./types";

export const MoreMenu = ({
  anchorEl,
  open,
  handleClose,
  handleClickMoreItem,
  businessProfile = false,
}: MoreMenuProps) => {
  const filteredMenuItems = MORE_MENU_ITEMS.filter(
    (item) => !(businessProfile && item.id === 2),
  );
  return (
    <Menu
      anchorEl={anchorEl}
      sx={{
        "& .MuiMenu-paper": {
          borderRadius: "12px",
        },
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      open={open}
      onClose={handleClose}
    >
      <div className="px-12 py-16 w-[244px]">
        {filteredMenuItems.map((item) => (
          <button
            key={item.id}
            className="inline-flex gap-8 items-center p-8 w-full whitespace-nowrap text-body-medium text-on-surface transition-all duration-200 hover:bg-surface-container rounded-small"
            onClick={() => handleClickMoreItem(item.id)}
          >
            <Icon name={item.icon} className="text-[20px]" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </Menu>
  );
};
