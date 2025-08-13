import { LottieAnimation } from "@/components/shared";

import { BelongingItemProps } from "./types";

export const BelongingItem = ({ icon, title, caption }: BelongingItemProps) => {
  return (
    <div className="flex flex-col gap-16 items-center py-24 px-16 w-full text-center bg-primary-opacity-8 rounded-medium">
      <LottieAnimation
        animationName={icon}
        width={48}
        height={48}
        loop={false}
        autoplay={false}
        hoverActive={true}
      />
      <div>
        <h6 className="text-title-medium text-on-surface">{title}</h6>
        <span className="text-body-small text-on-surface-variant">
          {caption}
        </span>
      </div>
    </div>
  );
};
