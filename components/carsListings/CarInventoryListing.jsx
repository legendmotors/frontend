"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroller";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import IconPlus from "@/components/icon/icon-plus";
import { formatCurrency } from "@/utils/formatCurrency";
import IconSearch from "@/components/icon/icon-search";
import IconTrash from "@/components/icon/icon-trash";
import IconPencil from "@/components/icon/icon-pencil";
import Swal from "sweetalert2";
import { AsyncPaginate } from "react-select-async-paginate";

import { GeBrandDetails, TrimService } from "@/services";
import CarModelService from "@/services/CarModelService";
import YearService from "@/services/YearService";
import { useSearchParams, useRouter } from "next/navigation";

// Redux imports
import { useSelector, useDispatch } from "react-redux";
import {
    setBrandId,
    setModelId,
    setTrimId,
    setYearId,
    setSearchQuery,
    resetFilters,
    setSortOption
} from "@/store/filterOptionsSlice";
import { fetchCarList, resetCars, incrementPage } from "@/store/carSlice";

import CarService from "@/services/CarService";
import FlatFilter3 from "../common/FlatFilter3";
import LocalizedLink from "../translation/LocalizedLink";
import DropdownSelect from "../common/DropDownSelect";
import ListGridToggler from "./ListGridToggler";
import ShareButton from "../social/ShareButton";
import Image from "next/image";
import CarCardWithGridAndListing from "./CarCardWithGridAndListing";

const FILTER_KEYS = ["brandId", "modelId", "trimId", "yearId"];

