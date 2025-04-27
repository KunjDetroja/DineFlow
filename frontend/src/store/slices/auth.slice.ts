import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../services/auth.service';

interface AuthState {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: {
    id: '',
    email: '',
    name: '',
  },
  token: '',
  isAuthenticated: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.user = initialState.user;
    },
    clearToken: (state) => {
      state.token = '';
    },
    clearUser: (state) => {
      state.user = initialState.user;
    },
    clearAll: (state) => {
      state.user = initialState.user;
      state.token = '';
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      }
    );
  },

});

export default authSlice.reducer;
