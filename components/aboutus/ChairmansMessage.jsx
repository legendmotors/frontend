import Image from 'next/image'
import React from 'react'

export default function ChairmansMessage({ sectionsByKey }) {
    return (
        <section className="tf-section3 section-why-choose-us">
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <div className="relative">
                            <div className="image-inner1 hover-img-wrap img-style-hover">
                                <Image
                                    className="ls-is-cached lazyloaded"
                                    data-src="/assets/images/team/chairman.jpg"
                                    alt="images"
                                    src="/assets/images/team/chairman.jpg"
                                    width={600}
                                    height={800}
                                    style={{ objectFit: "cover", width: "100%", height: "50%" }} // Ensures cover behavior
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="content-wcs d-flex flex-column justify-content-center h-100">
                            <div className="tf-icon-box-list">
                                <div
                                    className="tf-icon-box style-2 wow fadeInUpSmall"
                                    data-wow-delay="0.2s"
                                    data-wow-duration="1000ms"
                                >

                                    <div className="content">
                                        <h1
                                            className="wow fadeInUpSmall message-header font-weight-bold"
                                            data-wow-delay="0.2s"
                                            data-wow-duration="1000ms"
                                        >
                                            {sectionsByKey.chairman_message?.title}
                                        </h1>
                                        <h2
                                            className="mt-18 wow fadeInUpSmall message-sub-header"
                                            data-wow-delay="0.2s"
                                            data-wow-duration="1000ms"
                                        >
                                            {sectionsByKey.principal?.title}
                                        </h2>
                                        <h3
                                            className="mt-18 wow fadeInUpSmall"
                                            data-wow-delay="0.2s"
                                            data-wow-duration="1000ms"
                                            dangerouslySetInnerHTML={{ __html: sectionsByKey.chairman_message?.content }}
                                        >

                                        </h3>
                                        {/* <h4
                                            className="mt-18 wow fadeInUpSmall"
                                            data-wow-delay="0.2s"
                                            data-wow-duration="1000ms"
                                        >
                                            - Mira Wu
                                        </h4> */}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
