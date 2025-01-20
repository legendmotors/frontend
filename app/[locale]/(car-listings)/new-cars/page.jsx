'use client';

import ListingCars from '@/components/carsListings/ListingCars';
import MainFilter from '@/components/filter/MainFilter';
import { useState } from 'react';

export default function Home() {

    const mockCarData = [

        {

            make: { value: "audi", label: "Audi" },

            model: { value: "a4", label: "A4" },

            door: { value: "4_door", label: "4 Door" },

            body: { value: "sedan", label: "Sedan" },

            fuel: { value: "petrol", label: "Petrol" },

            transmission: { value: "automatic", label: "Automatic" },

            location: { value: "dubai", label: "Dubai" },

            cylinder: { value: "4_cylinder", label: "4 Cylinder" },

            color: { value: "black", label: "Black" },

            km: [50000, 70000],

            price: [80000, 100000],

            year: [2018, 2022],

            features: ["sunroof", "bluetooth", "leather seats"]

        },

        {

            make: { value: "bmw", label: "BMW" },

            model: { value: "x5", label: "X5" },

            door: { value: "4_door", label: "4 Door" },

            body: { value: "suv", label: "SUV" },

            fuel: { value: "diesel", label: "Diesel" },

            transmission: { value: "automatic", label: "Automatic" },

            location: { value: "new_york", label: "New York" },

            cylinder: { value: "6_cylinder", label: "6 Cylinder" },

            color: { value: "white", label: "White" },

            km: [30000, 60000],

            price: [90000, 120000],

            year: [2020, 2024],

            features: ["navigation system", "backup camera", "heated seats"]

        },

        {

            make: { value: "ford", label: "Ford" },

            model: { value: "focus", label: "Focus" },

            door: { value: "4_door", label: "4 Door" },

            body: { value: "hatchback", label: "Hatchback" },

            fuel: { value: "petrol", label: "Petrol" },

            transmission: { value: "manual", label: "Manual" },

            location: { value: "paris", label: "Paris" },

            cylinder: { value: "3_cylinder", label: "3 Cylinder" },

            color: { value: "blue", label: "Blue" },

            km: [60000, 90000],

            price: [70000, 90000],

            year: [2017, 2021],

            features: ["cruise control", "keyless entry", "alloy wheels"]

        },

        {

            make: { value: "audi", label: "Audi" },

            model: { value: "q5", label: "Q5" },

            door: { value: "4_door", label: "4 Door" },

            body: { value: "suv", label: "SUV" },

            fuel: { value: "diesel", label: "Diesel" },

            transmission: { value: "automatic", label: "Automatic" },

            location: { value: "london", label: "London" },

            cylinder: { value: "4_cylinder", label: "4 Cylinder" },

            color: { value: "red", label: "Red" },

            km: [20000, 50000],

            price: [50000, 75000],

            year: [2019, 2023],

            features: ["rear parking sensors", "lane assist", "automatic climate control"]

        },

        {

            make: { value: "toyota", label: "Toyota" },

            model: { value: "corolla", label: "Corolla" },

            door: { value: "4_door", label: "4 Door" },

            body: { value: "sedan", label: "Sedan" },

            fuel: { value: "hybrid", label: "Hybrid" },

            transmission: { value: "automatic", label: "Automatic" },

            location: { value: "tokyo", label: "Tokyo" },

            cylinder: { value: "4_cylinder", label: "4 Cylinder" },

            color: { value: "silver", label: "Silver" },

            km: [30000, 50000],

            price: [75000, 100000],

            year: [2019, 2023],

            features: ["adaptive cruise control", "blind spot monitor", "wireless charging"]

        },

        {

            make: { value: "nissan", label: "Nissan" },

            model: { value: "altima", label: "Altima" },

            door: { value: "4_door", label: "4 Door" },

            body: { value: "sedan", label: "Sedan" },

            fuel: { value: "petrol", label: "Petrol" },

            transmission: { value: "automatic", label: "Automatic" },

            location: { value: "los_angeles", label: "Los Angeles" },

            cylinder: { value: "4_cylinder", label: "4 Cylinder" },

            color: { value: "gray", label: "Gray" },

            km: [45000, 75000],

            price: [70000, 95000],

            year: [2018, 2022],

            features: ["keyless start", "apple carplay", "backup camera"]

        },

        {

            make: { value: "bmw", label: "BMW" },

            model: { value: "3_series", label: "3 Series" },

            door: { value: "4_door", label: "4 Door" },

            body: { value: "sedan", label: "Sedan" },

            fuel: { value: "petrol", label: "Petrol" },

            transmission: { value: "automatic", label: "Automatic" },

            location: { value: "berlin", label: "Berlin" },

            cylinder: { value: "4_cylinder", label: "4 Cylinder" },

            color: { value: "black", label: "Black" },

            km: [25000, 50000],

            price: [95000, 125000],

            year: [2021, 2024],

            features: ["sport seats", "navigation system", "android auto"]

        }

    ];

    const [filteredCars, setFilteredCars] = useState(mockCarData);

    const handleFilterChange = (filters) => {
        const updatedCars = mockCarData.filter((car) => {
            return (
                (!filters.make || car.make.value === filters.make) &&
                (!filters.model || car.model.value === filters.model) &&
                (!filters.body || car.body.value === filters.body) &&
                (!filters.fuel || car.fuel.value === filters.fuel) &&
                (!filters.transmission || car.transmission.value === filters.transmission) &&
                (!filters.location || car.location.value === filters.location) &&
                (!filters.cylinder || car.cylinder.value === filters.cylinder) &&
                (!filters.color || car.color.value === filters.color) &&
                car.price[0] >= filters.price[0] &&
                car.price[1] <= filters.price[1] &&
                car.km[0] >= filters.km[0] &&
                car.km[1] <= filters.km[1] &&
                filters.features.every((feature) => car.features.includes(feature))
            );
        });

        setFilteredCars(updatedCars);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Car Listing</h1>
            <MainFilter onFilterChange={handleFilterChange} />
            <ListingCars cars={filteredCars} />
        </div>
    );
}
