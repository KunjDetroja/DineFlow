import { baseApi } from "./baseApi.service";
import {
  CreateOutletRequest,
  CreateOutletResponse,
  GetAllOutletsResponse,
  UpdateOutletRequest,
  UpdateOutletResponse,
  IOutlet,
  baseResponse,
} from "@/types";

export const outletApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOutlet: builder.mutation<
      baseResponse<CreateOutletResponse>,
      CreateOutletRequest
    >({
      query: (outletData) => ({
        url: "outlet/create",
        method: "POST",
        body: outletData,
      }),
      invalidatesTags: ["Outlet"],
    }),
    getAllOutlets: builder.query<
      baseResponse<GetAllOutletsResponse>,
      { page?: number; limit?: number; search?: string; status?: string }
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
            url: `outlet/all?${params}`,
            method: "GET",
          };
        } else {
          return {
            url: `outlet/all`,
            method: "GET",
          };
        }
      },
      providesTags: ["Outlet"],
    }),
    getOutletById: builder.query<
      baseResponse<IOutlet>,
      string
    >({
      query: (id) => ({
        url: `outlet/${id}`,
        method: "GET",
      }),
      providesTags: ["Outlet"],
    }),
    updateOutlet: builder.mutation<
      baseResponse<UpdateOutletResponse>,
      { id: string; data: UpdateOutletRequest }
    >({
      query: ({ id, data }) => ({
        url: `outlet/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Outlet"],
    }),
    deleteOutlet: builder.mutation<
      baseResponse<null>,
      string
    >({
      query: (id) => ({
        url: `outlet/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Outlet"],
    }),
  }),
});

export const { 
  useCreateOutletMutation, 
  useGetAllOutletsQuery,
  useGetOutletByIdQuery,
  useUpdateOutletMutation,
  useDeleteOutletMutation,
} = outletApi;