// pages/car-brands.js
import React from 'react';
import Footer1 from '../footers/Footer1';

const carBrands = [
    { name: 'BMW', logo: '/logos/bmw.png', vehicles: 120 },
    { name: 'Mercedes', logo: '/logos/mercedes.png', vehicles: 98 },
    { name: 'Audi', logo: '/logos/audi.png', vehicles: 85 },
    { name: 'Toyota', logo: '/logos/toyota.png', vehicles: 150 },
    { name: 'Ford', logo: '/logos/ford.png', vehicles: 110 },
    { name: 'Tesla', logo: '/logos/tesla.png', vehicles: 60 },
];

export default function CarBrands() {
    return (
        <>
            <div className="container mt-5">
                <h1 className="text-center mb-4">Car Brands</h1>
                <div className="row">
                    {carBrands.map((brand, index) => (
                        <div key={index} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                            <div className="card text-center shadow-sm border-0">
                                <img
                                    src={brand.logo}
                                    alt={`${brand.name} logo`}
                                    className="card-img-top p-3"
                                    style={{ height: '150px', objectFit: 'contain' }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title fw-bold">{brand.name}</h5>
                                    <p className="card-text text-muted">
                                        {brand.vehicles} {brand.vehicles === 1 ? 'vehicle' : 'vehicles'} available
                                    </p>
                                    <a href="#" className="btn btn-primary">
                                        Explore {brand.name}
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
        </>
    );
}
