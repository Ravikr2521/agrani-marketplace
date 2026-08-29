import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import { ArrowUpRight, BadgeCheck, Leaf, ShoppingBasket } from "lucide-react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";

const slides = [
  {
    title: "Farm fresh",
    subtitle: "Fresh picks, every day",
    category: "FRUIT",
    icon: Leaf,
    bg: "bg-[#edf7e9]",
    circle: "bg-[#d7ebca]",
    iconColor: "text-emerald-700",
    accent: "text-emerald-700",
  },
  {
    title: "Trusted quality",
    subtitle: "From verified sellers",
    category: "VEGETABLE",
    icon: BadgeCheck,
    bg: "bg-[#edf4fa]",
    circle: "bg-[#d7e7f3]",
    iconColor: "text-blue-700",
    accent: "text-blue-700",
  },
  {
    title: "Shop smarter",
    subtitle: "Find your essentials",
    category: "GRAINS",
    icon: ShoppingBasket,
    bg: "bg-[#fff5e5]",
    circle: "bg-[#f6e4bd]",
    iconColor: "text-amber-700",
    accent: "text-amber-700",
  },
];

export default function MarketplacePromoCarousel() {
  return (
    <section className="my-6">
      <Swiper
        modules={[Autoplay, Pagination]}
        loop
        centeredSlides
        slidesPerView={1.05}
        spaceBetween={12}
        speed={700}
        autoplay={{
          delay: 3200,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 1.4,
          },
          768: {
            slidesPerView: 1.8,
          },
          1024: {
            slidesPerView: 2.2,
          },
        }}
        className="marketplace-feature-carousel pb-7!"
      >
        {slides.map((slide) => {
          const Icon = slide.icon;

          return (
            <SwiperSlide key={slide.title}>
              <Link
                to={`/category?category=${encodeURIComponent(slide.category)}`}
                className={`
                  relative
                  flex
                  h-28
                  overflow-hidden
                  rounded-3xl
                  ${slide.bg}
                  sm:h-32
                `}
              >
                <div
                  className={`
                    absolute
                    -left-8
                    -top-8
                    h-32
                    w-32
                    rounded-full
                    ${slide.circle}
                  `}
                />

                <div
                  className={`
                    absolute
                    -bottom-12
                    left-20
                    h-24
                    w-24
                    rounded-full
                    ${slide.circle}
                    opacity-60
                  `}
                />

                <div className="relative z-10 flex w-[48%] items-center justify-center">
                  <div
                    className={`
                      relative
                      grid
                      h-16
                      w-16
                      place-items-center
                      rounded-full
                      bg-white
                      shadow-sm
                      sm:h-20
                      sm:w-20
                    `}
                  >
                    <div
                      className={`
                        absolute
                        inset-2
                        rounded-full
                        border
                        border-black/5
                      `}
                    />

                    <Icon
                      className={`h-7 w-7 sm:h-8 sm:w-8 ${slide.iconColor}`}
                    />

                    <span
                      className={`
                        absolute
                        -right-1
                        top-1
                        h-3
                        w-3
                        rounded-full
                        bg-white
                        shadow-sm
                      `}
                    />
                  </div>
                </div>

                <div className="relative z-10 flex flex-1 flex-col justify-center pr-4">
                  <span
                    className={`text-[9px] font-bold uppercase tracking-[0.16em] ${slide.accent}`}
                  >
                    {slide.category}
                  </span>

                  <h3 className="mt-1 text-base font-bold leading-tight text-stone-900 sm:text-lg">
                    {slide.title}
                  </h3>

                  <p className="mt-1 text-[10px] text-stone-500 sm:text-xs">
                    {slide.subtitle}
                  </p>

                  {/* <div
                    className={`
                      mt-2
                      flex
                      items-center
                      gap-1
                      text-[9px]
                      font-semibold
                      ${slide.accent}
                    `}
                  >
                    Explore
                    <ArrowUpRight className="h-3 w-3" />
                  </div> */}
                </div>

                <div className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-white/80" />
                <div className="absolute right-6 top-6 h-1 w-1 rounded-full bg-white/70" />
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <style>{`
        .marketplace-feature-carousel .swiper-pagination {
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        .marketplace-feature-carousel .swiper-pagination-bullet {
          width: 5px;
          height: 5px;
          margin: 0 !important;
          opacity: 0.3;
          background: #78716c;
          transition: all 300ms ease;
        }

        .marketplace-feature-carousel .swiper-pagination-bullet-active {
          width: 17px;
          border-radius: 999px;
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
