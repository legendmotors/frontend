"use client";
import { useParams } from "next/navigation";
import CarDetails1 from "@/components/carDetails/CarDetails1";
import CarService from "@/services/CarService";
import React, { useEffect, useRef, useState } from "react";
import Slider1 from "./sliders/Slider1";
import Image from "next/image";
import Description from "./detailComponents/Description";
import Overview from "./detailComponents/Overview";
import LoanCalculator from "./detailComponents/LoanCalculator";
import CarReview from "./detailComponents/CarReview";
import CarInfo from "./detailComponents/CarInfo";
import ProfileInfo from "./detailComponents/ProfileInfo";
import Recommended from "./detailComponents/Recommended";
import Features from "./detailComponents/Features";
import SidebarToggleButton from "./SidebarToggleButton";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
// Import the CarEnquiryService (adjust the path as needed)
import CarEnquiryService from "@/services/CarEnquiryService";

// Dynamic imports for Next.js SSR compatibility
const Viewer = dynamic(() => import("@react-pdf-viewer/core").then((mod) => mod.Viewer), { ssr: false });
const Worker = dynamic(() => import("@react-pdf-viewer/core").then((mod) => mod.Worker), { ssr: false });
const defaultLayoutPlugin = dynamic(
  () => import("@react-pdf-viewer/default-layout").then((mod) => mod.defaultLayoutPlugin),
  { ssr: false }
);

// Import Full-Screen and Get File (Download PDF) Plugins
import { fullScreenPlugin } from "@react-pdf-viewer/full-screen";
import { getFilePlugin } from "@react-pdf-viewer/get-file";

// Import Styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/full-screen/lib/styles/index.css";
import { getCookie } from "@/utils/cookieFunction";

