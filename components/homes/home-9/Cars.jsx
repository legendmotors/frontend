"use client";
import Link from "next/link";
import { carData } from "@/data/cars";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import CarCard from "@/components/carsListings/CarCard";
import { formatPriceAED } from "@/utility/formatedPriceAED";
import LocalizedLink from "@/components/translation/LocalizedLink";
const priceRanges = [
  {
    title: `${formatPriceAED(50000)} - ${formatPriceAED(80000)}`,
    isActive: false,
    range: { min: 50000, max: 80000 },
  },
  {
    title: `${formatPriceAED(50000)} - ${formatPriceAED(80000)}`,
    isActive: false,
    range: { min: 50000, max: 80000 },
  },
  {
    title: `${formatPriceAED(80000)} - ${formatPriceAED(100000)}`,
    isActive: false,
    range: { min: 80000, max: 100000 },
  },
];

export default function Cars({title}) {
  const [filtered, setFiltered] = useState(carData);
  const [selectedRange, setSelectedRange] = useState(priceRanges[0]);

  useEffect(() => {
    if (selectedRange.range) {
      setFiltered(
        [...carData].filter(
          (elm) =>
            elm.price >= selectedRange.range.min &&
            elm.price <= selectedRange.range.max
        )
      );
    } else {
      setFiltered([...carData]);
    }
  }, [selectedRange]);
  const swiperOptions = {
    speed: 1000,
    spaceBetween: 30,
    pagination: {
      el: ".spd19",
      clickable: true,
    },
    navigation: {
      nextEl: ".snbn23",
      prevEl: ".snbp23",
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      600: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      991: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  };
  return (
    <section className="tf-section3">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="heading-section flex align-center justify-space flex-wrap gap-20">
              <h2
                className="wow fadeInUpSmall"
                data-wow-delay="0.2s"
                data-wow-duration="1000ms"
              >
               {title}
              </h2>
              <LocalizedLink
                href={`/listing-grid`}
                className="tf-btn-arrow wow fadeInUpSmall"
                data-wow-delay="0.2s"
                data-wow-duration="1000ms"
              >
                View all
                <i className="icon-autodeal-btn-right" />
              </LocalizedLink>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="flat-tabs themesflat-tabs">
              <div className="box-tab center">
                <ul className="menu-tab tab-title style flex">
                  {priceRanges.map((item, index) => (
                    <li
                      key={index}
                      className={`item-title ${item == selectedRange ? "active" : ""
                        }`}
                      onClick={() => setSelectedRange(item)}
                    >
                      <h5 className="inner">{item.title}</h5>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="content-tab">
                <div className="content-inner tab-content">
                  <Swiper
                    {...swiperOptions}
                    modules={[Pagination, Navigation]}
                    className="swiper-container tf-sw-mobile3"
                  >
                    {filtered.map((car, i) => (
                      <SwiperSlide key={i} className="swiper-slide">
                        <CarCard car={car} />
                      </SwiperSlide>
                    ))}
                    <div className="swiper-pagination5 spd19 pb-1"></div>
                  </Swiper>
                  <div className="swiper-button-next style-1 snbn23" />
                  <div className="swiper-button-prev style-1 snbp23" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
