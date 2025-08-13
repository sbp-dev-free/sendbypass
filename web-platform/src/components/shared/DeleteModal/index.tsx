"use client";
import { FC } from "react";

import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import { Icon, Modal } from "@/components";

import { DeleteModalProps } from "./types";

export const DeleteModal: FC<DeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  loading = false,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="lg:w-[400px] p-24">
        <div className="flex justify-between mb-16">
          <div className="text-on-surface text-title-medium">{title}</div>
          <IconButton
            color="outlined"
            className="!w-32 !h-32 rounded-full"
            onClick={onClose}
          >
            <Icon name="Close remove" className="text-[20px]" />
          </IconButton>
        </div>
        <div className="mb-16 text-body-medium text-on-surface-variant">
          {description}
        </div>
        <div className="flex gap-x-16 justify-end">
          <Button variant="text" onClick={onClose} className="rounded-small">
            Cancel
          </Button>
          <LoadingButton
            onClick={onConfirm}
            variant="filled"
            className="rounded-small !bg-error-40"
            loading={loading}
          >
            Delete
          </LoadingButton>
        </div>
      </div>
    </Modal>
  );
};
