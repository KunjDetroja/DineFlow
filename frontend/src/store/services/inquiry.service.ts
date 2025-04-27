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
    getInquiry: builder.query<baseResponse<getInquiryResponse>, void>({
      query: () => ({
        url: "inquiry/all",
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateInquiryMutation, useGetInquiryQuery } = authApi;
