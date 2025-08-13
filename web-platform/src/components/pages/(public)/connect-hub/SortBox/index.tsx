"use client";

import { MouseEvent, useState } from "react";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useMediaQuery } from "usehooks-ts";

import { Icon, Modal } from "@/components/shared";
import { SORT_OPTIONS } from "@/constants/connect-hub";
import { cn } from "@/utils";

export const SortBox = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const open = Boolean(anchorEl);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (
    event: MouseEvent<HTMLElement>,
    index: number,
  ) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  return (
    <div className="flex justify-between items-center py-12 px-16 rounded-small bg-surface-container-lowest grow">
      <span className="flex gap-8 items-center text-outline">
        <Icon name="Sort down" className="text-[24px]" />
        <span className="hidden md:inline text-label-large">Sort</span>
      </span>
      <button className="inline-flex gap-2 items-center" onClick={handleClick}>
        <span className="text-body-medium">{SORT_OPTIONS[selectedIndex]}</span>
        <Icon
          name="Caret Down MD"
          className={cn(
            "text-[20px] cursor-pointer transition-all duration-200",
            {
              "rotate-180": open,
            },
          )}
        />
      </button>
      <Menu
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        anchorEl={anchorEl}
        open={open && !isMobile}
        onClose={handleClose}
        sx={{
          "& .MuiMenu-paper": {
            padding: "8px",
            borderRadius: "12px",
          },
        }}
      >
        {SORT_OPTIONS.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px",
              width: "276px",
              backgroundColor:
                selectedIndex === index
                  ? "rgba(var(--primary-opacity-8)) !important"
                  : "rgb(var(--surface-container-lowest)) !important",
              borderRadius: "8px",
            }}
          >
            <span className="text-body-medium text-on-surface">{option}</span>
            {selectedIndex === index && (
              <Icon name="Check circle" className="text-primary text-[20px]" />
            )}
          </MenuItem>
        ))}
      </Menu>
      <Modal open={open && isMobile} onClose={handleClose}>
        <div className="px-16 pb-16">
          {SORT_OPTIONS.map((option, index) => (
            <MenuItem
              key={option}
              selected={index === selectedIndex}
              onClick={(event) => handleMenuItemClick(event, index)}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px",
                width: "100%",
                backgroundColor:
                  selectedIndex === index
                    ? "rgba(var(--primary-opacity-8)) !important"
                    : "rgb(var(--surface-container-lowest)) !important",
                borderRadius: "8px",
              }}
            >
              <span className="text-body-medium text-on-surface">{option}</span>
              {selectedIndex === index && (
                <Icon
                  name="Check circle"
                  className="text-primary text-[20px]"
                />
              )}
            </MenuItem>
          ))}
        </div>
      </Modal>
    </div>
  );
};
