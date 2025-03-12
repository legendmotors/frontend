"use client";
import React, { useRef, useState } from "react";
import { branches } from "@/data/address";
import MapAndAddress from "../contact/MapAndAddress";
// Import the contact service method
import { subscribeContact } from "@/services/ContactUsService";

export default function Contact({ sectionsByKey }) {
  const formRef = useRef();
  const [success, setSuccess] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };

  // New form submission handler using subscribeContact from ContactUsService
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Build payload from form values
    const payload = {
      name: e.target.name.value,
      emailAddress: e.target.email.value,
      phoneNumber: e.target.tel.value,
      subject: e.target.subject.value,
      message: e.target.message.value,
    };

    try {
      const response = await subscribeContact(payload);
      if (response) {
        setSuccess(true);
        handleShowMessage();
        formRef.current.reset();
      } else {
        setSuccess(false);
        handleShowMessage();
      }
    } catch (error) {
      console.error("Error submitting contact enquiry:", error);
      setSuccess(false);
      handleShowMessage();
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <section className="flat-property">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="inner-heading flex-two flex-wrap mb-2">
                <h1 className="heading-listing">
                  {sectionsByKey.drop_us_a_line?.title}
                </h1>
                <div className="social-listing flex-six flex-wrap">
                  <p>Share this page:</p>
                  <div className="icon-social style1">
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tf-section-contact pt-0">
        <div className="container">
          <div className="row">
            <div className="col-md-8 contact-left">
              <div className="heading-section mb-30">
                <div
                  className="mt-12"
                  dangerouslySetInnerHTML={{
                    __html: sectionsByKey.drop_us_a_line?.content,
                  }}
                />
              </div>
              <div id="comments" className="comments">
                <div className="respond-comment">
                  <form
                    onSubmit={handleContactSubmit}
                    ref={formRef}
                    id="loan-calculator"
                    className="comment-form form-submit"
                    acceptCharset="utf-8"
                  >
                    <div className="grid-sw-2">
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
                    <div className="grid-sw-2">
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
                        <label className="font-1 fs-14 fw-5">Subject</label>
                        <input
                          type="text"
                          className="tb-my-input"
                          name="subject"
                          placeholder="Enter Keyword"
                          required
                        />
                      </fieldset>
                    </div>
                    <fieldset className="phone-wrap style-text">
                      <label className="font-1 fs-14 fw-5">Your Message</label>
                      <textarea
                        id="comment-message"
                        name="message"
                        rows={4}
                        tabIndex={4}
                        placeholder="Your message"
                        aria-required="true"
                        required
                      />
                    </fieldset>
                    <div
                      className={`tfSubscribeMsg footer-sub-element ${
                        showMessage ? "active" : ""
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
                    {/* Loader indicator */}
                    {isSubmitting && (
                      <div
                        className="loader"
                        style={{ margin: "10px 0", fontWeight: "bold" }}
                      >
                        Loading...
                      </div>
                    )}
                    <div className="button-boxs">
                      <button
                        className="sc-button"
                        name="submit"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        <span>Send</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-4 contact-right">
              <div className="contact-info box-sd">
                <h2 className="mb-30">Legend Motors Group</h2>
                <div className="wrap-info">
                  <div className="box-info">
                    <h5>Head Office —</h5>
                    <p>P.O.Box – 381203, Showroom # 46,</p>
                    <p>Auto Market, Block 1, Ras-Al-khor,</p>
                    <p>Al Aweer, Dubai, UAE</p>
                  </div>
                  <ul className="list-unstyled mt-3">
                    <li className="mb-2">
                      <i className="bi bi-envelope-fill text-primary me-2"></i>
                      <a
                        href={`mailto:sales@legendmotorsuae.com`}
                        className="text-decoration-none"
                      >
                        sales@legendmotorsuae.com
                      </a>
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-telephone-fill text-primary me-2"></i>
                      <a
                        href={`tel: +9714548563`}
                        className="text-decoration-none"
                      >
                        +971 4 548 563
                      </a>
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-telephone-fill text-primary me-2"></i>
                      <a
                        href={`tel: +971509660888`}
                        className="text-decoration-none"
                      >
                        +971 50 966 0888
                      </a>
                    </li>
                  </ul>
                  <div className="box-info">
                    <h5>Follow Us:</h5>
                    <div className="icon-social style2">
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container py-5">
          <div className="row">
            {branches.map((branch, index) => (
              <MapAndAddress key={index} details={branch} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
