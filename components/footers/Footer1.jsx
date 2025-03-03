"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import emailjs from "@emailjs/browser";
import Link from "next/link";
import { footerData } from "@/data/footerLinks";

export default function Footer1() {
  const formRef = useRef();
  const [success, setSuccess] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

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

    // Clean up event listeners when the component unmounts
    return () => {
      headings.forEach((heading) => {
        heading.removeEventListener("click", toggleOpen);
      });
    };
  }, []); // Empty dependency array means this will run only once on mount
  return (
    <footer id="footer" className="clearfix home">
      <div className="container">
        <div className="footer-main">
          <div className="row">
            {footerData.map((column, index) => (
              <div className="col-lg-3 col-sm-6 col-12" key={index}>
                <div className="widget widget-menu footer-col-block">
                  <div className="footer-heading-desktop">
                    <h4>{column.heading}</h4>
                  </div>
                  <div className="footer-heading-mobie ">
                    <h4>{column.heading}</h4>
                  </div>
                  <ul className="box-menu tf-collapse-content">
                    {column.menuItems.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <Link href={item.href}>{item.text}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="widget widget-menu widget-form footer-col-block">
                <div className="footer-heading-desktop">
                  <h4>Newsletter</h4>
                </div>
                <div className="footer-heading-mobie">
                  <h4>Newsletter</h4>
                </div>
                <div className="tf-collapse-content">
                  <div
                    className={`tfSubscribeMsg  footer-sub-element ${
                      showMessage ? "active" : ""
                    }`}
                  >
                    {success ? (
                      <p style={{ color: "rgb(52, 168, 83)" }}>
                        You have successfully subscribed.
                      </p>
                    ) : (
                      <p style={{ color: "red" }}>Something went wrong</p>
                    )}
                  </div>
                  <form
                    onSubmit={sendMail}
                    ref={formRef}
                    className="comment-form form-submit"
                    acceptCharset="utf-8"
                  >
                    <p className="font-2">
                      Stay on top of the latest car trends, tips, and tricks for
                      selling your car.
                    </p>
                    <div className="text-wrap clearfix">
                      <fieldset className="email-wrap style-text">
                        <input
                          type="email"
                          className="tb-my-input"
                          name="email"
                          placeholder="Your email address"
                          required
                        />
                      </fieldset>
                    </div>
                    <button
                      name="submit"
                      type="submit"
                      className="button btn-submit-comment btn-1 btn-8"
                    >
                      <span>Send</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="row">
            <div className="col-lg-4 col-md-12">
              <div className="logo-footer style box-1">
                <Link href={`/`}>
                  <Image
                    className="lazyload"
                    data-src="/assets/images/logo/footer-logo.png"
                    alt="img"
                    width={225}
                    height={40}
                    src="/assets/images/logo/footer-logo.png"
                  />
                </Link>
              </div>
            </div>
            <div className="col-lg-8 col-md-12">
              <div className="footer-bottom-right flex-six flex-wrap">
                <div className="title-bottom center">
                  © 2024 Legend Motors. All rights reserved
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
