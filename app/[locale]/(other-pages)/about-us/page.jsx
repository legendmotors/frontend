"use client"
import Agents from "@/components/common/Agents";
import Footer1 from "@/components/footers/Footer1";
import RecomandedCars from "@/components/common/RecomandedCars";
import Header2 from "@/components/headers/Header2";
import Testimonials from "@/components/homes/home-10/Testimonials";
import Features from "@/components/homes/home-3/Features";
import Banner from "@/components/otherPages/about/Banner";

import React, { useEffect, useState } from "react";
import ChairmansMessage from "@/components/aboutus/ChairmansMessage";
import Partners from "@/components/common/Partners";
import { useLocale } from "next-intl";
import PagesService from "@/services/PagesService";

// export const metadata = {
//   title:
//     "About Us",
//   description: "",
// };
export default function page() {

  const locale = useLocale();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(pageData, "pageData");



  useEffect(() => {
    const fetchPage = async () => {
      try {
        // For the homepage, assume your slug is "home"
        const result = await PagesService.getPageBySlug("about_us", locale);

        if (result && result.success && result.data) {
          setPageData(result.data);
        }
      } catch (err) {
        console.error("Error fetching page data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [locale]);

  const sectionsByKey = pageData && Array.isArray(pageData.sections)
    ? pageData.sections.reduce((acc, section) => {
      acc[section.sectionKey] = {
        title: section.title,
        content: section.content,
      };
      return acc;
    }, {})
    : {};

  return (
    <>
      <Banner />
      <div className="mt-5 pt-5"></div>
      <Features sectionsByKey={sectionsByKey}/>
      <div className="mt-5 pt-5"></div>
      {/* <Agents parentClass="tf-section3" /> */}
      <ChairmansMessage sectionsByKey={sectionsByKey} />
      <Partners />
      {/* <Testimonials /> */}
      {/* <RecomandedCars /> */}
      
    </>
  );
}
