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
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `inquiry/all?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateInquiryMutation, useGetAllInquiryQuery } = authApi;
