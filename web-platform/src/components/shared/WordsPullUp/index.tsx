"use client";
import * as React from "react";

import { motion } from "motion/react";

import { cn } from "@/utils";

export function WordsPullUp({
  text,
  className = "",
  preText,
  postText,
}: {
  text: string;
  className?: string;
  preText?: string;
  postText?: string;
}) {
  const splittedText = text.split(" ");

  const pullupVariant = {
    initial: { y: 5, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.03,
      },
    }),
  };
  return (
    <div className="flex justify-center flex-wrap">
      {preText && preText}
      {splittedText.map((current, i) => (
        <motion.div
          key={i}
          variants={pullupVariant}
          initial="initial"
          animate={"animate"}
          custom={i}
          className={cn("text-center px-4 tracking-wide", className, {
            "pl-[5px]": !i,
            "pr-[5px]": i === splittedText.length - 1,
          })}
        >
          {current == "" ? <span>&nbsp;</span> : current}
        </motion.div>
      ))}
      {postText && postText}
    </div>
  );
}
