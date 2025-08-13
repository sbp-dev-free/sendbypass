import { ADVISORS } from '@/app/_dtos/static-pages';

import { AdvisorCard } from './AdvisorCard';

export const TrustedAdvisor = () => {
  return (
    <div className="space-y-[32px]">
      <div className="flex justify-center">
        <p className="text-display-small text-on-surface">
          <span className="font-light">Trusted</span> Advisor
        </p>
      </div>
      <div className="flex flex-col gap-[16px] lg:flex-row lg:justify-center">
        {ADVISORS.map(({ image, name, description, linkedin }) => (
          <AdvisorCard
            key={name}
            image={image}
            name={name}
            description={description}
            linkedin={linkedin}
          />
        ))}
      </div>
    </div>
  );
};
