export default function ListingCars({ cars }) {
    return (
      <div>
        {cars.length > 0 ? (
          cars.map((car, index) => (
            <div key={index} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px' }}>
              <h3>
                {car.make.label} {car.model.label}
              </h3>
              <p>Body: {car.body.label}</p>
              <p>Fuel: {car.fuel.label}</p>
              <p>Transmission: {car.transmission.label}</p>
              <p>Location: {car.location.label}</p>
              <p>KM: {car.km[0]} - {car.km[1]}</p>
              <p>Price: AED {car.price[0]} - AED {car.price[1]}</p>
              <p>Features: {car.features.join(', ')}</p>
            </div>
          ))
        ) : (
          <p>No cars found matching the criteria.</p>
        )}
      </div>
    );
  }
  