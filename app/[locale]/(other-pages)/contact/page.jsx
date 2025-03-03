"use client"
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import Contact from "@/components/otherPages/Contact";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Partners from "@/components/common/Partners";
import { useLocale } from "next-intl";
import PagesService from "@/services/PagesService";
// export const metadata = {
//   title:
//     "Contact || AutoDeal - Car Dealer, Rental & Listing React Nextjs Template",
//   description: "AutoDeal - Car Dealer, Rental & Listing React Nextjs Template",
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
        const result = await PagesService.getPageBySlug("contact", locale);

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
      <section className="flat-title mb-40">
        {/* <div className="container2">
          <div className="row">
            <div className="col-lg-12">
              <div className="title-inner style">
                <div className="title-group fs-12">
                  <Link className="home fw-6 text-color-3" href={`/`}>
                    Home
                  </Link>
                  <span>Cars</span>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </section>
      <Contact sectionsByKey={sectionsByKey}/>
      <Partners />
      
    </>
  );
}
