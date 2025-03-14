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
  const [imagesByCategory, setImagesByCategory] = useState({
    exterior: [],
    interior: [],
    highlight: [],
  });
  const [selectedCategory, setSelectedCategory] = useState("exterior");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startingSlideIndex, setStartingSlideIndex] = useState(0);

  // Slider instance states
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);

  // References for the two sliders
  const mainSliderRef = useRef(null);
  const thumbSliderRef = useRef(null);

  // Set slider instances once the component mounts
  useEffect(() => {
    setNav1(mainSliderRef.current);
    setNav2(thumbSliderRef.current);
  }, []);

  // Group images by category and sort them
  useEffect(() => {
    if (carResponse && carResponse?.CarImages) {
      const grouped = { exterior: [], interior: [], highlight: [] };
      carResponse.CarImages.forEach((img) => {
        const type = img.type ? img.type.toLowerCase() : "exterior";
        if (grouped[type] !== undefined) {
          grouped[type].push(img);
        }
      });
      Object.keys(grouped).forEach((key) => {
        grouped[key].sort((a, b) => (a.order || 0) - (b.order || 0));
      });
      setImagesByCategory(grouped);
    }
  }, [carResponse]);

  const categoryOrder = ["exterior", "interior", "highlight"];
  const availableCategories = categoryOrder.filter(
    (cat) => imagesByCategory[cat] && imagesByCategory[cat].length > 0
  );

  useEffect(() => {
    if (
      availableCategories.length > 0 &&
      !availableCategories.includes(selectedCategory)
    ) {
      setSelectedCategory(availableCategories[0]);
    }
  }, [availableCategories, selectedCategory]);

  useEffect(() => {
    if (nav1) {
      nav1.slickGoTo(startingSlideIndex, true);
      setCurrentIndex(startingSlideIndex);
      setStartingSlideIndex(0);
    }
  }, [selectedCategory, nav1]);

  // Initialize PhotoSwipe lightbox (code unchanged)
  useEffect(() => {
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

  const images = imagesByCategory[selectedCategory] || [];
  const computedSlidesToShow = images.length > 0 ? Math.min(5, images.length) : 1;

  const mainSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    asNavFor: nav2, // use the slider instance state
    afterChange: (index) => {
      setCurrentIndex(index);
    },
  };

  const thumbSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: computedSlidesToShow,
    slidesToScroll: 1,
    arrows: true,
    focusOnSelect: true,
    asNavFor: nav1, // use the slider instance state
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

  // Navigation handlers remain the same
  const handleNext = () => {
    if (currentIndex === images.length - 1) {
      const currentCatIndex = availableCategories.indexOf(selectedCategory);
      if (currentCatIndex < availableCategories.length - 1) {
        setStartingSlideIndex(0);
        setSelectedCategory(availableCategories[currentCatIndex + 1]);
      }
    } else {
      nav1.slickNext();
    }
  };

  const handlePrev = () => {
    if (currentIndex === 0) {
      const currentCatIndex = availableCategories.indexOf(selectedCategory);
      if (currentCatIndex > 0) {
        const prevCategory = availableCategories[currentCatIndex - 1];
        const lastIndex = (imagesByCategory[prevCategory]?.length || 1) - 1;
        setStartingSlideIndex(lastIndex);
        setSelectedCategory(prevCategory);
      }
    } else {
      nav1.slickPrev();
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
          .thumbnail img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

        /* Thumbnail Slider */
        .thumbnail {
          cursor: pointer;
          opacity: 0.6;
          border: 2px solid transparent;
          padding: 2px;
          width:160px;
          height: 110px;
          overflow: hidden;
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
