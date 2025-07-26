import { baseApi } from "./baseApi.service";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: "user/me",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetProfileQuery } = userApi;
