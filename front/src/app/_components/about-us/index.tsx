import { StaticPageFrame } from '../StaticPageFrame';

import { Hero } from './Hero';
import { NeverMissUpdate } from './NeverMissUpdate';
import { OurJourney } from './OurJourney';
import { OurMission } from './OurMission';
import { OurValues } from './OurValues';
import { StrategicPartners } from './StrategicPartners';
import { TrustedAdvisor } from './TrustedAdvisor';

export const AboutUs = () => {
  return (
    <StaticPageFrame title="About us">
      <div className="space-y-[48px]">
        <Hero />
        <div className="w-full bg-[url('/img/static-pages/about-us/pattern.svg')] bg-no-repeat bg-cover rounded-[4px] h-[24px]" />
        <OurJourney />
        <OurMission />
        <OurValues />
        <StrategicPartners />
        <TrustedAdvisor />
        <div className="w-full bg-[url('/img/static-pages/about-us/pattern.svg')] bg-no-repeat bg-cover rounded-[4px] h-[24px]" />
        <NeverMissUpdate />
      </div>
    </StaticPageFrame>
  );
};
