"use client"
import React, { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import PagesService from "@/services/PagesService";

export default function Page() {
     const {i18n} = useTranslation();
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);


    console.log(pageData, "pageData");



    useEffect(() => {
        const fetchPage = async () => {
            try {
                // For the homepage, assume your slug is "home"
                const result = await PagesService.getPageBySlug("terms_and_conditions", i18n.language);

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
    }, [i18n.language]);

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
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-12 contact-left">
                    <div className="heading-section mb-30">
                        <h2>{sectionsByKey?.terms_content?.title}</h2>
                        <div className="mt-12" dangerouslySetInnerHTML={{ __html: sectionsByKey.terms_content?.content }}
                        >
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
