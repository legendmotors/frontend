"use client";

import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import PartnerService from "@/services/PartnerService";
import { useEffect, useState } from "react";
export default function Partners({ title }) {
  const swiperOptions = {
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    slidesPerView: 2,
    loop: true,
    spaceBetween: 30,
    speed: 10000,
    observer: true,
    observeParents: true,

    breakpoints: {
      450: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
      868: {
        slidesPerView: 5,
        spaceBetween: 30,
      },
      992: {
        slidesPerView: 6,
        spaceBetween: 30,
      },
    },
  };

  const [partners, setPartners] = useState([]);

  useEffect(() => {
    async function fetchPartners() {
      const params = { featured: true };
      const res = await PartnerService.listPartnerLogos(params);

      if (res && res.data) {
        setPartners(res.data);
      }
    }
    fetchPartners();
  }, []);

  console.log(partners, "resresres");



  return (
    <section className="flat-brand tf-section3">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="title-section center">
              <h2
                className="wow fadeInUpSmall"
                data-wow-delay="0.2s"
                data-wow-duration="1000ms"
              >
                {title}
              </h2>
            </div>
            <Swiper
              {...swiperOptions}
              modules={[Autoplay, Pagination]}
              className="swiper-container carousel-5"
            >
              {partners.map((logo, index) => (
                <SwiperSlide className="swiper-slide" key={index}>
                  <div className="slogan-logo">
                    <a href="#">
                      <Image
                        className="lazyload"
                        data-src={
                          // Use the thumbnail path if available, otherwise fallback
                          process.env.NEXT_PUBLIC_FILE_PREVIEW_URL + logo.media?.webp ||
                          "/placeholder-image.jpg"
                        }
                        alt={logo.name}
                        src={
                          // Use the thumbnail path if available, otherwise fallback
                          process.env.NEXT_PUBLIC_FILE_PREVIEW_URL + logo.media?.webp ||
                          "/placeholder-image.jpg"
                        }
                        width={100}
                        height={100}
                      />
                    </a>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
