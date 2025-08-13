"use client";

import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

import { FormPageHeader } from "@/components";

import { ShoppingForm } from "./ShoppingForm";
import { CreateShoppingNeedProps } from "./types";

export const CreateShoppingNeed = ({ isEdit }: CreateShoppingNeedProps) => {
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
    <div className="md:p-16 bg-surface-container-lowest rounded-medium">
      <FormPageHeader
        title={`${isEdit ? "Edit" : "Add"} shopping item`}
        subtitle="Enter your item details accurately"
        hasBackButton
        onBack={() => router.back()}
      />
      <ShoppingForm needId={needId} />
    </div>
  );
};
