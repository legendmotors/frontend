"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import CarService from "@/services/CarService"; // Using your CarService.listCars
import { formatCurrency } from "@/utils/formatCurrency";

// Define your price range filters.
// Note: Adjust these ranges so that at least one car matches the first tab.
const priceRanges = [
  { title: "AED 50 - 80K", range: { min: 50000, max: 80000 } },
  { title: "AED 80 - 130K", range: { min: 80000, max: 130000 } },
  { title: "AED 130 - 180K", range: { min: 130000, max: 180000 } },
];

export default function Cars({ title, tagId }) {
  const [cars, setCars] = useState([]);
  const [currency, setCurrency] = useState(Cookies.get("NEXT_CURRENCY") || "AED");
  const [exchangeRate, setExchangeRate] = useState(1);
  const [selectedRange, setSelectedRange] = useState(priceRanges[0]);

  // Fetch cars using CarService.listCars with tag and price filtering
  const fetchCarsByTag = async () => {
    try {
      // Build query params based on currency and selected price range
      const query = {
        tags: tagId,
        limit: 8,
      };

      if (currency === "AED") {
        query.minPriceAED = selectedRange.range.min;
        query.maxPriceAED = selectedRange.range.max;
      } else {
        query.minPriceUSD = selectedRange.range.min;
        query.maxPriceUSD = selectedRange.range.max;
      }

      const response = await CarService.listCars(query);
      // Response structure: { success, message, data: [...], pagination: {...} }
      if (response.data) {
        setCars(response.data);
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  // Fetch exchange rate for conversion (if needed)
  const fetchExchangeRate = async (newCurrency) => {
    if (newCurrency !== "AED") {
      try {
        const res = await fetch(`/api/currency?to=${newCurrency}`);
        const data = await res.json();
        if (data.rates && data.rates[newCurrency]) {
          setExchangeRate(data.rates[newCurrency]);
        }
      } catch (error) {
        setExchangeRate(1);
      }
    } else {
      setExchangeRate(1);
    }
  };

  // Poll the NEXT_CURRENCY cookie for changes
  useEffect(() => {
    const interval = setInterval(() => {
      const savedCurrency = Cookies.get("NEXT_CURRENCY") || "AED";
      if (savedCurrency !== currency) {
        setCurrency(savedCurrency);
        fetchExchangeRate(savedCurrency);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [currency]);

  // Re-fetch cars when the tag, currency, or selected price range changes
  useEffect(() => {
    fetchCarsByTag();
  }, [tagId, currency, selectedRange]);

  // Inline CarCard component mapping the response structure
  const CarCard = ({ car }) => {
    // Determine the price based on current currency; fallback to first price if not found
    const priceObj =
      car.CarPrices.find((p) => p.currency === currency) || car.CarPrices[0];
    const basePrice = parseFloat(priceObj.price);
    const convertedPrice = Math.round(basePrice * exchangeRate);

    // Choose an image: prefer one with type "exterior", otherwise use the first available
    const exteriorImage = car.CarImages.find((img) => img.type === "exterior");
    const firstImage = car.CarImages[0];
    const imagePath = exteriorImage
      ? process.env.NEXT_PUBLIC_FILE_PREVIEW_URL + exteriorImage.FileSystem.path
      : firstImage
        ? process.env.NEXT_PUBLIC_FILE_PREVIEW_URL + firstImage.FileSystem.path
        : "/placeholder-image.jpg";

    // Build a title using Brand, CarModel, and Trim
    const titleText = `${car.Brand?.name || ""} ${car.CarModel?.name || ""} ${car.Trim?.name || ""}`.trim();
    // Extract the year from the Year object
    const carYear = car.Year?.year || "";



    const bodyTypeSpecification = car.SpecificationValues.find(
      (spec) => spec.Specification.key === "body_type"
    );

    const fuelTypeSpecification = car.SpecificationValues.find(
      (spec) => spec.Specification.key === "fuel_type"
    );

    const regionalSpecification = car.SpecificationValues.find(
      (spec) => spec.Specification.key === "regional_specification"
    );

    const steeringSideSpecification = car.SpecificationValues.find(
      (spec) => spec.Specification.key === "steering_side"
    );

    const transmission = car.SpecificationValues.find(
      (spec) => spec.Specification.key === "transmission"
    );



    const engine = car.SpecificationValues.find(
      (spec) => spec.Specification.key === "body_type"
    );
    // Extract the body type name if it exists
    const bodyTypeName = bodyTypeSpecification?.name || "N/A";

    const fuelTypeName = fuelTypeSpecification?.name || "N/A"
    const transmissionName = transmission?.name || "N/A";
    const regionalSpecificationName = regionalSpecification?.name || "N/A";
    const steeringSideSpecificationName = steeringSideSpecification?.name || "N/A";
    const displayPrice = car?.CarPrices?.find(item => item.currency === currency);


    return (
      <div key={car.id} className="box-car-list hv-one">
        <div className="image-group relative">
          {/* <div className="top flex-two">
            <ul className="d-flex gap-8">
              {car.Tags &&
                car.Tags.map((tag) => <li className="flag-tag success">{tag.name}</li>
                )}
              <li className="flag-tag style-1">
                <div className="icon">
                  <svg
                    width={16}
                    height={13}
                    viewBox="0 0 16 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.5 9L4.93933 5.56067C5.07862 5.42138 5.24398 5.31089 5.42597 5.2355C5.60796 5.16012 5.80302 5.12132 6 5.12132C6.19698 5.12132 6.39204 5.16012 6.57403 5.2355C6.75602 5.31089 6.92138 5.42138 7.06067 5.56067L10.5 9M9.5 8L10.4393 7.06067C10.5786 6.92138 10.744 6.81089 10.926 6.7355C11.108 6.66012 11.303 6.62132 11.5 6.62132C11.697 6.62132 11.892 6.66012 12.074 6.7355C12.256 6.81089 12.4214 6.92138 12.5607 7.06067L14.5 9M2.5 11.5H13.5C13.7652 11.5 14.0196 11.3946 14.2071 11.2071C14.3946 11.0196 14.5 10.7652 14.5 10.5V2.5C14.5 2.23478 14.3946 1.98043 14.2071 1.79289C14.0196 1.60536 13.7652 1.5 13.5 1.5H2.5C2.23478 1.5 1.98043 1.60536 1.79289 1.79289C1.60536 1.98043 1.5 2.23478 1.5 2.5V10.5C1.5 10.7652 1.60536 11.0196 1.79289 11.2071C1.98043 11.3946 2.23478 11.5 2.5 11.5ZM9.5 4H9.50533V4.00533H9.5V4ZM9.75 4C9.75 4.0663 9.72366 4.12989 9.67678 4.17678C9.62989 4.22366 9.5663 4.25 9.5 4.25C9.4337 4.25 9.37011 4.22366 9.32322 4.17678C9.27634 4.12989 9.25 4.0663 9.25 4C9.25 3.9337 9.27634 3.87011 9.32322 3.82322C9.37011 3.77634 9.4337 3.75 9.5 3.75C9.5663 3.75 9.62989 3.77634 9.67678 3.82322C9.72366 3.87011 9.75 3.9337 9.75 4Z"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                6
              </li>
            </ul>
            <div className="year flag-tag">{carYear}</div>
          </div> */}
          <div className="img-style">
            <Image
              className="lazyload object-fit-cover"
              alt="car image"
              src={imagePath}
              width={450}
              height={200}
              style={{ height: "200px" }}
            />

          </div>
        </div>
        <div className="content">
          <div>
            <div className="d-flex gap-8 mb-1">
              {car.Tags &&
                car.Tags.map((tag) => <li className="badge bg-dark">{tag.name}</li>
                )}

            </div>
            <div className="text-address">
              <div className="icons flex-three">
                <i className="text-color-3 fa fa-car-side me-2" />
                <span className="text-color-3">{bodyTypeName}</span>
              </div>
            </div>
            <h5 className="link-style-1">
              <Link href={`/cars/new-cars/${car.Brand.slug}/${car.CarModel.slug}/${car.Year.year}/${car.slug}`}>
                {car.Year.year} {car.Brand.name} {car.CarModel.name} {car.Trim.name}
              </Link>
            </h5>
            <div className="icon-box flex flex-wrap my-2">
              <div className="icons flex-three">
                <i className="fa fa-cogs" />
                <span>{car.engineSize} ltr</span>
              </div>
              <div className="icons flex-three">
                <i className="fa fa-gas-pump" />
                <span>{fuelTypeName}</span>
              </div>
              <div className="icons flex-three">
                <i className="fa fa-exchange-alt" />
                <span>{transmissionName}</span>
              </div>

              <div className="icons flex-three">
                <i className="fa fa-flag" />
                <span>{regionalSpecificationName}</span>
              </div>
              <div className="icons flex-three">
                <i className="fa fa-steering-wheel" />
                <span>{steeringSideSpecificationName}</span>
              </div>

            </div>
          </div>

          <div className="money fs-20 fw-5 lh-25 text-color-3 d-flex justify-content-between align-items-center">
            {displayPrice?.currency} {formatCurrency(displayPrice?.price, displayPrice?.currency)}
            <Link href={`/cars/new-cars/${car.Brand.slug}/${car.CarModel.slug}/${car.Year.year}/${car.slug}`} className="view-car">
              View car
            </Link>
          </div>
        </div>
      </div>
    );
  };

  // Define Swiper settings
  const swiperOptions = {
    speed: 1000,
    spaceBetween: 30,
    pagination: { el: ".swiper-pagination", clickable: true },
    navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
    breakpoints: {
      0: { slidesPerView: 1, spaceBetween: 20 },
      600: { slidesPerView: 2, spaceBetween: 20 },
      991: { slidesPerView: 3 },
      1200: { slidesPerView: 4 },
    },
  };

  return (
    <section className="tf-section3">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="heading-section flex align-center justify-space flex-wrap gap-20">
              <h2>{title}</h2>
              <Link href={`/cars/new-cars`} className="tf-btn-arrow">
                View all <i className="icon-autodeal-btn-right" />
              </Link>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="flat-tabs themesflat-tabs">
              <div className="box-tab center">
                <ul className="menu-tab tab-title style flex">
                  {priceRanges.map((item, index) => (
                    <li
                      key={index}
                      className={`item-title ${item === selectedRange ? "active" : ""}`}
                      onClick={() => setSelectedRange(item)}
                    >
                      <h5>{item.title}</h5>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="content-tab">
                <div className="content-inner tab-content">
                  <Swiper {...swiperOptions} modules={[Pagination, Navigation]} className="swiper-container" >
                    {cars.length > 0 ? (
                      cars.map((car) => (
                        <SwiperSlide key={car.id}>
                          <CarCard car={car} />
                        </SwiperSlide>
                      ))
                    ) : (
                      <p>No cars found in this price range.</p>
                    )}
                    <div className="swiper-pagination pb-1"></div>
                  </Swiper>
                  <div className="swiper-button-next" />
                  <div className="swiper-button-prev" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
