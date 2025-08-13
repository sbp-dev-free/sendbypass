import {
  LEGAL_CONSIDERATIONS_CONTENT,
  LEGAL_CONSIDERATIONS_ITEMS,
} from "@/constants/static-pages";

import { StaticPageFrame } from "../StaticPageFrame";

import { TableOfContent } from "./TableOfContent";
import { TableOfContentSheet } from "./TableOfContentSheet";
import { TermItem } from "./TermItem";

export const LegalGonsiderations = () => {
  return (
    <StaticPageFrame title="Legal considerations">
      <div className="flex gap-12 items-start">
        <div className="hidden sticky top-0 md:block">
          <TableOfContent />
        </div>
        <div className="flex-1 px-8 space-y-8">
          {LEGAL_CONSIDERATIONS_CONTENT.map((content, index) => (
            <TermItem
              key={index}
              id={LEGAL_CONSIDERATIONS_ITEMS[index]?.href}
              number={index + 1}
              {...content}
            />
          ))}
        </div>
      </div>
      <TableOfContentSheet />
    </StaticPageFrame>
  );
};
