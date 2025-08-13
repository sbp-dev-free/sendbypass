import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import { Icon } from "@/components";
import { MOBILE_MENU_ITEMS, SOCIAL_ICONS } from "@/constants/globals";

import { MenuItem } from "./MenuItem";
import { DrawerMenuProps } from "./types";

const renderSocialItems = () => {
  return SOCIAL_ICONS.map((socialIcon, index) => (
    <IconButton
      key={index}
      color="standard"
      href={socialIcon.link || "#"}
      target="_blank"
    >
      <Icon name={socialIcon.name} />
    </IconButton>
  ));
};

export const DrawerMenu = ({
  openNeedTypeModal,
  handleToggleMenu,
}: DrawerMenuProps) => {
  const handleAddItem = () => {
    handleToggleMenu();
    openNeedTypeModal();
  };
  const renderMenuItems = () => {
    return MOBILE_MENU_ITEMS.map((item) => {
      if (item.id === 2) {
        return (
          <MenuItem key={item.id} item={item}>
            <Button
              variant="tonal"
              startIcon={<Icon name="Plus" />}
              onClick={handleAddItem}
            >
              Add Item
            </Button>
          </MenuItem>
        );
      } else {
        return <MenuItem key={item.id} item={item} />;
      }
    });
  };

  return (
    <div className="flex flex-col px-16 pt-16 pb-48 h-full">
      <div className="grow">{renderMenuItems()}</div>
      <div className="space-y-2 text-center">
        <div className="text-body-medium text-on-surface-variant">
          Follow us
        </div>
        <div>{renderSocialItems()}</div>
      </div>
    </div>
  );
};
