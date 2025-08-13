import React from "react";

import { type DialogProps } from "@mui/material/Dialog";
import Drawer from "@mui/material/Drawer";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

export const BottomSheet: React.FC<
  Partial<DialogProps & { onClose: () => void }>
> = ({ children, ...rest }) => {
  // if (!rest.open) return null;
  const PresenterComponent = !rest.onClose ? Drawer : SwipeableDrawer;

  return (
    <PresenterComponent
      anchor="bottom"
      {...rest}
      onClose={rest.onClose || (() => {})}
      PaperProps={{
        style: {
          borderRadius: "28px 28px 0px 0px",
          overflowY: "auto",
          position: "absolute",
          bottom: 0,
        },
      }}
      onOpen={() => {}}
      disableSwipeToOpen
    >
      <div
        className="flex sticky top-0 items-center justify-center p-12 h-[44px] w-full cursor-grab rounded-t-extra-large  bg-surface-container-lowest z-20"
        style={{ touchAction: "none" }}
      >
        <div className="w-32 h-4 rounded-full bg-outline" />
      </div>

      {children}
    </PresenterComponent>
  );
};
