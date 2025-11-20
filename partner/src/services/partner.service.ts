import { API_BASE_URL } from '@/config/api';

export interface BookingData {
  key: string;
  bookingCode: string;
  customerName: string;
  price: string;
  budget: string;
  checkInDate: string;
  dailyIncome: string;
  paymentStatus: string;
  updateStatus: string;
  paymentMethod: string;
  bookingId: string;
}

export interface BookingsResponse {
  success: boolean;
  data: BookingData[];
  total: number;
  limit: number;
  offset: number;
}

export class PartnerService {
  /**
   * Get partner's accommodation bookings
   */
  static async getBookings(params?: {
    search?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<BookingsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.search) queryParams.append('search', params.search);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());

      const url = `${API_BASE_URL}/api/partner/bookings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }
}

