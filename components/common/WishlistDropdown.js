"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import WishlistService from "@/services/WishlistService";
import { setWishlist } from "@/store/wishlistSlice";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/utils/formatCurrency";
import { getCookie } from "@/utils/cookieFunction";

export default function WishlistDropdown() {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items || []);

  const fetchWishlistFromApi = async () => {
    const cookieData = getCookie("userData");
    if (!cookieData) {
      // If no userData, clear wishlist and do not fetch
      dispatch(setWishlist([]));
      return;
    }
    const userData = JSON.parse(cookieData);
    // Pass userId to the wishlist API call
    const response = await WishlistService.listWishlist({ userId: userData.id });
    // Assuming your API returns the wishlist array in response.data
    dispatch(setWishlist(response.data || []));
  };

  useEffect(() => {
    fetchWishlistFromApi();
  }, [dispatch]);

  // Listen for global "wishlistChange" events to re-fetch wishlist data
  useEffect(() => {
    const handleWishlistChange = () => {
      fetchWishlistFromApi();
    };
    window.addEventListener("wishlistChange", handleWishlistChange);
    return () => {
      window.removeEventListener("wishlistChange", handleWishlistChange);
    };
  }, [dispatch]);

  // Remove a wishlist item using the API
  const handleRemove = async (e, carId) => {
    e.stopPropagation();
    try {
      const cookieData = getCookie("userData");
      const userData = cookieData ? JSON.parse(cookieData) : null;
      if (!userData || !userData.id) {
        console.error("User not authenticated");
        return;
      }
      await WishlistService.removeFromWishlist({ userId: userData.id, carId });
      window.dispatchEvent(new Event("wishlistChange"));
    } catch (error) {
      console.error("Error removing wishlist item:", error);
    }
  };

  return (
    <div className="dropdown">
      {/* Dropdown Toggle */}
      <button
        className="btn btn-light dropdown-toggle"
        type="button"
        id="wishlistDropdownButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i className="icon-autodeal-favorite fs-18" />
        {wishlist.length > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-3 text-white"
            style={{ fontSize: "0.7rem" }}
          >
            {wishlist.length}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      <ul
        className="dropdown-menu p-0"
        aria-labelledby="wishlistDropdownButton"
        style={{ width: "300px" }}
      >
        <li className="m-0">Wishlist</li>
        {wishlist.length === 0 ? (
          <li className="dropdown-item text-muted">No items in wishlist</li>
        ) : (
          wishlist.map((item) => {
            // Each wishlist item contains a nested "car" object.
            const car = item.car;
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
            const imagePath = exteriorImage
              ? `${process.env.NEXT_PUBLIC_FILE_PREVIEW_URL}${exteriorImage}`
              : firstImage
              ? `${process.env.NEXT_PUBLIC_FILE_PREVIEW_URL}${firstImage}`
              : "/assets/car-placeholder.webp";

            const displayPrice = car.CarPrices?.find(
              (price) => price.currency === "AED"
            );
            const carTitle =
              car.additionalInfo ||
              `${car.Brand?.name || ""} - ${car.CarModel?.name || ""}`;

            return (
              <li
                className="dropdown-item d-flex align-items-center"
                key={item.id}
              >
                <Link
                  href={`/cars/new-cars/${car.Brand?.slug}/${car.CarModel?.slug}/${car.Year?.year}/${car.slug}`}
                  className="d-flex align-items-center text-decoration-none"
                >
                  <Image
                    src={imagePath}
                    alt={carTitle}
                    width={50}
                    height={50}
                    className="me-2 rounded"
                    style={{ objectFit: "cover" }}
                  />
                  <div>
                    <div
                      className="fw-bold text-truncate"
                      style={{ maxWidth: "180px" }}
                    >
                      {carTitle}
                    </div>
                    {displayPrice && (
                      <div className="text-muted small">
                        {displayPrice.currency}{" "}
                        {formatCurrency(
                          displayPrice.price,
                          displayPrice.currency
                        )}
                      </div>
                    )}
                  </div>
                </Link>
                <button
                  className="btn btn-sm btn-link ms-auto text-danger"
                  onClick={(e) => handleRemove(e, car.id)}
                  title="Remove"
                >
                  <i className="fa fa-times"></i>
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
