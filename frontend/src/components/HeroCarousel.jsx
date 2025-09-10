// components/HeroCarousel.jsx
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Link } from "react-router-dom";
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

export default function HeroCarousel() {
  return (
    <Swiper
      modules={[Autoplay, Navigation, Pagination]}
      spaceBetween={0}
      slidesPerView={1}
      autoplay={{ delay: 4000 }}
      className="w-[80%] h-[300px] sm:h-[300px] md:h-[400px] lg:h-[500px]"
    >
      <SwiperSlide>
        <Link to="/eventos" className="block w-full h-full">
        <img
          src="/banner1.png"
          alt="Joias 1"
          className="w-full h-full sm:h-[300px] md:h-[400px] lg:h-[500px] object-cover"
        />

      {/* Texto sobreposto */}
      <div className="absolute inset-0 flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-10">
      {/* Bloco esquerdo */}
        <div className="flex flex-col items-center text-center mx-auto xl:mx-0 xl:items-start">
          <h2 className="text-[clamp(2.5rem,4.5vw,4.5rem)] font-BodoniMT text-[#FAF9F6] text-left">
            CONFIRA NOSSOS
          </h2>
        <h2 className="text-[clamp(3rem,5vw,6rem)] font-BodoniMT text-[#F7E7CE] mt-1 text-left">
            EVENTOS
        </h2>
        </div>

      {/* Bloco direito */}
      <div className="hidden xl:flex flex-col items-end text-left md:text-right mt-6 md:mt-0 max-w-md text-sm md:text-base leading-relaxed text-[#FAF9F6]">
          <p className=" mb-1 text-[clamp(0.8rem,2.5vw,1.1rem)] whitespace-nowrap">
            Descubra o encanto por trás de cada peça.
          </p>
          <p className="mb-1 text-[clamp(0.8rem,2.5vw,1.1rem)] whitespace-nowrap">
            Nossos encontros revelam a arte da joalheria artesanal.
          </p> 
          <p className="mb-1 text-[clamp(0.8rem,2.5vw,1.1rem)] whitespace-nowrap">
            Experiências únicas para celebrar a beleza do feito à mão.
          </p>
          <p className="mb-1 text-[clamp(0.8rem,2.5vw,1.1rem)] whitespace-nowrap">
            Venha conferir momentos especiais conosco.
          </p>
       </div>
      </div>
      </Link>
      </SwiperSlide>
      {/*
      <SwiperSlide>
        <img
          src="/banner2.jpg"
          alt="Joias 2"
          className="w-full h-full object-cover"
        />
      </SwiperSlide>
      <SwiperSlide>
        <img
          src="/banner3.jpg"
          alt="Joias 3"
          className="w-full h-full object-cover"
        />
      </SwiperSlide>
      */}
    </Swiper>
  )
}
