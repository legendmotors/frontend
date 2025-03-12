// app/cars/[carslug]/page.jsx
import CarService from "@/services/CarService";
import CarDetails from "@/components/carDetails/CarDetails";
import React from "react";

export const metadata = {
  title: "Car Details",
  description: "Detailed view of the selected car",
};

export default async function Page({ params }) {
  const { carslug } = params;
  // Fetch the car details on the server side
  const carResponse = await CarService.getCarByIdOrSlug(carslug);


  console.log(carResponse,"carResponsecarResponse");
  
  return (
    <>
      {/* Pass the fetched data to the client component */}
      <CarDetails carResponse={carResponse.data} />
    </>
  );
}
