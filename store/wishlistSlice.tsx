import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
  },
  reducers: {
    addToWishlist: (state, action) => {
      const car = action.payload;
      if (!state.items.find((item) => item.id === car.id)) {
        state.items.push(car); // Add only if the car is not already in the wishlist
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
