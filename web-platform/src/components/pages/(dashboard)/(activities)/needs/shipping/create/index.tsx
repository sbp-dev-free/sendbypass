"use client";

import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

import { FormPageHeader } from "@/components";

import { ShippingForm } from "./ShippingForm";
import { CreateShippingNeedProps } from "./types";

export const CreateShippingNeed = ({ isEdit }: CreateShippingNeedProps) => {
  const router = useRouter();
  const [needId, setNeedId] = useState("");
  const pathName = usePathname();

  useEffect(() => {
    if (isEdit) {
      const needId = pathName.split("/").at(-1);
      if (needId) setNeedId(needId);
    }
  }, [pathName, isEdit]);

  return (
    <div className="p-12 md:p-16 bg-surface-container-lowest rounded-medium">
      <FormPageHeader
        title={`${isEdit ? "Edit" : "Add"} shipping item`}
        subtitle="Enter your item details accurately"
        hasBackButton
        onBack={() => router.back()}
      />
      <ShippingForm needId={needId} />
    </div>
  );
};
