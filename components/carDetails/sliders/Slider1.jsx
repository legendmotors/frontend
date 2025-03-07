"use client";
import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import Image from "next/image";

// Import slick CSS (you can also import these in your global CSS)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Define fixed order for categories
const categoryOrder = ["exterior", "interior", "highlight"];

export default function Slider1({ carResponse }) {
  // Group images by category (type) and sort by order
  const [imagesByCategory, setImagesByCategory] = useState({
    exterior: [],
    interior: [],
    highlight: [],
  });
  const [selectedCategory, setSelectedCategory] = useState("exterior");
  const [currentIndex, setCurrentIndex] = useState(0);
  // startingSlideIndex determines which slide to show when switching categories.
  const [startingSlideIndex, setStartingSlideIndex] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (carResponse && carResponse.CarImages) {
      const grouped = { exterior: [], interior: [], highlight: [] };
      carResponse.CarImages.forEach((img) => {
        const type = img.type ? img.type.toLowerCase() : "exterior";
        if (grouped[type] !== undefined) {
          grouped[type].push(img);
        }
      });
      // Sort each category by the "order" field (if available)
      Object.keys(grouped).forEach((key) => {
        grouped[key].sort((a, b) => (a.order || 0) - (b.order || 0));
      });
      setImagesByCategory(grouped);
    }
  }, [carResponse]);

  // When the category changes, force the slider to go to the starting slide index.
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(startingSlideIndex, true);
      setCurrentIndex(startingSlideIndex);
      setStartingSlideIndex(0); // reset after applying
    }
  }, [selectedCategory]);

  useEffect(() => {
    // Initialize PhotoSwipe lightbox
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#my-gallery",
      children: ".image",
      pswpModule: () => import("photoswipe"),
    });
    lightbox.init();
    return () => {
      lightbox.destroy();
    };
  }, []);

  // Prepare images array for the current category
  const images = imagesByCategory[selectedCategory] || [];

  // react-slick settings; infinite is set to false so we can handle boundaries manually.
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // We'll use our custom navigation buttons
    afterChange: (index) => {
      setCurrentIndex(index);
    },
  };

  // Custom next button handler
  const handleNext = () => {
    if (currentIndex === images.length - 1) {
      // At the end of the current category. Check if a next category exists.
      const currentCatIndex = categoryOrder.indexOf(selectedCategory);
      if (currentCatIndex < categoryOrder.length - 1) {
        setStartingSlideIndex(0); // start at the first slide of the next category
        setSelectedCategory(categoryOrder[currentCatIndex + 1]);
      }
    } else {
      sliderRef.current.slickNext();
    }
  };

  // Custom previous button handler
  const handlePrev = () => {
    if (currentIndex === 0) {
      // At the beginning of the current category. Check if a previous category exists.
      const currentCatIndex = categoryOrder.indexOf(selectedCategory);
      if (currentCatIndex > 0) {
        const prevCategory = categoryOrder[currentCatIndex - 1];
        const lastIndex = (imagesByCategory[prevCategory]?.length || 1) - 1;
        setStartingSlideIndex(lastIndex);
        setSelectedCategory(prevCategory);
      }
    } else {
      sliderRef.current.slickPrev();
    }
  };

  return (
    <div>
      {/* Global CSS to mimic your UI */}
      <style jsx global>{`
        .nav.nav-pills {
          display: flex;
          list-style: none;
          padding: 0;
        }
        .nav-item {
          margin-right: 10px;
        }
        .nav-link {
          cursor: pointer;
          padding: 8px 16px;
          background: #eee;
          border: none;
          border-radius: 4px;
        }
        .nav-link.active {
          background: #ddd;
          font-weight: bold;
        }
        .custom-nav-button {
          cursor: pointer;
          background: transparent;
          border: none;
          margin: 5px;
        }
      `}</style>

      {/* Category Selector Buttons */}
      <nav id="navbar-example2" className="navbar tab-listing-scroll">
        <ul className="nav nav-pills">
          {categoryOrder.map((cat) => (
            <li key={cat} className="nav-item">
              <button
                className={`nav-link ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Slider */}
      <div id="my-gallery">
        <Slider ref={sliderRef} {...settings}>
          {images.map((img, i) => {
            // Use the image URL from FileSystem; prefer webpPath if available, else fallback to original.
            const imgUrl = img.FileSystem?.webpPath || img.FileSystem?.original;
            return (
              <div key={img.id || i} className="swiper-slide">
                <div className="image-list-details">
                  <a
                    href={imgUrl}
                    data-pswp-width="1245"
                    data-pswp-height="701"
                    className="image"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Image
                      alt={img.FileSystem?.name || "Car image"}
                      src={process.env.NEXT_PUBLIC_FILE_PREVIEW_URL + imgUrl}
                      width={1245}
                      height={701}
                      style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    />
                  </a>
                  {/* Lightbox Icon for Fullscreen View */}
                  <div className="specs-features-wrap flex-three">
                    <a
                      className="specs-features image d-flex"
                      href={imgUrl}
                      data-pswp-width="1245"
                      data-pswp-height="701"
                      onClick={(e) => e.preventDefault()}
                    >
                      <div className="icon">
                        <svg
                          width={18}
                          height={14}
                          viewBox="0 0 18 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.875 10.125L5.17417 5.82583C5.34828 5.65172 5.55498 5.51361 5.78246 5.41938C6.00995 5.32515 6.25377 5.27665 6.5 5.27665C6.74623 5.27665 6.99005 5.32515 7.21754 5.41938C7.44502 5.51361 7.65172 5.65172 7.82583 5.82583L12.125 10.125M10.875 8.875L12.0492 7.70083C12.2233 7.52672 12.43 7.38861 12.6575 7.29438C12.885 7.20015 13.1288 7.15165 13.375 7.15165C13.6212 7.15165 13.865 7.20015 14.0925 7.29438C14.32 7.38861 14.5267 7.52672 14.7008 7.70083L17.125 10.125M2.125 13.25H15.875C16.2065 13.25 16.5245 13.1183 16.7589 12.8839C16.9933 12.6495 17.125 12.3315 17.125 12V2C17.125 1.66848 16.9933 1.35054 16.7589 1.11612C16.5245 0.881696 16.2065 0.75 17.125 0.75H2.125C1.79348 0.75 1.47554 0.881696 1.24112 1.11612C1.0067 1.35054 0.875 1.66848 0.875 2V12C0.875 12.3315 1.0067 12.6495 1.24112 12.8839C1.47554 13.1183 1.79348 13.25 2.125 13.25ZM10.875 3.875H10.8817V3.88167H10.875V3.875ZM11.1875 3.875C11.1875 3.95788 11.1546 4.03737 11.096 4.09597C11.0374 4.15458 10.9579 4.1875 10.875 4.1875C10.7921 4.1875 10.7126 4.15458 10.654 4.09597C10.5954 4.03737 10.5625 3.95788 10.5625 3.875C10.5625 3.79212 10.5954 3.71263 10.654 3.65403C10.7126 3.59542 10.7921 3.5625 10.875 3.5625C10.9579 3.5625 11.0374 3.59542 11.096 3.65403C11.1546 3.71263 11.1875 3.79212 11.1875 3.875Z"
                            stroke="CurrentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="fw-5 font text-color-2 lh-16">
                        All image
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>

      {/* Custom Navigation Buttons */}
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <button className="custom-nav-button border rounded p-2" onClick={handlePrev}>
          {/* You can customize the button icon/label as needed */}
          Prev
        </button>
        <button className="custom-nav-button border rounded p-2" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
}
