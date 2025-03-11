"use client";
import React, { useEffect, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { AsyncPaginate } from "react-select-async-paginate";

import { GeBrandDetails, TrimService } from "@/services";
import CarModelService from "@/services/CarModelService";
import YearService from "@/services/YearService";
import { useSearchParams, useRouter } from "next/navigation";
import "react-range-slider-input/dist/style.css";

// Redux imports
import { useSelector, useDispatch } from "react-redux";
import {
    setBrandId,
    setModelId,
    setTrimId,
    setYearId,
    setSearchQuery,
    resetFilters,
    setSpecFilter,
    setPriceRangeAED,
    setPriceRangeUSD,
    setSortBy,
    setOrder,
    setTagIds,
} from "@/store/filterOptionsSlice";
import { fetchCarList, resetCars, incrementPage } from "@/store/carSlice";

import SpecificationService from "@/services/SpecificationService";
import FeatureService from "@/services/FeatureService";
import CarTagService from "@/services/CarTagService";

import Select from "react-select";

const FILTER_KEYS = ["brandId", "modelId", "trimId", "yearId"];

const Loader = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
    </div>
);

const sortOptions = [
    { label: "Created At (Newest First)", value: "createdAt_DESC" },
    { label: "Created At (Oldest First)", value: "createdAt_ASC" },
    { label: "Price: Low to High", value: "price_ASC" },
    { label: "Price: High to Low", value: "price_DESC" },
    { label: "Year: Newest First", value: "year_DESC" },
    { label: "Year: Oldest First", value: "year_ASC" },
    { label: "Brand (A-Z)", value: "brandName_ASC" },
    { label: "Brand (Z-A)", value: "brandName_DESC" },
    { label: "Model (A-Z)", value: "modelName_ASC" },
    { label: "Model (Z-A)", value: "modelName_DESC" }
];

