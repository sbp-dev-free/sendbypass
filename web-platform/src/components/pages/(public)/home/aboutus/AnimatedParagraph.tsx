"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/utils";

const AnimatedParagraph = ({ text }: { text: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const middle = windowHeight / 2;
      const start = windowHeight;
      const end = middle;

      const scrollProgress = Math.min(
        Math.max((start - rect.bottom) / (start - end), 0),
        1,
      );
      setProgress(scrollProgress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="">
      <span className="font-semibold text-primary">SendByPass ✦</span>

      {text.split("").map((char, i) => {
        const threshold = i / text.length;
        const threshold2 = (i - 2) / text.length;
        const threshold3 = (i - 4) / text.length;
        const active = progress > threshold;
        const active2 = progress > threshold2;
        const active3 = progress > threshold3;

        return (
          <span
            key={i}
            className={cn(
              "transition-all duration-300 text-on-surface-variant-opacity-12",
              {
                "text-on-surface": active,
                "text-on-surface-variant-opacity-50": active2 && !active,
                "text-on-surface-variant-opacity-16":
                  active3 && !active && !active2,
              },
            )}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};

export default AnimatedParagraph;
