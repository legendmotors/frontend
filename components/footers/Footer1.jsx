"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import emailjs from "@emailjs/browser";
import { useTranslation } from "react-i18next";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Import your BrandService
import BrandService from "@/services/BrandService";

// Import your footer links data
import { footerData } from "@/data/footerLinks";

export default function Footer1() {
  const formRef = useRef();
  const [success, setSuccess] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const { t } = useTranslation();

  // -------------------------
  // 1) STATE FOR POPULAR BRANDS
  // -------------------------
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    async function fetchFeaturedBrands() {
      try {
        const params = { featured: true };
        const res = await BrandService.listBrand(params);
        if (res && res.data) {
          setBrands(res.data);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    }
    fetchFeaturedBrands();
  }, []);

  // -------------------------
  // 2) SWIPER CONFIG
  // -------------------------
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
  };

  // -------------------------
  // Newsletter submit handler
  // -------------------------
  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };

  const sendMail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm("service_noj8796", "template_fs3xchn", formRef.current, {
        publicKey: "iG4SCmR-YtJagQ4gV",
      })
      .then((res) => {
        if (res.status === 200) {
          setSuccess(true);
          handleShowMessage();
          formRef.current.reset();
        } else {
          setSuccess(false);
          handleShowMessage();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // -------------------------
  // Mobile heading collapse
  // -------------------------
  useEffect(() => {
    const headings = document.querySelectorAll(".footer-heading-mobie");
    const toggleOpen = (event) => {
      const parent = event.target.closest(".footer-col-block");
      const content = parent.querySelector(".tf-collapse-content");

      if (parent.classList.contains("open")) {
        parent.classList.remove("open");
        content.style.height = "0px";
        content.style.padding = "0px 0px";
      } else {
        parent.classList.add("open");
        content.style.height = content.scrollHeight + 10 + "px";
        content.style.padding = "10px 0px";
      }
    };

    headings.forEach((heading) => {
      heading.addEventListener("click", toggleOpen);
    });
    return () => {
      headings.forEach((heading) => {
        heading.removeEventListener("click", toggleOpen);
      });
    };
  }, []);

  return (
    <footer id="footer" className="clearfix home">
      <div className="container">
        <div className="footer-main">
          <div className="row">
            {/* Loop through your footer data */}
            {footerData.map((column, index) => {
              // If this is the "Popular Cars" column (e.g., index === 1),
              // replace it with a Popular Brands slider.
              if (index === 1) {
                return (
                  <div className="col-lg-3 col-sm-6 col-12" key={index}>
                    <div className="widget widget-menu footer-col-block">
                      <div className="footer-heading-desktop">
                        <h4>Popular Brands</h4>
                      </div>
                      <div className="footer-heading-mobie">
                        <h4>Popular Brands</h4>
                      </div>
                      <ul className="box-menu tf-collapse-content">
                        {brands.map((brand, i) => (
                          <li key={i}>
                            <Link href={`/cars/new-cars?brandId=${brand.id}`}>{brand.name}</Link>
                          </li>
                        ))}
                      </ul>

                    </div>
                  </div>
                );
              } else {
                // Otherwise, render the default footer column
                return (
                  <div className="col-lg-3 col-sm-6 col-12" key={index}>
                    <div className="widget widget-menu footer-col-block">
                      <div className="footer-heading-desktop">
                        <h4>{t(column.heading)}</h4>
                      </div>
                      <div className="footer-heading-mobie">
                        <h4>{t(column.heading)}</h4>
                      </div>
                      <ul className="box-menu tf-collapse-content">
                        {column.menuItems.map((item, itemIndex) => (
                          <li key={itemIndex}>
                            <Link href={item.href}>{t(item.text)}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              }
            })}

            {/* Fourth column - Newsletter */}
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="widget widget-menu widget-form footer-col-block">
                <div className="footer-heading-desktop">
                  <h4>{t("newsletter")}</h4>
                </div>
                <div className="footer-heading-mobie">
                  <h4>{t("newsletter")}</h4>
                </div>
                <div className="tf-collapse-content">
                  <div
                    className={`tfSubscribeMsg footer-sub-element ${showMessage ? "active" : ""
                      }`}
                  >
                    {success ? (
                      <p style={{ color: "rgb(52, 168, 83)" }}>
                        {t("subscription_success")}
                      </p>
                    ) : (
                      <p style={{ color: "red" }}>{t("subscription_error")}</p>
                    )}
                  </div>
                  <form
                    onSubmit={sendMail}
                    ref={formRef}
                    className="comment-form form-submit"
                    acceptCharset="utf-8"
                  >
                    <p className="font-2">{t("newsletter_text")}</p>
                    <div className="text-wrap clearfix">
                      <fieldset className="email-wrap style-text">
                        <input
                          type="email"
                          className="tb-my-input"
                          name="email"
                          placeholder={t("email_placeholder")}
                          required
                        />
                      </fieldset>
                    </div>
                    <button
                      name="submit"
                      type="submit"
                      className="button btn-submit-comment btn-1 btn-8"
                    >
                      <span>{t("send")}</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Footer bottom */}
        <div className="footer-bottom">
          <div className="row">
            <div className="col-lg-4 col-md-12">
              <div className="logo-footer style box-1">
                <Link href={`/`}>
                  <Image
                    className="lazyload"
                    data-src={t("logo_footer")}
                    alt={t("footer_logo_alt")}
                    width={225}
                    height={40}
                    src={t("logo_footer")}
                  />
                </Link>
              </div>
            </div>
            <div className="col-lg-8 col-md-12">
              <div className="footer-bottom-right flex-six flex-wrap">
                <div className="title-bottom center">
                  {t("footer_copyright")}
                </div>
                <div className="icon-social box-3 text-color-1">
                  <a href="#">
                    <i className="icon-autodeal-facebook" />
                  </a>
                  <a href="#">
                    <i className="icon-autodeal-linkedin" />
                  </a>
                  <a href="#">
                    <i className="icon-autodeal-twitter" />
                  </a>
                  <a href="#">
                    <i className="icon-autodeal-instagram" />
                  </a>
                  <a href="#">
                    <i className="icon-autodeal-youtube" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
