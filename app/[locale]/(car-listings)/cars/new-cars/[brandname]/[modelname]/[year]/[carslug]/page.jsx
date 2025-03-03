
import CarService from "@/services/CarService";
import CarDetails from "@/components/carDetails/CarDetails";
import React from "react";
export const metadata = {
    title:
        "",
    description: "",
};
export default async function page({ params }) {
    const { carslug } = params;
    return (
        <>
            {/* {carData?.Brand?.name} */}
            <CarDetails carslug={params.carslug}/>
        </>
    );
}
