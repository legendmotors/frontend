"use client"
import Blogs2 from "@/components/common/Blogs2";
import CarBodyTypes from "@/components/common/CarBodyTypes";
import CarBrands from "@/components/common/CarBodyTypes";
import PopularBrands from "@/components/common/PopularBrands";
import Categories2 from "@/components/common/PopularBrands";
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
import PagesService from "@/services/PagesService";
import { useLocale } from "next-intl";
import React, { useEffect, useRef, useState } from "react";
import Partners from "@/components/common/Partners";

export default function page() {
  const hasTracked = useRef(false);
  const TRACKING_INTERVAL = 30000; // 30 seconds

  useEffect(() => {
    // Prevent duplicate tracking from Strict Mode
    if (hasTracked.current) return;
    hasTracked.current = true;

    const now = Date.now();
    const lastTracked = localStorage.getItem("lastTrackingEvent");

    // Check if the last event was tracked within the interval
    if (lastTracked && now - parseInt(lastTracked, 10) < TRACKING_INTERVAL) {
      console.log("Tracking event suppressed due to recent event.");
      return;
    }
    // Update the last tracked timestamp
    localStorage.setItem("lastTrackingEvent", now.toString());

    // CleverTap event
    if (typeof window !== "undefined" && window.clevertap) {
      clevertap.event.push('Page Viewed', { "Page Name": "Homepage" });
      console.log("CleverTap Event: Home Page Viewed");
    }

    // Custom tracking event to your Node.js backend
    const sessionId = localStorage.getItem("sessionId") || (() => {
      const newSession = Math.random().toString(36).substr(2, 9);
      localStorage.setItem("sessionId", newSession);
      return newSession;
    })();

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}tracking/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        eventType: "page_view",
        page: "Homepage",
        timestamp: now
      })
    })
      .then(response => response.json())
      .then(data => console.log("Tracking event recorded:", data))
      .catch(err => console.error("Error recording tracking event:", err));
  }, []);

  const locale = useLocale();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(pageData, "pageData");



  useEffect(() => {
    const fetchPage = async () => {
      try {
        // For the homepage, assume your slug is "home"
        const result = await PagesService.getPageBySlug("home", locale);

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
      <Hero />
      <div className="mt-5 pt-5"></div>
      <Cars title={sectionsByKey.featured_cars?.title} tagId={5}/>
      <Cars title={sectionsByKey.the_most_searched_cars?.title} tagId={4} />
      <CarBodyTypes title={sectionsByKey.search_by_body?.title} specId={6}/>
      <div className="mt-5 pt-5"></div>
      <PopularBrands title={sectionsByKey.popular_brands?.title} />
      {/* <Cta /> */}
      <div className="mt-5 pt-5"></div>
      <DownloadApp sectionsByKey={sectionsByKey} />
      <div className="mt-5 pt-5"></div>
      <Features sectionsByKey={sectionsByKey} />
      <Cars3 title={sectionsByKey.best_cars_by_budget?.title} />
      <Testimonials sectionsByKey={sectionsByKey} />
      <div className="mt-5 pt-5"></div>
      <Blogs2 title={sectionsByKey.our_news?.title}/>
      <Partners title={sectionsByKey.our_partners?.title}/>
    </>
  );
}
