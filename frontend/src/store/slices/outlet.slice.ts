import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OutletState {
  filter: Record<string, unknown>;
  searchQuery: string;
}

const initialState: OutletState = {
  filter: {},
  searchQuery: "",
};

const outletSlice = createSlice({
  name: 'outlet',
  initialState,
  reducers: {
    setOutletFilter: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.filter = action.payload;
    },
    clearOutletFilter: (state) => {
      state.filter = {};
    },
  },
});

export const { setOutletFilter, clearOutletFilter } = outletSlice.actions;
export default outletSlice.reducer;