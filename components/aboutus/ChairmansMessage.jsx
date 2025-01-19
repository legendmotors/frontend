import Image from 'next/image'
import React from 'react'

export default function ChairmansMessage() {
    return (
        <section className="tf-section3 section-why-choose-us">
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <div className="relative">
                            <div className="glass-container d-flex align-items-center justify-content-center position-absolute top-50 start-50"  >

                            </div>
                            <div className="glass-container d-flex align-items-center justify-content-center position-absolute top-0 start-0 mt-5"  >

                            </div>
                            <div className="image-inner1 hover-img-wrap img-style-hover">
                                <Image
                                    className="ls-is-cached lazyloaded"
                                    data-src="/assets/images/team/chairman.png"
                                    alt="images"
                                    src="/assets/images/team/chairman.png"
                                    width={600}
                                    height={800}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
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
                                           Chairman Message
                                        </h1>
                                        <h2
                                            className="mt-18 wow fadeInUpSmall message-sub-header"
                                            data-wow-delay="0.2s"
                                            data-wow-duration="1000ms"
                                        >
                                            Principal and Co-founder
                                        </h2>
                                        <h3
                                            className="mt-18 wow fadeInUpSmall"
                                            data-wow-delay="0.2s"
                                            data-wow-duration="1000ms"
                                        >
                                            Our experienced team excels in car sales with many years of
                                            successfully navigating the market, delivering informed
                                            decisions and optimal results.
                                        </h3>
                                        <h4
                                            className="mt-18 wow fadeInUpSmall"
                                            data-wow-delay="0.2s"
                                            data-wow-duration="1000ms"
                                        >
                                            - Mira Wu
                                        </h4>
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
