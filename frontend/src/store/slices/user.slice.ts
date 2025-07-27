import { createSlice } from "@reduxjs/toolkit";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
  saveToLocalStorage,
} from "@/utils";
import { authApi } from "@/store/services/auth.service";
import { IUser } from "@/types";

const initialState = {
  data: null as IUser | null,
  filter: null,
  token: getFromLocalStorage("token") || null,
  role: null as string | null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.data = action.payload.data;
      state.role = action.payload.data.role;
    },
    logout: (state) => {
      state.data = null;
      state.token = null;
      state.role = null;

      removeFromLocalStorage("token");
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        state.data = action.payload.data || null;
        state.token = action.payload.data?.token || null;
        state.role = action.payload.data?.role || null;
        // Save values to localStorage
        if (action.payload.data?.token) {
          saveToLocalStorage("token", action.payload.data.token);
        }
      }
    );
  },
});

export const { setUserDetails, logout } = userSlice.actions;

export default userSlice.reducer;
