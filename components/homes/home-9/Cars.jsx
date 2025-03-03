"use client";
import Link from "next/link";
import { carData } from "@/data/cars";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import CarCard from "@/components/carsListings/CarCard";

import Cookies from "js-cookie";

const priceRanges = [
  { title: `AED 50 - 80K`, isActive: false, range: { min: 50000, max: 80000 } },
  { title: `AED 80 - 130K`, isActive: false, range: { min: 80000, max: 130000 } },
  { title: `AED 130 - 180K`, isActive: false, range: { min: 130000, max: 180000 } },
];

export default function Cars({ title }) {
  const [filtered, setFiltered] = useState(carData);
  const [selectedRange, setSelectedRange] = useState(priceRanges[0]);
  const [currency, setCurrency] = useState(Cookies.get("NEXT_CURRENCY") || "AED");
  const [exchangeRate, setExchangeRate] = useState(1);

  // Function to fetch exchange rate whenever currency changes
  const fetchExchangeRate = async (newCurrency) => {
    if (newCurrency !== "AED") {
      try {
        const res = await fetch(`/api/currency?to=${newCurrency}`);
        const data = await res.json();
        if (data.rates && data.rates[newCurrency]) {
          setExchangeRate(data.rates[newCurrency]);
        }
      } catch (error) {
        setExchangeRate(1); // Default to 1 if API fails
      }
    } else {
      setExchangeRate(1); // If AED, no conversion needed
    }
  };

  // Effect to listen for currency changes
  useEffect(() => {
    const interval = setInterval(() => {
      const savedCurrency = Cookies.get("NEXT_CURRENCY") || "AED";
      if (savedCurrency !== currency) {
        setCurrency(savedCurrency);
        fetchExchangeRate(savedCurrency);
      }
    }, 2000); // Check every 2 seconds for changes

    return () => clearInterval(interval);
  }, [currency]);

  // Effect to filter cars based on price range
  useEffect(() => {
    if (selectedRange.range) {
      setFiltered(
        carData.filter(
          (car) => car.price >= selectedRange.range.min && car.price <= selectedRange.range.max
        )
      );
    } else {
      setFiltered([...carData]);
    }
  }, [selectedRange]);

  const swiperOptions = {
    speed: 1000,
    spaceBetween: 30,
    pagination: { el: ".spd19", clickable: true },
    navigation: { nextEl: ".snbn23", prevEl: ".snbp23" },
    breakpoints: {
      0: { slidesPerView: 1, spaceBetween: 20 },
      600: { slidesPerView: 2, spaceBetween: 20 },
      991: { slidesPerView: 3 },
      1200: { slidesPerView: 4 },
    },
  };

  return (
    <section className="tf-section3">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="heading-section flex align-center justify-space flex-wrap gap-20">
              <h2 className="wow fadeInUpSmall" data-wow-delay="0.2s" data-wow-duration="1000ms">
                {title}
              </h2>
              <Link href={`/cars/new-cars`} className="tf-btn-arrow wow fadeInUpSmall" data-wow-delay="0.2s" data-wow-duration="1000ms">
                View all
                <i className="icon-autodeal-btn-right" />
              </Link>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="flat-tabs themesflat-tabs">
              <div className="box-tab center">
                <ul className="menu-tab tab-title style flex">
                  {priceRanges.map((item, index) => (
                    <li
                      key={index}
                      className={`item-title ${item === selectedRange ? "active" : ""}`}
                      onClick={() => setSelectedRange(item)}
                    >
                      <h5 className="inner">{item.title}</h5>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="content-tab">
                <div className="content-inner tab-content">
                  <Swiper {...swiperOptions} modules={[Pagination, Navigation]} className="swiper-container tf-sw-mobile3">
                    {filtered.map((car, i) => (
                      <SwiperSlide key={i} className="swiper-slide">
                        <CarCard
                          car={{
                            ...car,
                            convertedPrice: Math.round(car.price * exchangeRate),

                            currency,
                          }}
                        />
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
