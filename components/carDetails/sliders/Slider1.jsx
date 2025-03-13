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

// Custom arrow for the thumbnail slider (prev)
const ThumbnailPrevArrow = (props) => {
  const { onClick, currentSlide } = props;
  // Hide the arrow if we are on the first thumbnail
  if (currentSlide === 0) return null;
  return (
    <button className="thumbnail-arrow thumbnail-prev" onClick={onClick}>
      <i className="fa fa-chevron-left" />
    </button>
  );
};

// Custom arrow for the thumbnail slider (next)
const ThumbnailNextArrow = (props) => {
  const { onClick, currentSlide, slideCount, slidesToShow } = props;
  // Hide the arrow if we are on the last set of thumbnails
  if (currentSlide >= slideCount - slidesToShow) return null;
  return (
    <button className="thumbnail-arrow thumbnail-next" onClick={onClick}>
      <i className="fa fa-chevron-right" />
    </button>
  );
};

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

  // References for the two sliders
  const mainSliderRef = useRef(null);
  const thumbSliderRef = useRef(null);

  useEffect(() => {
    if (carResponse && carResponse?.CarImages) {
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

  // Compute available categories (only those with images)
  const availableCategories = categoryOrder.filter(
    (cat) => imagesByCategory[cat] && imagesByCategory[cat].length > 0
  );

  // If the selectedCategory is not available, switch to the first available category.
  useEffect(() => {
    if (availableCategories.length > 0 && !availableCategories.includes(selectedCategory)) {
      setSelectedCategory(availableCategories[0]);
    }
  }, [availableCategories, selectedCategory]);

  // When the category changes, force the main slider to go to the starting slide index
  // and reset the current index so the first image is active.
  useEffect(() => {
    if (mainSliderRef.current) {
      mainSliderRef.current.slickGoTo(startingSlideIndex, true);
      setCurrentIndex(startingSlideIndex);
      setStartingSlideIndex(0);
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

  // Main slider settings
  const mainSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // We'll use custom navigation buttons
    asNavFor: thumbSliderRef.current, // Link to thumbnail slider
    afterChange: (index) => {
      setCurrentIndex(index);
    },
  };

  // Determine the number of thumbnails to show (responsive)
  const computedSlidesToShow = images.length > 0 ? Math.min(5, images.length) : 1;

  // Thumbnail slider settings
  const thumbSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: computedSlidesToShow,
    slidesToScroll: 1,
    arrows: true,
    focusOnSelect: true,
    asNavFor: mainSliderRef.current, // Link to main slider
    nextArrow: <ThumbnailNextArrow slidesToShow={computedSlidesToShow} />,
    prevArrow: <ThumbnailPrevArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: images.length > 0 ? Math.min(3, images.length) : 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: images.length > 0 ? Math.min(2, images.length) : 1,
        },
      },
    ],
  };

  // Custom next button handler for the main slider
  const handleNext = () => {
    if (currentIndex === images.length - 1) {
      // At the end of the current category. Check if a next category exists.
      const currentCatIndex = availableCategories.indexOf(selectedCategory);
      if (currentCatIndex < availableCategories.length - 1) {
        setStartingSlideIndex(0); // start at the first slide of the next category
        setSelectedCategory(availableCategories[currentCatIndex + 1]);
      }
    } else {
      mainSliderRef.current.slickNext();
    }
  };

  // Custom previous button handler for the main slider
  const handlePrev = () => {
    if (currentIndex === 0) {
      // At the beginning of the current category. Check if a previous category exists.
      const currentCatIndex = availableCategories.indexOf(selectedCategory);
      if (currentCatIndex > 0) {
        const prevCategory = availableCategories[currentCatIndex - 1];
        const lastIndex = (imagesByCategory[prevCategory]?.length || 1) - 1;
        setStartingSlideIndex(lastIndex);
        setSelectedCategory(prevCategory);
      }
    } else {
      mainSliderRef.current.slickPrev();
    }
  };

  return (
    <div>
      {/* Global CSS */}
      <style jsx global>{`
        /* Category Tabs */
        .nav.nav-pills {
          display: flex;
          list-style: none;
          padding: 0;
          margin-bottom: 15px;
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

        /* Main Slider */
        .slider-container {
          position: relative;
        }

        /* The container that restricts height on mobile */
        .main-slider-image {
          position: relative;
          width: 100%;
          max-height: 600px; /* Default max height for larger screens */
          overflow: hidden;
        }
        @media (max-width: 480px) {
          .main-slider-image {
            max-height: 250px; /* Reduced max height on mobile */
          }
        }

        .custom-nav-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.7);
          border: none;
          cursor: pointer;
          z-index: 2;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .custom-nav-button i {
          font-size: 16px;
        }
        .prev-button {
          left: 10px;
        }
        .next-button {
          right: 10px;
        }

        /* Thumbnail Slider */
        .thumbnail {
          cursor: pointer;
          opacity: 0.6;
          border: 2px solid transparent;
          padding: 2px;
        }
        .thumbnail.active {
          opacity: 1;
          border-color: #333;
        }
        .thumbnail-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.7);
          border: none;
          cursor: pointer;
          z-index: 2;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .thumbnail-arrow i {
          font-size: 12px;
        }
        .thumbnail-prev {
          left: 0;
        }
        .thumbnail-next {
          right: 0;
        }

        /* Make buttons slightly smaller on very small screens */
        @media (max-width: 480px) {
          .custom-nav-button {
            width: 35px;
            height: 35px;
          }
          .custom-nav-button i {
            font-size: 14px;
          }
          .thumbnail-arrow {
            width: 25px;
            height: 25px;
          }
          .thumbnail-arrow i {
            font-size: 10px;
          }
        }
      `}</style>

      {/* Render Category Tabs only for available categories */}
      {availableCategories.length > 0 && (
        <nav id="navbar-example2" className="navbar tab-listing-scroll">
          <ul className="nav nav-pills">
            {availableCategories.map((cat) => (
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
      )}

      {/* Main Slider */}
      <div className="slider-container" id="my-gallery">
        <Slider ref={mainSliderRef} {...mainSettings}>
          {images.map((img, i) => {
            // Use the image URL from FileSystem; prefer compressedPath if available, else fallback to webpPath.
            const imgUrl = img.FileSystem?.compressedPath || img.FileSystem?.webpPath;
            return (
              <div key={img.id || i}>
                {/* Wrap your Image in .main-slider-image to restrict its height on mobile */}
                <div className="main-slider-image">
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
                </div>
              </div>
            );
          })}
        </Slider>
        {/* Navigation buttons inside the main slider using FontAwesome icons */}
        <button className="custom-nav-button prev-button" onClick={handlePrev}>
          <i className="fa fa-chevron-left" />
        </button>
        <button className="custom-nav-button next-button" onClick={handleNext}>
          <i className="fa fa-chevron-right" />
        </button>
      </div>

      {/* Thumbnail Slider with custom arrows */}
      {images.length > 0 && (
        <div style={{ marginTop: "10px", position: "relative" }}>
          {/* Using a key prop forces the slider to reinitialize when selectedCategory changes */}
          <Slider
            key={`thumb-${selectedCategory}`}
            ref={thumbSliderRef}
            {...thumbSettings}
          >
            {images.map((img, index) => {
              const thumbUrl = img.FileSystem?.thumbnailPath || img.FileSystem?.compressedPath;
              return (
                <div
                  key={img.id || index}
                  onClick={() => {
                    // Clicking a thumbnail goes to that slide in the main slider
                    mainSliderRef.current.slickGoTo(index);
                    setCurrentIndex(index);
                  }}
                >
                  <div className={`thumbnail ${currentIndex === index ? "active" : ""}`}>
                    <Image
                      src={process.env.NEXT_PUBLIC_FILE_PREVIEW_URL + thumbUrl}
                      alt={img.FileSystem?.name || "Thumbnail"}
                      width={80}
                      height={60}
                      style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    />
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      )}
    </div>
  );
}
