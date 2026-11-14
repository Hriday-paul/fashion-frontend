"use client";

import React, { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/styles.css";
import { defaultImg } from "@/utils/defaultImg";
import { ZoomIn } from "lucide-react";

export interface CharityGalleryItem {
  id?: string;
  url: string;
  caption?: string | null;
}

interface CharityGalleryProps {
  images: CharityGalleryItem[];
  className?: string;
}

export default function CharityGallery({ images, className }: CharityGalleryProps) {
  const [index, setIndex] = useState<number>(-1);

  if (!images || images.length === 0) return null;

  const slides = images.map((img, i) => ({
    src: img.url || defaultImg?.placeholderImg,
    alt: img?.caption || `Gallery Image ${i + 1}`,
  }));

  return (
    <>
      <div className={className || "mt-4 grid grid-cols-2 gap-3 md:grid-cols-3"}>
        {images.map((image, i) => (
          <button
            key={image?.id || i}
            type="button"
            onClick={() => setIndex(i)}
            className="group relative aspect-4/3 w-full overflow-hidden rounded-md border border-gray-200 bg-gray-50 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          >
            <Image
              src={image.url || defaultImg?.placeholderImg}
              alt={image?.caption || `Gallery Image ${i + 1}`}
              placeholder="blur"
              blurDataURL={defaultImg?.placeholderImg}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              quality={95}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-black/10 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/60 px-2 py-0.5 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
              <ZoomIn className="size-3.5" />
              <span>Zoom</span>
            </div>
          </button>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
        plugins={[Zoom, Counter]}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2,
          doubleClickMaxStops: 2,
        }}
        carousel={{
          finite: false,
        }}
      />
    </>
  );
}
