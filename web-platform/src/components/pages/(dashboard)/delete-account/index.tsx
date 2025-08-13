import { Breadcrumbs } from "@/components/shared";

import { DeleteAccountContent } from "./DeleteAccountContent";

export const DeleteAccount = () => {
  return (
    <div className="py-16">
      <div className="mx-auto w-fit space-y-12 pb-16">
        <h1 className="text-center text-title-large md:text-display-medium text-on-surface">
          Account Deletion
        </h1>
        <div className="mx-auto w-fit">
          <Breadcrumbs />
        </div>
      </div>
      <DeleteAccountContent />
    </div>
  );
};
