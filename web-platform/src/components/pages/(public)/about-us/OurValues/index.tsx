import Image from "next/image";

import { OUR_VALUES } from "@/constants";

import { ValueItem } from "./ValueItem";

export const OurValues = () => {
  return (
    <div className="p-24 space-y-24 border-2 border-surface-container rounded-large">
      <div className="flex justify-between items-end">
        <p className="text-display-small text-on-surface">
          <span className="font-light">Our</span> Values
        </p>
        <Image
          src="/images/static-pages/about-us/dots.svg"
          width={30}
          height={30}
          alt="dots"
        />
      </div>
      <div className="grid grid-cols-1 gap-24 md:grid-cols-2">
        {OUR_VALUES.map(({ number, title, description }) => (
          <ValueItem
            key={number}
            number={number}
            title={title}
            description={description}
          />
        ))}
      </div>
    </div>
  );
};