const CarInventoryListing = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const [isGrid, setIsGrid] = useState(false);
    // Read filters and car state from Redux
    const filters = useSelector((state) => state.filters);
    const { cars, totalCars, currentPage, hasMore, isLoading } = useSelector(
        (state) => state.car
    );

    // Local state for dropdown selected options (rehydration)
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedModels, setSelectedModels] = useState([]);
    const [selectedTrims, setSelectedTrims] = useState([]);
    const [selectedYears, setSelectedYears] = useState([]);

    // 1) On mount, remove empty params from URL
    useEffect(() => {
        let changed = false;
        const newParams = new URLSearchParams(searchParams.toString());
        FILTER_KEYS.forEach((key) => {
            if (newParams.get(key) === "") {
                newParams.delete(key);
                changed = true;
            }
        });
        if (changed) {
            router.replace(`?${newParams.toString()}`, { scroll: false });
        }
    }, []);

    // 2) Update URL whenever filters change (synchronization)
    useEffect(() => {
        const params = new URLSearchParams();
        if (filters.searchQuery.trim()) {
          params.set("search", filters.searchQuery.trim());
        }
        FILTER_KEYS.forEach((key) => {
          const arr = filters[key];
          if (arr && arr.length > 0) {
            params.set(key, arr.join(","));
          }
        });
        // Include sorting parameters in URL if applicable
        if (filters.sortOption && filters.sortOption !== "default") {
          params.set("sortBy", "price");
          params.set("order", filters.sortOption);
        }
        router.push(`?${params.toString()}`, { scroll: false });
        dispatch(resetCars());
        dispatch(fetchCarList({ page: 1 }));
      }, [filters]);
      

    // 3) Infinite scroll using react-infinite-scroller.
    const handleLoadMore = () => {
        if (hasMore && !isLoading) {
            dispatch(incrementPage());
            dispatch(fetchCarList({ page: currentPage + 1 }));
        }
    };

    // 4) Rehydrate filter dropdown selections (kept local)
    const rehydrateFilter = async (
        filterArray,
        setSelected,
        serviceFn,
        extraParams = {}
    ) => {
        if (filterArray.length === 0) {
            setSelected([]);
            return;
        }
        try {
            const resp = await serviceFn({
                limit: 9999,
                sortBy: "name",
                order: "asc",
                ...extraParams,
            });
            const options = resp.data.map((item) => ({
                value: item.id.toString(),
                label: item.name || item.year,
            }));
            const selected = options.filter((opt) =>
                filterArray.includes(opt.value)
            );
            setSelected(selected);
        } catch (err) {
            console.error("Error rehydrating filter:", err);
        }
    };

    useEffect(() => {
        if (filters.brandId.length > 0 && selectedBrands.length === 0) {
            rehydrateFilter(filters.brandId, setSelectedBrands, GeBrandDetails.listBrand, {
                hasModels: "true",
            });
        }
    }, [filters.brandId, selectedBrands.length]);

    useEffect(() => {
        if (filters.modelId.length > 0 && selectedModels.length === 0) {
            rehydrateFilter(filters.modelId, setSelectedModels, CarModelService.listCarModel, {
                brandId: filters.brandId.join(","),
            });
        }
    }, [filters.brandId, filters.modelId, selectedModels.length]);

    useEffect(() => {
        if (filters.trimId.length > 0 && selectedTrims.length === 0) {
            rehydrateFilter(filters.trimId, setSelectedTrims, TrimService.listTrim, {
                modelId: filters.modelId.join(","),
            });
        }
    }, [filters.modelId, filters.trimId, selectedTrims.length]);

    useEffect(() => {
        if (filters.yearId.length > 0 && selectedYears.length === 0) {
            rehydrateFilter(filters.yearId, setSelectedYears, YearService.listYear, {
                brandId: filters.brandId.join(","),
                modelId: filters.modelId.join(","),
                trimId: filters.trimId.join(","),
                sortBy: "year",
            });
        }
    }, [filters.brandId, filters.modelId, filters.trimId, filters.yearId, selectedYears.length]);

    // 5) Build loadOptions for AsyncPaginate
    const createLoadOptions = (serviceFn, defaultParams = {}) => {
        return async (inputValue, _loadedOptions, additional) => {
            const page = additional?.page || 1;
            try {
                const params = { page, limit: 10, ...defaultParams };
                if (inputValue.trim()) {
                    params.search = inputValue.trim();
                }
                const resp = await serviceFn(params);
                const options = resp.data.map((item) => ({
                    value: item.id.toString(),
                    label: item.name || item.year,
                }));
                return {
                    options,
                    hasMore: resp.pagination.currentPage < resp.pagination.totalPages,
                    additional: { page: page + 1 },
                };
            } catch (error) {
                console.error("Error loading options:", error);
                return { options: [], hasMore: false, additional: { page } };
            }
        };
    };

    const loadBrandOptions = createLoadOptions(GeBrandDetails.listBrand, {
        sortBy: "name",
        order: "asc",
        hasModels: "true",
    });
    const loadModelOptions = createLoadOptions(CarModelService.listCarModel, {
        sortBy: "name",
        order: "asc",
        brandId: filters.brandId.join(","),
    });
    const loadTrimOptions = createLoadOptions(TrimService.listTrim, {
        sortBy: "name",
        order: "asc",
        modelId: filters.modelId.join(","),
    });

    const getYearExtraParams = () => {
        const params = { sortBy: "year", order: "asc" };
        if (filters.brandId.length > 0) params.brandId = filters.brandId.join(",");
        if (filters.modelId.length > 0) params.modelId = filters.modelId.join(",");
        if (filters.trimId.length > 0) params.trimId = filters.trimId.join(",");
        return params;
    };
    const loadYearOptions = createLoadOptions(YearService.listYear, getYearExtraParams());

    // 6) onChange handlers for each dropdown
    const handleBrandsChange = (selected) => {
        const actual = selected || [];
        setSelectedBrands(actual);
        const brandId = actual.map((opt) => opt.value);
        dispatch(setBrandId(brandId));
    };

    const handleModelsChange = (selected) => {
        const actual = selected || [];
        setSelectedModels(actual);
        const modelId = actual.map((opt) => opt.value);
        dispatch(setModelId(modelId));
    };

    const handleTrimsChange = (selected) => {
        const actual = selected || [];
        setSelectedTrims(actual);
        const trimId = actual.map((opt) => opt.value);
        dispatch(setTrimId(trimId));
    };

    const handleYearsChange = (selected) => {
        const actual = selected || [];
        setSelectedYears(actual);
        const yearId = actual.map((opt) => opt.value);
        dispatch(setYearId(yearId));
    };

    // 7) Searching & Reset
    const handleSearch = () => {
        dispatch(resetCars());
        dispatch(fetchCarList({ page: 1 }));
    };

    const handleResetFilters = () => {
        setSelectedBrands([]);
        setSelectedModels([]);
        setSelectedTrims([]);
        setSelectedYears([]);
        dispatch(resetFilters());
        dispatch(resetCars());
        router.push("?", { scroll: false });
    };

    // 8) Delete a Car
    const handleDelete = (id) => {
        if (id === null) return;
        Swal.fire({
            icon: "warning",
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            showCancelButton: true,
            confirmButtonText: "Delete",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await CarService.deleteCar(id);
                    Swal.fire({
                        icon: "success",
                        title: "Deleted!",
                        text: "The car has been deleted successfully.",
                    });
                    dispatch(resetCars());
                    dispatch(fetchCarList({ page: 1 }));
                } catch (error) {
                    console.error("Error deleting car:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Error!",
                        text: "Something went wrong while deleting.",
                    });
                }
            }
        });
    };

    // 9) Custom styles for dropdowns
    const customStyles = {
        container: (provided) => ({
            ...provided,
            width: "100%",
        }),
        control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? "#ccc" : "#EDEDED",
            borderWidth: "1px",
            boxShadow: state.isFocused ? "0 0 0 1px #00000" : "none",
            "&:hover": {
                borderColor: "#bbb",
            },
            borderRadius: "15px",
            minHeight: "40px",
        }),
        valueContainer: (provided) => ({
            ...provided,
            display: "flex",
            flexWrap: "nowrap",
            padding: "11px 12px",
            maxWidth: "210px",
        }),
        multiValue: (provided) => ({
            ...provided,
            display: "inline-flex",
            margin: "2px",
            borderRadius: "10px",
            backgroundColor: "#f0f0f0",
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            fontSize: "14px",
            color: "#333",
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: "#999",
            "&:hover": {
                backgroundColor: "#e0e0e0",
                color: "#000",
            },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: "#696665",
            fontSize: "14px",
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: "#00000",
            "&:hover": {
                color: "#00000",
            },
        }),
        indicatorSeparator: () => ({
            display: "none",
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 10,
            borderRadius: "4px",
            overflow: "hidden",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            animation: "fadeIn 0.3s ease-in-out",
        }),
        menuList: (provided) => ({
            ...provided,
            padding: "0",
            maxHeight: "200px",
            overflowY: "auto",
            scrollbarWidth: "6px",
            "&::-webkit-scrollbar": {
                width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#ED8721",
                borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#aaa",
            },
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? "#f5f5f5" : "white",
            color: "#333",
            padding: "10px 12px",
            fontSize: "14px",
            cursor: "pointer",
            "&:active": {
                backgroundColor: "#eee",
            },
        }),
    };

    // 10) Sort change handler – only updates the sort option; filtering effect will trigger a new API call.
    const handleSortChange = (selected) => {
        const sortValue = selected.value;
        dispatch(setSortOption(sortValue));
    };

    // 11) RENDER
    return (
        <div className="container mx-auto p-4">
            <div className="flat-filter-search mt--3">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="flat-tabs">
                                <div className={`content-tab `}>
                                    <div className="content-inner tab-content">
                                        <div className="form-sl">
                                            <form onSubmit={(e) => e.preventDefault()}>
                                                <div className="wd-find-select flex gap-2">
                                                    <div className="inner-group gap-3">
                                                        <div className="form-group-1">
                                                            <div className="group-select">
                                                                <AsyncPaginate
                                                                    isMulti
                                                                    loadOptions={loadBrandOptions}
                                                                    debounceTimeout={300}
                                                                    additional={{ page: 1 }}
                                                                    value={selectedBrands}
                                                                    onChange={handleBrandsChange}
                                                                    placeholder="Select Brand(s)"
                                                                    styles={customStyles}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-group-1">
                                                            <div className="group-select">
                                                                <AsyncPaginate
                                                                    isMulti
                                                                    loadOptions={loadModelOptions}
                                                                    cacheUniqs={[filters.brandId.join(",")]}
                                                                    debounceTimeout={300}
                                                                    additional={{ page: 1 }}
                                                                    value={selectedModels}
                                                                    onChange={handleModelsChange}
                                                                    placeholder="Select Model(s)"
                                                                    isDisabled={!filters.brandId.length}
                                                                    styles={customStyles}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-group-1">
                                                            <div className="group-select">
                                                                <AsyncPaginate
                                                                    isMulti
                                                                    loadOptions={loadTrimOptions}
                                                                    cacheUniqs={[filters.modelId.join(",")]}
                                                                    debounceTimeout={300}
                                                                    additional={{ page: 1 }}
                                                                    value={selectedTrims}
                                                                    onChange={handleTrimsChange}
                                                                    placeholder="Select Trim(s)"
                                                                    isDisabled={!filters.modelId.length}
                                                                    styles={customStyles}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-group-1">
                                                            <div className="group-select">
                                                                <AsyncPaginate
                                                                    isMulti
                                                                    loadOptions={loadYearOptions}
                                                                    cacheUniqs={[
                                                                        filters.brandId.join(","),
                                                                        filters.modelId.join(","),
                                                                        filters.trimId.join(","),
                                                                    ]}
                                                                    debounceTimeout={300}
                                                                    additional={{ page: 1 }}
                                                                    value={selectedYears}
                                                                    onChange={handleYearsChange}
                                                                    placeholder="Select Year(s)"
                                                                    styles={customStyles}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="button-search sc-btn-top">
                                                        <LocalizedLink className="sc-button" href="/listing-g">
                                                            <span>Find cars</span>
                                                            <i className="far fa-search text-color-1" />
                                                        </LocalizedLink>
                                                    </div>
                                                    <div className="features-wrap">
                                                        <a
                                                            className="tf-btn-arrow wow fadeInUpSmall clear-filter p-3 "
                                                            onClick={handleResetFilters}
                                                        >
                                                            <i
                                                                className="icon-autodeal-plus m-0"
                                                                style={{ transform: "rotate(25deg)" }}
                                                            />
                                                        </a>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="tf-section py-4">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="sidebar-left-listing">
                                <div className="row">
                                    <div className="col-lg-12 listing-list-car-wrap listing-grid-car-wrap">
                                        <div className="flat-tabs themesflat-tabs category-filter">
                                            <div className="box-tab center flex-two mb-40 flex-wrap gap-20">
                                                <ul className="menu-tab tab-title style1 flex align-items-center">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <input
                                                            type="text"
                                                            value={filters.searchQuery}
                                                            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                                                            placeholder="Search by Stock ID"
                                                            className="form-control w-auto"
                                                        />
                                                    </div>
                                                    <h5 className="fs-5 ms-4">Total Cars: {totalCars}</h5>
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
                                                                selectedValue={filters.sortOption || "default"}
                                                                options={[
                                                                    { value: "default", label: "Sort by (Default)" },
                                                                    { value: "asc", label: "Price Ascending" },
                                                                    { value: "desc", label: "Price Descending" },
                                                                ]}
                                                                onChange={handleSortChange}
                                                            />
                                                        </div>
                                                        <a href="#" className="icon border p-2 rounded">
                                                            <ShareButton />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Cars List */}
                                            <InfiniteScroll
                                                pageStart={currentPage}
                                                loadMore={handleLoadMore}
                                                hasMore={hasMore && !isLoading}
                                                loader={
                                                    <div key="loader" className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                        {Array.from({ length: 4 }).map((_, idx) => (
                                                            <Skeleton key={idx} height={210} width="100%" />
                                                        ))}
                                                    </div>
                                                }
                                            >
                                                <div className="content-tab">
                                                    <div className="content-inner tab-content">
                                                        <div className="row">
                                                            {isGrid ? (
                                                                <div className="col-lg-12">
                                                                    <div className="list-car-list-1 list-car-grid-1">
                                                                        {cars.map((car) => {
                                                                            const exteriorImage = car.CarImages.find(
                                                                                (img) => img.type === "exterior"
                                                                            )?.FileSystem?.path;
                                                                            const firstImage = car.CarImages[0]?.FileSystem?.path;
                                                                            const imagePath = exteriorImage
                                                                                ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads${exteriorImage}`
                                                                                : firstImage
                                                                                    ? `http://localhost:4000/uploads${firstImage}`
                                                                                    : "/placeholder-image.jpg";

                                                                            return (
                                                                                <CarCardWithGridAndListing
                                                                                    key={car.id}
                                                                                    car={car}
                                                                                    isGrid={isGrid}
                                                                                />
                                                                            );
                                                                        })}
                                                                        {isLoading &&
                                                                            Array.from({ length: 4 }).map((_, idx) => (
                                                                                <Skeleton key={idx} height={210} width="100%" />
                                                                            ))}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <div className="col-lg-8">
                                                                        <div className="list-car-list-1 list-car-list-1 gap-4">
                                                                            {cars.map((car) => {
                                                                                const exteriorImage = car.CarImages.find(
                                                                                    (img) => img.type === "exterior"
                                                                                )?.FileSystem?.path;
                                                                                const firstImage = car.CarImages[0]?.FileSystem?.path;
                                                                                const imagePath = exteriorImage
                                                                                    ? `http://localhost:4000/uploads${exteriorImage}`
                                                                                    : firstImage
                                                                                        ? `http://localhost:4000/uploads${firstImage}`
                                                                                        : "/placeholder-image.jpg";

                                                                                return (
                                                                                    <CarCardWithGridAndListing
                                                                                        key={car.id}
                                                                                        car={car}
                                                                                        isGrid={isGrid}
                                                                                        imagePath={imagePath}
                                                                                    />
                                                                                );
                                                                            })}
                                                                            {isLoading &&
                                                                                Array.from({ length: 4 }).map((_, idx) => (
                                                                                    <Skeleton key={idx} height={210} width="100%" />
                                                                                ))}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-4">
                                                                        <div className="sticky-top top-0 img-style z-0">
                                                                            <Image
                                                                                className="lazyload"
                                                                                alt="image"
                                                                                src="/assets/skyskrapper.webp"
                                                                                width={450}
                                                                                height={338}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </InfiniteScroll>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CarInventoryListing;
