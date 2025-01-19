"use client";

import React from "react";

export default function MapAndAddress({ details }) {
    const {
        title,
        address,
        email,
        phone,
        fax,
        mapSrc,
    } = details;

    return (
        <div className="col-md-6 mb-4"> {/* Adjusted for two-column layout */}
            <div className="p-3 contact-info box-sd">
                {mapSrc && (
                    <iframe
                        src={mapSrc}
                        width="100%"
                        height="200"
                        style={{ border: "0" }}
                        allowFullScreen=""
                        loading="lazy"
                    ></iframe>
                )}
                <div className="wrap-info">

                </div>
                <h3 className="fw-bold mt-3">Contact Details</h3>
                <h5 className="mt-4">{title}</h5>
                <p className="text-muted">Head Office —</p>
                <p>{address}</p>
                <ul className="list-unstyled mt-3">
                    {email && (
                        <li className="mb-2">
                            <i className="bi bi-envelope-fill text-primary me-2"></i>
                            <a href={`mailto:${email}`} className="text-decoration-none">
                                {email}
                            </a>
                        </li>
                    )}
                    {phone && (
                        <li className="mb-2">
                            <i className="bi bi-telephone-fill text-primary me-2"></i>
                            <a href={`tel:${phone}`} className="text-decoration-none">
                                {phone}
                            </a>
                        </li>
                    )}
                    {fax && (
                        <li>
                            <i className="bi bi-printer-fill text-primary me-2"></i>
                            {fax}
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}