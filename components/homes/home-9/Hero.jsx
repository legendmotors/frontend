
"use client";
import { slides } from "@/data/heroSlides";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import FlatFilter2 from "@/components/common/FlatFilter2";
import React, { useEffect, useReducer } from "react";
import { useTranslations } from "next-intl";
import FlatFilter3 from "@/components/common/FlatFilter3";
import { initialState, reducer } from "@/reducer/carFilterReducer";

export default function Hero() {
  const swiperOptions = {
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    slidesPerView: 1,
    speed: 500,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    navigation: {
      nextEl: ".snbn7",
      prevEl: ".snbp7",
    },
    preventClicks: false,
    simulateTouch: false,
    preventClicksPropagation: false,
    touchStartPreventDefault: false, // Ensure dropdowns can receive focus
    allowTouchMove: true, // Allow touch interactions if needed
  };


  const t = useTranslations('HomePage');


const [state, dispatch] = useReducer(reducer, initialState);
  const allProps = {
    ...state,
    setPrice: (value) => dispatch({ type: "SET_PRICE", payload: value }),
    setYear: (value) => dispatch({ type: "SET_YEAR", payload: value }),
    setModel: (value) => dispatch({ type: "SET_MODEL", payload: value }),
    setKM: (value) => dispatch({ type: "SET_KM", payload: value }),
    setBody: (value) => dispatch({ type: "SET_BODY", payload: value }),
    setMake: (value) => dispatch({ type: "SET_MAKE", payload: value }),
    setFuel: (value) => dispatch({ type: "SET_FUEL", payload: value }),
    setTransmission: (value) =>
      dispatch({ type: "SET_TRANSMISSION", payload: value }),
    setLocation: (value) => dispatch({ type: "SET_LOCATION", payload: value }),
    setDoor: (value) => dispatch({ type: "SET_DOOR", payload: value }),
    setCylinder: (value) => dispatch({ type: "SET_CYLINDER", payload: value }),
    setColor: (value) => dispatch({ type: "SET_COLOR", payload: value }),

    setFeatures: (newFeature) => {
      const updated = [...features].includes(newFeature)
        ? [...features].filter((elm) => elm != newFeature)
        : [...features, newFeature];
      dispatch({ type: "SET_FEATURES", payload: updated });
    },
    setSortingOption: (value) =>
      dispatch({ type: "SET_SORTING_OPTION", payload: value }),
    setCurrentPage: (value) =>
      dispatch({ type: "SET_CURRENT_PAGE", payload: value }),
    setItemPerPage: (value) => {
      dispatch({ type: "SET_CURRENT_PAGE", payload: 1 }),
        dispatch({ type: "SET_ITEM_PER_PAGE", payload: value });
    },
  };

  const clearFilter = () => {
    dispatch({ type: "CLEAR_FILTER" });
  };

  return (
    <Swiper
      {...swiperOptions}
      modules={[Autoplay, Navigation, Pagination, EffectFade]}
      className="swiper mainslider slider home9"
    >
      {slides.map((elm, i) => (
        <SwiperSlide key={i} className="swiper-slide">
          <div className="slider-item">
            <div className="img-slider">
              <Image
                className="img-item lazyload"
                alt=""
                src={elm.imgSrc}
                width={3840}
                height={1920}
              />
            </div>
            <div className="container relative">
              <div className="row">
                <div className="col-lg-12">
                  <div className="content po-content-two">
                    <div className="heading center">
                      <div
                        className="sub-title2 fs-20 fw-3 lh-25 text-color-1 wow fadeInUp"
                        data-wow-delay="0ms"
                        data-wow-duration="1200ms"
                      >
                        {t('ads_count')}
                      </div>
                      <h1
                        className="wow fadeInUp js-letters text-color-1"
                        data-wow-delay="200ms"
                        data-wow-duration="1200ms"
                      >
                        {t('cta_text')}
                      </h1>
                    </div>
                    {/* filter */}
                    <div className="flat-filter-search home9">
                      <div className="flat-tabs">
                        <FlatFilter3 clearFilter={clearFilter} allProps={allProps} />
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}

      <div className="swiper-button-next snbn7" />
      <div className="swiper-button-prev snbp7" />
    </Swiper>
  );
}
