"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { addToWishlist } from "@/store/wishlistSlice";
import { getCookie } from "@/utils/cookieFunction";

export default function CarCardWithGridAndListing({ car, imagePath }) {
    const [currency, setCurrency] = useState(Cookies.get("NEXT_CURRENCY") || "AED");
    const [exchangeRate, setExchangeRate] = useState(1);
    const dispatch = useDispatch();

    const token = getCookie('token');


    const handleAddToWishlist = () => {
        dispatch(addToWishlist(car)); // Dispatch the action to add the car to the wishlist
    };
    console.log(currency, "currency");


    // Find the body type specification
    const bodyTypeSpecification = car.SpecificationValues.find(
        (spec) => spec.Specification.key === "body_type"
    );

    const fuelTypeSpecification = car.SpecificationValues.find(
        (spec) => spec.Specification.key === "fuel_type"
    );

    const regionalSpecification = car.SpecificationValues.find(
        (spec) => spec.Specification.key === "regional_specification"
    );

    const steeringSideSpecification = car.SpecificationValues.find(
        (spec) => spec.Specification.key === "steering_side"
    );

    const transmission = car.SpecificationValues.find(
        (spec) => spec.Specification.key === "transmission"
    );



    const engine = car.SpecificationValues.find(
        (spec) => spec.Specification.key === "body_type"
    );
    // Extract the body type name if it exists
    const bodyTypeName = bodyTypeSpecification?.name || "N/A";

    const fuelTypeName = fuelTypeSpecification?.name || "N/A"
    const transmissionName = transmission?.name || "N/A";
    const regionalSpecificationName = regionalSpecification?.name || "N/A";
    const steeringSideSpecificationName = steeringSideSpecification?.name || "N/A";
    const displayPrice = car?.CarPrices?.find(item => item.currency === currency);

    console.log(displayPrice, "displayPrice");

    return (
        <div>
            <div className="box-car-list style-2 hv-one mb-3">
                <div className="image-group relative">
                    <div className="top flex-two">
                        <ul className="d-flex gap-8">
                            {car.featured && (
                                <li className="flag-tag success">Featured</li>
                            )}
                        </ul>
                        {/* <div className="year flag-tag">{car.Year.year}</div> */}
                    </div>
                    {/* <ul className="change-heart flex">
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
                    </ul> */}
                    <div className="img-style">
                        <Image
                            className="lazyload "
                            alt="image"
                            src={imagePath}
                            width={450}
                            height={338}
                        />
                    </div>
                </div>
                <div className="content">
                    <div className="inner1">
                        <div className="text-address">
                            <div className="icons flex-three">
                                <i className="text-color-3 fa fa-car-side me-2" />
                                <span className="text-color-3">{bodyTypeName}</span>
                            </div>
                        </div>
                        <h5 className="link-style-1">
                            <Link href={`/cars/new-cars/${car.Brand.slug}/${car.CarModel.slug}/${car.Year.year}/${car.slug}`}>
                                {car.Year.year} {car.Brand.name} {car.CarModel.name} {car.Trim.name}
                            </Link>
                        </h5>
                        <div className="icon-box flex flex-wrap my-2">
                            <div className="icons flex-three">
                                <i className="fa fa-cogs" />
                                <span>{car.engineSize} ltr</span>
                            </div>
                            <div className="icons flex-three">
                                <i className="fa fa-gas-pump" />
                                <span>{fuelTypeName}</span>
                            </div>
                            <div className="icons flex-three">
                                <i className="fa fa-exchange-alt" />
                                <span>{transmissionName}</span>
                            </div>

                            <div className="icons flex-three">
                                <i className="fa fa-flag" />
                                <span>{regionalSpecificationName}</span>
                            </div>
                            <div className="icons flex-three">
                                <i className="fa fa-steering-wheel" />
                                <span>{steeringSideSpecificationName}</span>
                            </div>

                        </div>
                        <div className="money fs-20 text-color-3 mb-2 mt-2">
                            {token ? <>{displayPrice?.currency} {displayPrice?.price}</> : <small className="fs-6 text-black">
                                <a className="text-color-3" href="#"
                                    data-bs-toggle="modal"
                                    data-bs-target="#popup_bid">Log in</a> or <a className="text-color-3" href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#popup_bid2">Register</a> to see the price</small>}
                        </div>
                        <div className="flex gap-2">
                            <Link
                                href={`/cars/new-cars/${car.Brand.slug}/${car.CarModel.slug}/${car.Year.year}/${car.slug}`}
                                className="view-car px-3"
                            >
                                View car
                                <i className="icon-autodeal-btn-right" />
                            </Link>
                            {/* <button
                                href={`/listing-detail-v2/${car.id}`}
                                className="view-car px-3"
                            >
                                Get Offer
                            </button> */}
                        </div>

                    </div>
                    <div className="inner2 ps-0 h-full">
                        <div className="days-box d-flex justify-content-center align-items-center h-100">
                            <div className="d-flex justify-content-end">
                                <Link
                                    href={`/cars/new-cars/${car.Brand.slug}/${car.CarModel.slug}/${car.Year.year}/${car.slug}`}
                                    className="view-car"
                                >
                                    View car
                                    <i className="icon-autodeal-btn-right" />
                                </Link>
                                {/* <button
                                    href={`/listing-detail-v2/${car.id}`}
                                    className="view-car"
                                >
                                    View car
                                    <i className="icon-autodeal-btn-right" />
                                </button> */}
                            </div>

                            <button className="btn btn-outline border fs-12 lh-16">
                                <i className="far fa-heart me-1"></i>   Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
