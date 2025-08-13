import { useState } from "react";

import { useSelector } from "react-redux";

import { SelectionModal } from "@/components/shared";
import { createKycOptions } from "@/constants/globals";
import { useProfile } from "@/hooks";
import { selectUser } from "@/store/slices/authSlice";
import { type Verification } from "@/types";

import SuccessBadge from "./SuccessBadge";
import { VerificationProps } from "./types";
import VerificationBadge from "./VerificationBadge";
import WarningBadge from "./WarningBadge";

const Verification = ({ toggleOpenDrawer }: VerificationProps) => {
  const profile = useSelector(selectUser);
  const verification = profile?.verification;
  const { necessaryItems } = useProfile(profile ?? undefined);
  const firstFiveItems = necessaryItems.slice(0, 5);
  const allFirstFiveComplete = firstFiveItems.every((el) => el.isComplete);

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
  const tabs: Record<Verification["type"], any> = {
    ADVANCED: <VerificationBadge />,
    BASIC: <SuccessBadge onActionClick={openModal} />,
    BEGINNER: allFirstFiveComplete ? (
      <SuccessBadge onActionClick={openModal} />
    ) : (
      <WarningBadge onActionClick={() => toggleOpenDrawer()} />
    ),
  };
  return (
    <>
      <div className="w-full gap-20 flex flex-col">
        {tabs[verification?.type || "BASIC"]}
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

export default Verification;
