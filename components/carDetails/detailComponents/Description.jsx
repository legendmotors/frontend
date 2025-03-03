import React from "react";

export default function Description({ carResponse }) {
  return (
    <>
      {" "}
      <div className="tfcl-listing-info mt-30">
        <div dangerouslySetInnerHTML={{ __html: carResponse?.description || "" }} />
      </div>

    </>
  );
}
