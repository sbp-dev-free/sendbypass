import { PARTNERS } from '@/app/_dtos/static-pages';

import { PartnerCard } from './PartnerCard';

export const StrategicPartners = () => {
  return (
    <div className="space-y-[32px]">
      <div className="flex justify-center">
        <p className="text-display-small text-on-surface">
          <span className="font-light">Strategic</span> Partners
        </p>
      </div>
      <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2">
        {PARTNERS.map(({ image, title, description, location, href }) => (
          <PartnerCard
            key={title}
            image={image}
            title={title}
            description={description}
            location={location}
            href={href}
          />
        ))}
      </div>
    </div>
  );
};
