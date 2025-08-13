import { FC } from "react";

import Image from "next/image";
import Link from "next/link";

import { BlogItemProps } from "./types";

export const BlogItem: FC<BlogItemProps> = ({
  title,
  href,
  image,
  readTime,
}) => {
  return (
    <Link
      href={href || "/"}
      className="inline-block px-4 pt-4 pb-12 space-y-12 rounded-medium lg:shadow-light-3 bg-surface-container-lowest"
    >
      <Image
        src={image}
        height={159}
        width={290}
        alt="blog"
        className="rounded-small object-cover w-full h-[159px]"
      />
      <div className="space-y-8">
        <div className="px-8 pb-8 h-48 text-label-large text-on-surface-variant line-clamp-2">
          {title}
        </div>
        <div className="flex justify-between items-center px-8">
          <span className="text-outline text-body-small">
            {readTime} Read Time
          </span>
          <span className="text-label-medium text-outline">News</span>
        </div>
      </div>
    </Link>
  );
};
