"use client";
import { FC } from "react";

import IconButton from "@mui/material/IconButton";

import { Icon, Modal } from "@/components";

import { SelectOption } from "./SelectOption";
import { SelectionModalProps } from "./types";

export const SelectionModal: FC<SelectionModalProps> = ({
  open,
  onClose,
  title,
  options,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="rounded-large pt-0 px-16 pb-16 md:p-24">
        <div className="relative my-16 md:mb-16 md:mt-0 md:h-[34px] flex items-center justify-center">
          <div className="text-center text-on-surface text-title-medium">
            {title}
          </div>
          <IconButton
            color="outlined"
            className="!w-32 !h-32 rounded-full !absolute -top-4 md:top-0 right-0"
            onClick={onClose}
          >
            <Icon name="Close remove" className="text-[20px]" />
          </IconButton>
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
          {options.map((option, index) => (
            <SelectOption
              key={index}
              title={option.title}
              icon={option.icon}
              description={option.description}
              href={option.href}
              onClick={option.onClick}
              onClose={onClose}
              showBadge={option.showBadge}
              badgeText={option.badgeText}
              disabled={option.disabled}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
};
