export interface baseResponse<T> {
  status_code: number;
  message: string;
  success: boolean;
  data?: T;
}

export interface pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface createInquiryResponse {
  restaurantName: string;
  numberOfOutlets: number;
  email: string;
  phone: string;
  name: string;
  _id: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface createInquiryRequest {
  restaurantName: string;
  numberOfOutlets?: number;
  email: string;
  phone: string;
  name: string;
  description?: string;
}

export interface getInquiryResponse {
  data: createInquiryResponse[];
  pagination: pagination;
}

export interface IUser {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  restaurantId?: string;
}

export interface IRestaurant {
  _id: string;
  name: string;
  logo?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRestaurantRequest {
  restaurant: {
    name: string;
    logo?: string;
  };
  user: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface CreateRestaurantResponse {
  restaurant: IRestaurant;
  user: IUser;
}

export interface GetAllRestaurantsResponse {
  data: IRestaurant[];
  pagination: pagination;
}
