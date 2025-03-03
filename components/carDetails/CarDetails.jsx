"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CarDetails1 from "@/components/carDetails/CarDetails1";
import CarService from "@/services/CarService";

export default function CarDetails({ carslug }) {
  const [carResponse, setCarResponse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await CarService.getCarByIdOrSlug(carslug);
        if (response && response.success && response.data) {
          setCarResponse(response.data);
        }
      } catch (error) {
        console.error("Error fetching car:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCar();
  }, [carslug]);

  console.log(carResponse, "carResponse");

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <CarDetails1 carResponse={carResponse} />
    </div>
  );
}
