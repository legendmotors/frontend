import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

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

export default function MainFilter() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    body: '',
    fuel: '',
    transmission: '',
    price: [50000, 150000],
    km: [20000, 100000],
    features: [],
  });

  useEffect(() => {
    if (router.query) {
      setFilters({
        make: router.query.make || '',
        model: router.query.model || '',
        body: router.query.body || '',
        fuel: router.query.fuel || '',
        transmission: router.query.transmission || '',
        price: router.query.price ? router.query.price.split(',').map(Number) : [50000, 150000],
        km: router.query.km ? router.query.km.split(',').map(Number) : [20000, 100000],
        features: router.query.features ? router.query.features.split(',') : [],
      });
    }
  }, [router.query]);

  const handleChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyFilters = () => {
    const query = {
      ...(filters.make && { make: filters.make }),
      ...(filters.model && { model: filters.model }),
      ...(filters.body && { body: filters.body }),
      ...(filters.fuel && { fuel: filters.fuel }),
      ...(filters.transmission && { transmission: filters.transmission }),
      price: filters.price.join(','),
      km: filters.km.join(','),
      ...(filters.features.length && { features: filters.features.join(',') }),
    };

    router.push({
      pathname: '/car-listing',
      query,
    });
  };

  const filteredData = mockCarData.filter((car) => {
    return (
      (!filters.make || car.make.value === filters.make) &&
      (!filters.model || car.model.value === filters.model) &&
      (!filters.body || car.body.value === filters.body) &&
      (!filters.fuel || car.fuel.value === filters.fuel) &&
      (!filters.transmission || car.transmission.value === filters.transmission) &&
      car.price[0] >= filters.price[0] &&
      car.price[1] <= filters.price[1] &&
      car.km[0] >= filters.km[0] &&
      car.km[1] <= filters.km[1] &&
      filters.features.every((feature) => car.features.includes(feature))
    );
  });

  return (
    <div style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '20px' }}>
      <select onChange={(e) => handleChange('make', e.target.value)} value={filters.make}>
        <option value="">Select Make</option>
        {[...new Set(mockCarData.map((car) => car.make.value))].map((value) => (
          <option key={value} value={value}>
            {mockCarData.find((car) => car.make.value === value)?.make.label}
          </option>
        ))}
      </select>

      <select onChange={(e) => handleChange('model', e.target.value)} value={filters.model}>
        <option value="">Select Model</option>
        {[...new Set(mockCarData.map((car) => car.model.value))].map((value) => (
          <option key={value} value={value}>
            {mockCarData.find((car) => car.model.value === value)?.model.label}
          </option>
        ))}
      </select>

      <div>
        <label>Price Range</label>
        <input
          type="range"
          min="40000"
          max="150000"
          value={filters.price[0]}
          onChange={(e) => handleChange('price', [Number(e.target.value), filters.price[1]])}
        />
        <input
          type="range"
          min="40000"
          max="150000"
          value={filters.price[1]}
          onChange={(e) => handleChange('price', [filters.price[0], Number(e.target.value)])}
        />
        <div>{filters.price[0]} - {filters.price[1]}</div>
      </div>

      <div>
        <label>KM Range</label>
        <input
          type="range"
          min="20000"
          max="100000"
          value={filters.km[0]}
          onChange={(e) => handleChange('km', [Number(e.target.value), filters.km[1]])}
        />
        <input
          type="range"
          min="20000"
          max="100000"
          value={filters.km[1]}
          onChange={(e) => handleChange('km', [filters.km[0], Number(e.target.value)])}
        />
        <div>{filters.km[0]} - {filters.km[1]}</div>
      </div>

      <div>
        <label>Features</label>
        {[...new Set(mockCarData.flatMap((car) => car.features))].map((feature) => (
          <div key={feature}>
            <input
              type="checkbox"
              checked={filters.features.includes(feature)}
              onChange={(e) =>
                handleChange(
                  'features',
                  e.target.checked
                    ? [...filters.features, feature]
                    : filters.features.filter((f) => f !== feature)
                )
              }
            />
            {feature}
          </div>
        ))}
      </div>

      <button onClick={applyFilters} style={{ marginTop: '20px', padding: '10px', cursor: 'pointer' }}>
        Apply Filters
      </button>
    </div>
  );
}
