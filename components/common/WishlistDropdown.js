"use client";

import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "@/store/wishlistSlice";
import Link from "next/link";

export default function WishlistDropdown() {
  const wishlist = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id));
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
        {wishlist.length === 0 ? (
          <li className="dropdown-item text-muted">No items in wishlist</li>
        ) : (
          wishlist.map((car) => (
            <li
              className="dropdown-item d-flex justify-content-between align-items-center"
              key={car.id}
            >
              <Link href={`/car/${car.id}`} className="text-decoration-none">
                {car.Brand.name} - {car.CarModel.name}
              </Link>
              <button
                className="btn btn-sm btn-danger ms-2"
                onClick={() => handleRemove(car.id)}
              >
                Remove
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
