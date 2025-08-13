import Button from "@mui/material/Button";
import Image from "next/image";
import Link from "next/link";

import { ROUTES } from "@/constants";

export const Hero = () => {
  return (
    <div className="space-y-20">
      <div className="relative">
        <div className="flex justify-center">
          <h1 className="uppercase text-[40px] lg:text-[120px] leading-none font-bold bg-gradient-to-t to-[rgba(101,85,143,0.16)] from-[rgba(254,247,253,0.00)] bg-clip-text text-transparent">
            Sendbypass
          </h1>
        </div>
        <div className="absolute bottom-0 inset-x-1/2 -translate-x-1/2 flex justify-center text-[20px] font-bold lg:text-display-large text-on-surface">
          <span className="mr-8 font-light">Send</span> Smarter,
          <span className="mx-8 font-light"> Travel </span>Wiser
        </div>
      </div>
      <div className="relative h-[150px] lg:h-[495px]">
        <Image
          src="/images/static-pages/about-us/map.svg"
          className="object-cover"
          fill
          priority
          alt="map"
        />
      </div>
      <div className="flex flex-col gap-12 items-start lg:gap-0 lg:flex-row lg:justify-between">
        <div className="space-y-4">
          <p className="text-body-small text-on-surface">Our platform</p>
          <p className="text-display-small text-on-surface">
            <span className="font-light">Who</span> we are
          </p>
        </div>
        <div className="lg:w-[595px] space-y-32">
          <p className="text-body-large text-on-surface-variant">
            At Sendbypass, we are revolutionizing the way people connect for
            secure and affordable international shipping. Our innovative
            platform seamlessly unites travelers, senders, and buyers to
            streamline global item transfers.
          </p>
          <Link href={ROUTES.home} className="inline-block">
            <Button variant="tonal" className="h-[44px]">
              Explore Sendbypass
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
