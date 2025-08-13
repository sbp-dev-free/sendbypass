import { FC } from "react";

import { TermItemProps } from "./types";

export const TermItem: FC<TermItemProps> = ({ number, title, content, id }) => {
  return (
    <div id={id} className="space-y-8">
      <h1 className="pt-32 text-title-medium text-on-surface">
        {number}. {title}
      </h1>
      <p className="text-body-large text-on-surface">{content}</p>
    </div>
  );
};
