import { ApiResponse, axiosClient } from "./api";

interface InquiryData {
  restaurantName: string;
  numberOfOutlets?: number;
  email: string;
  phone: string;
  name: string;
  description?: string;
}

interface InquiryResponse {
  _id: string;
  restaurantName: string;
  numberOfOutlets?: number;
  email: string;
  phone: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Create Inquiry
export async function createInquiry(
  inquiryData: InquiryData
): Promise<ApiResponse<InquiryResponse>> {
  try {
    const response = await axiosClient.post<ApiResponse<InquiryResponse>>(
      "/inquiry/create",
      inquiryData
    );
    return response.data;
  } catch (error) {
    console.error("Create inquiry failed:", error);
    throw error;
  }
}

export type { InquiryData, InquiryResponse, ApiResponse };
