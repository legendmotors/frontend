"use client";
import { useEffect, useState, useRef } from "react";
import { Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import BrandService from "@/services/BrandService"; // Ensure the path is correct

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function PopularBrands({ title }) {
  const [brands, setBrands] = useState([]);
  const swiperRef = useRef(null);

  const swiperOptions = {
    slidesPerView: 6,
    spaceBetween: 30,
    observer: true,
    observeParents: true,
    breakpoints: {
      0: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      600: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      992: {
        slidesPerView: 4,
      },
      1440: {
        slidesPerView: 6,
      },
    },
    // Configure custom navigation
    navigation: {
      nextEl: ".custom-next",
      prevEl: ".custom-prev",
    },
  };

  // Fetch featured brands from the API
  useEffect(() => {
    async function fetchFeaturedBrands() {
      const params = { featured: true };
      const res = await BrandService.listBrand(params);
      if (res && res.data) {
        setBrands(res.data);
      }
    }
    fetchFeaturedBrands();
  }, []);

  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="heading-section flex align-center justify-space flex-wrap gap-20">
              <h2>{title}</h2>
              <Link href="/cars/new-cars" className="tf-btn-arrow">
                View all <i className="icon-autodeal-btn-right" />
              </Link>
            </div>
          </div>
          <div className="col-lg-12">
            {/* Relative container for Swiper and buttons */}
            <div style={{ position: "relative" }}>
              <Swiper
                {...swiperOptions}
                modules={[Pagination, Navigation]}
                ref={swiperRef}
                className="swiper"
              >
                {brands.length > 0
                  ? brands.map((brand, i) => (
                      <SwiperSlide key={i} className="swiper-slide">
                        <Link
                          href={{
                            pathname: "/cars/new-cars",
                            query: { brandId: brand.id },
                          }}
                          className="partner-item style-1"
                        >
                          <div className="image">
                            <Image
                              src={
                                process.env.NEXT_PUBLIC_FILE_PREVIEW_URL +
                                  (brand.logo?.webp ||
                                    "/placeholder-image.jpg")
                              }
                              alt={brand.name}
                              width={100}
                              height={100}
                            />
                          </div>
                          <div className="content center">
                            <div className="fs-16 fw-6 title text-color-2 font-2">
                              {brand.name}
                            </div>
                          </div>
                          <div className="content center">
                            <div className="fs-16 fw-1 title text-color-2 font-2">
                              Cars
                            </div>
                            <span className="sub-title fs-12 fw-6 font-2">
                              {brand?.carCount}
                            </span>
                          </div>
                        </Link>
                      </SwiperSlide>
                    ))
                  : null}
              </Swiper>

              {/* Navigation Buttons */}
              <button
                className="custom-prev"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "0",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  background: "rgba(0, 0, 0, 0.5)",
                  color: "#fff",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => swiperRef.current?.swiper.slidePrev()}
              >
                <i className="fas fa-chevron-left" />
              </button>

              <button
                className="custom-next"
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "0",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  background: "rgba(0, 0, 0, 0.5)",
                  color: "#fff",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => swiperRef.current?.swiper.slideNext()}
              >
                <i className="fas fa-chevron-right" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
