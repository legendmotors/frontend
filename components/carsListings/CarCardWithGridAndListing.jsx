"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LocalizedLink from "../translation/LocalizedLink";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { addToWishlist } from "@/store/wishlistSlice";

export default function CarCardWithGridAndListing({ car, isGrid }) {
    const [currency, setCurrency] = useState(Cookies.get("NEXT_CURRENCY") || "AED");
    const [exchangeRate, setExchangeRate] = useState(1);
    const dispatch = useDispatch();

    const handleAddToWishlist = () => {
      dispatch(addToWishlist(car)); // Dispatch the action to add the car to the wishlist
    };
    console.log(currency, "currency");


    // Find the body type specification
    const bodyTypeSpecification = car.SpecificationValues.find(
        (spec) => spec.Specification.key === "body_type"
    );
    const transmission = car.SpecificationValues.find(
        (spec) => spec.Specification.key === "transmission"
    );


    const engine = car.SpecificationValues.find(
        (spec) => spec.Specification.key === "body_type"
    );
    // Extract the body type name if it exists
    const bodyTypeName = bodyTypeSpecification?.name || "N/A";
    const transmissionName = transmission?.name || "N/A";

    const CarImages = car.CarImages.find(
        (img) => img.type === "exterior"
    );




    return (
        <div>
            <div className="box-car-list style-2 hv-one">
                <div className="image-group relative">
                    <div className="top flex-two">
                        <ul className="d-flex gap-8">
                            {car.featured && (
                                <li className="flag-tag success">Featured</li>
                            )}
                        </ul>
                        <div className="year flag-tag">{car.Year.year}</div>
                    </div>
                    <ul className="change-heart flex">
                        <li className="box-icon w-32">
                            <div onClick={handleAddToWishlist} className="icon">
                                <svg
                                    width={18}
                                    height={16}
                                    viewBox="0 0 18 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M16.5 4.875C16.5 2.80417 14.7508 1.125 12.5933 1.125C10.9808 1.125 9.59583 2.06333 9 3.4025C8.40417 2.06333 7.01917 1.125 5.40583 1.125C3.25 1.125 1.5 2.80417 1.5 4.875C1.5 10.8917 9 14.875 9 14.875C9 14.875 16.5 10.8917 16.5 4.875Z"
                                        stroke="CurrentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </li>
                    </ul>
                    <div className="img-style">
                        <Image
                            className="lazyload"
                            alt="image"
                            src={`http://localhost:4000/uploads/${CarImages.FileSystem.originalPath}`}
                            width={450}
                            height={338}
                        />
                    </div>
                </div>
                <div className="content">
                    <div className="inner1">
                        <div className="text-address">
                            <p className="text-color-3 font">{bodyTypeName}</p>
                        </div>
                        <h5 className="link-style-1">
                            <Link href={`/listing-detail-v1/${car.id}`}>
                                {car.Brand.name}{car.CarModel.nam} {car.Trim.name}
                            </Link>
                        </h5>
                        <div className="icon-box flex flex-wrap">
                            <div className="icons flex-three">
                                <i className="fa fa-cogs" />
                                <span>{car.engineSize} cc</span>
                            </div>
                            <div className="icons flex-three">
                                <i className="fa fa-gas-pump" />
                                <span>{transmissionName}</span>
                            </div>
                            <div className="icons flex-three">
                                <i className="fa fa-tachometer-alt" />
                                <span>{car.engineSize} cc</span>
                            </div>
                            <div className="icons flex-three">
                                <i className="fa fa-flag" />
                                <span>Oman Spec</span>
                            </div>
                        </div>
                        <div className="money fs-20 fw-5 lh-25 text-color-3">
                            {currency === "AED" ? <>{car.CarPrices[0].currency} {Math.floor(car.CarPrices[0].price)}</> : <>{car.CarPrices[1].currency} {Math.floor(car.CarPrices[1].price)}</>}
                        </div>
                        <LocalizedLink
                            href={`/listing-detail-v2/${car.id}`}
                            className="view-car"
                        >
                            View car
                            <i className="icon-autodeal-btn-right" />
                        </LocalizedLink>
                    </div>
                    <div className="inner2">
                        <div className="days-box d-flex justify-content-end">
                            <div className="d-flex justify-content-end">
                                <LocalizedLink
                                    href={`/listing-detail-v2/${car.id}`}
                                    className="view-car"
                                >
                                    View car
                                    <i className="icon-autodeal-btn-right" />
                                </LocalizedLink>
                            </div>
                            <p className="fs-12 lh-16">
                                View 20 variants matching your search criteria
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
