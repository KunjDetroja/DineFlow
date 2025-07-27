import axios from "axios";

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Configure axios instance for inquiry APIs
export const axiosClient = axios.create({
  baseURL: `${API_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  status: number;
}
