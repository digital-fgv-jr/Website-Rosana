import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function HeroCarousel() {
  return (
    <Swiper
      modules={[Autoplay, Navigation, Pagination]}
      spaceBetween={0}
      slidesPerView={1}
      autoplay={{ delay: 4000 }}
      className="w-[80%] max-w-[1152px] h-[120px] sm:h-[120px] md:h-[220px] lg:h-[320px] mb-8"
    >
      <SwiperSlide>
        <div className="relative w-full h-full">
          <Link to="/eventos" className="block w-full h-full">
            <img
              src="/banner1.png"
              alt="Banner de eventos da joalheria"
              className="w-full h-full sm:h-[120px] md:h-[220px] lg:h-[320px] object-cover"
            />

            {/* Texto sobreposto com layout ajustado */}
            <div
              className="
                absolute inset-0 
                flex flex-col md:flex-row
                justify-center md:justify-between 
                items-center
                px-6 md:px-10 lg:px-16
                gap-x-8
              "
            >
              {/* Bloco esquerdo com texto reduzido */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <h2 className="text-[clamp(1.8rem,5.2vw,3.6rem)] font-BodoniMT text-[#FAF9F6]">
                  CONFIRA NOSSOS
                </h2>
                <h2 className="text-[clamp(2.2rem,6.2vw,4.8rem)] font-BodoniMT text-[#F7E7CE] mt-0 md:-mt-2">
                  EVENTOS
                </h2>
              </div>

              {/* Bloco direito agora visível em telas médias e texto com quebra de linha */}
              <div className="hidden md:flex flex-col items-center md:items-end text-center md:text-right mt-4 md:mt-0 max-w-sm text-sm md:text-base leading-relaxed text-[#FAF9F6]">
                <p className="mb-1 text-[clamp(0.8rem,2.2vw,1.1rem)] whitespace-nowrap">
                  Descubra o encanto por trás de cada peça.
                </p>
                <p className="mb-1 text-[clamp(0.8rem,2.2vw,1.1rem)] whitespace-nowrap">
                  Nossos encontros revelam a arte da joalheria artesanal.
                </p>
                <p className="mb-1 text-[clamp(0.8rem,2.2vw,1.1rem)] whitespace-nowrap">
                  Experiências únicas para celebrar a beleza do feito à mão.
                </p>
                <p className="mb-1 text-[clamp(0.8rem,2.2vw,1.1rem)] whitespace-nowrap">
                  Venha conferir momentos especiais conosco.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </SwiperSlide>
    </Swiper>
  );
}