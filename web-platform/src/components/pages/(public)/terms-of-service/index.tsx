import { TABLE_OF_CONTENT, TERMS } from "@/constants/static-pages";

import { StaticPageFrame } from "../StaticPageFrame";

import { TableOfContent } from "./TableOfContent";
import { TableOfContentSheet } from "./TableOfContentSheet";
import { TermItem } from "./TermItem";

export const TermsOfService = () => {
  return (
    <StaticPageFrame title="Terms & Conditions">
      <div className="flex gap-12 items-start">
        <div className="hidden sticky top-0 md:block">
          <TableOfContent />
        </div>
        <div className="flex-1 px-8 space-y-8">
          {TERMS.map((term, index) => (
            <TermItem
              key={index}
              id={TABLE_OF_CONTENT[index]?.href}
              number={index + 1}
              {...term}
            />
          ))}
        </div>
      </div>
      <TableOfContentSheet />
    </StaticPageFrame>
  );
};
