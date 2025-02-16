"use client";
import React, { useEffect, useReducer, useState } from "react";
import Image from "next/image";
import Link from "next/link";
const categories = ["All car", "New car", "Used car"];
import { initialState, reducer } from "@/reducer/carFilterReducer";
import { allCars } from "@/data/cars";
import DropdownSelect from "../common/DropDownSelect";
import Pagination from "../common/Pagination";
import Pricing from "../common/Pricing";
import { featureOptions } from "@/data/filterOptions";
import ListGridToggler from "./ListGridToggler";
import FilterSidebar from "./FilterSidebar";
import FlatFilter3 from "../common/FlatFilter3";
import CarCardWithGridAndListing from "./CarCardWithGridAndListing";
import { useDispatch, useSelector } from "react-redux";
import ShareButton from "../social/ShareButton";
export default function Cars3() {
  const wishlist = useSelector((state) => state.wishlist.items);

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id));
  };

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
    itemPerPage,
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
    allProps.setItemPerPage(12);
  }, []);
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
  const [isGrid, setIsGrid] = useState(false);
  const [cars, setCars] = useState([]); // State for storing car data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [pageSize, setPageSize] = useState(10); // Cars per page
  const [totalItems, setTotalItems] = useState(0); // Total number of cars
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [activeIndex, setActiveIndex] = useState(0); // Default active is the first item

  // Function to fetch car data
  const fetchCars = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:4000/api/car/list?page=${page}&limit=${limit}`
      );
      const data = await response.json();

      if (data.success) {
        setCars(data.data); // Set car data
        setTotalItems(data.pagination.totalItems); // Set total items
      } else {
        setError(data.message || "Failed to fetch cars.");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching cars:", err);
      setError("Something went wrong while fetching cars.");
      setLoading(false);
    }
  };

  // Fetch cars on component mount and page/limit changes
  useEffect(() => {
    fetchCars(currentPage, pageSize);
  }, [currentPage, pageSize]);


  console.log(cars, "uiuuuuuuuuuu");

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

      <section className="tf-section py-4">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              {/* <div className="heading-section">
                <h2>Listing grid</h2>
                <p className="mt-18">
                  There Are Currently {sorted.length} Results
                </p>
              </div> */}
              <div className="sidebar-left-listing">
                <div className="row">
                  <div className="col-lg-12 listing-list-car-wrap listing-grid-car-wrap">
                    <div className="flat-tabs themesflat-tabs category-filter">
                      <div className="box-tab center flex-two mb-40 flex-wrap gap-20">
                        <ul className="menu-tab tab-title style1 flex">

                        </ul>
                        <div className="box-2 flex gap-8 flex-wrap">
                          <div className="filter-mobie">
                            <a
                              data-bs-toggle="offcanvas"
                              data-bs-target="#offcanvasRight"
                              aria-controls="offcanvasRight"
                              className="filter"
                            >
                              Filter
                              <i className="icon-autodeal-filter" />
                            </a>
                          </div>

                          <div className="wd-find-select flex align-items-center gap-8">

                            <ListGridToggler
                              isGrid={isGrid}
                              setIsGrid={setIsGrid}
                            />
                            <div className="group-select">
                              <DropdownSelect
                                selectedValue="12" // Default selected value
                                options={[
                                  { value: "12", label: "Show: 12" },
                                  { value: "16", label: "Show: 16" },
                                  { value: "20", label: "Show: 20" },
                                ]}
                                onChange={(selected) => {
                                  allProps.setItemPerPage(parseInt(selected.value, 10));
                                }}
                              />
                            </div>

                            <div className="group-select">
                              <DropdownSelect
                                selectedValue="default" // Default selected value
                                options={[
                                  { value: "default", label: "Sort by (Default)" },
                                  { value: "asc", label: "Price Ascending" },
                                  { value: "desc", label: "Price Descending" },
                                ]}
                                onChange={(selected) => {
                                  allProps.setSortingOption(selected.value);
                                }}
                              />
                            </div>
                            <a href="#" className="icon border p-2 rounded">
                              <ShareButton />
                            </a>

                          </div>
                        </div>
                      </div>
                      <div className="content-tab">
                        <div className="content-inner tab-content">
                          <div className="row">
                            {isGrid ? <div className="col-lg-12">
                              <div
                                className={`list-car-list-1 list-car-grid-1`}
                              >
                                {cars.map((car) => (
                                  <CarCardWithGridAndListing key={car.id} car={car} isGrid={isGrid} />
                                ))}
                              </div>
                            </div> : <> <div className="col-lg-8">
                              <div
                                className={`list-car-list-1 list-car-list-1`}
                              >
                                {cars.map((car) => (
                                  <CarCardWithGridAndListing key={car.id} car={car} isGrid={isGrid} />
                                ))}
                              </div>
                            </div><div className="col-lg-4">
                                <div className="sticky-top top-0 img-style">
                                  <Image
                                    className="lazyload"
                                    alt="image"
                                    src="/assets/skyskrapper.webp"
                                    width={450}
                                    height={338}
                                  />
                                </div>
                              </div></>}


                          </div>


                        </div>
                      </div>
                      <div className="themesflat-pagination clearfix mt-40">
                        <ul>
                          <Pagination
                            currentPage={currentPage}
                            setPage={setCurrentPage}
                            itemLength={totalItems}
                            itemPerPage={pageSize}
                          />
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FilterSidebar allProps={allProps} clearFilter={clearFilter} />
    </>
  );
}
