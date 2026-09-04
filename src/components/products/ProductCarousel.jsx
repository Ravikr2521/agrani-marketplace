import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ImageOff } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const SlideDots = memo(({ count, active }) => {
  if (count <= 1) return null;

  return (
    <div className="pointer-events-none absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/20 px-2 py-1 backdrop-blur-sm">
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={`block rounded-full transition-all duration-300 ${index === active ? "h-1.5 w-3 bg-white" : "h-1.5 w-1.5 bg-white/55"}`}
        />
      ))}
    </div>
  );
});

SlideDots.displayName = "SlideDots";

const ImageFallback = memo(() => (
  <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-stone-100 via-stone-50 to-stone-200">
    <div className="flex flex-col items-center gap-2 text-muted">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 shadow-sm">
        <ImageOff className="h-5 w-5" />
      </div>
      <span className="text-xs font-medium">No image</span>
    </div>
  </div>
));

ImageFallback.displayName = "ImageFallback";

const ProductCarousel = memo(function ProductCarousel({
  images = [],
  alt = "",
  className = "",
  autoPlay = true,
  interval = 3500,
}) {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [erroredImages, setErroredImages] = useState(() => new Set());

  const validImages = useMemo(
    () => [
      ...new Set(
        images.filter(
          (image) => typeof image === "string" && image.trim().length > 0,
        ),
      ),
    ],
    [images],
  );

  const usableImages = useMemo(
    () => validImages.filter((image) => !erroredImages.has(image)),
    [validImages, erroredImages],
  );

  const hasMultipleImages = usableImages.length > 1;

  const handleImageError = useCallback((src) => {
    setErroredImages((previous) => {
      const next = new Set(previous);
      next.add(src);
      return next;
    });
  }, []);

  useEffect(() => {
    setActiveIndex(0);
    setErroredImages(new Set());
  }, [validImages.join("|")]);

  useEffect(() => {
    if (!swiperRef.current) return;

    swiperRef.current.slideToLoop(0, 0);
  }, [validImages.join("|")]);

  if (!usableImages.length) {
    return (
      <div
        className={`relative aspect-3/2 shrink-0 overflow-hidden bg-gray-100 ${className}`}
      >
        <ImageFallback />
      </div>
    );
  }

  return (
    <div
      className={`group relative aspect-3/2 shrink-0 overflow-hidden bg-gray-100 ${className}`}
    >
      <Swiper
        key={usableImages.join("|")}
        modules={[Autoplay, Pagination, A11y]}
        slidesPerView={1}
        spaceBetween={0}
        loop={hasMultipleImages}
        speed={900}
        grabCursor={hasMultipleImages}
        allowTouchMove={hasMultipleImages}
        watchSlidesProgress
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
        }}
        autoplay={
          autoPlay && hasMultipleImages
            ? {
                delay: interval,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        className="h-full w-full"
      >
        {usableImages.map((src, index) => (
          <SwiperSlide key={src}>
            <div className="relative h-full w-full overflow-hidden">
              <img
                src={src}
                alt={`${alt} ${index + 1}`}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
                className="h-full w-full select-none object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                onError={() => handleImageError(src)}
              />

              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-black/5 opacity-60" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {hasMultipleImages && (
        <SlideDots count={usableImages.length} active={activeIndex} />
      )}
    </div>
  );
});

ProductCarousel.displayName = "ProductCarousel";

export default ProductCarousel;
