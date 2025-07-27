import { baseApi } from "./baseApi.service";
import {
  CreateRestaurantRequest,
  CreateRestaurantResponse,
  GetAllRestaurantsResponse,
  baseResponse,
} from "@/types";

export const restaurantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createRestaurant: builder.mutation<
      baseResponse<CreateRestaurantResponse>,
      CreateRestaurantRequest
    >({
      query: (restaurantData) => ({
        url: "restaurant/create",
        method: "POST",
        body: restaurantData,
      }),
      invalidatesTags: ["Restaurant"],
    }),
    getAllRestaurants: builder.query<
      baseResponse<GetAllRestaurantsResponse>,
      { page?: number; limit?: number; search?: string }
    >({
      query: (filters) => {
        const cleanedFilters = Object.entries(filters).reduce(
          (acc, [key, value]) => {
            if (
              value !== "" &&
              value !== null &&
              value !== undefined &&
              value !== "all"
            ) {
              acc[key] = value;
            }
            return acc;
          },
          {} as { [key: string]: any }
        );
        const params = new URLSearchParams(cleanedFilters).toString();
        if (params) {
          return {
            url: `restaurant/all?${params}`,
            method: "GET",
          };
        } else {
          return {
            url: `restaurant/all`,
            method: "GET",
          };
        }
      },
      providesTags: ["Restaurant"],
    }),
  }),
});

export const { useCreateRestaurantMutation, useGetAllRestaurantsQuery } =
  restaurantApi;
