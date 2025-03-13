import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: []
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    // Replace the entire wishlist with API data
    setWishlist: (state, action) => {
      state.items = action.payload;
    },
    // Add a single wishlist item (if not already there)
    addToWishlist: (state, action) => {
      const car = action.payload;
      // Here we assume each item stored in Redux is an object with a nested car.
      // If the car is not already added, we push a new object.
      if (!state.items.find(item => item.car.id === car.id)) {
        // Create a dummy wishlist item with an id. In a real app this would come from the API.
        state.items.push({ id: Date.now(), car });
      }
    },
    // Remove an item by its car id
    removeFromWishlist: (state, action) => {
      const carId = action.payload;
      state.items = state.items.filter(item => item.car.id !== carId);
    }
  }
});

export const { setWishlist, addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
