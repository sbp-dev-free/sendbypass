"use client";
import { useEffect, useRef, useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";

import { TUTORIALS } from "@/constants/home";

export const VideoList = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(Array(TUTORIALS.length).fill(0));
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const video = videoRefs.current[activeIndex];
    setProgress((prev) => {
      const updated = [...prev];
      updated[activeIndex] = 0;
      return updated;
    });

    if (video) {
      setIsLoading(true);
      video.load();
      video.oncanplay = () => {
        setIsLoading(false);
        video.play();
      };
      const onTimeUpdate = () => {
        const percentage = (video.currentTime / video.duration) * 100;
        setProgress((prev) => {
          const updated = [...prev];
          updated[activeIndex] = percentage;
          return updated;
        });
      };
      video.addEventListener("timeupdate", onTimeUpdate);
      return () => video.removeEventListener("timeupdate", onTimeUpdate);
    }
  }, [activeIndex]);

  const handleVideoEnd = () => {
    const nextIndex = (activeIndex + 1) % TUTORIALS.length;
    setProgress((prev) => {
      const updated = [...prev];
      updated[nextIndex] = 0;
      return updated;
    });

    setActiveIndex(nextIndex);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 md:gap-32">
      <div className="mb-32 flex justify-center order-1 md:order-2 md:mb-0 md:col-span-3 ">
        {isLoading ? (
          <div className="h-[296px] md:h-[346px] w-full flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          TUTORIALS[activeIndex] && (
            <video
              className="rounded-large h-[296px] md:h-[346px]"
              ref={(el) => {
                videoRefs.current[activeIndex] = el;
              }}
              src={TUTORIALS[activeIndex].video}
              onEnded={handleVideoEnd}
              autoPlay
              muted
            />
          )
        )}
      </div>

      <div className="border-l-[2px] border-outline-variant order-2 md:order-1 md:h-fit md:my-auto md:md:col-span-2">
        {TUTORIALS.map((el, index) => (
          <div
            key={index}
            onClick={() => setActiveIndex(index)}
            className="flex items-center gap-16 relative mb-12 last:mb-0 md:h-auto cursor-pointer"
          >
            <div
              className="rounded h-full"
              style={{ width: "5px", backgroundColor: "#e2e8f0" }}
            >
              {activeIndex === index && (
                <div
                  className="absolute top-0 -left-4 w-6 rounded-small transition-all duration-500"
                  style={{
                    height: `${progress[index]}%`,
                    backgroundColor: "#67548E",
                  }}
                ></div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <div className="text-title-small md:text-title-medium text-on-surface whitespace-nowrap">
                {el.title}
              </div>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  activeIndex === index
                    ? "max-h-[100px] md:max-h-[80px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="text-body-medium text-on-surface-variant">
                  {el.text}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
