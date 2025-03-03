"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Cookies from "js-cookie";

const CarCard = ({ car }) => {
  const [currency, setCurrency] = useState(Cookies.get("NEXT_CURRENCY") || "AED");
  const [exchangeRate, setExchangeRate] = useState(1);

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

  // Calculate the converted price
  const convertedPrice = Math.round(car.price * exchangeRate);

  return (
    <div key={car.id} className="box-car-list hv-one">
      <div className="image-group relative">
        <div className="top flex-two">
          <ul className="d-flex gap-8">
            {car.isFeatured && <li className="flag-tag success">Featured</li>}
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
          <div className="year flag-tag">{car.year}</div>
        </div>

        <div className="img-style">
          <Image
            className="lazyload"
            alt="image"
            src={car.imgSrc}
            width={450}
            height={338}
          />
        </div>
      </div>

      <div className="content">
        <div className="text-address">
          <p className="text-color-3 font">{car.type}</p>
        </div>
        <h5 className="link-style-1">
          <Link href={`/listing-detail-v1/${car.id}`}>
            {car.title}
          </Link>
        </h5>
        <div className="icon-box flex flex-wrap">
          <div className="icons flex-three">
            <i className="fa fa-cogs" />
            <span>{car.fuelType}</span>
          </div>
          <div className="icons flex-three">
            <i className="fa fa-gas-pump" />
            <span>Manual</span>
          </div>
          <div className="icons flex-three">
            <i className="fa fa-tachometer-alt" />
            <span>V8</span>
          </div>
          <div className="icons flex-three">
            <i className="fa fa-flag" />
            <span>Oman Spec</span>
          </div>
        </div>

        {/* Display Converted Price in Selected Currency */}
        <div className="money fs-20 fw-5 lh-25 text-color-3 d-flex justify-content-between align-items-center">
          {currency} {convertedPrice}
          <Link
            href={`/listing-detail-v2/${car.id}`}
            className="view-car"
          >
            View car
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
