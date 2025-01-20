"use client";
import React, { useRef, useState } from "react";
import Slider2 from "./sliders/Slider2";
import Image from "next/image";
import Description from "./detailComponents/Description";
import Overview from "./detailComponents/Overview";
import Features from "./detailComponents/Features";
import LoanCalculator from "./detailComponents/LoanCalculator";
import CarReview from "./detailComponents/CarReview";
import ProfileInfo from "./detailComponents/ProfileInfo";
import Recommended from "./detailComponents/Recommended";
import { allCars } from "@/data/cars";
import SidebarToggleButton from "./SidebarToggleButton";

import emailjs from "@emailjs/browser";
export default function CarDetails2({ carItem = allCars[0] }) {
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
  return (
    <>
      <section className="tf-section3 listing-detail style-2">
        <div className="container">
          <div className="row">
            <div className="heading-widget flex-one mb-20 flex-wrap gap-8">
              <div className="inner w-100">
                <div className="d-flex justify-content-between ">
                  <h1 className="title">{carItem.title}</h1>
                  <div>
                    <ul className="action-icon style-1 flex flex-wrap">
                      <li>
                        <a href="#" className="icon">
                          <svg
                            width={16}
                            height={18}
                            viewBox="0 0 16 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4.41276 8.18022C4.23116 7.85345 3.94619 7.59624 3.60259 7.44895C3.25898 7.30167 2.8762 7.27265 2.51432 7.36645C2.15244 7.46025 1.83196 7.67157 1.60317 7.96722C1.37438 8.26287 1.25024 8.62613 1.25024 8.99997C1.25024 9.37381 1.37438 9.73706 1.60317 10.0327C1.83196 10.3284 2.15244 10.5397 2.51432 10.6335C2.8762 10.7273 3.25898 10.6983 3.60259 10.551C3.94619 10.4037 4.23116 10.1465 4.41276 9.81972M4.41276 8.18022C4.54776 8.42322 4.62501 8.70222 4.62501 8.99997C4.62501 9.29772 4.54776 9.57747 4.41276 9.81972M4.41276 8.18022L11.5873 4.19472M4.41276 9.81972L11.5873 13.8052M11.5873 4.19472C11.6924 4.39282 11.8361 4.56797 12.0097 4.70991C12.1834 4.85186 12.3836 4.95776 12.5987 5.02143C12.8138 5.08509 13.0394 5.10523 13.2624 5.08069C13.4853 5.05614 13.7011 4.98739 13.8972 4.87846C14.0933 4.76953 14.2657 4.62261 14.4043 4.44628C14.5429 4.26995 14.645 4.06775 14.7046 3.85151C14.7641 3.63526 14.78 3.40931 14.7512 3.18686C14.7225 2.96442 14.6496 2.74994 14.537 2.55597C14.3151 2.17372 13.952 1.89382 13.5259 1.77643C13.0997 1.65904 12.6445 1.71352 12.2582 1.92818C11.8718 2.14284 11.585 2.50053 11.4596 2.92436C11.3341 3.34819 11.38 3.80433 11.5873 4.19472ZM11.5873 13.8052C11.4796 13.999 11.4112 14.2121 11.3859 14.4323C11.3606 14.6525 11.3789 14.8756 11.4398 15.0887C11.5007 15.3019 11.603 15.5009 11.7408 15.6746C11.8787 15.8482 12.0494 15.9929 12.2431 16.1006C12.4369 16.2082 12.65 16.2767 12.8702 16.302C13.0905 16.3273 13.3135 16.3089 13.5267 16.248C13.7398 16.1871 13.9389 16.0848 14.1125 15.947C14.2861 15.8092 14.4309 15.6385 14.5385 15.4447C14.7559 15.0534 14.809 14.5917 14.686 14.1612C14.563 13.7307 14.274 13.3668 13.8826 13.1493C13.4913 12.9319 13.0296 12.8789 12.5991 13.0019C12.1686 13.1249 11.8047 13.4139 11.5873 13.8052Z"
                              stroke="CurrentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="icon">
                          <svg
                            width={16}
                            height={14}
                            viewBox="0 0 16 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M14.75 4.1875C14.75 2.32375 13.1758 0.8125 11.234 0.8125C9.78275 0.8125 8.53625 1.657 8 2.86225C7.46375 1.657 6.21725 0.8125 4.76525 0.8125C2.825 0.8125 1.25 2.32375 1.25 4.1875C1.25 9.6025 8 13.1875 8 13.1875C8 13.1875 14.75 9.6025 14.75 4.1875Z"
                              stroke="CurrentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </a>
                      </li>

                    </ul>
                  </div>
                </div>

                <div className="icon-box flex flex-wrap">
                  <div className="icons flex-three gap-8">
                    <i className="icon-autodeal-km1" />
                    <span>{carItem.km.toLocaleString()} kms</span>
                  </div>
                  <div className="icons flex-three gap-8">
                    <i className="icon-autodeal-diesel" />
                    <span>{carItem.fuelType}</span>
                  </div>
                  <div className="icons flex-three gap-8">
                    <i className="icon-autodeal-automatic" />
                    <span>{carItem.transmission}</span>
                  </div>
                  {/* <div className="icons flex-three gap-8">
                    <i className="icon-autodeal-owner" />
                    <span>1st owner</span>
                  </div> */}
                </div>
                <div className="money text-color-3 font">
                  ${carItem.price.toLocaleString()}
                </div>

              </div>
              <div className="col-md-12">
                <nav
                  id="navbar-example2 "
                  className="navbar tab-listing-scroll mb-30"
                >
                  <ul className="nav nav-pills">
                    <li className="nav-item">
                      <a className="nav-link" href="#scrollspyHeading1">
                        Interior
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#scrollspyHeading2">
                        Exterior
                      </a>
                    </li>

                  </ul>
                </nav>
              </div>

            </div>
          </div>
        </div>
        <div className="container-fluid">
          <Slider2 />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <nav
                id="navbar-example2 "
                className="navbar tab-listing-scroll mb-30"
              >
                <ul className="nav nav-pills">
                  <li className="nav-item">
                    <a className="nav-link" href="#scrollspyHeading1">
                      Overview
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#scrollspyHeading2">
                      Specs &amp; features
                    </a>
                  </li>
                  {/* <li className="nav-item">
                    <a className="nav-link" href="#scrollspyHeading3">
                      Recommended cars
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#scrollspyHeading4">
                      Loan calculator
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#scrollspyHeading5">
                      New car reviews
                    </a>
                  </li> */}
                </ul>
              </nav>
            </div>
            <div className="col-lg-8">
              <div className="listing-detail-wrap">
                <div className="row">
                  <div className="col-lg-12">
                    <div
                      data-bs-spy="scroll"
                      data-bs-target="#navbar-example2"
                      data-bs-offset={0}
                      className="scrollspy-example"
                      tabIndex={0}
                    >
                      <div className="listing-description mb-40 widget-listing box-sd">
                        <div className="tfcl-listing-header">
                          <h2>Description</h2>
                        </div>
                        <Description />
                      </div>
                      <div
                        className="listing-description widget-listing box-sd mb-30 footer-col-block"
                        id="scrollspyHeading1"
                      >
                        <div className="footer-heading-desktop">
                          <h2>Car overview</h2>
                        </div>
                        <div className="footer-heading-mobie listing-details-mobie">
                          <h2>Car overview</h2>
                        </div>
                        <Overview />
                      </div>
                      <div
                        className="listing-features widget-listing box-sd mb-30 footer-col-block"
                        id="scrollspyHeading2"
                      >
                        <div className="footer-heading-desktop">
                          <h2>Features</h2>
                        </div>
                        <div className="footer-heading-mobie listing-details-mobie mb-30">
                          <h2>Features</h2>
                        </div>
                        <Features />
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="overlay-siderbar-mobie" />
              <div className="listing-sidebar">
                <div className="widget-listing mb-30 box-sd">
                  <div id="comments" className="comments">
                    <div className="respond-comment">
                      <form
                        onSubmit={sendMail}
                        ref={formRef}
                        id="loan-calculator"
                        className="comment-form form-submit"
                        acceptCharset="utf-8"
                      >
                        <div className="">
                          <fieldset className="email-wrap style-text">
                            <label className="font-1 fs-14 fw-5">Name</label>
                            <input
                              type="text"
                              className="tb-my-input"
                              name="name"
                              placeholder="Your name"
                              required
                            />
                          </fieldset>
                          <fieldset className="email-wrap style-text">
                            <label className="font-1 fs-14 fw-5">
                              Phone Numbers
                            </label>
                            <input
                              type="tel"
                              className="tb-my-input"
                              name="tel"
                              placeholder="Phone Numbers"
                              required
                            />
                          </fieldset>
                          <fieldset className="phone-wrap style-text">
                            <label className="font-1 fs-14 fw-5">
                              Email address
                            </label>
                            <input
                              type="email"
                              className="tb-my-input"
                              name="email"
                              placeholder="Your email"
                              required
                            />
                          </fieldset>
                        </div>


                        <div
                          className={`tfSubscribeMsg  footer-sub-element ${showMessage ? "active" : ""
                            }`}
                        >
                          {success ? (
                            <p style={{ color: "rgb(52, 168, 83)" }}>
                              Message has been sent successfully
                            </p>
                          ) : (
                            <p style={{ color: "red" }}>Something went wrong</p>
                          )}
                        </div>
                        <div className="button-boxs">
                          <button className="sc-button" name="submit" type="submit">
                            <span>Send</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="widget-listing box-sd">
                  <div className="listing-header mb-30">
                    <h3>Recommended Cars</h3>
                  </div>
                  <Recommended />
                  <a href="#" className="fs-16 fw-5 font text-color-3 lh-22">
                    View more  <i className="icon-autodeal-view-more" />
                  </a>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
      <SidebarToggleButton />
    </>
  );
}
