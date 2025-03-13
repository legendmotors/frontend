import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import WishlistService from '@/services/WishlistService';

// Async thunk to fetch wishlist items from the API
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, thunkAPI) => {
    try {
      const response = await WishlistService.listWishlist();
      // Adjust the return based on your API response structure
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// Async thunk to add a car to the wishlist via API
export const addToWishlistAsync = createAsyncThunk(
  'wishlist/addToWishlistAsync',
  async (car, thunkAPI) => {
    try {
      const response = await WishlistService.addToWishlist({ carId: car.id });
      // Return the car (or response.data.data if your API returns the new wishlist item)
      return car;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// Async thunk to remove a wishlist item via API
export const removeFromWishlistAsync = createAsyncThunk(
  'wishlist/removeFromWishlistAsync',
  async (id, thunkAPI) => {
    try {
      await WishlistService.removeFromWishlist(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Synchronous actions (if needed)
    addToWishlist: (state, action) => {
      // Ensure state.items is an array, just in case.
      state.items = state.items || [];
      const car = action.payload;
      if (!state.items.find((item) => item.id === car.id)) {
        state.items.push(car);
      }
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchWishlist cases
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // addToWishlistAsync cases
      .addCase(addToWishlistAsync.fulfilled, (state, action) => {
        const car = action.payload;
        if (!state.items.find((item) => item.id === car.id)) {
          state.items.push(car);
        }
      })
      // removeFromWishlistAsync cases
      .addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
