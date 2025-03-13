"use client";

import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "@/store/wishlistSlice";
import { getCookie } from "@/utils/cookieFunction";
import WishlistService from "@/services/WishlistService";

export default function WishlistButton({ car }) {
  const dispatch = useDispatch();
  // Get the current wishlist from Redux to check if this car is already added.
  const wishlist = useSelector((state) => state.wishlist.items || []);
  const isWishlisted = wishlist.some((item) => item.car.id === car.id);

  const cookieData = getCookie("userData");
  const userData = cookieData ? JSON.parse(cookieData) : null;

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    if (!userData || !userData.id) {
      // If not logged in, open the login modal.
      const modalElement = document.getElementById("popup_bid");
      if (modalElement && typeof bootstrap !== "undefined") {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      } else {
        window.location.href = "/login";
      }
      return;
    }
    try {
      if (isWishlisted) {
        // Remove from wishlist:
        await WishlistService.removeFromWishlist({ userId: userData.id, carId: car.id });
        dispatch(removeFromWishlist(car.id));
      } else {
        // Add to wishlist:
        await WishlistService.addToWishlist({ userId: userData.id, carId: car.id });
        dispatch(addToWishlist(car));
      }
      // Trigger a global event so that other components (like the dropdown) refresh their data.
      window.dispatchEvent(new Event("wishlistChange"));
    } catch (error) {
      console.error("Error toggling wishlist item:", error);
    }
  };

  // Use a filled heart if the car is wishlisted, otherwise an outline.
  const heartIconClass = isWishlisted ? "fas fa-heart me-1" : "far fa-heart me-1";

  // If guest user, render an anchor that opens the login modal.
  if (!userData || !userData.id) {
    return (
      <a
        href="#"
        data-bs-toggle="modal"
        data-bs-target="#popup_bid"
        className="btn btn-outline border fs-12 lh-16"
        onClick={(e) => e.stopPropagation()}
      >
        <i className="far fa-heart me-1"></i> Wishlist
      </a>
    );
  }

  return (
    <button
      onClick={handleToggleWishlist}
      className="btn btn-outline border fs-12 lh-16"
    >
      <i className={heartIconClass}></i> Wishlist
    </button>
  );
}
