import React from "react";
import Image from "next/image";
export default function DownloadApp({ sectionsByKey }) {

  console.log(sectionsByKey, "sectionsByKeysss");

  return (
    <section >
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="tf-image-box style2 bg-black flex-three">
              <div className="image">
                <Image
                  className="lazyload"
                  data-src="/assets/images/img-box/find-car-4.png"
                  alt="images"
                  src="/assets/images/img-box/find-car-4.png"
                  width={247}
                  height={275}
                />
              </div>
              <div className="content">
                <h2 className="text-color-1">
                  <a href="#">{sectionsByKey?.download_our_app?.title}</a>
                </h2>
                <div className="text-color-1" dangerouslySetInnerHTML={{ __html: sectionsByKey?.download_our_app?.content }}>

                </div>
                <div className="flex gap-8">
                  <a href="#">
                    <Image
                      className="lazyload"
                      data-src="/assets/images/section/app-store.png"
                      alt="images"
                      src="/assets/images/section/app-store.png"
                      width={140}
                      height={48}
                    />
                  </a>
                  <a href="#">
                    <Image
                      className="lazyload"
                      data-src="/assets/images/section/google-play.png"
                      alt="images"
                      src="/assets/images/section/google-play.png"
                      width={160}
                      height={48}
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="tf-image-box style2 bg-orange flex-three">
              <div className="image">
                <Image
                  className="lazyload"
                  data-src="/assets/images/img-box/find-car-4.png"
                  alt="images"
                  src="/assets/images/img-box/find-car-4.png"
                  width={247}
                  height={275}
                />
              </div>
              <div className="content">
                <h2 className="text-color-1">
                  <a href="#">{sectionsByKey?.are_you_looking_for_a_car?.title}</a>
                </h2>
                <div className="text-color-1" dangerouslySetInnerHTML={{ __html: sectionsByKey?.are_you_looking_for_a_car?.content }}>
                </div>
                <a href="#" className="find-cars">
                  <span>Find cars</span>
                  <i className="icon-autodeal-search" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
