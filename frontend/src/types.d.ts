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
  desc?: string;
  createdAt: string;
  updatedAt: string;
}

export interface createInquiryRequest {
  restaurantName: string;
  numberOfOutlets?: number;
  email: string;
  phone: string;
  name: string;
  desc?: string;
}

export interface getInquiryResponse {
  data:createInquiryResponse[];
  pagination: pagination;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
}
