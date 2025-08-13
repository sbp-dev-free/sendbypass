import Link from "next/link";

import { Icon } from "@/components/shared";
import { ROUTES } from "@/constants";

export const PendingProfileBanner = () => {
  return (
    <div className="bg-warning absolute w-full inset-x-0 top-[80px] lg:top-[80px] py-8 px-16 text-on-warning flex items-center justify-center gap-8">
      <Icon name="Face ID lock" className="text-[24px]" />
      <span className="text-body-medium">
        Your profile under review, Your changes will be posted after
        approval{" "}
      </span>
      <Link
        href={ROUTES.security}
        className="underline text-label-large-prominent"
      >
        Learn more
      </Link>
    </div>
  );
};
