// components/HeroCarousel.jsx
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
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
      navigation
      pagination={{ clickable: true }}
      className="w-[100%] max-w-6xl mx-auto h-[500px]"
    >
      <SwiperSlide>
        <img
          src="/banner1.jpg"
          alt="Joias 1"
          className="w-full h-full object-cover"
        />
      </SwiperSlide>
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
    </Swiper>
  )
}
