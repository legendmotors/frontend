"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCookie } from "@/utils/cookieFunction";
import SearchBar from "../common/SearchBar";
import LanguageSelector from "../common/LanguageSelector";
import CurrencySelector from "../common/CurrencySelector";
import WishlistDropdown from "../common/WishlistDropdown";
import UserDropdown from "../auth/UserDropdown";
import { useTranslation } from "react-i18next";
import { blogPages, homepages, listingPages, otherPages } from "@/data/menu";

export default function MobileNav() {
  const { t } = useTranslation();
  const token = getCookie("token");
  const pathname = usePathname();

  // Existing mobile nav dropdown functions remain if needed.
  // For brevity, only the main navigation and account header are included.

  return (
    <div className="menu-outer">
      {/* Mobile Header Account Section */}
      <div className="mobile-header-account mb-2">
        {!token && (
          <div className="register">
            <ul className="flex align-center">
              <li>
                <i className="icon-autodeal-user fs-20" />
              </li>
              <li>
                <a href="#" data-bs-toggle="modal" data-bs-target="#popup_bid">
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

      {/* Navigation Section */}
      <div
        className="navbar-collapse collapse clearfix"
        id="navbarSupportedContent"
      >
        <ul className="navigation clearfix">
          <li className={pathname === "/" ? "current" : ""}>
            <Link href="/">{t("home")}</Link>
          </li>
          <li className={pathname === "/cars/new-cars" ? "current" : ""}>
            <Link href="/cars/new-cars">{t("explore_cars")}</Link>
          </li>
          <li className={pathname === "/blog" ? "current" : ""}>
            <Link href="/blog">{t("blogs")}</Link>
          </li>
          <li className={pathname === "/about-us" ? "current" : ""}>
            <Link href="/about-us">{t("about_us")}</Link>
          </li>
          <li className={"contact" === pathname.split("/")[1] ? "current" : ""}>
            <Link href="/contact">{t("contact")}</Link>
          </li>
        </ul>
      </div>
      <div className="flex justify-content-between mt-4">
        <LanguageSelector />
        <CurrencySelector />
      </div>
    </div>
  );
}
