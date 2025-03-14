"use client";

import "rc-slider/assets/index.css";
import "../../public/assets/scss/app.scss";
import "swiper/css/effect-fade";
import "swiper/css/grid";
import "photoswipe/style.css";
import { useEffect, useState } from "react";
import BackToTop from "@/components/common/BacktoTop";
import SignUp from "@/components/modals/SignUp";
import Header1 from "@/components/headers/Header1";
import { Provider } from "react-redux";
import store from "@/store";
import Login from "../modals/Login";
import { getCookie, setCookie } from "@/utils/cookieFunction";
import { GetUserDetails, GetUserLogin } from "@/services";
import Footer1 from "../footers/Footer1";
import { I18nextProvider } from 'react-i18next';

export default function RootClient({ children }) {
  const token = getCookie('token');

  const userId = getCookie('userId')



  // useEffect(() => {
  //   if (token) {
  //     GetUserDetails.getUserById(userId)
  //       .then((response) => {
  //         console.log("User response:", response);
  //         if (response) {
  //           // Save user details as a JSON string in a cookie for 60 minutes.
  //           setCookie("userData", JSON.stringify(response), 60);
  //         }
  //       })
  //       .catch((err) => {
  //         console.error("Error fetching user details:", err);
  //       });
  //   }
  // }, [userId]);


  const [clevertapModule, setClevertapModule] = useState(null);

  useEffect(() => {
    const initCleverTap = async () => {
      if (!clevertapModule) {
        try {
          const clevertap = await initializeClevertap();
          setClevertapModule(clevertap);
          console.log("✅ CleverTap Initialized Globally");
        } catch (error) {
          console.error("❌ CleverTap Initialization Failed:", error);
        }
      }
    };

    initCleverTap();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.esm").then(() => {
        // Bootstrap imported
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

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
      <Provider store={store}>
        <div className="header-fixed">
          <Header1 />
        </div>
        <div id="wrapper">
          <div id="pagee" className="clearfix">
            {children}
          </div>
        </div>
        <Footer1 />
        {!token && <>
          <Login />
          <SignUp /></>}

        <BackToTop />
      </Provider>
    </>
  );
}

// CleverTap Initialization Function
async function initializeClevertap() {
  const clevertapModule = await import("clevertap-web-sdk");

  clevertapModule.default.init("6Z8-W98-7W7Z", "eu1"); // Replace with your actual Account ID & Region
  clevertapModule.default.setLogLevel(3);

  return clevertapModule.default;
}