"use client";

import { useMemo } from "react";

import { motion } from "motion/react";
import Image from "next/image";

import { useInView } from "@/hooks/useInView";
import { cn } from "@/utils";

import { JoinUsButton } from "./JoinUsButton";

export const UserAvatars = () => {
  const avatarImages = useMemo(
    () => [
      "/images/home/users/1.png",
      "/images/home/users/2.png",
      "/images/home/users/3.png",
      "/images/home/users/4.png",
      "/images/home/users/5.png",
    ],
    [],
  );
  const { ref, isInView } = useInView<HTMLDivElement>({
    rootMargin: "-100px",
    once: true,
  });

  const avatarVariants = {
    hidden: { opacity: 0, x: 200 },
    visible: (index: number) => ({
      opacity: 1,
      x: index * 30,
      transition: {
        delay: index * 0.2,
        duration: 0.5,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative max-w-[260px] md:min-w-[260px] mx-auto h-[48px] overflow-x-hidden md:mr-0",
      )}
    >
      {[...avatarImages, null].map((src, index) =>
        src ? (
          <motion.div
            key={index}
            variants={avatarVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={index}
          >
            <Image
              src={src}
              alt={`profile-${index + 1}`}
              width={48}
              height={48}
              sizes="100vw"
              className=" !w-[48px] !h-[48px] absolute top-0 left-0"
            />
          </motion.div>
        ) : (
          <motion.div
            key={index}
            variants={avatarVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={index}
          >
            <JoinUsButton />
          </motion.div>
        ),
      )}
    </div>
  );
};
