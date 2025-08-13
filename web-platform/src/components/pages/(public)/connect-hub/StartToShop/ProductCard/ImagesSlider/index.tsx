"use client";

import { FC, useEffect, useRef } from "react";

import lightGallery from "lightgallery";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import Image from "next/image";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css/pagination";

import { ImagesSliderProps } from "./types";

import "swiper/css";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";
import "./ImagesSlider.Module.css";

export const ImagesSlider: FC<ImagesSliderProps> = ({ images }) => {
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (galleryRef.current) {
      lightGallery(galleryRef.current, {
        plugins: [lgThumbnail, lgZoom],
        speed: 500,
        selector: ".lightbox-item",
      });
    }
  }, []);
  return (
    <div ref={galleryRef} className="gallery-container cursor-pointer">
      <Swiper
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className="xs:size-[50px] xs:min-w-[50px] xs:min-h-[50px] sm:size-[75px] sm:min-w-[75px] sm:min-h-[75px] md:size-[90px] md:min-w-[90px] md:min-h-[90px] rounded-small"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="lightbox-item" data-src={image}>
            <Image
              src={image}
              alt="product"
              width={0}
              height={0}
              sizes="100vw"
              className="xs:size-[50px] xs:min-w-[50px] xs:min-h-[50px] sm:size-[75px] sm:min-w-[75px] sm:min-h-[75px] md:size-[90px] md:min-w-[90px] md:min-h-[90px] rounded-small"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
