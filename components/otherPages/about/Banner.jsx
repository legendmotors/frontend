"use client";
import React, { useState, useEffect } from "react";
import BannerService from "@/services/BannerService";
import { useTranslation } from "react-i18next";

export default function Banner() {
  const [banner, setBanner] = useState(null);
   const { i18n } = useTranslation();
  const locale = i18n.language
  const [loading, setLoading] = useState(true);
  console.log(banner, "banner");

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        // Use a single banner identifier from your database
        const identifier = "AboutUs";
        const result = await BannerService.getBannerByIdentifier(identifier, locale);
        if (result && result.success && result.data) {
          setBanner(result.data);
        }
      } catch (err) {
        console.error("Error fetching banner by identifier:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [locale]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!banner) {
    return <div>Banner not found.</div>;
  }

  // Build image URL if media is available
  const imageUrl =
    banner.media &&
    `${process.env.NEXT_PUBLIC_FILE_PREVIEW_URL}${
      banner.media.webp || banner.media.thumbnailPath
    }`;

  return (
    <section
      className="tf-banner"
      style={{
        backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            {/* Text Content rendered on top of the background */}
            <div className="content relative z-2">
              <div className="heading">
                <h1 className="text-color-1">{banner?.title}</h1>
                <p className="text-color-1 fs-18 fw-4 lh-22 font">
                  {banner?.description}
                </p>
                <a href="#" className="sc-button btn-svg">
                  <span>{banner?.buttontext}</span>
                  <i className="icon-autodeal-next" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
