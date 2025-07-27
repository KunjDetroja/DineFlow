import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InquiryState {
  filter: Record<string, unknown>;
}

const initialState: InquiryState = {
  filter: {},
};

const inquirySlice = createSlice({
  name: 'inquiry',
  initialState,
  reducers: {
    setInquiryFilter: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.filter = action.payload;
    },
    clearInquiryFilter: (state) => {
      state.filter = {};
    },
  },
});

export const { setInquiryFilter, clearInquiryFilter } = inquirySlice.actions;
export default inquirySlice.reducer;