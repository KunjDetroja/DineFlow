import { baseApi } from './baseApi.service';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  success: boolean;
  data?: {
    id: string;
    email: string;
    name: string;
    role: string;
    token: string;
    phone: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'user/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi; 