import {
  baseResponse,
  createInquiryRequest,
  createInquiryResponse,
  getInquiryResponse,
} from "@/types";
import { baseApi } from "./baseApi.service";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createInquiry: builder.mutation<
      baseResponse<createInquiryResponse>,
      createInquiryRequest
    >({
      query: (body) => ({
        url: "inquiry/create",
        method: "POST",
        body,
      }),
    }),
    getAllInquiry: builder.query<
      baseResponse<getInquiryResponse>,
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {} as { [key: string]: any }
        );
        const params = new URLSearchParams(cleanedFilters).toString();
        if (params) {
          return {
            url: `inquiry/all?${params}`,
            method: "GET",
          };
        } else {
          return {
            url: `inquiry/all`,
            method: "GET",
          };
        }
      },
    }),
    createRestaurantFromInquiry: builder.mutation<
      baseResponse<any>,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `inquiry/create-restaurant/${id}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useCreateInquiryMutation,
  useGetAllInquiryQuery,
  useCreateRestaurantFromInquiryMutation,
} = authApi;
