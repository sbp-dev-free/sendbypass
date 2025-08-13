"use client";
import { useEffect, useRef, useState } from "react";

import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import CircularProgress from "@mui/material/CircularProgress";

import { useInView } from "@/hooks";
import { cn } from "@/utils";

import { LottieAnimationProps } from "./types";

export const LottieAnimation = ({
  animationName,
  width,
  height,
  loop = false,
  autoplay = false,
  hoverActive = false,
}: LottieAnimationProps) => {
  const [animationData, setAnimationData] = useState(null);
  const lottieRef = useRef<any>(null);
  const { ref: containerRef, isInView } = useInView<HTMLDivElement>({
    once: true,
    threshold: 0.1,
    rootMargin: "0px",
  });
  const [isPlayingToCompletion, setIsPlayingToCompletion] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(`/lottie/${animationName}.json`, { signal })
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => {
        if (err.name === "AbortError") {
          console.error("Fetch request was aborted.");
        } else {
          console.error("Error loading animation:", err);
        }
      });

    return () => controller.abort();
  }, [animationName]);

  useEffect(() => {
    if (!lottieRef.current || !hoverActive) return;

    const handleEnterFrame = () => {
      if (!lottieRef.current) return;

      const anim = lottieRef.current?.animationItem;
      if (!anim) return;

      if (isPlayingToCompletion && anim.currentFrame >= anim.totalFrames - 1) {
        anim.pause();
        setIsPlayingToCompletion(false);
      }
    };

    if (lottieRef.current?.animationItem) {
      try {
        lottieRef.current?.animationItem.addEventListener(
          "enterFrame",
          handleEnterFrame,
        );
      } catch (err) {
        console.error("Error adding event listener:", err);
      }
    } else {
      const checkAnimationItem = setInterval(() => {
        if (lottieRef.current?.animationItem) {
          lottieRef.current.animationItem.addEventListener(
            "enterFrame",
            handleEnterFrame,
          );
          clearInterval(checkAnimationItem);
        }
      }, 100);

      return () => clearInterval(checkAnimationItem);
    }

    return () => {
      lottieRef.current?.animationItem?.removeEventListener(
        "enterFrame",
        handleEnterFrame,
      );
    };
  }, [hoverActive, isPlayingToCompletion]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isInView && lottieRef.current) {
      timer = setTimeout(() => {
        lottieRef.current.goToAndPlay(0, false);
      }, 1500);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isInView]);

  return animationData ? (
    <div
      ref={containerRef}
      style={{ width, height }}
      onMouseEnter={() => {
        if (hoverActive && lottieRef.current) {
          lottieRef.current.goToAndPlay(0, false);
          setIsPlayingToCompletion(true);
        }
      }}
      className={cn({ "cursor-pointer": hoverActive })}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  ) : (
    <div className="w-48 h-48 flex justify-center items-center">
      <CircularProgress size="24px" />
    </div>
  );
};
