import Cars2 from '@/components/carsListings/Cars2'
import Footer1 from '@/components/footers/Footer1'
import React from 'react'

export default function page() {
    return (
        <>
            <section className="tf-banner style-2">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="content relative z-2">
                                <div className="heading">
                                    <h1 className="text-color-1">
                                        BMW Cars In UAE
                                    </h1>
                                    <p className="text-color-1 fs-18 fw-4 lh-22 font">
                                        BMW offers luxury, performance, <br />
                                        and innovation in every model
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Cars2 />
            
        </>
    )
}
