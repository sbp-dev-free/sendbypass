"use client";
import { useState } from "react";

import Button from "@mui/material/Button";

import { SelectionModal } from "@/components";
import { FingerPrint } from "@/components/icons";
import { createKycOptions } from "@/constants/globals";
export const KycUpgrade = () => {
  const [open, setOpen] = useState(false);

  const openModal = () => {
    setOpen(true);
  };
  const handleGlobalProvider = () => {
    console.log("Global provider selected");
  };

  const handleLocalProvider = () => {
    console.log("Local provider selected");
  };

  const KYC_OPTIONS = createKycOptions(
    handleGlobalProvider,
    handleLocalProvider,
  );
  return (
    <>
      <div className="bg-surface-container-lowest rounded-large p-20">
        <div className="flex flex-col md:flex-row md:justify-between gap-20">
          <div className="flex flex-col md:flex-row gap-8 md:gap-[10px] items-center">
            <FingerPrint />
            <div>
              <div className="text-on-surface text-title-medium text-center md:text-left">
                KYC upgrade
              </div>
              <p className="text-outline text-body-small text-center">
                Unlock higher limits and advanced features by verifying your
                identity.
              </p>
            </div>
          </div>
          <Button variant="filled" onClick={openModal}>
            Verify now
          </Button>
        </div>
      </div>
      <SelectionModal
        open={open}
        onClose={() => setOpen(false)}
        title="Select KYC Method"
        options={KYC_OPTIONS}
      />
    </>
  );
};
