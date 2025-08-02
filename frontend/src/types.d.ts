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
  restaurant?: {
    _id: string;
    name: string;
    logo?: string;
  };
  outlet?: {
    _id: string;
    name: string;
    address?: string;
  };
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
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

export interface UpdateRestaurantRequest {
  name?: string;
  logo?: string;
  isActive?: boolean;
}

export interface UpdateRestaurantResponse {
  restaurant: IRestaurant;
}

export interface ITable {
  _id: string;
  outletId: string;
  tableNumber: number;
  isOccupied: boolean;
  currentOrder?: string;
  createdAt: string;
  updatedAt: string;
  outlet?: {
    _id: string;
    name: string;
    restaurantId: string;
  };
}

export interface CreateTableRequest {
  outletId: string;
  tableNumber: number;
}

export interface CreateTableResponse {
  table: ITable;
}

export interface GetAllTablesResponse {
  data: ITable[];
  pagination: pagination;
}

// Staff/User related interfaces
export interface CreateUserRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  restaurantId?: string;
  outletId?: string;
}

export interface CreateUserResponse {
  user: IUser;
}

export interface GetAllUsersResponse {
  data: IUser[];
  pagination: pagination;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  restaurantId?: string;
  outletId?: string;
  isActive?: boolean;
}

// Outlet related interfaces
export interface IOutlet {
  _id: string;
  restaurantId: string | {
    _id: string;
    name: string;
    logo?: string;
  };
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phone?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOutletRequest {
  restaurantId?: string; // Optional for admin, not needed for owner
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phone?: string;
}

export interface CreateOutletResponse {
  outlet: IOutlet;
}

export interface GetAllOutletsResponse {
  data: IOutlet[];
  pagination: pagination;
}

export interface UpdateOutletRequest {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  phone?: string;
  isActive?: boolean;
}

export interface UpdateOutletResponse {
  outlet: IOutlet;
}
