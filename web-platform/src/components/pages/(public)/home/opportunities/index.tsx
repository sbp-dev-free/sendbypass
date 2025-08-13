import { OPPORTUNITIES } from "@/constants/home";

import { OpportunityCard } from "./OpportunityCard";

export const Opportunities = () => {
  return (
    <div className="flex flex-col gap-24 items-center">
      <div className="space-y-4 text-center">
        <h5 className="uppercase text-display-small text-on-surface">
          your opportunities
        </h5>
        <span className="text-body-small text-on-surface-variant">
          Custom solutions designed around your unique vision.
        </span>
      </div>
      <div className="flex flex-col gap-16 justify-center w-full xl:w-[1039px] md:flex-row">
        {OPPORTUNITIES.map(({ id, ...props }) => (
          <OpportunityCard key={id} id={id} {...props} />
        ))}
      </div>
    </div>
  );
};