export default function CarDetails({ carResponse }) {
  // Retrieve token if needed
  const token = getCookie("token");

  // Retrieve logged in user data from cookies
  const cookieData = getCookie('userData');
  const parsedData = cookieData ? JSON.parse(cookieData) : null;
  const userData = parsedData
    ? { name: parsedData.firstName + " " + parsedData?.lastName, email: parsedData.email, phone: parsedData.phone }
    : { name: "", email: "", phone: "" };

  console.log(cookieData,"userDatauserData");
  // Compute a title based on car details
  const title = `${carResponse?.Brand?.name || ""} ${carResponse?.CarModel?.name || ""} ${carResponse?.Trim?.name || ""}`;

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  // Reference to the PDF Viewer Container
  const pdfContainerRef = useRef(null);

  // Initialize Full-Screen Plugin with getFullScreenTarget
  const fullScreenPluginInstance = fullScreenPlugin({
    enableShortcuts: true,
    getFullScreenTarget: () => pdfContainerRef.current,
  });

  // Initialize Get File (Download PDF) Plugin
  const getFilePluginInstance = getFilePlugin();

  // Extract Buttons from Plugins
  const { EnterFullScreenButton } = fullScreenPluginInstance;
  const { DownloadButton } = getFilePluginInstance;

  const formRef = useRef();
  const [success, setSuccess] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };

  // Updated form submission function using CarEnquiryService
  const sendEnquiry = async (e) => {
    e.preventDefault();
    // Build payload using car details and form values
    const payload = {
      stockId: carResponse?.stockId,
      year: carResponse?.Year?.year,
      brand: carResponse?.Brand?.name,
      model: carResponse?.CarModel?.name,
      trim: carResponse?.Trim?.name,
      name: e.target.name.value,
      phoneNumber: e.target.tel.value,
      emailAddress: e.target.email.value,
    };

    const response = await CarEnquiryService.addCarEnquiry(payload);
    if (response) {
      setSuccess(true);
      handleShowMessage();
      formRef.current.reset();
    } else {
      setSuccess(false);
      handleShowMessage();
    }
  };

  const [currency, setCurrency] = useState(Cookies.get("NEXT_CURRENCY") || "AED");
  const [exchangeRate, setExchangeRate] = useState(1);

  // Find the correct price from carResponse based on currency
  const priceObj = carResponse?.CarPrices?.find((price) => price.currency === currency);
  const basePrice = priceObj ? parseFloat(priceObj.price) : 0;
  const convertedPrice = Math.round(basePrice * exchangeRate);

  // Function to fetch exchange rate whenever currency changes
  const fetchExchangeRate = async (newCurrency) => {
    if (newCurrency !== "AED") {
      try {
        const res = await fetch(`/api/currency?to=${newCurrency}`);
        const data = await res.json();
        if (data.rates && data.rates[newCurrency]) {
          setExchangeRate(data.rates[newCurrency]);
        }
      } catch (error) {
        setExchangeRate(1); // Default to 1 if API fails
      }
    } else {
      setExchangeRate(1); // If AED, no conversion needed
    }
  };

  // Effect to listen for currency changes
  useEffect(() => {
    const interval = setInterval(() => {
      const savedCurrency = Cookies.get("NEXT_CURRENCY") || "AED";
      if (savedCurrency !== currency) {
        setCurrency(savedCurrency);
        fetchExchangeRate(savedCurrency);
      }
    }, 2000); // Check every 2 seconds for changes

    return () => clearInterval(interval);
  }, [currency]);

  return (
    <>
      <section className="tf-section3 listing-detail style-1 mt-4">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="listing-detail-wrap">
                {/* Pass car images to the slider component if needed */}
                <Slider1 images={carResponse?.CarImages} carResponse={carResponse} />
                <div className="listing-line" />
                <div className="row">
                  <div className="col-lg-12">
                    <div
                      data-bs-spy="scroll"
                      data-bs-target="#navbar-example2"
                      data-bs-offset={0}
                      className="scrollspy-example"
                      tabIndex={0}
                    >
                      <div className="listing-description footer-col-block" id="scrollspyHeading1">
                        <div className="footer-heading-desktop">
                          <h2>Car overview</h2>
                        </div>
                        {/* Pass carResponse to Overview if required */}
                        <Overview carResponse={carResponse} />
                      </div>
                      <div className="listing-line" />

                      {/* PDF Viewer Container */}
                      {carResponse?.brochureFile && (
                        <>
                          <div className="flex justify-content-center">
                            <div
                              ref={pdfContainerRef}
                              style={{ width: "100%", height: "100vh", background: "#f8f9fa", padding: "10px" }}
                            >
                              <div className="flex justify-content-end">
                                <EnterFullScreenButton />
                                <DownloadButton />
                              </div>
                              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                <Viewer
                                  fileUrl={
                                    process.env.NEXT_PUBLIC_FILE_PREVIEW_URL +
                                    carResponse.brochureFile.originalPath
                                  }
                                  plugins={[
                                    defaultLayoutPluginInstance,
                                    fullScreenPluginInstance,
                                    getFilePluginInstance,
                                  ]}
                                />
                              </Worker>
                            </div>
                          </div>
                          <div className="listing-line" />
                        </>
                      )}

                      <div className="listing-description mb-40">
                        <div className="tfcl-listing-header">
                          <h2>Description</h2>
                        </div>
                        {/* Provide the car's description as a prop */}
                        <Description carResponse={carResponse} />
                      </div>

                      <div className="listing-line" />

                      <div className="listing-features footer-col-block" id="scrollspyHeading2">
                        <div className="footer-heading-desktop mb-30">
                          <h2>Features</h2>
                        </div>
                        <div className="footer-heading-mobie listing-details-mobie mb-30">
                          <h2>Features</h2>
                        </div>
                        {/* Pass feature data if needed */}
                        <Features carResponse={carResponse} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="overlay-siderbar-mobie" />
              <div className="listing-sidebar">
                <div className="widget-listing mb-40">
                  <div className="heading-widget">
                    <h1 className="responsive-heading lh-sm">
                      {carResponse?.additionalInfo ? (
                        <>{carResponse?.additionalInfo}</>
                      ) : (
                        <>
                          {carResponse?.Year.year} {carResponse?.Brand.name}{" "}
                          {carResponse?.CarModel.name} {carResponse?.Trim?.name}
                        </>
                      )}
                    </h1>
                    <CarInfo carResponse={carResponse} currency={currency} convertedPrice={convertedPrice} />
                  </div>
                </div>
                <div className="widget-listing mb-30 box-sd">
                  <div id="comments" className="comments">
                    <div className="respond-comment">
                      <h3 className="mb-2">Enquire Now</h3>
                      <form
                        onSubmit={sendEnquiry}
                        ref={formRef}
                        id="loan-calculator"
                        className="comment-form form-submit"
                        acceptCharset="utf-8"
                      >
                        <div>
                          <fieldset className="email-wrap style-text">
                            <label className="font-1 fs-14 fw-5">Name</label>
                            <input
                              type="text"
                              className="tb-my-input"
                              name="name"
                              placeholder="Your name"
                              required
                              defaultValue={userData.name}
                            />
                          </fieldset>
                          <fieldset className="email-wrap style-text">
                            <label className="font-1 fs-14 fw-5">Phone Numbers</label>
                            <input
                              type="tel"
                              className="tb-my-input"
                              name="tel"
                              placeholder="Phone Numbers"
                              required
                              defaultValue={userData.phone}
                            />
                          </fieldset>
                          <fieldset className="phone-wrap style-text">
                            <label className="font-1 fs-14 fw-5">Email address</label>
                            <input
                              type="email"
                              className="tb-my-input"
                              name="email"
                              placeholder="Your email"
                              required
                              defaultValue={userData.email}
                            />
                          </fieldset>
                        </div>

                        <div className={`tfSubscribeMsg footer-sub-element ${showMessage ? "active" : ""}`}>
                          {success ? (
                            <p style={{ color: "rgb(52, 168, 83)" }}>Enquiry submitted successfully!</p>
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
                  {/* Uncomment below if you need recommended cars */}
                  {/* <div className="widget-listing box-sd">
                    <div className="listing-header mb-30">
                      <h3>Recommended Cars</h3>
                    </div>
                    <Recommended />
                    <a href="#" className="fs-16 fw-5 font text-color-3 lh-22">
                      View more <i className="icon-autodeal-view-more" />
                    </a>
                  </div> */}
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
