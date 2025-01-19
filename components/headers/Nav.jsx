"use client";
import React, { useState } from "react";
import { blogPages, homepages, listingPages, otherPages } from "@/data/menu";
import { usePathname } from "next/navigation";
import Image from "next/image";
import LocalizedLink from "../translation/LocalizedLink";

// Example data for each tab
const popularBrands = [
  { name: "Toyota", image: "assets/images/brands/toyota.png", LocalizedLink: "/brands/toyota" },
  { name: "Land Rover", image: "assets/images/brands/landrover.png", LocalizedLink: "/brands/toyota" },
  { name: "Toyota", image: "assets/images/brands/toyota.png", LocalizedLink: "/brands/toyota" },
  { name: "Land Rover", image: "assets/images/brands/landrover.png", LocalizedLink: "/brands/toyota" },
  { name: "Toyota", image: "assets/images/brands/toyota.png", LocalizedLink: "/brands/toyota" },
  { name: "Land Rover", image: "assets/images/brands/landrover.png", LocalizedLink: "/brands/toyota" },
];

const popularModels = [
  { name: "2018 BMV X1 xDrive 20d xline", image: "assets/images/car-list/car1.jpg", LocalizedLink: "/models/camry" },
  { name: "2018 BMV X1 xDrive 20d xline", image: "assets/images/car-list/car1.jpg", LocalizedLink: "/models/camry" },
  { name: "2018 BMV X1 xDrive 20d xline", image: "assets/images/car-list/car1.jpg", LocalizedLink: "/models/camry" },
  { name: "2018 BMV X1 xDrive 20d xline", image: "assets/images/car-list/car1.jpg", LocalizedLink: "/models/camry" },
  { name: "2018 BMV X1 xDrive 20d xline", image: "assets/images/car-list/car1.jpg", LocalizedLink: "/models/camry" },
];

const newModels = [
  { name: "2018 BMV X1 xDrive 20d xline", image: "assets/images/car-list/car1.jpg", LocalizedLink: "/models/camry" },
  { name: "2018 BMV X1 xDrive 20d xline", image: "assets/images/car-list/car1.jpg", LocalizedLink: "/models/camry" },
  { name: "2018 BMV X1 xDrive 20d xline", image: "assets/images/car-list/car1.jpg", LocalizedLink: "/models/camry" },
  { name: "2018 BMV X1 xDrive 20d xline", image: "assets/images/car-list/car1.jpg", LocalizedLink: "/models/camry" },
  { name: "2018 BMV X1 xDrive 20d xline", image: "assets/images/car-list/car1.jpg", LocalizedLink: "/models/camry" },
  { name: "2018 BMV X1 xDrive 20d xline", image: "assets/images/car-list/car1.jpg", LocalizedLink: "/models/camry" },
];


