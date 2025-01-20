"use client";
import React, { useEffect, useReducer } from "react";
import Link from "next/link";
import Image from "next/image";
import { allCars, cars } from "@/data/cars";
import FlatFilter3 from "../common/FlatFilter3";
import { initialState, reducer } from "@/reducer/carFilterReducer";
import Pagination from "../common/Pagination";
import CarCard from "./CarCard";
export default function Cars2() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    price,
    km,
    year,
    body,
    make,
    model,
    fuel,
    transmission,
    location,
    door,
    cylinder,
    color,

    features,
    filtered,
    sortingOption,
    sorted,
    currentPage,
  } = state;

  const allProps = {
    ...state,
    setPrice: (value) => dispatch({ type: "SET_PRICE", payload: value }),
    setYear: (value) => dispatch({ type: "SET_YEAR", payload: value }),
    setModel: (value) => dispatch({ type: "SET_MODEL", payload: value }),
    setKM: (value) => dispatch({ type: "SET_KM", payload: value }),
    setBody: (value) => dispatch({ type: "SET_BODY", payload: value }),
    setMake: (value) => dispatch({ type: "SET_MAKE", payload: value }),
    setFuel: (value) => dispatch({ type: "SET_FUEL", payload: value }),
    setTransmission: (value) =>
      dispatch({ type: "SET_TRANSMISSION", payload: value }),
    setLocation: (value) => dispatch({ type: "SET_LOCATION", payload: value }),
    setDoor: (value) => dispatch({ type: "SET_DOOR", payload: value }),
    setCylinder: (value) => dispatch({ type: "SET_CYLINDER", payload: value }),
    setColor: (value) => dispatch({ type: "SET_COLOR", payload: value }),

    setFeatures: (newFeature) => {
      const updated = [...features].includes(newFeature)
        ? [...features].filter((elm) => elm != newFeature)
        : [...features, newFeature];
      dispatch({ type: "SET_FEATURES", payload: updated });
    },
    setSortingOption: (value) =>
      dispatch({ type: "SET_SORTING_OPTION", payload: value }),
    setCurrentPage: (value) =>
      dispatch({ type: "SET_CURRENT_PAGE", payload: value }),
    setItemPerPage: (value) => {
      dispatch({ type: "SET_CURRENT_PAGE", payload: 1 }),
        dispatch({ type: "SET_ITEM_PER_PAGE", payload: value });
    },
  };

  const clearFilter = () => {
    dispatch({ type: "CLEAR_FILTER" });
  };

  useEffect(() => {
    let filteredArrays = [];

    if (features.length) {
      const filteredByFeatures = [...allCars].filter((elm) =>
        features.every((el) => elm.features.includes(el))
      );
      filteredArrays = [...filteredArrays, filteredByFeatures];
    }
    if (body !== "Any Body") {
      const filteredBybody = [...allCars].filter((elm) => body === elm.body);
      filteredArrays = [...filteredArrays, filteredBybody];
    }
    if (make !== "Any Make") {
      const filteredBymake = [...allCars].filter((elm) => make === elm.make);
      filteredArrays = [...filteredArrays, filteredBymake];
    }
    if (model !== "Any Model") {
      const filteredBymodel = [...allCars].filter((elm) => model === elm.model);
      filteredArrays = [...filteredArrays, filteredBymodel];
    }
    if (fuel !== "Any Fuel") {
      const filteredByfuel = [...allCars].filter(
        (elm) => fuel === elm.fuelType
      );
      filteredArrays = [...filteredArrays, filteredByfuel];
    }
    if (transmission !== "Any Transmission") {
      const filteredByTransmission = [...allCars].filter(
        (elm) => transmission === elm.transmission
      );
      filteredArrays = [...filteredArrays, filteredByTransmission];
    }
    if (location !== "Any Location") {
      const filteredBylocation = [...allCars].filter(
        (elm) => location === elm.location
      );
      filteredArrays = [...filteredArrays, filteredBylocation];
    }
    if (door !== "Any Door") {
      const filteredBydoor = [...allCars].filter(
        (elm) => parseInt(door.match(/\d+/)[0], 10) === elm.door
      );
      filteredArrays = [...filteredArrays, filteredBydoor];
    }
    if (cylinder !== "Any Cylinder") {
      const filteredBycylinder = [...allCars].filter(
        (elm) => parseInt(cylinder.match(/\d+/)[0], 10) === elm.cylinder
      );
      filteredArrays = [...filteredArrays, filteredBycylinder];
    }
    if (color !== "Any Color") {
      const filteredBycolor = [...allCars].filter((elm) => color === elm.color);
      filteredArrays = [...filteredArrays, filteredBycolor];
    }

    const filteredByPrice = [...allCars].filter(
      (elm) => elm.price >= price[0] && elm.price <= price[1]
    );
    filteredArrays = [...filteredArrays, filteredByPrice];
    const filteredBykm = [...allCars].filter(
      (elm) => elm.km >= km[0] && elm.km <= km[1]
    );
    filteredArrays = [...filteredArrays, filteredBykm];
    const filteredByyear = [...allCars].filter(
      (elm) => elm.year >= year[0] && elm.year <= year[1]
    );
    filteredArrays = [...filteredArrays, filteredByyear];

    const commonItems = [...allCars].filter((item) =>
      filteredArrays.every((array) => array.includes(item))
    );
    dispatch({ type: "SET_FILTERED", payload: commonItems });
  }, [
    price,
    km,
    year,
    body,
    make,
    model,
    fuel,
    transmission,
    location,
    door,
    cylinder,
    color,

    features,
  ]);

  useEffect(() => {
    if (sortingOption === "Price Ascending") {
      dispatch({
        type: "SET_SORTED",
        payload: [...filtered].sort((a, b) => a.price - b.price),
      });
    } else if (sortingOption === "Price Descending") {
      dispatch({
        type: "SET_SORTED",
        payload: [...filtered].sort((a, b) => b.price - a.price),
      });
    } else {
      dispatch({ type: "SET_SORTED", payload: filtered });
    }
    dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
  }, [filtered, sortingOption]);

  useEffect(() => {
    let filteredCars = [...allCars];
  
    // Apply filters in sequence to restrict available options
    if (make !== "Any Make") {
      filteredCars = filteredCars.filter((car) => car.make === make);
    }
  
    if (model !== "Any Model") {
      filteredCars = filteredCars.filter((car) => car.model === model);
    }
  
    if (body !== "Any Body") {
      filteredCars = filteredCars.filter((car) => car.body === body);
    }
  
    if (fuel !== "Any Fuel") {
      filteredCars = filteredCars.filter((car) => car.fuelType === fuel);
    }
  
    if (transmission !== "Any Transmission") {
      filteredCars = filteredCars.filter((car) => car.transmission === transmission);
    }
  
    // Update available filter options dynamically
    const updatedMakes = [...new Set(filteredCars.map((car) => car.make))];
    const updatedModels = [...new Set(filteredCars.map((car) => car.model))];
    const updatedBodies = [...new Set(filteredCars.map((car) => car.body))];
    const updatedFuels = [...new Set(filteredCars.map((car) => car.fuelType))];
  
    dispatch({ type: "SET_FILTERED", payload: filteredCars });
    dispatch({ type: "SET_AVAILABLE_MAKES", payload: updatedMakes });
    dispatch({ type: "SET_AVAILABLE_MODELS", payload: updatedModels });
    dispatch({ type: "SET_AVAILABLE_BODIES", payload: updatedBodies });
    dispatch({ type: "SET_AVAILABLE_FUELS", payload: updatedFuels });
  }, [make, model, body, fuel, transmission]);
  return (
    <>
      <div className="flat-filter-search mt--3">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="flat-tabs">
                <FlatFilter3 clearFilter={clearFilter} allProps={allProps} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="tf-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="heading-section">
                <h2>Listing grid</h2>
                <p className="mt-18">
                  There Are Currently {sorted.length} Results
                </p>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="list-car-grid-4 gap-30">
                {sorted
                  .slice((currentPage - 1) * 12, currentPage * 12)
                  .map((car, i) => (
                    <CarCard car={car}/>
                  ))}
              </div>
              <div className="themesflat-pagination pagination-style1 clearfix center">
                <ul>
                  <Pagination
                    currentPage={currentPage}
                    setPage={(value) => allProps.setCurrentPage(value)}
                    itemLength={sorted.length}
                    itemPerPage={12}
                  />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
