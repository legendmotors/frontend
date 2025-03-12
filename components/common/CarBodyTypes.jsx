"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SpecificationService from "@/services/SpecificationService"; // adjust the import path as needed

// Allowed body types and their corresponding image filenames
const allowedBodyTypes = {
  "Sedan": "sedan.png",
  "Hatchback": "hatchback.png",
  "SUV": "suv.png",
  "Crossover": "crossover.png",
};

export default function CarBodyTypes({ title, specId }) {
  const [specValues, setSpecValues] = useState([]);

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
            <Swiper {...swiperOptions} modules={[Autoplay, Pagination]} className="swiper carousel-1 overflow-hidden">
              {specValues.length > 0 ? (
                specValues.map((spec, index) => (
                  <SwiperSlide key={index}>
                    <Link href={`/cars/new-cars?body_type=${spec.id}`} className="partner-item style-2">
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
                        <div className="fs-16 fw-6 title text-color-2 font-2">{spec.name}</div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))
              ) : (
                <p>No specification values found.</p>
              )}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
