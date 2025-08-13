import {
  PRIVACY_POLICY_CONTENT,
  PRIVACY_POLICY_ITEMS,
} from "@/constants/static-pages";

import { StaticPageFrame } from "../StaticPageFrame";

import { TableOfContent } from "./TableOfContent";
import { TableOfContentSheet } from "./TableOfContentSheet";
import { TermItem } from "./TermItem";

export const PrivacyPolicy = () => {
  return (
    <StaticPageFrame title="Privacy Policy">
      <div className="space-y-24 text-body-large text-on-surface">
        <div className="flex gap-12 items-start">
          <div className="hidden sticky top-0 md:block">
            <TableOfContent />
          </div>
          <div className="flex-1 px-8 space-y-8">
            {PRIVACY_POLICY_CONTENT.map((content, index) => (
              <TermItem
                key={index}
                id={PRIVACY_POLICY_ITEMS[index]?.href}
                number={index + 1}
                {...content}
              />
            ))}
          </div>
        </div>
        <TableOfContentSheet />
      </div>
    </StaticPageFrame>
  );
};
