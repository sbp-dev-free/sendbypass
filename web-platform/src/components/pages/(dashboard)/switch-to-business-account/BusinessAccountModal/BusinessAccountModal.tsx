"use client";
import { forwardRef, Ref, useImperativeHandle, useState } from "react";

import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Link from "next/link";

import { Icon, Modal } from "@/components";

import { BusinessAccountModalProps } from "./types";

export type BusinessAccountModalRefType = {
  openBusinessAccountModal: () => void;
  setLoadingBusinessAccountModal: () => void;
  setUnLoadingBusinessAccountModal: () => void;
  closeBusinessAccountModal: () => void;
};

export const BusinessAccountModal = forwardRef(
  (
    { onApply }: BusinessAccountModalProps,
    ref: Ref<BusinessAccountModalRefType>,
  ) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const openBusinessAccountModal = () => setIsOpen(true);
    const setLoadingBusinessAccountModal = () => setIsLoading(true);
    const setUnLoadingBusinessAccountModal = () => setIsLoading(false);
    const closeBusinessAccountModal = () => {
      setIsLoading(false);
      setIsOpen(false);
    };
    useImperativeHandle(ref, () => ({
      openBusinessAccountModal,
      setLoadingBusinessAccountModal,
      setUnLoadingBusinessAccountModal,
      closeBusinessAccountModal,
    }));

    return (
      <Modal
        open={isOpen}
        onClose={closeBusinessAccountModal}
        PaperProps={{
          sx: {
            width: "600px",
            maxWidth: "600px",
          },
        }}
      >
        <div className="md:w-full md:p-24 p-16">
          <div className="flex justify-between">
            <div className="text-on-surface text-title-medium">
              Business Account Switch Confirmation{" "}
            </div>
            <IconButton
              color="outlined"
              className="!w-32 !h-32 rounded-full"
              onClick={closeBusinessAccountModal}
            >
              <Icon name="Close remove" className="text-[20px]" />
            </IconButton>
          </div>
          <div className="my-16 text-on-surface-variant text-body-medium">
            Are you sure about switching your individual account to a business
            account?
          </div>
          <div className="my-20 text-body-small text-warning px-16 py-20 bg-warning-opacity-8">
            <p>
              After switching to a business account, you cannot switch back to
              an individual account
              <Link
                href="/"
                target="_blank"
                className="underline underline-offset-1 mx-4"
              >
                Read more
              </Link>
            </p>
          </div>
          <div className="flex gap-16 md:justify-end">
            <Button
              variant="text"
              className="w-full md:w-auto"
              onClick={closeBusinessAccountModal}
            >
              No, Cancel{" "}
            </Button>
            <LoadingButton
              variant="filled"
              onClick={onApply}
              loading={isLoading}
              className="w-full md:w-auto whitespace-nowrap"
            >
              Yes, Switch{" "}
            </LoadingButton>
          </div>
        </div>
      </Modal>
    );
  },
);

BusinessAccountModal.displayName = "BusinessAccountModal";
