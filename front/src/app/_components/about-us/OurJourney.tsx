import Image from 'next/image';

export const OurJourney = () => {
  return (
    <div className="flex flex-col gap-[24px] items-center lg:flex-row">
      <div className="flex-1 space-y-[12px]">
        <p className="text-display-small text-on-surface">
          <span className="font-light">Our</span> Journey
        </p>
        <p className="text-body-large text-on-surface-variant">
          Sendbypass emerged from the frustration of expensive and complicated
          international shipping. Our journey began when we saw an opportunity
          to leverage the travels of everyday people to create a more affordable
          and efficient shipping solution. What started as a simple idea has
          blossomed into a vibrant community of users dedicated to helping one
          another. We are committed to making the world more connected, allowing
          users to transform their journeys into a means to move items safely
          and efficiently. Join us as we continue our journey, building a
          community-driven solution for global shipping and shopping.
        </p>
      </div>
      <div className="w-[356px] lg:w-[484px] h-[280px] relative">
        <Image
          src="/img/static-pages/about-us/our-journey.svg"
          fill
          className="object-cover rounded-2xl"
          alt="our journey"
        />
      </div>
    </div>
  );
};
