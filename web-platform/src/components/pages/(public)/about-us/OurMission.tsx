import Image from "next/image";

export const OurMission = () => {
  return (
    <div className="flex flex-col-reverse gap-24 items-center lg:flex-row">
      <div className="relative">
        <Image
          src="/images/static-pages/about-us/our-mission.svg"
          width={484}
          height={280}
          sizes="(max-width: 768px) 206px, 484px"
          className="object-contain w-auto h-[206px] md:h-[280px]"
          alt="our mission"
        />
      </div>
      <div className="flex-1 space-y-12">
        <p className="text-display-small text-on-surface">
          <span className="font-light">Our</span> Mission
        </p>
        <p className="text-body-large text-on-surface-variant">
          At SendBypass, our mission is to create a more connected world by
          revolutionizing the way items move across distances. We are an
          innovative online platform that seamlessly connects travelers,
          shoppers, and senders, enabling the efficient transportation of
          luggage and purchases between any two points on the globe. We believe
          in harnessing the power of existing travel patterns to create
          sustainable, cost-effective delivery solutions. By connecting people
          who are already traveling with those who need items transported,
          we&apos;re building a collaborative economy that maximizes efficiency
          while minimizing environmental impact.
        </p>
      </div>
    </div>
  );
};
