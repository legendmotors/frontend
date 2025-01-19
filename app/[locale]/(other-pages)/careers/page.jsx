import Footer1 from '@/components/footers/Footer1'
import Banner from '@/components/otherPages/careers/Banner'
import Features from '@/components/otherPages/careers/Features'
import React from 'react'

export default function pages() {
  return (
    <><Banner />
      <Features />
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
                  <h1 className="mb-2 ">Join Our Team</h1>
                  <p className="text-muted">
                    We’re always on the lookout for passionate individuals to join our team. Send us your
                    resume and start your career with us!
                  </p>
                </div>
                <div className='d-flex justify-content-center align-items-center'>
                  <p className="card-text">
                    Please send your updated resume to
                  </p>
                  <h3 className="mb-1 ms-2">careers@example.com</h3>
                </div>


                <div
                  className="flat-bt-top wow fadeInUpSmall mt-4"
                  data-wow-delay="0.2s"
                  data-wow-duration="1000ms"
                >
                  <a className="sc-button btn-1" href="mailto:careers@example.com">
                    <span> Email Us Now</span>
                    <i className="icon-autodeal-next" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer1 />
    </>
  )
}
