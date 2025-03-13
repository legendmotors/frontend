"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import WishlistService from "@/services/WishlistService";
import { formatCurrency } from "@/utils/formatCurrency";
import { getCookie } from "@/utils/cookieFunction";

export default function WishlistDropdown() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch wishlist items from the API
  const fetchWishlistFromApi = async () => {
    setLoading(true);
    try {
      const response = await WishlistService.listWishlist();
      // Assuming your API returns the wishlist array in response.data
      setWishlist(response.data || []);
    } catch (error) {
      console.error("Error fetching wishlist from API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistFromApi();
  }, []);

  // Function to remove an item from the wishlist via API
  const handleRemove = async (carId) => {
    try {
      // Get user data from cookie
      const cookieData = getCookie("userData");
      const userData = cookieData ? JSON.parse(cookieData) : null;
      if (!userData || !userData.id) {
        console.error("User not authenticated");
        return;
      }
      // Pass both userId and carId to the API call
      await WishlistService.removeFromWishlist({ userId: userData.id, carId });
      // Refresh the wishlist after removal
      fetchWishlistFromApi();
    } catch (error) {
      console.error("Error removing wishlist item:", error);
    }
  };

  return (
    <div className="dropdown">
      {/* Icon as Dropdown Toggle */}
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
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary text-white"
            style={{ fontSize: "0.7rem" }}
          >
            {wishlist.length}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      <ul
        className="dropdown-menu dropdown-menu-end"
        aria-labelledby="wishlistDropdownButton"
        style={{ width: "300px" }}
      >
        <li className="dropdown-header">Wishlist</li>
        {loading ? (
          <li className="dropdown-item text-muted">Loading...</li>
        ) : wishlist.length === 0 ? (
          <li className="dropdown-item text-muted">No items in wishlist</li>
        ) : (
          wishlist.map((item) => {
            // In your API response, the wishlist item contains a nested "car" object.
            const car = item.car;

            // Compute image path using the provided snippet
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
            // Compose car name using brand and model
            const carName = `${car.Brand?.name || ""} - ${car.CarModel?.name || ""}`;

            return (
              <li
                className="dropdown-item d-flex align-items-center"
                key={item.id}
              >
                <Link
                  href={`/car/${car.id}`}
                  className="d-flex align-items-center text-decoration-none"
                >
                  <Image
                    src={imagePath}
                    alt={carName}
                    width={50}
                    height={50}
                    className="me-2 rounded"
                    style={{ objectFit: "cover" }}
                  />
                  <div>
                    <div className="fw-bold">{carName}</div>
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
                {/* Font Awesome cross icon for removal */}
                <button
                  className="btn btn-sm btn-link ms-auto text-danger"
                  onClick={() => handleRemove(car.id)}
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
