"use client";
import React, { useState } from "react";
import { blogPages, homepages, listingPages, otherPages } from "@/data/menu";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";


// Example data for each tab
const popularBrands = [
  { name: "", image: "/assets/images/brands/BENZ.png", Link: "/brands/toyota" },
  { name: "", image: "/assets/images/brands/BMW.png", Link: "/brands/toyota" },
  { name: "", image: "/assets/images/brands/BYD.png", Link: "/brands/toyota" },
  { name: "", image: "/assets/images/brands/Changan.png", Link: "/brands/toyota" },
  { name: "", image: "/assets/images/brands/CHERY.png", Link: "/brands/toyota" },
  { name: " ", image: "/assets/images/brands/GAC.png", Link: "/brands/toyota" },
];

const popularModels = [
  { name: "2018 BMV X1 xDrive 20d xline", image: "assets/images/car-list/car1.jpg", Link: "/models/camry" },
  { name: "2018 BMV X1 xDrive 20d xline", image: "assets/images/car-list/car1.jpg", Link: "/models/camry" },
  { name: "2018 BMV X1 xDrive 20d xline", image: "assets/images/car-list/car1.jpg", Link: "/models/camry" },
  { name: "2018 BMV X1 xDrive 20d xline", image: "assets/images/car-list/car1.jpg", Link: "/models/camry" },
  { name: "2018 BMV X1 xDrive 20d xline", image: "assets/images/car-list/car1.jpg", Link: "/models/camry" },
];

const newModels = [
  { name: "2018 BMV X1 xDrive 20d xline", image: "assets/images/car-list/car1.jpg", Link: "/models/camry" },
  { name: "2018 BMV X1 xDrive 20d xline", image: "assets/images/car-list/car1.jpg", Link: "/models/camry" },
  { name: "2018 BMV X1 xDrive 20d xline", image: "assets/images/car-list/car1.jpg", Link: "/models/camry" },
  { name: "2018 BMV X1 xDrive 20d xline", image: "assets/images/car-list/car1.jpg", Link: "/models/camry" },
  { name: "2018 BMV X1 xDrive 20d xline", image: "assets/images/car-list/car1.jpg", Link: "/models/camry" },
  { name: "2018 BMV X1 xDrive 20d xline", image: "assets/images/car-list/car1.jpg", Link: "/models/camry" },
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
      if (elm.Links) {
        elm.Links.forEach((elm2) => {
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
              <Link className="p-2" href={page.href}>{page.text}</Link>
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
                {item.Links.map((Link, LinkIndex) => (
                  <li
                    key={LinkIndex}
                    className={`${Link.className || ""} ${Link.href.split("/")[1] == pathname.split("/")[1]
                        ? "current"
                        : ""
                      }`}
                  >
                    <Link className="p-2" href={Link.href}>{Link.text}</Link>
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
              <Link className="p-2" href={item.href}>{item.text}</Link>
            </li>
          ))}
        </ul>
      </li> */}



      <li className={pathname === "/" ? "current" : ""}>
        <Link className="p-2" href="/" >Home</Link>
      </li>


      {/* New Cars Dropdown */}
      {/* Dropdown Menu */}
      <li className={pathname === "/cars/new-cars" ? "current" : ""}>
        <Link className="p-2" href="/cars/new-cars">Explore Cars</Link>
      </li>
      {/* <li className="tfcl-mega-menu dropdown2">
        <Link className="p-2" href="/cars/new-cars">Explore Cars</Link>
        <ul className="dropdown-menu">
          <li className="dropdown-wrapper d-flex">
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

            <div className="dropdown-content tab-transition">
              <div className="megamenu-grid">
                {tabs
                  .find((tab) => tab.id === activeTab)
                  .data.map((item, index) => (
                    <div key={index} className="megamenu">
                      <Image
                        className={`lazyload ${activeTab === "popularBrands" || activeTab === "popularBodyTypes"
                          ? "object-fit-contain p-3"
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
              <Link href={`/${activeTab}`} className="see-all-link p-2">
                See all {tabs.find((tab) => tab.id === activeTab).label} →
              </Link>
            </div>
          </li>
        </ul>
      </li> */}


      {/* <li className={`dropdown2  ${isActive(otherPages) ? "current" : ""} `}>
        <a href="#">Page</a>
        <ul>
          {otherPages.map((item, index) => (
            <li
              key={index}
              className={`${item.className || ""}  ${item.Links ? (isActive(item.Links) ? "current" : "") : ""
                } ${item.href?.split("/")[1] == pathname.split("/")[1]
                  ? "current"
                  : ""
                }`}
            >
              {item.title ? (
                <>
                  <a href="#">{item.title}</a>
                  <ul>
                    {item.Links.map((Link, LinkIndex) => (
                      <li
                        key={LinkIndex}
                        className={
                          Link.href.split("/")[1] == pathname.split("/")[1]
                            ? "current"
                            : ""
                        }
                      >
                        <Link className="p-2" href={Link.href}>{Link.text}</Link>
                      </li>
                    ))}
                  </ul>
                  <div className="dropdown2-btn" />
                </>
              ) : (
                <Link className="p-2" href={item.href}>{item.text}</Link>
              )}
            </li>
          ))}
        </ul>
      </li> */}


      <li className={pathname === "/blog" ? "current" : ""}>
        <Link className="p-2" href="/blog">Blogs</Link>
      </li>
      <li className={pathname === "/about-us" ? "current" : ""}>
        <Link className="p-2" href="/about-us">About Us</Link>
      </li>
      <li className={"contact" == pathname.split("/")[1] ? "current" : ""}>
        <Link className="p-2" href={`/contact`}>Contact</Link>
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
            {item.Links.map((Link, LinkIndex) => (
              <li key={LinkIndex}>
                <Link className="p-2" href={Link.href}>{Link.text}</Link>
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
            <Link className="p-2" href={item.href}>{item.text}</Link>
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
                {item.Links.map((Link, LinkIndex) => (
                  <li key={LinkIndex}>
                    <Link className="p-2" href={Link.href}>{Link.text}</Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <Link className="p-2" href={item.href}>{item.text}</Link>
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
            <Link className="p-2" href={item.href}>{item.text}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}