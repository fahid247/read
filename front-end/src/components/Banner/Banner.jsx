// components/Banner.jsx
"use client"; // make this a client component

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "animate.css";

// Import images
import image1 from "../../../public/daria-nepriakhina-xY55bL5mZAM-unsplash.jpg";
import image2 from "../../../public/patrick-tomasso-Oaqk7qqNh_c-unsplash.jpg";
import image3 from "../../../public/susan-q-yin-2JIvboGLeho-unsplash.jpg";

const Banner = () => {
  const router = useRouter();

  const slides = [
    {
      image: image3,
      title: "Empowering Libraries with Modern Delivery Tools",
      subtitle:
        "Manage books, track orders, and serve readers efficiently through BookCourier.",
    },
     {
      image: image2,
      title: "Designed for Students, Researchers & Readers",
      subtitle:
        "Access academic and general books from trusted libraries without travel or waiting lines.",
    },
    {
      image: image1,
      title: "Your Library, Delivered to Your Doorstep",
      subtitle:
        "Order, track, and return books from your favorite libraries — all from one platform.",
    },
   
    
  ];

  return (
    <div className="pb-8 bg-base-200">
      <div className="h-[70vh] w-full relative">
        <Swiper
          slidesPerView={1}
          spaceBetween={0}
          loop={true}
          autoplay={{ delay: 3000, pauseOnMouseEnter: true }}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Pagination, Navigation, Autoplay]}
          className="h-full w-full"
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={idx}>
              {/* Background image */}
              <div className="h-full w-full relative">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 flex justify-center items-center">
                  <div className="text-center text-white max-w-5xl px-4">
                    <h1 className="text-2xl playfair sm:text-4xl md:text-6xl font-bold animate__animated animate__fadeInDown">
                      {slide.title}
                    </h1>
                    <p className="mt-4 inter text-sm sm:text-lg md:text-xl font-medium animate__animated animate__fadeInUp">
                      {slide.subtitle}
                    </p>
                    <button
                      onClick={() => router.push("/allbooks")}
                      className="mt-6 bg-primary playfair hover:bg-accent text-base-100 font-semibold px-6 py-3 rounded-full transition-all duration-300"
                    >
                      All Books
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Banner;