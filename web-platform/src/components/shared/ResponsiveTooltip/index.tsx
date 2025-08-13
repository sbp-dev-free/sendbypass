"use client";
import { useState } from "react";

import ClickAwayListener from "@mui/material/ClickAwayListener";
import Tooltip, { type TooltipProps } from "@mui/material/Tooltip";

import { useDevice } from "@/hooks";

export const ResponsiveTooltip = ({ children, ...rest }: TooltipProps) => {
  const { isMobile } = useDevice();
  const [open, setOpen] = useState(false);
  const defaultProps: Partial<TooltipProps> = {
    open: open,
    onClose: () => setOpen(false),
    disableHoverListener: isMobile,
    disableFocusListener: isMobile,
    disableTouchListener: isMobile,
  };
  if (!isMobile) {
    delete defaultProps.open;
    delete defaultProps.onClose;
  }
  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Tooltip {...defaultProps} {...rest}>
        <div
          className="inline-block cursor-pointer"
          onClick={() => isMobile && setOpen(!open)}
        >
          {children}
        </div>
      </Tooltip>
    </ClickAwayListener>
  );
};
