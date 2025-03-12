"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

// Import your BrandService
import BrandService from "@/services/BrandService";

// Import the subscribeNewsletter function from your NewsletterService
import { subscribeNewsletter } from "@/services/NewsletterService";

// Import your footer links data
import { footerData } from "@/data/footerLinks";

export default function Footer1() {
  const formRef = useRef();
  const [success, setSuccess] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  // Newsletter submit handler using NewsletterService
  // -------------------------
  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const email = e.target.email.value;
    const payload = { email };

    try {
      const response = await subscribeNewsletter(payload);
      if (response) {
        setSuccess(true);
        handleShowMessage();
        formRef.current.reset();
      } else {
        setSuccess(false);
        handleShowMessage();
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      setSuccess(false);
      handleShowMessage();
    }
    setIsSubmitting(false);
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
              // For the "Popular Brands" column (e.g., index === 1),
              // render the popular brands list.
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
                  <div className={`tfSubscribeMsg footer-sub-element ${showMessage ? "active" : ""}`}>
                    {success ? (
                      <p style={{ color: "rgb(52, 168, 83)" }}>{t("subscription_success")}</p>
                    ) : (
                      <p style={{ color: "red" }}>{t("subscription_error")}</p>
                    )}
                  </div>
                  <form
                    onSubmit={handleNewsletterSubmit}
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
                    {/* Loader indicator */}
                    {isSubmitting && (
                      <div className="loader" style={{ margin: "10px 0", fontWeight: "bold" }}>
                        Loading...
                      </div>
                    )}
                    <button
                      name="submit"
                      type="submit"
                      className="button btn-submit-comment btn-1 btn-8"
                      disabled={isSubmitting}
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
                <div className="title-bottom center">{t("footer_copyright")}</div>
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
