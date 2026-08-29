import { Leaf, ShoppingBasket, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/effect-fade";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const heroSlides = [
  {
    badge: "Fresh agricultural marketplace",
    title: "Fresh produce from local farms",
    description:
      "Browse verified farm stocks, choose your variant, and order without an account.",
    gradient: "from-[#f56a00] via-[#ff8b17] to-[#ffb35d]",
    icon: ShoppingBasket,
    image:
      "https://www.transparentpng.com/thumb/vegetables/all-fruits-and-vegetables-in-basket-background-transparent-veD4qx.png",
  },
  {
    badge: "Verified agricultural sellers",
    title: "Quality you can trust",
    description:
      "Discover fresh products from verified sellers and select the exact variant and pack size you need.",
    gradient: "from-[#15803d] via-[#22a653] to-[#86efac]",
    icon: Leaf,
    image:
      "https://static.wixstatic.com/media/7e88c5_1b5c8df9b2fd4515ae58c9e141239655~mv2.png",
  },
  {
    badge: "Simple & convenient delivery",
    title: "From farm to your doorstep",
    description:
      "Choose your preferred produce and pack size and get your order delivered with ease.",
    gradient: "from-[#0369a1] via-[#0284c7] to-[#38bdf8]",
    icon: Truck,
    image:
      "https://png.pngtree.com/png-clipart/20250131/original/pngtree-cartoon-vegetable-truck-fresh-produce-delivery-vehicle-png-image_20352838.png",
  },
];

const WelcomCarousel = () => {
  return (
    <section>
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        speed={900}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop
        className="overflow-hidden rounded-2xl shadow-sm"
      >
        {heroSlides.map((slide, index) => {
          const Icon = slide.icon;

          return (
            <SwiperSlide key={index}>
              <Link
                to="/category"
                className="block cursor-pointer"
                aria-label="Explore products"
              >
                <div
                  className={`
                    relative
                    h-42
                    overflow-hidden
                    bg-linear-to-r
                    ${slide.gradient}
                    sm:h-50
                    lg:h-50
                  `}
                >
                  <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-white/10" />

                  <div className="pointer-events-none absolute left-[42%] -top-20 h-48 w-48 rounded-full bg-white/[0.07]" />

                  <div className="pointer-events-none absolute -bottom-16 right-[20%] h-48 w-48 rounded-full bg-white/8" />

                  <svg
                    className="pointer-events-none absolute bottom-0 left-0 h-56 w-56 opacity-[0.07]"
                    viewBox="0 0 200 200"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="#ffffff"
                      d="M40,-61.7C52.8,-49.3,64.3,-39.1,72.1,-25.4C79.9,-11.8,84,5.3,78.6,19.7C73.3,34,58.4,45.5,44.1,54.6C29.7,63.7,14.8,70.3,-1.4,72C-17.6,73.7,-35.2,70.4,-45.4,60.5C-55.6,50.7,-58.4,34.3,-62.6,18.4C-66.8,2.4,-72.4,-13.1,-68.1,-26.2C-63.8,-39.2,-49.5,-49.8,-35.2,-60.2C-20.9,-70.6,-10.5,-80.8,1.1,-82.1C12.7,-83.5,25.5,-76.2,40,-61.7Z"
                      transform="translate(100 100)"
                    />
                  </svg>

                  <div className="relative z-10 flex h-full items-center">
                    <div className="w-full px-6 py-6 sm:px-10 lg:w-[62%] lg:px-12">
                      <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
                        <Icon className="h-5 w-5 shrink-0" />
                        <span>{slide.badge}</span>
                      </div>

                      <h1 className="mt-3 max-w-2xl text-xl font-bold leading-[1.1] tracking-tight text-white sm:text-3xl lg:text-[38px]">
                        {slide.title}
                      </h1>

                      <p className="mt-2 max-w-xl text-[13px] leading-6 text-white/85 sm:text-base">
                        {slide.description}
                      </p>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute bottom-0 right-3 hidden h-full w-[40%] items-end justify-end lg:flex">
                    <img
                      src={slide.image}
                      alt=""
                      className="max-h-46 w-auto max-w-[95%] object-contain drop-shadow-2xl"
                    />
                  </div>

                  <div className="pointer-events-none absolute inset-0 lg:hidden">
                    <img
                      src={slide.image}
                      alt=""
                      className="absolute bottom-0 -right-7.5 h-36 w-auto max-w-[45%] object-contain opacity-20"
                    />
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

export default WelcomCarousel;
