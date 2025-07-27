import { baseApi } from './baseApi.service';
import {
  CreateRestaurantRequest,
  CreateRestaurantResponse,
  GetAllRestaurantsResponse,
  baseResponse
} from '@/types';

export const restaurantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createRestaurant: builder.mutation<baseResponse<CreateRestaurantResponse>, CreateRestaurantRequest>({
      query: (restaurantData) => ({
        url: 'restaurant/create',
        method: 'POST',
        body: restaurantData,
      }),
      invalidatesTags: ['Restaurant'],
    }),
    getAllRestaurants: builder.query<baseResponse<GetAllRestaurantsResponse>, { page?: number; limit?: number; search?: string }>({
      query: ({ page = 1, limit = 10, search } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        
        if (search && search.trim()) {
          params.append('search', search.trim());
        }
        
        return {
          url: `restaurant?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Restaurant'],
    }),
  }),
});

export const { 
  useCreateRestaurantMutation, 
  useGetAllRestaurantsQuery 
} = restaurantApi;