const CarFilter = () => {
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
    // Tag states
    const [selectedTags, setSelectedTags] = useState([]);
    const [tagOptions, setTagOptions] = useState([]);

    const [localPriceRangeAED, setLocalPriceRangeAED] = useState([0, 200000]);
    const [localPriceRangeUSD, setLocalPriceRangeUSD] = useState([0, 50000]);
    // Manual input states
    const [manualMinAED, setManualMinAED] = useState("");
    const [manualMaxAED, setManualMaxAED] = useState("");
    const [manualMinUSD, setManualMinUSD] = useState("");
    const [manualMaxUSD, setManualMaxUSD] = useState("");

    const [localSearch, setLocalSearch] = useState("");
    const [selectedPriceCurrency, setSelectedPriceCurrency] = useState("AED");
    const [expanded, setExpanded] = useState(false);

    // 1) On mount, remove empty URL params for fixed filters.
    useEffect(() => {
        let changed = false;
        const newParams = new URLSearchParams(searchParams.toString());
        for (const key of FILTER_KEYS) {
            if (newParams.get(key) === "") {
                newParams.delete(key);
                changed = true;
            }
        }
        if (changed) {
            router.replace(`?${newParams.toString()}`, { scroll: false });
        }
    }, [searchParams, router]);

    // 2) Rehydrate filters from URL (including sorting and tags).
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        const FIXED_KEYS = [
            "search",
            "brandId",
            "modelId",
            "trimId",
            "yearId",
            "minPriceAED",
            "maxPriceAED",
            "minPriceUSD",
            "maxPriceUSD",
            "sortBy",
            "order",
            "tags",
        ];
        // Search query
        const searchQuery = params.get("search") || "";
        dispatch(setSearchQuery(searchQuery));

        // brandId
        const brandIdParam = params.get("brandId");
        if (brandIdParam) {
            const brandIds = brandIdParam.split(",").filter(Boolean);
            dispatch(setBrandId(brandIds));
        }
        // modelId
        const modelIdParam = params.get("modelId");
        if (modelIdParam) {
            const modelIds = modelIdParam.split(",").filter(Boolean);
            dispatch(setModelId(modelIds));
        }
        // trimId
        const trimIdParam = params.get("trimId");
        if (trimIdParam) {
            const trimIds = trimIdParam.split(",").filter(Boolean);
            dispatch(setTrimId(trimIds));
        }
        // yearId
        const yearIdParam = params.get("yearId");
        if (yearIdParam) {
            const yearIds = yearIdParam.split(",").filter(Boolean);
            dispatch(setYearId(yearIds));
        }
        // tags
        const tagsParam = params.get("tags");
        if (tagsParam) {
            const tagIds = tagsParam.split(",").filter(Boolean);
            dispatch(setTagIds(tagIds));
        }
        // Sorting
        const sortByQuery = params.get("sortBy");
        if (sortByQuery) {
            dispatch(setSortBy(sortByQuery));
        }
        const orderQuery = params.get("order");
        if (orderQuery) {
            dispatch(setOrder(orderQuery));
        }
        // Dynamic spec filters
        params.forEach((value, key) => {
            if (!FIXED_KEYS.includes(key)) {
                const specKey = key.toLowerCase();
                const specValues = value.split(",").filter(Boolean);
                if (specValues.length > 0) {
                    dispatch(setSpecFilter({ key: specKey, value: specValues }));
                }
            }
        });

        dispatch(resetCars());
        dispatch(fetchCarList({ page: 1 }));
    }, [searchParams, dispatch]);

    // 3) Rehydrate price ranges from URL.
    useEffect(() => {
        const urlMinAED = searchParams.get("minPriceAED");
        const urlMaxAED = searchParams.get("maxPriceAED");
        if (urlMinAED && urlMaxAED) {
            const parsedMinAED = Number(urlMinAED);
            const parsedMaxAED = Number(urlMaxAED);
            setLocalPriceRangeAED([parsedMinAED, parsedMaxAED]);
            setManualMinAED(urlMinAED);
            setManualMaxAED(urlMaxAED);
            dispatch(setPriceRangeAED({ minPrice: parsedMinAED, maxPrice: parsedMaxAED }));
            setSelectedPriceCurrency("AED");
        }
        const urlMinUSD = searchParams.get("minPriceUSD");
        const urlMaxUSD = searchParams.get("maxPriceUSD");
        if (urlMinUSD && urlMaxUSD) {
            const parsedMinUSD = Number(urlMinUSD);
            const parsedMaxUSD = Number(urlMaxUSD);
            setLocalPriceRangeUSD([parsedMinUSD, parsedMaxUSD]);
            setManualMinUSD(urlMinUSD);
            setManualMaxUSD(urlMaxUSD);
            dispatch(setPriceRangeUSD({ minPrice: parsedMinUSD, maxPrice: parsedMaxUSD }));
            setSelectedPriceCurrency("USD");
        }
    }, [searchParams, dispatch]);

    // 4) Removed automatic URL update on filters change.
    // The URL will now only update when the user clicks the "Find cars" button.

    // 5) Infinite scroll load more handler.
    const handleLoadMore = () => {
        if (!isLoading && hasMore) {
            dispatch(incrementPage());
            dispatch(fetchCarList({ page: currentPage + 1 }));
        }
    };

    // 6) Rehydrate filter dropdown selections (brands, models, trims, years)
    const rehydrateFilter = async (filterArray, setSelected, serviceFn, extraParams = {}) => {
        if (filterArray.length === 0) {
            setSelected([]);
            return;
        }
        try {
            const resp = await serviceFn({ limit: 9999, sortBy: "name", order: "asc", ...extraParams });
            const options = resp.data.map((item) => ({
                value: item.id.toString(),
                label: item.name || item.year,
            }));
            const selected = options.filter((opt) => filterArray.includes(opt.value));
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

    // NEW: Load tag options on mount & rehydrate
    useEffect(() => {
        const loadTags = async () => {
            try {
                const response = await CarTagService.listTags({ limit: 0, sortBy: "name", order: "asc" });
                const options = response.data.map((tag) => ({
                    value: tag.id.toString(),
                    label: tag.name,
                }));
                setTagOptions(options);
            } catch (error) {
                console.error("Error loading tags:", error);
            }
        };
        loadTags();
    }, []);

    // Rehydrate selected tags from Redux filters
    useEffect(() => {
        if (tagOptions.length > 0 && filters.tagIds.length > 0 && selectedTags.length === 0) {
            const selected = tagOptions.filter((opt) => filters.tagIds.includes(opt.value));
            setSelectedTags(selected);
        } else if (filters.tagIds.length === 0 && selectedTags.length > 0) {
            setSelectedTags([]);
        }
    }, [tagOptions, filters.tagIds, selectedTags.length]);

    // 7) Build loadOptions for AsyncPaginate (brand, model, trim, year)
    const createLoadOptions = (serviceFn, defaultParams = {}) => async (inputValue, _loadedOptions, additional) => {
        const page = additional?.page ?? 1;
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

    // 8) onChange handlers
    const handleBrandsChange = (selected) => {
        const actual = selected || [];
        setSelectedBrands(actual);
        const brandId = actual.map((opt) => opt.value);
        dispatch(setBrandId(brandId));
        if (brandId.length === 0) {
            setSelectedModels([]);
            setSelectedTrims([]);
            dispatch(setModelId([]));
            dispatch(setTrimId([]));
        }
    };

    const handleModelsChange = (selected) => {
        const actual = selected || [];
        setSelectedModels(actual);
        const modelId = actual.map((opt) => opt.value);
        dispatch(setModelId(modelId));
        if (modelId.length === 0) {
            setSelectedTrims([]);
            dispatch(setTrimId([]));
        }
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

    // Tag change
    const handleTagsChange = (selected) => {
        const actual = Array.from(selected);
        setSelectedTags(actual);
        dispatch(setTagIds(actual.map((opt) => opt.value)));
    };

    // 9) Search & Reset
    // When the user clicks the "Find cars" button, build the query string from the stored filter state and navigate.
    const handleSearch = () => {
        const params = new URLSearchParams();
        if (filters.searchQuery.trim()) {
            params.set("search", filters.searchQuery.trim());
        }
        // Add fixed filter keys
        FILTER_KEYS.forEach((key) => {
            if (filters[key] && filters[key].length > 0) {
                params.set(key, filters[key].join(","));
            }
        });
        // Add dynamic specification filters
        if (filters.specFilters) {
            for (const key in filters.specFilters) {
                const values = filters.specFilters[key];
                if (values && values.length > 0) {
                    params.set(key, values.join(","));
                }
            }
        }
        // Add price filters based on selected currency
        if (selectedPriceCurrency === "AED") {
            if (filters.minPriceAED != null)
                params.set("minPriceAED", filters.minPriceAED.toString());
            if (filters.maxPriceAED != null)
                params.set("maxPriceAED", filters.maxPriceAED.toString());
        } else {
            if (filters.minPriceUSD != null)
                params.set("minPriceUSD", filters.minPriceUSD.toString());
            if (filters.maxPriceUSD != null)
                params.set("maxPriceUSD", filters.maxPriceUSD.toString());
        }
        // Sorting
        if (filters.sortBy) params.set("sortBy", filters.sortBy);
        if (filters.order) params.set("order", filters.order);
        // Tag filters
        if (filters.tagIds && filters.tagIds.length > 0) {
            params.set("tags", filters.tagIds.join(","));
        }
        // Navigate to the car listing page (adjust the route if necessary)
        router.push(`/cars/new-cars?${params.toString()}`);
    };

    const handleResetFilters = () => {
        setSelectedBrands([]);
        setSelectedModels([]);
        setSelectedTrims([]);
        setSelectedYears([]);
        setSelectedTags([]);
        setLocalPriceRangeAED([0, 200000]);
        setLocalPriceRangeUSD([0, 50000]);
        setManualMinAED("");
        setManualMaxAED("");
        setManualMinUSD("");
        setManualMaxUSD("");
        setLocalSearch("");
        dispatch(resetFilters());
        dispatch(resetCars());
        router.push("?", { scroll: false });
    };

    const customStyles = {
        valueContainer: (base) => ({
            ...base,
            flexWrap: "nowrap",
            overflowX: "auto",
            minHeight: "20px",
        }),
        multiValue: (base) => ({
            ...base,
            margin: "2px 4px",
        }),
        multiValueLabel: (base) => ({
            ...base,
            whiteSpace: "nowrap",
        }),
        multiValueRemove: (base) => ({
            ...base,
            cursor: "pointer",
        }),
        menu: (base) => ({
            ...base,
            zIndex: 9999,
        }),
        menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
        }),
    };

    const [specifications, setSpecifications] = useState([]);
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetching specs
    useEffect(() => {
        const fetchSpecificationsWithValues = async () => {
            try {
                setLoading(true);
                const specsRes = await SpecificationService.listSpecifications({ limit: 0 });
                const specsData = specsRes.data;
                const specsWithValues = await Promise.all(
                    specsData.map(async (spec) => {
                        const valuesRes = await SpecificationService.listSpecificationValues({
                            specificationId: spec.id,
                            limit: 0,
                        });
                        const values = valuesRes.data.map((v) => ({
                            value: v.id.toString(),
                            label: v.name,
                        }));
                        return { ...spec, values };
                    })
                );
                setSpecifications(specsWithValues);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching specifications:", error);
                setLoading(false);
            }
        };
        fetchSpecificationsWithValues();
    }, []);

    // Fetching features
    useEffect(() => {
        const fetchFeaturesWithValues = async () => {
            try {
                const featuresRes = await FeatureService.listFeatures({ limit: 0 });
                const featuresData = featuresRes.data;
                const featuresWithValues = await Promise.all(
                    featuresData.map(async (feature) => {
                        const valuesRes = await FeatureService.listFeatureValues({
                            featureId: feature.id,
                            limit: 0,
                        });
                        const values = valuesRes.data.map((v) => ({
                            id: v.id,
                            name: v.name,
                            slug: v.slug,
                        }));
                        return { ...feature, values };
                    })
                );
                setFeatures(featuresWithValues);
            } catch (error) {
                console.error("Error fetching features:", error);
            }
        };
        fetchFeaturesWithValues();
    }, []);

    // 11) RENDER
    return (
        <div className="container mx-auto p-4">
            <div
                className="form-sl d-md-block d-none"
                style={{ position: "sticky", top: "115px", backgroundColor: "white", zIndex: 1020 }}
            >
                <div onSubmit={(e) => e.preventDefault()}>
                    <div className="wd-find-select flex gap-2 align-items-center">
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
                        <div className={!expanded ? "collapse show" : "collapse"}>
                            <div className="form-group-2">
                                <a className="icon-filter pull-right" onClick={() => setExpanded((prev) => !prev)}>
                                    <svg
                                        width={20}
                                        height={18}
                                        viewBox="0 0 20 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M4.00002 6.84375V0.75C4.00002 0.551088 3.92101 0.360322 3.78035 0.21967C3.6397 0.0790178 3.44894 0 3.25002 0C3.05111 0 2.86035 0.0790178 2.71969 0.21967C2.57904 0.360322 2.50002 0.551088 2.50002 0.75V6.84375C1.85471 7.00898 1.28274 7.38428 0.874293 7.91048C0.465842 8.43669 0.244141 9.08387 0.244141 9.75C0.244141 10.4161 0.465842 11.0633 0.874293 11.5895C1.28274 12.1157 1.85471 12.491 2.50002 12.6562V17.25C2.50002 17.4489 2.57904 17.6397 2.71969 17.7803C2.86035 17.921 3.05111 18 3.25002 18C3.44894 18 3.6397 17.921 3.78035 17.7803C3.92101 17.6397 4.00002 17.4489 4.00002 17.25V12.6562C4.64533 12.491 5.2173 12.1157 5.62575 11.5895C6.0342 11.0633 6.25591 10.4161 6.25591 9.75C6.25591 9.08387 6.0342 8.43669 5.62575 7.91048C5.2173 7.38428 4.64533 7.00898 4.00002 6.84375ZM3.25002 11.25C2.95335 11.25 2.66334 11.162 2.41667 10.9972C2.16999 10.8324 1.97774 10.5981 1.8642 10.324C1.75067 10.0499 1.72097 9.74834 1.77885 9.45737C1.83672 9.16639 1.97958 8.89912 2.18936 8.68934C2.39914 8.47956 2.66642 8.3367 2.95739 8.27882C3.24836 8.22094 3.54996 8.25065 3.82405 8.36418C4.09814 8.47771 4.33241 8.66997 4.49723 8.91665C4.66205 9.16332 4.75002 9.45333 4.75002 9.75C4.75002 10.1478 4.59199 10.5294 4.31068 10.8107C4.02938 11.092 3.64785 11.25 3.25002 11.25ZM10.75 2.34375V0.75C10.75 0.551088 10.671 0.360322 10.5304 0.21967C10.3897 0.0790178 10.1989 0 10 0C9.80111 0 9.61034 0.0790178 9.46969 0.21967C9.32904 0.360322 9.25002 0.551088 9.25002 0.75V2.34375C8.60471 2.50898 8.03274 2.88428 7.62429 3.41048C7.21584 3.93669 6.99414 4.58387 6.99414 5.25C6.99414 5.91613 7.21584 6.56331 7.62429 7.08952C8.03274 7.61572 8.60471 7.99102 9.25002 8.15625V17.25C9.25002 17.4489 9.32904 17.6397 9.46969 17.7803C9.61034 17.921 9.80111 18 10 18C10.1989 18 10.3897 17.921 10.5304 17.7803C10.671 17.6397 10.75 17.4489 10.75 17.25V8.15625C11.3953 7.99102 11.9673 7.61572 12.3758 7.08952C12.7842 6.56331 13.0059 5.91613 13.0059 5.25C13.0059 4.58387 12.7842 3.93669 12.3758 3.41048C11.9673 2.88428 11.3953 2.50898 10.75 2.34375ZM10 6.75C9.70335 6.75 9.41334 6.66203 9.16667 6.4972C8.91999 6.33238 8.72773 6.09811 8.6142 5.82403C8.50067 5.54994 8.47097 5.24834 8.52884 4.95736C8.58672 4.66639 8.72958 4.39912 8.93936 4.18934C9.14914 3.97956 9.41642 3.8367 9.70739 3.77882C9.99836 3.72094 10.3 3.75065 10.574 3.86418C10.8481 3.97771 11.0824 4.16997 11.2472 4.41665C11.412 4.66332 11.5 4.95333 11.5 5.25C11.5 5.64782 11.342 6.02936 11.0607 6.31066C10.7794 6.59196 10.3978 6.75 10 6.75ZM19.75 12.75C19.7494 12.0849 19.5282 11.4388 19.121 10.9129C18.7139 10.387 18.1438 10.011 17.5 9.84375V0.75C17.5 0.551088 17.421 0.360322 17.2804 0.21967C17.1397 0.0790178 16.9489 0 16.75 0C16.5511 0 16.3603 0.0790178 16.2197 0.21967C16.079 0.360322 16 0.551088 16 0.75V9.84375C15.3547 10.009 14.7827 10.3843 14.3743 10.9105C13.9658 11.4367 13.7441 12.0839 13.7441 12.75C13.7441 13.4161 13.9658 14.0633 14.3743 14.5895C14.7827 15.1157 15.3547 15.491 16 15.6562V17.25C16 17.4489 16.079 17.6397 16.2197 17.7803C16.3603 17.921 16.5511 18 16.75 18C16.9489 18 17.1397 17.921 17.2804 17.7803C17.421 17.6397 17.5 17.4489 17.5 17.25V15.6562C18.1438 15.489 18.7139 15.113 19.121 14.5871C19.5282 14.0612 19.7494 13.4151 19.75 12.75ZM16.75 14.25C16.4534 14.25 16.1633 14.162 15.9167 13.9972C15.67 13.8324 15.4777 13.5981 15.3642 13.324C15.2507 13.0499 15.221 12.7483 15.2788 12.4574C15.3367 12.1664 15.4796 11.8991 15.6894 11.6893C15.8991 11.4796 16.1664 11.3367 16.4574 11.2788C16.7484 11.2209 17.05 11.2506 17.324 11.3642C17.5981 11.4777 17.8324 11.67 17.9972 11.9166C18.1621 12.1633 18.25 12.4533 18.25 12.75C18.25 13.1478 18.092 13.5294 17.8107 13.8107C17.5294 14.092 17.1478 14.25 16.75 14.25Z"
                                            fill="CurrentColor"
                                        />
                                    </svg>
                                    <i className="icon-autodeal-plus search-icon fs-20" />
                                </a>
                            </div>
                        </div>
                        {/* <div className="features-wrap">
                            <a className="tf-btn-arrow wow fadeInUpSmall clear-filter p-3" onClick={handleResetFilters}>
                                <i className="icon-autodeal-plus m-0" style={{ transform: "rotate(25deg)" }} />
                            </a>
                        </div> */}

                    </div>
                    <div className={!expanded ? "collapse show" : "collapse"}>
                        <div className="button-search sc-btn-top flex justify-content-center mt-3">
                            <button className="sc-button border-0" onClick={handleSearch}>
                                <span>Find cars</span>
                                <i className="far fa-search text-color-1" />
                            </button>
                        </div>
                    </div>
                    <div className={expanded ? "collapse show" : "collapse"}>
                        <div className="row mt-3">
                            {specifications.map((spec) => (
                                <div key={spec.id} className="col-12 col-md-3 mb-3">
                                    <label className="form-label fw-bold mb-1">
                                        {spec.name} {spec.mandatory && <span className="text-danger">*</span>}
                                    </label>
                                    <div>
                                        <Select
                                            isMulti
                                            options={spec.values}
                                            placeholder={`Select ${spec.name}`}
                                            value={
                                                filters.specFilters[spec.key.toLowerCase()]
                                                    ? spec.values.filter((option) =>
                                                        filters.specFilters[spec.key.toLowerCase()].includes(option.value)
                                                    )
                                                    : []
                                            }
                                            onChange={(selectedOptions) => {
                                                const values = selectedOptions.map((option) => option.value);
                                                dispatch(setSpecFilter({ key: spec.key.toLowerCase(), value: values }));
                                            }}
                                            isClearable
                                            styles={customStyles}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {selectedPriceCurrency === "AED" ? (
                            <div>
                                <label className="form-label mb-1">
                                    Price Range{" "}
                                    <select
                                        className="form-select w-auto d-inline-block"
                                        value={selectedPriceCurrency}
                                        onChange={(e) => {
                                            const currency = e.target.value;
                                            setSelectedPriceCurrency(currency);
                                        }}
                                    >
                                        <option value="AED">AED</option>
                                        <option value="USD">USD</option>
                                    </select>
                                </label>
                                <div className="d-flex gap-2 mt-3">
                                    <input
                                        type="number"
                                        placeholder="From"
                                        className="form-control"
                                        value={manualMinAED}
                                        onChange={(e) => setManualMinAED(e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="To"
                                        className="form-control"
                                        value={manualMaxAED}
                                        onChange={(e) => setManualMaxAED(e.target.value)}
                                    />
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => {
                                            const fromVal = manualMinAED ? parseInt(manualMinAED, 10) : 0;
                                            const toVal = manualMaxAED ? parseInt(manualMaxAED, 10) : 500000;
                                            setLocalPriceRangeAED([fromVal, toVal]);
                                            dispatch(setPriceRangeAED({ minPrice: fromVal, maxPrice: toVal }));
                                        }}
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="form-label mb-1">
                                    Price Range{" "}
                                    <select
                                        className="form-select w-auto d-inline-block"
                                        value={selectedPriceCurrency}
                                        onChange={(e) => {
                                            const currency = e.target.value;
                                            setSelectedPriceCurrency(currency);
                                        }}
                                    >
                                        <option value="AED">AED</option>
                                        <option value="USD">USD</option>
                                    </select>
                                </label>
                                <div className="d-flex gap-2 mt-3">
                                    <input
                                        type="number"
                                        placeholder="From"
                                        className="form-control"
                                        value={manualMinUSD}
                                        onChange={(e) => setManualMinUSD(e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="To"
                                        className="form-control"
                                        value={manualMaxUSD}
                                        onChange={(e) => setManualMaxUSD(e.target.value)}
                                    />
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => {
                                            const fromVal = manualMinUSD ? parseInt(manualMinUSD, 10) : 0;
                                            const toVal = manualMaxUSD ? parseInt(manualMaxUSD, 10) : 100000;
                                            setLocalPriceRangeUSD([fromVal, toVal]);
                                            dispatch(setPriceRangeUSD({ minPrice: fromVal, maxPrice: toVal }));
                                        }}
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className={expanded ? "collapse show" : "collapse"}>
                            <div className="d-flex justify-content-center gap-3 w-100 align-items-center mt-4">
                                <div className="button-search sc-btn-top flex justify-content-center">
                                    <button className="sc-button border-0" onClick={handleSearch}>
                                        <span>Find cars</span>
                                        <i className="far fa-search text-color-1" />
                                    </button>
                                </div>


                                <div className="form-group-2">
                                    <a className="icon-filter pull-right" onClick={() => setExpanded((prev) => !prev)}>
                                        <svg
                                            width={20}
                                            height={18}
                                            viewBox="0 0 20 18"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M4.00002 6.84375V0.75C4.00002 0.551088 3.92101 0.360322 3.78035 0.21967C3.6397 0.0790178 3.44894 0 3.25002 0C3.05111 0 2.86035 0.0790178 2.71969 0.21967C2.57904 0.360322 2.50002 0.551088 2.50002 0.75V6.84375C1.85471 7.00898 1.28274 7.38428 0.874293 7.91048C0.465842 8.43669 0.244141 9.08387 0.244141 9.75C0.244141 10.4161 0.465842 11.0633 0.874293 11.5895C1.28274 12.1157 1.85471 12.491 2.50002 12.6562V17.25C2.50002 17.4489 2.57904 17.6397 2.71969 17.7803C2.86035 17.921 3.05111 18 3.25002 18C3.44894 18 3.6397 17.921 3.78035 17.7803C3.92101 17.6397 4.00002 17.4489 4.00002 17.25V12.6562C4.64533 12.491 5.2173 12.1157 5.62575 11.5895C6.0342 11.0633 6.25591 10.4161 6.25591 9.75C6.25591 9.08387 6.0342 8.43669 5.62575 7.91048C5.2173 7.38428 4.64533 7.00898 4.00002 6.84375ZM3.25002 11.25C2.95335 11.25 2.66334 11.162 2.41667 10.9972C2.16999 10.8324 1.97774 10.5981 1.8642 10.324C1.75067 10.0499 1.72097 9.74834 1.77885 9.45737C1.83672 9.16639 1.97958 8.89912 2.18936 8.68934C2.39914 8.47956 2.66642 8.3367 2.95739 8.27882C3.24836 8.22094 3.54996 8.25065 3.82405 8.36418C4.09814 8.47771 4.33241 8.66997 4.49723 8.91665C4.66205 9.16332 4.75002 9.45333 4.75002 9.75C4.75002 10.1478 4.59199 10.5294 4.31068 10.8107C4.02938 11.092 3.64785 11.25 3.25002 11.25ZM10.75 2.34375V0.75C10.75 0.551088 10.671 0.360322 10.5304 0.21967C10.3897 0.0790178 10.1989 0 10 0C9.80111 0 9.61034 0.0790178 9.46969 0.21967C9.32904 0.360322 9.25002 0.551088 9.25002 0.75V2.34375C8.60471 2.50898 8.03274 2.88428 7.62429 3.41048C7.21584 3.93669 6.99414 4.58387 6.99414 5.25C6.99414 5.91613 7.21584 6.56331 7.62429 7.08952C8.03274 7.61572 8.60471 7.99102 9.25002 8.15625V17.25C9.25002 17.4489 9.32904 17.6397 9.46969 17.7803C9.61034 17.921 9.80111 18 10 18C10.1989 18 10.3897 17.921 10.5304 17.7803C10.671 17.6397 10.75 17.4489 10.75 17.25V8.15625C11.3953 7.99102 11.9673 7.61572 12.3758 7.08952C12.7842 6.56331 13.0059 5.91613 13.0059 5.25C13.0059 4.58387 12.7842 3.93669 12.3758 3.41048C11.9673 2.88428 11.3953 2.50898 10.75 2.34375ZM10 6.75C9.70335 6.75 9.41334 6.66203 9.16667 6.4972C8.91999 6.33238 8.72773 6.09811 8.6142 5.82403C8.50067 5.54994 8.47097 5.24834 8.52884 4.95736C8.58672 4.66639 8.72958 4.39912 8.93936 4.18934C9.14914 3.97956 9.41642 3.8367 9.70739 3.77882C9.99836 3.72094 10.3 3.75065 10.574 3.86418C10.8481 3.97771 11.0824 4.16997 11.2472 4.41665C11.412 4.66332 11.5 4.95333 11.5 5.25C11.5 5.64782 11.342 6.02936 11.0607 6.31066C10.7794 6.59196 10.3978 6.75 10 6.75ZM19.75 12.75C19.7494 12.0849 19.5282 11.4388 19.121 10.9129C18.7139 10.387 18.1438 10.011 17.5 9.84375V0.75C17.5 0.551088 17.421 0.360322 17.2804 0.21967C17.1397 0.0790178 16.9489 0 16.75 0C16.5511 0 16.3603 0.0790178 16.2197 0.21967C16.079 0.360322 16 0.551088 16 0.75V9.84375C15.3547 10.009 14.7827 10.3843 14.3743 10.9105C13.9658 11.4367 13.7441 12.0839 13.7441 12.75C13.7441 13.4161 13.9658 14.0633 14.3743 14.5895C14.7827 15.1157 15.3547 15.491 16 15.6562V17.25C16 17.4489 16.079 17.6397 16.2197 17.7803C16.3603 17.921 16.5511 18 16.75 18C16.9489 18 17.1397 17.921 17.2804 17.7803C17.421 17.6397 17.5 17.4489 17.5 17.25V15.6562C18.1438 15.489 18.7139 15.113 19.121 14.5871C19.5282 14.0612 19.7494 13.4151 19.75 12.75ZM16.75 14.25C16.4534 14.25 16.1633 14.162 15.9167 13.9972C15.67 13.8324 15.4777 13.5981 15.3642 13.324C15.2507 13.0499 15.221 12.7483 15.2788 12.4574C15.3367 12.1664 15.4796 11.8991 15.6894 11.6893C15.8991 11.4796 16.1664 11.3367 16.4574 11.2788C16.7484 11.2209 17.05 11.2506 17.324 11.3642C17.5981 11.4777 17.8324 11.67 17.9972 11.9166C18.1621 12.1633 18.25 12.4533 18.25 12.75C18.25 13.1478 18.092 13.5294 17.8107 13.8107C17.5294 14.092 17.1478 14.25 16.75 14.25Z"
                                                fill="CurrentColor"
                                            />
                                        </svg>
                                        <i className="icon-autodeal-plus search-icon fs-20" />
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarFilter;
