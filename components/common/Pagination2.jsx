"use client";
import React from "react";

export default function Pagination2({
  totalItems,
  itemPerPage,
  currentPage,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalItems / itemPerPage);

  const handlePageClick = (page) => {
    if (page > 0 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <>
      <li onClick={() => handlePageClick(currentPage - 1)}>
        <a className="page-numbers style">
          <i className="far fa-angle-left" />
        </a>
      </li>
      {[...Array(totalPages)].slice(0, 4).map((_, index) => {
        const page = index + 1;
        return (
          <li key={page}>
            <a
              className={`page-numbers ${currentPage === page ? "current" : ""}`}
              onClick={() => handlePageClick(page)}
            >
              {page}
            </a>
          </li>
        );
      })}
      {currentPage >= 5 && (
        <li>
          <a className="page-numbers current">{currentPage}</a>
        </li>
      )}
      {totalPages >= 5 && currentPage !== totalPages && (
        <li className="dot-pagination">
          <a className="page-numbers dot">...</a>
        </li>
      )}
      <li onClick={() => handlePageClick(currentPage + 1)}>
        <a className="page-numbers style">
          <i className="far fa-angle-right" />
        </a>
      </li>
    </>
  );
}
