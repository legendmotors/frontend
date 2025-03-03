import Cars2 from "@/components/carsListings/Cars2";
import Cars3 from "@/components/carsListings/Cars3";
import CarListingBanner from "@/components/carsListings/CarListingBanner";
import CarInventoryListing from "@/components/carsListings/CarInventoryListing";
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import React from "react";

export const metadata = {
  title:
    "",
  description: "",
};
export default function page() {
  return (
    <>
      <CarListingBanner />
      <CarInventoryListing />
      
    </>
  );
}
