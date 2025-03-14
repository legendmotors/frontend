"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SpecificationService from "@/services/SpecificationService"; // adjust the import path as needed

// Allowed body types and their corresponding image filenames
const allowedBodyTypes = {
  Sedan: "sedan.png",
  Hatchback: "hatchback.png",
  SUV: "suv.png",
  Crossover: "crossover.png",
};

export default function CarBodyTypes({ title, specId }) {
  const [specValues, setSpecValues] = useState([]);
  const swiperRef = useRef(null);

  console.log(specValues, "Filtered specValues"); // Debugging API response

  const swiperOptions = {
    slidesPerView: 8,
    spaceBetween: 30,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    speed: 10000,
    loop: false,
    observer: true,
    observeParents: true,
    pagination: {
      el: ".spd5",
      clickable: true,
    },
    // Add custom navigation selectors
    navigation: {
      nextEl: ".custom-next",
      prevEl: ".custom-prev",
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

  // Fetch specification values based on the provided specification ID
  useEffect(() => {
    async function fetchSpecValues() {
      try {
        const params = { specificationId: specId };
        const response = await SpecificationService.listSpecificationValues(params);

        if (response.data) {
          // Strictly filter response to only include allowed body types
          const filteredSpecValues = response.data.filter((spec) =>
            Object.keys(allowedBodyTypes).includes(spec.name)
          );
          setSpecValues(filteredSpecValues);
        }
      } catch (error) {
        console.error("Error fetching specification values:", error);
      }
    }

    if (specId) {
      fetchSpecValues();
    }
  }, [specId]);

  return (
    <section className="">
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
            {/* Wrap the Swiper and navigation buttons in a relative container */}
            <div style={{ position: "relative" }}>
              <Swiper
                {...swiperOptions}
                modules={[Autoplay, Pagination, Navigation]}
                ref={swiperRef}
                className="swiper"
              >
                {specValues.length > 0 ? (
                  specValues.map((spec, index) => (
                    <SwiperSlide key={index}>
                      <Link
                        href={`/cars/new-cars?body_type=${spec.id}`}
                        className="partner-item style-2"
                      >
                        <div className="icon d-flex align-items-center justify-content-center mb-0">
                          <img
                            src={`/assets/images/bodytypes/${allowedBodyTypes[spec.name]}`}
                            alt={spec.name}
                            width={100}
                            height={100}
                            className="w-100"
                          />
                        </div>
                        <div className="content center">
                          <div className="fs-16 fw-6 title text-color-2 font-2">
                            {spec.name}
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))
                ) : (
                  <p>No specification values found.</p>
                )}
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
