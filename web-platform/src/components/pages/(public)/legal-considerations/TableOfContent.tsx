import Link from "next/link";

import { LEGAL_CONSIDERATIONS_ITEMS } from "@/constants/static-pages/legal-considerations";

export const TableOfContent = () => {
  return (
    <div className="md:w-[300px] space-y-16 md:pt-40 px-16 md:px-8 pb-8">
      <h5 className="text-center text-label-large text-on-surface md:text-left">
        Table of content
      </h5>
      <div className="space-y-8">
        {LEGAL_CONSIDERATIONS_ITEMS.map((term, index) => (
          <Link
            key={index}
            href={`#${term.href}`}
            className="flex gap-8 items-center text-body-medium text-on-surface"
          >
            <span className="size-[5px] rounded-full bg-outline-variant" />{" "}
            {term.label}
          </Link>
        ))}
      </div>
    </div>
  );
};
