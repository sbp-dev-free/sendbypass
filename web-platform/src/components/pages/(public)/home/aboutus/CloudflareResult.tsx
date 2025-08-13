"use client";
import { useEffect, useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";

import { CloudFlare } from "@/components/icons";
import { useDevice, useInView } from "@/hooks";
import { useGetVisitorStatsQuery } from "@/services/stats";

export const CloudflareResult = () => {
  const { isMobile } = useDevice();
  const [visitorCount, setVisitorCount] = useState(0);
  const [dailyVisitorCount, setDailyVisitorCount] = useState(0);

  const { ref, isInView } = useInView<HTMLDivElement>({ once: true });

  const { data: visitorStats, isLoading } = useGetVisitorStatsQuery();

  useEffect(() => {
    if (!isInView || isLoading || !visitorStats) return;

    const monthlyTarget = visitorStats?.monthly || 0;
    const dailyTarget = visitorStats?.daily || 0;
    const duration = 3000;
    const frameRate = 30;
    const totalFrames = (duration / 1000) * frameRate;

    let frame = 0;

    const interval = setInterval(() => {
      if (frame >= totalFrames) {
        setVisitorCount(monthlyTarget);
        setDailyVisitorCount(dailyTarget);
        clearInterval(interval);
        return;
      }

      const progress = frame / totalFrames;
      setVisitorCount(Math.round(monthlyTarget * progress));
      setDailyVisitorCount(Math.round(dailyTarget * progress));

      frame++;
    }, 1000 / frameRate);

    return () => clearInterval(interval);
  }, [isInView, visitorStats, isLoading]);

  const formatVisitors = (count: number) => {
    return count >= 1000 ? `${(count / 1000).toFixed(2)}K` : count;
  };

  const renderMonthlyCount = () => {
    if (isLoading) return <CircularProgress size="20px" />;
    return formatVisitors(visitorCount);
  };

  const renderDailyCount = () => {
    if (isLoading) return <CircularProgress size="20px" />;
    return dailyVisitorCount;
  };

  return isMobile ? (
    <div
      ref={ref}
      className="flex relative border-[2px] border-surface-container-high rounded-large p-16 justify-between"
    >
      <div className="flex flex-col justify-center items-center w-full">
        <div className="mb-8 flex justify-center items-center gap-x-12 md:mb-0">
          <span className="text-on-surface text-display-small">
            {renderMonthlyCount()}
          </span>
          <span className="flex size-[8px] relative">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-error opacity-75"></span>
            <span className="inline-flex size-[8px] rounded-full bg-error"></span>
          </span>
        </div>
        <div className="text-on-surface-variant text-label-large">
          Total Unique Visitors
        </div>
        <div className="text-label-medium text-outline">Previous 30 days</div>
      </div>
      <div className="flex flex-col justify-center items-center w-full border-l border-surface-container-high">
        <div className="mb-8 flex justify-center items-center gap-x-12 md:mb-0">
          <span className="text-on-surface text-display-small">
            {renderDailyCount()}
          </span>
          <span className="flex size-[8px] relative">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-error opacity-75"></span>
            <span className="inline-flex size-[8px] rounded-full bg-error"></span>
          </span>
        </div>
        <div className="text-on-surface-variant text-label-large">
          Unique Visitors
        </div>
        <div className="text-label-medium text-outline">Per day</div>
      </div>
      <div className="absolute -top-[12px] left-[50%] -translate-x-1/2 bg-background w-[78px] px-[10px]">
        <CloudFlare />
      </div>
    </div>
  ) : (
    <div
      ref={ref}
      className="relative flex border-[2px] border-surface-container-high rounded-large p-24 gap-x-32 items-center my-48 md:justify-between md:my-24"
    >
      <div className="flex justify-center items-center gap-x-24">
        <div>
          <div className="text-on-surface-variant text-label-large">
            Total Unique Visitors
          </div>
          <div className="text-label-medium text-outline">Previous 30 days</div>
        </div>
        <div className="mb-8 flex justify-center items-center gap-x-12 md:mb-0">
          <span className="text-on-surface text-display-small">
            {renderMonthlyCount()}
          </span>

          <span className="flex size-[8px] relative">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-error opacity-75"></span>
            <span className="inline-flex size-[8px] rounded-full bg-error"></span>
          </span>
        </div>
      </div>

      <div className="flex justify-center items-center gap-x-24">
        <div>
          <div className="text-on-surface-variant text-label-large">
            Unique Visitors
          </div>
          <div className="text-label-medium text-outline">Per day</div>
        </div>
        <div className="mb-8 flex justify-center items-center gap-x-12 md:mb-0">
          <span className="text-on-surface text-display-small">
            {renderDailyCount()}
          </span>
          <span className="flex size-[8px] relative">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-error opacity-75"></span>
            <span className="inline-flex size-[8px] rounded-full bg-error"></span>
          </span>
        </div>
      </div>
      <div className="absolute -top-[12px] right-[10px] -translate-x-1/2 bg-background w-[78px] px-[10px]">
        <CloudFlare />
      </div>
    </div>
  );
};
