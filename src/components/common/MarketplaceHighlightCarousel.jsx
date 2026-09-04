import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import { BadgeCheck, Leaf, ShoppingBasket } from "lucide-react";
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

const carouselSlides = [...slides, ...slides, ...slides];

export default function MarketplaceHighlightCarousel() {
  return (
    <section className="my-6 lg:my-8">
      <Swiper
        modules={[Autoplay, Pagination]}
        loop={true}
        loopAdditionalSlides={slides.length}
        slidesPerGroup={1}
        centeredSlides={true}
        slidesPerView={1.05}
        spaceBetween={12}
        speed={700}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 1.4,
            spaceBetween: 14,
          },
          768: {
            slidesPerView: 1.8,
            spaceBetween: 16,
          },
          1024: {
            slidesPerView: 2.2,
            spaceBetween: 18,
          },
          1280: {
            slidesPerView: 2.35,
            spaceBetween: 20,
          },
        }}
        className="marketplace-feature-carousel pb-7!"
      >
        {carouselSlides.map((slide, index) => {
          const Icon = slide.icon;

          return (
            <SwiperSlide key={`${slide.category}-${index}`}>
              <Link
                to={`/category?category=${encodeURIComponent(slide.category)}`}
                className={`
                  group
                  relative
                  flex
                  h-28
                  overflow-hidden
                  rounded-3xl
                  border
                  border-black/5
                  ${slide.bg}
                  shadow-[0_2px_12px_rgba(0,0,0,0.04)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]
                  sm:h-32
                  lg:h-36
                  xl:h-38
                `}
              >
                <div
                  className={`
                    absolute
                    -left-10
                    -top-10
                    h-36
                    w-36
                    rounded-full
                    ${slide.circle}
                    transition-transform
                    duration-700
                    group-hover:scale-110
                  `}
                />

                <div
                  className={`
                    absolute
                    -bottom-14
                    left-24
                    h-28
                    w-28
                    rounded-full
                    ${slide.circle}
                    opacity-60
                  `}
                />

                <div className="absolute -right-8 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-white/20 transition-transform duration-700 group-hover:translate-x-3" />

                <div className="relative z-10 flex w-[42%] shrink-0 items-center justify-center lg:w-[40%]">
                  <div
                    className="
                      relative
                      grid
                      h-16
                      w-16
                      place-items-center
                      rounded-full
                      bg-white
                      shadow-sm
                      ring-1
                      ring-black/5
                      transition-all
                      duration-500
                      group-hover:scale-105
                      group-hover:-rotate-2
                      sm:h-20
                      sm:w-20
                      lg:h-22
                      lg:w-22
                      xl:h-24
                      xl:w-24
                    "
                  >
                    <div
                      className="
                        absolute
                        inset-2
                        rounded-full
                        border
                        border-black/5
                        lg:inset-2.5
                      "
                    />

                    <Icon
                      className={`
                        h-7
                        w-7
                        transition-transform
                        duration-500
                        group-hover:scale-110
                        sm:h-8
                        sm:w-8
                        lg:h-9
                        lg:w-9
                        ${slide.iconColor}
                      `}
                    />

                    <span className="absolute right-0.5 top-1 h-3 w-3 rounded-full bg-white shadow-sm lg:right-1 lg:top-2" />
                  </div>
                </div>

                <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-center pr-4 sm:pr-5 lg:pr-6">
                  <span
                    className={`
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.16em]
                      sm:text-[10px]
                      lg:text-[11px]
                      ${slide.accent}
                    `}
                  >
                    {slide.category}
                  </span>

                  <h3
                    className="
                      mt-1
                      truncate
                      text-base
                      font-bold
                      leading-tight
                      text-stone-900
                      sm:text-lg
                      lg:text-xl
                    "
                  >
                    {slide.title}
                  </h3>

                  <p
                    className="
                      mt-1
                      truncate
                      text-[10px]
                      leading-4
                      text-stone-500
                      sm:text-xs
                      lg:text-sm
                    "
                  >
                    {slide.subtitle}
                  </p>

                  <div
                    className={`
                      mt-2
                      hidden
                      items-center
                      gap-1
                      text-[11px]
                      font-semibold
                      lg:flex
                      ${slide.accent}
                    `}
                  >
                    Explore category
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>

                <div
                  className="
                    absolute
                    right-3
                    top-3
                    grid
                    h-8
                    w-8
                    place-items-center
                    rounded-full
                    bg-white/80
                    shadow-sm
                    backdrop-blur-sm
                    transition-all
                    duration-300
                    group-hover:bg-white
                    group-hover:shadow-md
                    sm:right-4
                    sm:top-4
                    lg:h-9
                    lg:w-9
                  "
                >
                  <span className="text-sm font-medium text-stone-600 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    ↗
                  </span>
                </div>

                <div className="absolute bottom-3 right-5 h-1.5 w-1.5 rounded-full bg-white/80" />

                <div className="absolute bottom-5 right-8 h-1 w-1 rounded-full bg-white/60" />
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
