"use client";
import React, { useEffect, useRef, useState } from "react";

export default function Features({ carResponse }) {
  // Extract the features from carResponse, defaulting to an empty array if missing
  const featureList = carResponse?.FeatureValues || [];
  
  // Update the FAQ data logic:
  // Group features by their Feature.name and create FAQ items.
  const faqData = Object.entries(
    featureList.reduce((acc, feature) => {
      const title = feature.Feature?.name || "Other";
      if (!acc[title]) {
        acc[title] = [];
      }
      acc[title].push(feature.name);
      return acc;
    }, {})
  ).map(([title, names]) => ({
    title,
    content: names.join(", "),
  }));

  // Refs and state for accordion functionality
  const parentRefs = useRef([]);
  const questionRefs = useRef([]);
  const answerRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Reset all classes and inline styles
    questionRefs.current.forEach((el) => {
      el.classList.remove("active");
    });
    parentRefs.current.forEach((el) => {
      el.classList.remove("active");
    });
    answerRefs.current.forEach((el) => {
      if (el) {
        el.style.height = "0px";
        el.style.overflow = "hidden";
        el.style.transition = "all 0.5s ease-in-out";
      }
    });
    if (currentIndex !== -1 && questionRefs.current[currentIndex]) {
      questionRefs.current[currentIndex].classList.add("active");
      parentRefs.current[currentIndex].classList.add("active");
      const element = answerRefs.current[currentIndex];
      element.style.height = element.scrollHeight + "px";
      element.style.overflow = "hidden";
      element.style.transition = "all 0.5s ease-in-out";
    }
  }, [currentIndex]);

  return (
    <>
      {/* Features List */}
      <div className="features-inner tf-collapse-content">
        <div className="inner">
          {featureList.map((feature) => (
            <div key={feature.id} className="listing-feature-wrap flex">
              <i className="icon-autodeal-check" />
              <p>{feature.name}</p>
            </div>
          ))}
        </div>
      </div>
      {/* FAQ Accordion */}
      <div className="row">
        <div className="col-lg-12 flat-accordion">
          {faqData.map((item, index) => (
            <div
              ref={(el) => (parentRefs.current[index] = el)}
              className={`${currentIndex === index ? "activ" : ""} flat-toggle style-1`}
              onClick={() =>
                setCurrentIndex((prev) => (prev === index ? -1 : index))
              }
              key={index}
            >
              <div
                className="toggle-title flex align-center"
                role="button"
                aria-disabled="false"
                ref={(el) => (questionRefs.current[index] = el)}
              >
                <h5 className="fw-6">{item.title}</h5>
                <div className="btn-toggle" />
              </div>
              <div
                className="toggle-content section-desc"
                ref={(el) => (answerRefs.current[index] = el)}
              >
                <p className="texts">{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
