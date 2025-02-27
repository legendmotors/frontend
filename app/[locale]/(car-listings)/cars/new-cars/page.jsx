import Cars2 from "@/components/carsListings/Cars2";
import Cars3 from "@/components/carsListings/Cars3";
import CarInventoryListing from "@/components/carsListings/CarInventoryListing";
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import React from "react";

export const metadata = {
  title:
    "",
  description: "",
};
export default function page() {
  return (
    <>
      <section className="tf-banner style-2">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="content relative z-2">
                <div className="heading">
                  <h1 className="text-color-1">
                    Find Your Perfect New Car<br />
                    with Advanced Filtering!
                  </h1>
                  <p className="text-color-1 fs-18 fw-4 lh-22 font">
                    Explore our powerful new car filtering tool to discover models <br />
                    that match your preferences and budget effortlessly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <CarInventoryListing />
      <Footer1 />
    </>
  );
}
