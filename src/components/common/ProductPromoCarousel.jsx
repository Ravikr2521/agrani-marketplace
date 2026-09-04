import "swiper/css";
import "swiper/css/autoplay";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ArrowRight, Apple, Carrot, Wheat } from "lucide-react";
import { useNavigate } from "react-router-dom";

const promoSlides = [
  {
    title: "Fresh Fruits",
    subtitle: "Naturally fresh, farm-picked",
    category: "FRUIT",
    icon: Apple,
    className: "bg-orange-50",
    iconClass: "bg-orange-100 text-orange-600",
    titleClass: "text-orange-950",
    subtitleClass: "text-orange-700",
  },
  {
    title: "Fresh Vegetables",
    subtitle: "Crisp, fresh & locally sourced",
    category: "VEGETABLE",
    icon: Carrot,
    className: "bg-emerald-50",
    iconClass: "bg-emerald-100 text-emerald-600",
    titleClass: "text-emerald-950",
    subtitleClass: "text-emerald-700",
  },
  {
    title: "Quality Pulses",
    subtitle: "Everyday essentials from trusted sellers",
    category: "DAAL",
    icon: Wheat,
    className: "bg-amber-50",
    iconClass: "bg-amber-100 text-amber-700",
    titleClass: "text-amber-950",
    subtitleClass: "text-amber-700",
  },
];

const desktopSlides = [...promoSlides, ...promoSlides];

export default function ProductPromoCarousel() {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/category?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="overflow-hidden rounded-2xl">
      <style>{`
        .promo-desktop-swiper .swiper-wrapper {
          transition-timing-function: linear !important;
        }
      `}</style>

      <div className="lg:hidden">
        <Swiper
          modules={[Autoplay]}
          loop
          speed={900}
          autoplay={{
            delay: 3200,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          spaceBetween={10}
          slidesPerView={1.08}
          watchSlidesProgress
          breakpoints={{
            640: {
              slidesPerView: 1.5,
              spaceBetween: 12,
            },
          }}
          className="overflow-visible!"
        >
          {promoSlides.map((slide) => (
            <SwiperSlide
              key={slide.category}
              className="transition-all duration-700 ease-out"
            >
              <PromoCard slide={slide} onClick={handleCategoryClick} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="hidden lg:block">
        <Swiper
          modules={[Autoplay]}
          loop
          speed={6500}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          slidesPerView={3}
          spaceBetween={18}
          allowTouchMove
          className="promo-desktop-swiper"
        >
          {desktopSlides.map((slide, index) => (
            <SwiperSlide key={`${slide.category}-${index}`}>
              <PromoCard slide={slide} onClick={handleCategoryClick} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

function PromoCard({ slide, onClick }) {
  const Icon = slide.icon;

  return (
    <button
      type="button"
      onClick={() => onClick(slide.category)}
      className={`
        group relative flex h-full min-h-24 w-full items-center justify-between
        overflow-hidden rounded-2xl px-4 py-3
        shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-all duration-300
        hover:-translate-y-0.5 hover:shadow-md active:scale-[0.985]
        sm:h-28.75 sm:px-5 lg:min-h-36 lg:px-6 border border-black/5 ${slide.className}
        ${slide.className}
      `}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/30 transition-transform duration-700 group-hover:scale-125" />
      <div className="pointer-events-none absolute -bottom-12 right-20 h-24 w-24 rounded-full bg-white/20 transition-transform duration-700 group-hover:translate-y-2" />
      <div className="pointer-events-none absolute -left-12 bottom-11.25 h-24 w-24 rounded-full bg-white/20" />

      <div className="relative z-10 flex min-w-0 items-center gap-3 lg:gap-4">
        <div
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl shadow-sm transition-all duration-500 group-hover:scale-105 group-hover:rotate-1 lg:h-14 lg:w-14 lg:rounded-2xl ${slide.iconClass}`}
        >
          <Icon className="h-6 w-6 lg:h-7 lg:w-7" />
        </div>
        <div className="min-w-0 text-left">
          <h3
            className={`truncate text-sm font-bold sm:text-base lg:text-lg ${slide.titleClass}`}
          >
            {slide.title}
          </h3>
          <p
            className={`mt-2 text-[10px] leading-3 sm:text-xs lg:text-[13px] ${slide.subtitleClass}`}
          >
            {slide.subtitle}
          </p>
          <span
            className={`mt-2 hidden text-[11px] font-semibold lg:inline-block ${slide.subtitleClass}`}
          >
            Explore products
          </span>
        </div>
      </div>

      <div className="relative z-10 ml-2 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:translate-x-1 group-hover:bg-white lg:h-10 lg:w-10">
        <ArrowRight className="h-4 w-4 text-stone-700 transition-transform duration-300 group-hover:translate-x-0.5 lg:h-5 lg:w-5" />
      </div>
    </button>
  );
}
