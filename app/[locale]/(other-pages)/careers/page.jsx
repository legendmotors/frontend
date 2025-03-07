"use client"
import Footer1 from '@/components/footers/Footer1'
import Banner from '@/components/otherPages/careers/Banner'
import Features from '@/components/otherPages/careers/Features'

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PagesService from "@/services/PagesService";

export default function pages() {

  const locale = useLocale();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(pageData, "pageData");



  useEffect(() => {
    const fetchPage = async () => {
      try {
        // For the homepage, assume your slug is "home"
        const result = await PagesService.getPageBySlug("career", locale);

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
    <><Banner />
      <Features sectionsByKey={sectionsByKey} />
      <div className="container mb-5">

        <div className="col-md-12">
          <div className="content-wcs d-flex  justify-content-center text-center">
            <div className="tf-icon-box-list">
              <div
                className="tf-icon-box wow fadeInUpSmall"
                data-wow-delay="0.2s"
                data-wow-duration="1000ms"
              >
                <div className="text-center mb-3">
                  <h1 className="mb-2 ">{sectionsByKey.join_ourt_eam?.title}</h1>
                  <p className="text-muted" dangerouslySetInnerHTML={{ __html: sectionsByKey?.join_ourt_eam?.content }}
                  >
                  </p>
                </div>
                <div className='d-flex justify-content-center align-items-center'>
                  <p className="card-text">
                    {sectionsByKey.email_text?.title}
                  </p>
                  <h3 className="mb-1 ms-2">careers@example.com</h3>
                </div>

                <div
                  className="flat-bt-top wow fadeInUpSmall mt-4"
                  data-wow-delay="0.2s"
                  data-wow-duration="1000ms"
                >
                  <a className="sc-button btn-1" href="mailto:careers@example.com">
                    <span>  {sectionsByKey.email_button?.title}</span>
                    <i className="icon-autodeal-next" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </>
  )
}
