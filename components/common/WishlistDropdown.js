"use client";

import { useEffect } from "react";
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

  // Function to fetch wishlist items from the API and update Redux
  const fetchWishlistFromApi = async () => {
    try {
      const response = await WishlistService.listWishlist();
      dispatch(setWishlist(response.data || []));
    } catch (error) {
      console.error("Error fetching wishlist from API:", error);
    }
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
  // Pass both userId and carId (using car.id) as expected by your controller/service
  const handleRemove = async (e, carId) => {
    // Prevent the click from closing the dropdown
    e.stopPropagation();
    try {
      const cookieData = getCookie("userData");
      const userData = cookieData ? JSON.parse(cookieData) : null;
      if (!userData || !userData.id) {
        console.error("User not authenticated");
        return;
      }
      await WishlistService.removeFromWishlist({ userId: userData.id, carId });
      // After removal, trigger the global event to refresh the wishlist
      window.dispatchEvent(new Event("wishlistChange"));
    } catch (error) {
      console.error("Error removing wishlist item:", error);
    }
  };

  return (
    <div className="dropdown">
      {/* Dropdown Toggle */}
      <button
        className="btn btn-light header-favorite flex items-center justify-center dropdown-toggle position-relative"
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
        <li className="dropdown-header">Wishlist</li>
        {wishlist.length === 0 ? (
          <li className="dropdown-item text-muted">No items in wishlist</li>
        ) : (
          wishlist.map((item) => {
            // Each wishlist item contains a nested "car" object.
            const car = item.car;

            // Compute image path using your provided snippet
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

            // Compute display price (default AED)
            const displayPrice = car.CarPrices?.find(
              (price) => price.currency === "AED"
            );
            // Use additionalInfo if available, otherwise fallback to composed name
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
                {/* Removal button with Font Awesome cross icon */}
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
