import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RestaurantState {
  filter: Record<string, unknown>;
  searchQuery: string;
}

const initialState: RestaurantState = {
  filter: {},
  searchQuery: "",
};

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    setRestaurantFilter: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.filter = action.payload;
    },
    clearRestaurantFilter: (state) => {
      state.filter = {};
    },
  },
});

export const { setRestaurantFilter, clearRestaurantFilter } = restaurantSlice.actions;
export default restaurantSlice.reducer;