export default function Nav() {
  const [activeTab, setActiveTab] = useState("popularBrands"); // Default active tab
  // Tabs for "New Cars" dropdown
  // Tabs Configuration
  const tabs = [
    { id: "popularBrands", label: "Popular Brands", data: popularBrands },
    { id: "popularModels", label: "Popular Models", data: popularModels },
    { id: "newModels", label: "Latest Models", data: newModels },
  ];

  const pathname = usePathname();
  const isActive = (menus) => {
    let active = false;

    menus.forEach((elm) => {
      if (elm.LocalizedLinks) {
        elm.LocalizedLinks.forEach((elm2) => {
          if (elm2.href.split("/")[1] == pathname.split("/")[1]) {
            active = true;
          }
        });
      } else {
        if (elm.href.split("/")[1] == pathname.split("/")[1]) {
          active = true;
        }
      }
    });
    return active;
  };
  return (
    <>
      {/* Home Menu */}

      {/* <li
        className={`tf-megamenu dropdown2 ${isActive(homepages) ? "current" : ""
          } `}
      >
        <a href="#">Home</a>
        <ul>
          {homepages.map((page, index) => (
            <li
              key={index}
              className={
                page.href.split("/")[1] == pathname.split("/")[1]
                  ? "current"
                  : ""
              }
            >
              <LocalizedLink href={page.href}>{page.text}</LocalizedLink>
            </li>
          ))}
        </ul>
      </li> */}
      {/* <li
        className={`tfcl-mega-menu dropdown2  ${isActive(listingPages) ? "current" : ""
          } `}
      >
        <a href="#">Listing Car</a>
        <ul>
          {listingPages.map((item, index) => (
            <li key={index} className={item.className}>
              <a href="#">{item.title}</a>
              <ul>
                {item.LocalizedLinks.map((LocalizedLink, LocalizedLinkIndex) => (
                  <li
                    key={LocalizedLinkIndex}
                    className={`${LocalizedLink.className || ""} ${LocalizedLink.href.split("/")[1] == pathname.split("/")[1]
                        ? "current"
                        : ""
                      }`}
                  >
                    <LocalizedLink href={LocalizedLink.href}>{LocalizedLink.text}</LocalizedLink>
                  </li>
                ))}
              </ul>
              <div className="dropdown2-btn" />
            </li>
          ))}
        </ul>
      </li> */}

       {/* <li className={`dropdown2  ${isActive(blogPages) ? "current" : ""} `}>
        <a href="#">Blog</a>
        <ul>
          {blogPages.map((item, index) => (
            <li
              key={index}
              className={
                item.href.split("/")[1] == pathname.split("/")[1]
                  ? "current"
                  : ""
              }
            >
              <LocalizedLink href={item.href}>{item.text}</LocalizedLink>
            </li>
          ))}
        </ul>
      </li> */}



      <li className={pathname === "/" ? "current" : ""}>
        <LocalizedLink href="/">Home</LocalizedLink>
      </li>


      {/* New Cars Dropdown */}
      {/* Dropdown Menu */}
      <li className="tfcl-mega-menu dropdown2">
        <LocalizedLink href="/listing-grid">Explore Cars</LocalizedLink>
        <ul className="dropdown-menu">
          <li className="dropdown-wrapper d-flex">
            {/* Tabs Section (Left Side) */}
            <div className="dropdown-tabs">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`tab-item ${tab.id === activeTab ? "active-tab" : ""
                    }`}
                  onMouseEnter={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </div>
              ))}
            </div>

            {/* Content Section (Right Side) */}
            <div className="dropdown-content tab-transition">
              <div className="megamenu-grid">
                {tabs
                  .find((tab) => tab.id === activeTab)
                  .data.map((item, index) => (
                    <div key={index} className="megamenu">
                      <Image
                        className={`lazyload ${activeTab === "popularBrands" || activeTab === "popularBodyTypes"
                          ? "object-fit-contain"
                          : "rounded object-fit-cover"
                          }`}
                        data-src={item.image}
                        alt="images"
                        src={item.image}
                        width={300}
                        height={300}
                      />
                      <p>{item.name}</p>
                    </div>
                  ))}
              </div>
              <LocalizedLink href={`/${activeTab}`} className="see-all-link">
                See all {tabs.find((tab) => tab.id === activeTab).label} →
              </LocalizedLink>
            </div>
          </li>
        </ul>
      </li>


      {/* <li className={`dropdown2  ${isActive(otherPages) ? "current" : ""} `}>
        <a href="#">Page</a>
        <ul>
          {otherPages.map((item, index) => (
            <li
              key={index}
              className={`${item.className || ""}  ${item.LocalizedLinks ? (isActive(item.LocalizedLinks) ? "current" : "") : ""
                } ${item.href?.split("/")[1] == pathname.split("/")[1]
                  ? "current"
                  : ""
                }`}
            >
              {item.title ? (
                <>
                  <a href="#">{item.title}</a>
                  <ul>
                    {item.LocalizedLinks.map((LocalizedLink, LocalizedLinkIndex) => (
                      <li
                        key={LocalizedLinkIndex}
                        className={
                          LocalizedLink.href.split("/")[1] == pathname.split("/")[1]
                            ? "current"
                            : ""
                        }
                      >
                        <LocalizedLink href={LocalizedLink.href}>{LocalizedLink.text}</LocalizedLink>
                      </li>
                    ))}
                  </ul>
                  <div className="dropdown2-btn" />
                </>
              ) : (
                <LocalizedLink href={item.href}>{item.text}</LocalizedLink>
              )}
            </li>
          ))}
        </ul>
      </li> */}
     
      
      <li className={pathname === "/blog-grid" ? "current" : ""}>
        <LocalizedLink href="/blog-grid">Blogs</LocalizedLink>
      </li>
      <li className={pathname === "/about-us" ? "current" : ""}>
        <LocalizedLink href="/about-us">About Us</LocalizedLink>
      </li>
      <li className={"contact" == pathname.split("/")[1] ? "current" : ""}>
        <LocalizedLink href={`/contact`}>Contact</LocalizedLink>
      </li>
    </>
  );
}



// Custom UI for each tab
function CarsTabUI({ data }) {
  return (
    <div className="tab-content">
      <h3>Cars Section</h3>
      {data.map((item, index) => (
        <div key={index}>
          <strong>{item.title}</strong>
          <ul>
            {item.LocalizedLinks.map((LocalizedLink, LocalizedLinkIndex) => (
              <li key={LocalizedLinkIndex}>
                <LocalizedLink href={LocalizedLink.href}>{LocalizedLink.text}</LocalizedLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function HomeTabUI({ data }) {
  return (
    <div className="tab-content">
      <h3>Home Section</h3>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            <LocalizedLink href={item.href}>{item.text}</LocalizedLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PagesTabUI({ data }) {
  return (
    <div className="tab-content">
      <h3>Pages Section</h3>
      {data.map((item, index) => (
        <div key={index}>
          {item.title ? (
            <>
              <strong>{item.title}</strong>
              <ul>
                {item.LocalizedLinks.map((LocalizedLink, LocalizedLinkIndex) => (
                  <li key={LocalizedLinkIndex}>
                    <LocalizedLink href={LocalizedLink.href}>{LocalizedLink.text}</LocalizedLink>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <LocalizedLink href={item.href}>{item.text}</LocalizedLink>
          )}
        </div>
      ))}
    </div>
  );
}

function BlogTabUI({ data }) {
  return (
    <div className="tab-content">
      <h3>Blog Section</h3>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            <LocalizedLink href={item.href}>{item.text}</LocalizedLink>
          </li>
        ))}
      </ul>
    </div>
  );
}