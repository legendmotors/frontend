"use client";
import React from "react";
import Nav from "./Nav";
import Link from "next/link";
import Image from "next/image";
import MobileNav from "./MobileNav";
import SearchBar from "../common/SearchBar";
import LanguageSelector from "../common/LanguageSelector";
import CurrencySelector from "../common/CurrencySelector";
import WishlistDropdown from "../common/WishlistDropdown";
import { getCookie } from "@/utils/cookieFunction";
import { GetUserLogin } from "@/services";
import Dropdown from "../auth/UserDropdown";
import IconUser from "../icon/icon-user";
import IconMail from "../icon/icon-mail";
import IconLockDots from "../icon/icon-lock-dots";
import IconLogout from "../icon/icon-logout";
import UserDropdown from "../auth/UserDropdown";
import { useTranslation } from "react-i18next";

export default function Header1() {
  const token = getCookie("token");
  const { t } = useTranslation();

  return (
    <header className="main-header">
      {/* Header Lower */}
      <div className="header-lower">
        <div className="container2">
          <div className="row">
            <div className="col-lg-12">
              <div className="inner-container flex justify-space align-center">
                {/* Logo Box */}
                <div className="logo-box flex">
                  <div className="logo">
                    <Link href={`/`}>
                      <Image
                        className="lazyload img-none"
                        data-src={t("logo_header")}
                        alt="Logo"
                        width={160}
                        height={40}
                        src={t("logo_header")}
                      />
                      <Image
                        className="lazyload img-is-fixed"
                        data-src={t("logo_header")}
                        alt="Logo"
                        width={160}
                        height={40}
                        src={t("logo_header")}
                      />
                    </Link>
                  </div>
                </div>
                <div className="header-account flex align-center">
                  <SearchBar />
                  <LanguageSelector />
                  <CurrencySelector />
                  {/* <WishlistDropdown /> */}
                  {!token && (
                    <div className="register">
                      <ul className="flex align-center">
                        <li>
                          <i className="icon-autodeal-user fs-20" />
                        </li>
                        <li>
                          <a
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#popup_bid"
                          >
                            {t("login")}
                          </a>
                        </li>
                        <li>
                          <span>/</span>
                        </li>
                        <li>
                          <a
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#popup_bid2"
                          >
                            {t("register")}
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                  {token && <UserDropdown />}
                </div>
                <div
                  className="mobile-nav-toggler mobile-button"
                  onClick={() =>
                    document.body.classList.add("mobile-menu-visible")
                  }
                >
                  <span />
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="d-flex justify-content-center align-items-center border-top border-grey">
                <div className="nav-outer flex align-center">
                  {/* Main Menu */}
                  <nav className="main-menu ms-0 show navbar-expand-md">
                    <div
                      className="navbar-collapse collapse clearfix"
                      id="navbarSupportedContent"
                    >
                      <ul className="navigation clearfix">
                        <Nav />
                      </ul>
                    </div>
                  </nav>
                  {/* Main Menu End */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Header Lower */}
      {/* Mobile Menu */}
      <div
        className="close-btn"
        onClick={() =>
          document.body.classList.remove("mobile-menu-visible")
        }
      >
        <span className="icon flaticon-cancel-1" />
      </div>
      <div className="mobile-menu">
        <div
          className="menu-backdrop"
          onClick={() =>
            document.body.classList.remove("mobile-menu-visible")
          }
        />
        <nav className="menu-box">
          <div className="nav-logo">
            <Link href={`/`}>
              <Image
                className="lazyload"
                data-src="/assets/images/logo/legend-motors-logo.png"
                alt=""
                width={197}
                height={48}
                src="/assets/images/logo/legend-motors-logo.png"
              />
            </Link>
          </div>
          <div className="bottom-canvas">
            <div className="login-box flex align-center">
              <i className="icon-autodeal-user fs-20" />
              <a
                href="#"
                data-bs-toggle="modal"
                data-bs-target="#popup_bid"
                className="fw-7 font-2"
              >
                {t("login")}
              </a>
            </div>
            {/* <MobileNav /> */}
          </div>
        </nav>
      </div>
      {/* End Mobile Menu */}
    </header>
  );
}
