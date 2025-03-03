"use client";
import Link from "next/link";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";


export default function CarBodyTypes({title}) {
  const swiperOptions = {
    slidesPerView: 8,
    spaceBetween: 30,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    speed: 10000,
    loop: true,
    observer: true,
    observeParents: true,
    pagination: {
      el: ".spd5",
      clickable: true,
    },
    breakpoints: {
      0: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      480: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 4,
      },
      992: {
        slidesPerView: 5,
      },
      1440: {
        slidesPerView: 8,
      },
    },
  };

  return (
    <section className="">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="heading-section flex align-center justify-space flex-wrap gap-20">
              <h2 className="wow fadeInUpSmall" data-wow-delay="0.2s" data-wow-duration="1000ms">
               {title}
              </h2>
              <Link href="/cars/new-cars" className="tf-btn-arrow wow fadeInUpSmall" data-wow-delay="0.2s" data-wow-duration="1000ms">
                View all
                <i className="icon-autodeal-btn-right" />
              </Link>
            </div>
          </div>
          <div className="col-lg-12">
            <Swiper {...swiperOptions} modules={[Autoplay, Pagination]} className="swiper carousel-1 overflow-hidden">
              {[
                { type: "Sedan", icon: "sedan.png", count: 271 },
                { type: "Hatchback", icon: "hatchback.png", count: 271 },
                { type: "SUV", icon: "suv.png", count: 271 },
                { type: "Pickup Truck", icon: "pickup.png", count: 271 },
                { type: "Minivan", icon: "minivan.png", count: 271 },
                { type: "Crossover", icon: "crossover.png", count: 271 },
                { type: "SUV", icon: "suv.png", count: 271 },
                { type: "Pickup Truck", icon: "pickup.png", count: 271 },
                { type: "Minivan", icon: "minivan.png", count: 271 },
                { type: "Crossover", icon: "crossover.png", count: 271 },
              ].map((car, index) => (
                <SwiperSlide key={index} className="swiper-slide">
                  <Link href="/cars/new-cars" className="partner-item style-2 ">
                    <div className="icon d-flex align-items-center justify-content-center mb-0">
                      <img src={`/assets/images/bodytypes/${car.icon}`} alt={car.type} width={100} height={100} className="w-50"/>
                    </div>
                    <div className="content center">
                      <div className="fs-16 fw-6 title text-color-2 font-2">{car.type}</div>
                      <span className="sub-title fs-12 fw-4 font-2">{car.count} Car</span>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
