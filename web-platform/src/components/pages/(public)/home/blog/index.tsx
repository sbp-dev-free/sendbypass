"use client";

import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Swiper, SwiperSlide } from "swiper/react";

import { Icon } from "@/components";
import { BLOG_POSTS } from "@/constants/home";
import { cn } from "@/utils";

import { BlogItem } from "./BlogItem";

import "swiper/css";

export const Blog = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const renderBlogItems = () => {
    return BLOG_POSTS.map(({ id, ...props }) => (
      <BlogItem key={id} {...props} />
    ));
  };

  const renderSwiperBlogItems = () => {
    return BLOG_POSTS.map(({ id, ...props }) => (
      <SwiperSlide key={id}>
        <BlogItem {...props} />
      </SwiperSlide>
    ));
  };

  return (
    <div className="space-y-32">
      <div className="pl-8">
        <div className="flex justify-between items-center">
          <div className="space-y-4">
            <h6 className="text-display-small text-on-surface">Blog.</h6>
            <span className="text-body-small text-on-surface-variant">
              Discover insights, tips, and inspiration
            </span>
          </div>
          <Button
            variant="text"
            className="!hidden md:!inline-flex"
            endIcon={<Icon name="Arrow left MD" />}
            href="/blog"
            target="_blank"
          >
            More
          </Button>
        </div>
      </div>
      <div className="hidden grid-cols-4 gap-20 md:grid">
        {renderBlogItems()}
      </div>
      <div className="md:hidden">
        <Swiper
          spaceBetween={20}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            380: {
              slidesPerView: 1.5,
            },
            600: {
              slidesPerView: 2,
            },
          }}
        >
          {renderSwiperBlogItems()}
        </Swiper>
      </div>
      <div
        className={cn("hidden justify-end", {
          flex: isMobile,
        })}
      >
        <Button
          variant="text"
          endIcon={<Icon name="Arrow Left MD" />}
          href="/blog"
          target="_blank"
        >
          More
        </Button>
      </div>
    </div>
  );
};
