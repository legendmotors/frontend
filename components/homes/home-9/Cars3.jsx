"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { carListings2 } from "@/data/cars";
import { formatPriceAED } from "@/utils/formatedPriceAED";
import CarCardV2 from "@/components/carsListings/CarCardV2";
const priceRanges = [
  { title: `AED 50 - 80K`, isActive: false, range: { min: 50000, max: 80000 } },
  { title: `AED 80 - 130K`, isActive: false, range: { min: 80000, max: 130000 } },
  { title: `AED 130 - 180K`, isActive: false, range: { min: 130000, max: 180000 } },
];
export default function Cars3({title}) {
  const [filtered, setFiltered] = useState(carListings2);
  const [selectedRange, setSelectedRange] = useState(priceRanges[0]);

  useEffect(() => {
    if (selectedRange.range) {
      setFiltered(
        [...carListings2].filter(
          (elm) =>
            elm.price >= selectedRange.range.min &&
            elm.price <= selectedRange.range.max
        )
      );
    } else {
      setFiltered([...carListings2]);
    }
  }, [selectedRange]);
  return (
    <section className="tf-section3">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="heading-section flex align-center justify-space flex-wrap gap-20">
              <h2
                className="wow fadeInUpSmall"
                data-wow-delay="0.2s"
                data-wow-duration="1000ms"
              >
               {title}
              </h2>
              <Link
                href={`/cars/new-cars2`}
                className="tf-btn-arrow wow fadeInUpSmall"
                data-wow-delay="0.2s"
                data-wow-duration="1000ms"
              >
                View all
                <i className="icon-autodeal-btn-right" />
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
                      className={`item-title ${item == selectedRange ? "active" : ""
                        }`}
                      onClick={() => setSelectedRange(item)}
                    >
                      <h5 className="inner">{item.title}</h5>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="content-tab">
                <div className="content-inner tab-content">
                  <div className="list-car-grid-2">
                    {filtered.slice(0, 4).map((elm, i) => (
                      <div key={i}>

                        <CarCardV2 elm={elm} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
