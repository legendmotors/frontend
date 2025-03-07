"use client";
import React, { useState, useEffect } from "react";
import BannerService from "@/services/BannerService";
import { useTranslation } from "react-i18next";

export default function CarListingBanner() {
    const [banner, setBanner] = useState(null);
    const locale = useLocale();
    const [loading, setLoading] = useState(true);
    console.log(banner, "banner");

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                // Use a single banner identifier from your database
                const identifier = "CarListingPageBanner";
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
        `${process.env.NEXT_PUBLIC_FILE_PREVIEW_URL}${banner.media.original || banner.media.thumbnailPath
        }`;

    return (
        <section className="tf-banner" style={{
            backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
        }}>
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
    )
}
