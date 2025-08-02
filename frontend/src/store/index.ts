import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from './services/baseApi.service';
import userSlice from './slices/user.slice';
import inquirySlice from './slices/inquiry.slice';
import restaurantSlice from './slices/restaurant.slice';
import outletSlice from './slices/outlet.slice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    inquiry: inquirySlice,
    restaurant: restaurantSlice,
    outlet: outletSlice,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 