import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  brandId: string[];
  modelId: string[];
  trimId: string[];
  yearId: string[];
  searchQuery: string;
  sortOption: 'default' | 'asc' | 'desc';
}

const initialState: FilterState = {
  brandId: [],
  modelId: [],
  trimId: [],
  yearId: [],
  searchQuery: '',
  sortOption: 'default',
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setBrandId(state, action: PayloadAction<string[]>) {
      state.brandId = action.payload;
      state.modelId = [];
      state.trimId = [];
      state.yearId = [];
    },
    setModelId(state, action: PayloadAction<string[]>) {
      state.modelId = action.payload;
      state.trimId = [];
      state.yearId = [];
    },
    setTrimId(state, action: PayloadAction<string[]>) {
      state.trimId = action.payload;
      state.yearId = [];
    },
    setYearId(state, action: PayloadAction<string[]>) {
      state.yearId = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    // New reducer for sortOption
    setSortOption(state, action: PayloadAction<'default' | 'asc' | 'desc'>) {
      state.sortOption = action.payload;
    },
    resetFilters(state) {
      state.brandId = [];
      state.modelId = [];
      state.trimId = [];
      state.yearId = [];
      state.searchQuery = '';
      state.sortOption = 'default';
    },
  },
});

export const {
  setBrandId,
  setModelId,
  setTrimId,
  setYearId,
  setSearchQuery,
  setSortOption, // exported here
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
