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

export default function ProductPromoCarousel() {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/category?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="overflow-hidden rounded-2xl">
      <Swiper
        modules={[Autoplay]}
        loop
        speed={1000}
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
          1024: {
            slidesPerView: 2.2,
            spaceBetween: 14,
          },
        }}
        className="overflow-visible!"
      >
        {promoSlides.map((slide) => {
          const Icon = slide.icon;

          return (
            <SwiperSlide
              key={slide.category}
              className="transition-all duration-700 ease-out"
            >
              <button
                type="button"
                onClick={() => handleCategoryClick(slide.category)}
                className={`group relative flex h-25 w-full items-center justify-between overflow-hidden rounded-2xl px-4 py-3 text-left shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.985] sm:h-28.75 sm:px-5 ${slide.className}`}
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/30 transition-transform duration-700 group-hover:scale-125" />

                <div className="pointer-events-none absolute -bottom-10 right-20 h-20 w-20 rounded-full bg-white/20" />

                <div className="relative z-10 flex min-w-0 items-center gap-3">
                  <div
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl shadow-sm transition-transform duration-500 group-hover:scale-105 ${slide.iconClass}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="min-w-0">
                    <h3
                      className={`truncate text-sm font-bold sm:text-base ${slide.titleClass}`}
                    >
                      {slide.title}
                    </h3>

                    <p
                      className={`mt-0.5 truncate text-[10px] leading-4 sm:text-xs ${slide.subtitleClass}`}
                    >
                      {slide.subtitle}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 ml-2 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-white">
                  <ArrowRight className="h-4 w-4 text-stone-700 transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
              </button>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
