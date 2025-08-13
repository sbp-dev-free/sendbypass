"use client";

import AnimatedParagraph from "./AnimatedParagraph";
import { CloudflareResult } from "./CloudflareResult";
import { UserAvatars } from "./UserAvatars";

export const AboutUs = () => {
  return (
    <div className="flex flex-col-reverse gap-20 md:gap-32 items-center md:p-32 mt-[310px] md:mt-64 z-50 lg:flex-row md:items-start">
      <div className="md:hidden w-full">
        <CloudflareResult />
        <div className="text-on-surface-variant text-label-large pt-20 pb-12 w-[244px] mx-auto whitespace-nowrap">
          They’ve already trusted us, be the next!
        </div>

        <UserAvatars />
      </div>
      <div className="md:flex-shrink-0">
        <video
          className="rounded-large border border-surface-container-highest"
          src="https://sendbypass.com/media/intro.mp4"
          autoPlay
          muted
        />
      </div>
      <div>
        <div className="xs:text-[32px] xs:font-light xs:leading-[44px] xs:tracking-[-1px] md:!font-light">
          <AnimatedParagraph
            text=" is a
          platform that connects Passengers, Shoppers, and Senders to transport
          your Luggage or Purchases from any location to any destination."
          />
        </div>
        <div className="hidden md:block">
          <CloudflareResult />
          <div className="flex justify-between items-center">
            <div className="text-on-surface-variant text-label-large">
              They’ve already trusted us, be the next!
            </div>
            <UserAvatars />
          </div>
        </div>
      </div>
    </div>
  );
};
