import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import CarService from '@/services/CarService';
import { IRootState } from '@/store'; // Adjust the import path as needed
import { Car } from '@/types';

interface Pagination {
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

interface CarListResponse {
  data: Car[];
  pagination: Pagination;
}

interface CarState {
  cars: Car[];
  totalCars: number;
  currentPage: number;
  hasMore: boolean;
  isLoading: boolean;
}

const initialState: CarState = {
  cars: [],
  totalCars: 0,
  currentPage: 1,
  hasMore: true,
  isLoading: false,
};

export const fetchCarList = createAsyncThunk<
  CarListResponse,
  { page: number },
  { state: IRootState }
>(
  'car/fetchCarList',
  async ({ page }, { getState, rejectWithValue }) => {
    try {
      const { filters } = getState();
      const params: Record<string, any> = {
        page,
        limit: 12,
      };

      if (filters.brandId.length > 0) {
        params.brandId = filters.brandId.join(',');
      }
      if (filters.modelId.length > 0) {
        params.modelId = filters.modelId.join(',');
      }
      if (filters.trimId.length > 0) {
        params.trimId = filters.trimId.join(',');
      }
      if (filters.yearId.length > 0) {
        params.yearId = filters.yearId.join(',');
      }
      if (filters.searchQuery.trim()) {
        params.search = filters.searchQuery.trim();
      }

      // Add sorting if a valid sort option is selected.
      if (filters.sortOption && filters.sortOption !== 'default') {
        params.sortBy = 'price';
        params.order = filters.sortOption; // Should be either "asc" or "desc"
      }

      const response = await CarService.listCars(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

const carSlice = createSlice({
  name: 'car',
  initialState,
  reducers: {
    resetCars(state) {
      state.cars = [];
      state.currentPage = 1;
      state.hasMore = true;
    },
    incrementPage(state) {
      state.currentPage += 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCarList.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      fetchCarList.fulfilled,
      (
        state,
        action: PayloadAction<CarListResponse>
      ) => {
        state.isLoading = false;
        const { data, pagination } = action.payload;
        if (state.currentPage === 1) {
          state.cars = data;
        } else {
          state.cars = [...state.cars, ...data];
        }
        state.totalCars = pagination.totalItems;
        state.hasMore = pagination.currentPage < pagination.totalPages;
      }
    );
    builder.addCase(fetchCarList.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const { resetCars, incrementPage } = carSlice.actions;
export default carSlice.reducer;
