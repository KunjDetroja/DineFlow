import { baseApi } from "./baseApi.service";
import {
  CreateUserRequest,
  CreateUserResponse,
  GetAllUsersResponse,
  UpdateUserRequest,
  IUser,
  baseResponse,
} from "@/types";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: "user/me",
        method: "GET",
      }),
    }),
    getAllUsers: builder.query<
      baseResponse<GetAllUsersResponse>,
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
            url: `user/all?${params}`,
            method: "GET",
          };
        } else {
          return {
            url: `user/all`,
            method: "GET",
          };
        }
      },
      providesTags: ["User"],
    }),
    getUserById: builder.query<baseResponse<IUser>, string>({
      query: (id) => ({
        url: `user/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    createUser: builder.mutation<
      baseResponse<CreateUserResponse>,
      CreateUserRequest
    >({
      query: (userData) => ({
        url: "user/create",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation<
      baseResponse<IUser>,
      { id: string; data: UpdateUserRequest }
    >({
      query: ({ id, data }) => ({
        url: `user/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation<baseResponse<null>, string>({
      query: (id) => ({
        url: `user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
