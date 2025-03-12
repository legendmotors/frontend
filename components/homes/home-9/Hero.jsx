"use client";
import React, { useEffect, useReducer, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import BannerService from "@/services/BannerService";
import { useTranslation } from "react-i18next";
import CarFilter from "@/components/filter/CarFilter";

export default function Hero() {
  const { i18n } = useTranslation();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef(null); // Swiper reference

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const identifiers = [
          "HomeBannerSlideOne",
          "HomeBannerSlideTwo",
          "HomeBannerSlideThree",
        ];
        const promises = identifiers.map((id) =>
          BannerService.getBannerByIdentifier(id, i18n.language)
        );
        const results = await Promise.all(promises);
        const validBanners = results
          .filter((r) => r?.success && r.data)
          .map((r) => r.data);
        setBanners(validBanners);
      } catch (err) {
        console.error("Error fetching banners by identifier:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [i18n.language]);

  return (
    <div className="position-relative">
      <Swiper
        ref={swiperRef}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        slidesPerView={1}
        speed={500}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        className="swiper mainslider slider home9"
      >
        {!loading && banners.length > 0
          ? banners.map((banner, i) => (
              <SwiperSlide key={i} className="swiper-slide">
                <div className="slider-item position-relative">
                  <div className="img-slider">
                    <Image
                      className="img-item lazyload"
                      alt={banner.title || banner.identifier || "Banner"}
                      src={
                        banner.media
                          ? `${process.env.NEXT_PUBLIC_FILE_PREVIEW_URL}${
                              banner.media.webp || banner.media.compressed
                            }`
                          : "/default-banner.jpg"
                      }
                      width={3840}
                      height={1920}
                      priority
                    />
                  </div>
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="content po-content-two">
                          <div className="heading text-center">
                            <div
                              className="sub-title2 fs-20 fw-3 lh-25 text-color-1 wow fadeInUp"
                              data-wow-delay="0ms"
                              data-wow-duration="1200ms"
                            >
                              {banner.title}
                            </div>
                            <h1
                              className="wow fadeInUp js-letters text-color-1"
                              data-wow-delay="200ms"
                              data-wow-duration="1200ms"
                            >
                              {banner.description}
                            </h1>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Custom Swiper Navigation Buttons */}
                  <button
                    className="custom-prev"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "20px",
                      transform: "translateY(-50%)",
                      zIndex: 10,
                      background: "rgba(0, 0, 0, 0.5)",
                      color: "#fff",
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      border: "none",
                    }}
                    onClick={() => swiperRef.current?.swiper.slidePrev()}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button
                    className="custom-next"
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "20px",
                      transform: "translateY(-50%)",
                      zIndex: 10,
                      background: "rgba(0, 0, 0, 0.5)",
                      color: "#fff",
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      border: "none",
                    }}
                    onClick={() => swiperRef.current?.swiper.slideNext()}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </SwiperSlide>
            ))
          : null}
      </Swiper>

      {/* Overlay filter using Bootstrap classes */}
      <div
        className="position-absolute bottom-0 start-50 translate-middle-x w-100"
        style={{ zIndex: 10 }}
      >
        <div className="flat-filter-search home9">
          <div className="flat-tabs">
            <CarFilter />
          </div>
        </div>
      </div>
    </div>
  );
}
