"use client";

import "rc-slider/assets/index.css";
import "../../public/assets/scss/app.scss";
import "swiper/css/effect-fade";
import "swiper/css/grid";
import "photoswipe/style.css";
import { useEffect } from "react";
import BackToTop from "@/components/common/BacktoTop";
import Login from "@/components/modals/Login";
import SignUp from "@/components/modals/SignUp";
import Header1 from "@/components/headers/Header1";

export default function RootClient({ children }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.esm").then(() => {
        // Bootstrap imported
      });
    }
  }, []);

  useEffect(() => {
    const nav = document.querySelector(".header-lower");
    if (nav) {
      const headerHeight = nav.offsetHeight;
      const injectSpace = document.createElement("div");
      injectSpace.style.height = `${headerHeight}px`;
      injectSpace.classList.add("header-lower-after-div");
      nav.after(injectSpace);
      injectSpace.style.display = "none";
    }

    const handleScroll = () => {
      const nav = document.querySelector(".header-lower");
      if (document.querySelector(".header-fixed")) {
        const afterDiv = document.querySelector(".header-lower-after-div");
        if (nav && afterDiv) {
          if (window.scrollY > 200) {
            nav.classList.add("is-fixed");
            afterDiv.style.display = "block";
          } else {
            nav.classList.remove("is-fixed");
            afterDiv.style.display = "none";
          }

          if (window.scrollY > 300) {
            nav.classList.add("is-small");
          } else {
            nav.classList.remove("is-small");
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const { WOW } = require("wowjs");
    const wow = new WOW({
      mobile: false,
      live: false,
    });
    wow.init();
  }, []);

  return (
    <>
      <div className="header-fixed">
        <Header1 />
      </div>
      <div id="wrapper">
        <div id="pagee" className="clearfix">
          {children}
        </div>
      </div>
      <Login />
      <SignUp />
      <BackToTop />
    </>
  );
}
