"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { addToWishlist } from "@/store/wishlistSlice";
import { getCookie } from "@/utils/cookieFunction";
import { formatCurrency } from "@/utils/formatCurrency";
import WishlistService from "@/services/WishlistService";

export default function CarCardWithGridAndListing({ car, imagePath }) {
    const [currency] = useState(Cookies.get("NEXT_CURRENCY") || "AED");
    const dispatch = useDispatch();
    const token = getCookie("token");

    // Retrieve user data from cookie
    const cookieData = getCookie("userData");
    const userData = cookieData ? JSON.parse(cookieData) : null;

    const handleAddToWishlist = async () => {
        if (!userData || !userData.id) {
          console.error("User not authenticated");
          return;
        }
        try {
          const response = await WishlistService.addToWishlist({
            userId: userData.id,
            carId: car.id,
          });
          console.log("Wishlist add response:", response.data);
          // Update the Redux state on success
          dispatch(addToWishlist(car));
          // Dispatch a global event to notify that the wishlist has changed
          window.dispatchEvent(new Event("wishlistChange"));
        } catch (error) {
          console.error("Error adding wishlist item:", error);
        }
      };
    // Compute the image path using your provided snippet
    const exteriorCarImage = car.CarImages
        ?.filter((img) => img.type === "exterior")
        .sort((a, b) => a.order - b.order)[0];
    const exteriorImage =
        exteriorCarImage?.FileSystem?.thumbnailPath ||
        exteriorCarImage?.FileSystem?.path;
    const firstCarImage = car.CarImages?.[0];
    const firstImage =
        firstCarImage?.FileSystem?.thumbnailPath ||
        firstCarImage?.FileSystem?.path;
    const computedImagePath = exteriorImage
        ? `${process.env.NEXT_PUBLIC_FILE_PREVIEW_URL}${exteriorImage}`
        : firstImage
            ? `${process.env.NEXT_PUBLIC_FILE_PREVIEW_URL}${firstImage}`
            : "/assets/car-placeholder.webp";

    // Find specifications for display
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

    const bodyTypeName = bodyTypeSpecification?.name || "N/A";
    const fuelTypeName = fuelTypeSpecification?.name || "N/A";
    const transmissionName = transmission?.name || "N/A";
    const regionalSpecificationName = regionalSpecification?.name || "N/A";
    const steeringSideSpecificationName = steeringSideSpecification?.name || "N/A";
    const displayPrice = car?.CarPrices?.find((item) => item.currency === currency);
    const carName = `${car.Brand.name} - ${car.CarModel.name}`;

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
                    </div>
                    <div className="img-style">
                        <Image
                            className="lazyload"
                            alt="image"
                            src={computedImagePath}
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
                            <Link
                                href={`/cars/new-cars/${car.Brand.slug}/${car.CarModel.slug}/${car.Year.year}/${car.slug}`}
                            >
                                {car.additionalInfo ? (
                                    <>{car.additionalInfo}</>
                                ) : (
                                    <>
                                        {car.Year.year} {car.Brand.name} {car.CarModel.name} {car?.Trim?.name}
                                    </>
                                )}
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
                            {token ? (
                                <>
                                    {displayPrice?.currency}{" "}
                                    {formatCurrency(displayPrice?.price, displayPrice?.currency)}
                                </>
                            ) : (
                                <small className="fs-6 text-black">
                                    <a
                                        className="text-color-3"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#popup_bid"
                                    >
                                        Log in
                                    </a>{" "}
                                    or{" "}
                                    <a
                                        className="text-color-3"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#popup_bid2"
                                    >
                                        Register
                                    </a>{" "}
                                    to see the price
                                </small>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Link
                                href={`/cars/new-cars/${car.Brand.slug}/${car.CarModel.slug}/${car.Year.year}/${car.slug}`}
                                className="view-car px-3"
                            >
                                View car
                                <i className="icon-autodeal-btn-right" />
                            </Link>
                            {/* Wishlist Button using provided markup */}
                            <button
                                onClick={handleAddToWishlist}
                                className="btn btn-outline border fs-12 lh-16"
                            >
                                <i className="far fa-heart me-1"></i> Wishlist
                            </button>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
