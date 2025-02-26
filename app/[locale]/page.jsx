"use client"
import Blogs2 from "@/components/common/Blogs2";
import Brands from "@/components/common/Brands";
import CarBrands from "@/components/common/CarBrands";
import Categories2 from "@/components/common/Categories2";
import Cta from "@/components/common/Cta";
import DownloadApp from "@/components/common/DownloadApp";
import Features from "@/components/common/Features";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Cars from "@/components/homes/home-9/Cars";
import Cars2 from "@/components/homes/home-9/Cars2";
import Cars3 from "@/components/homes/home-9/Cars3";
import Hero from "@/components/homes/home-9/Hero";
import Testimonials from "@/components/homes/home-9/Testimonials";
import React, { useEffect } from "react";

// export const metadata = {
//   title:
//     "Home 09 || AutoDeal - Car Dealer, Rental & Listing React Nextjs Template",
//   description: "AutoDeal - Car Dealer, Rental & Listing React Nextjs Template",
// };
export default function page() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.clevertap) {
      clevertap.event.push('Page Viewed', {
        "Page Name": "Homepage"
      });
      console.log("CleverTap Event: Home Page Viewed");
    }
  }, []);

  return (
    <>

      <Hero />
      <div className="mt-5 pt-5"></div>
      <Cars title={"Featured Cars"} />
      <Cars title={"The Most Searched Cars"} />

      <CarBrands />
      <div className="mt-5 pt-5"></div>
      <Categories2 parentClass="tf-section3 pb-0" />
      {/* <Cta /> */}
      <div className="mt-5 pt-5"></div>
      <DownloadApp />
      <div className="mt-5 pt-5"></div>

      <Features />

      <Cars3 title={"Upcoming Cars"} />
      <Testimonials />
      <div className="mt-5 pt-5"></div>
      <Blogs2 />
      <Brands />
      <Footer1 />
    </>
  );
}
