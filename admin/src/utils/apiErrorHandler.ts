import Swal from 'sweetalert2';
import { USE_API_MODE } from '@/config/api';
import { getMockResponse } from './mockApi';

/**
 * API Error Response Interface
 */
export interface ApiErrorResponse {
    success: false;
    error: string;
    message?: string;
    code?: string;
    details?: unknown;
}

/**
 * API Success Response Interface
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
    code?: string;
}

/**
 * Get appropriate login page based on current system
 */
const getLoginPage = (): string => {
    return '/login'
};

/**
 * Handle authentication errors - clear tokens and redirect to login
 */
const handleAuthenticationError = (message?: string) => {
    // Clear all authentication data
    if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('approvalStatus');
        localStorage.removeItem('accommodationName');
    }
    
    // Show error message
    const errorMessage = message || 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง';
    showError('เซสชันหมดอายุ', errorMessage);
    
    // Redirect to appropriate login page after a short delay
    setTimeout(() => {
        const loginPage = getLoginPage();
        if (typeof window !== 'undefined') {
            window.location.href = loginPage;
        }
    }, 2000);
};

/**
 * Show error alert using SweetAlert2
 */
export const showError = (title: string, message: string) => {
    Swal.fire({
        icon: 'error',
        title: title,
        text: message,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#EF4444'
    });
};

/**
 * Show success alert using SweetAlert2
 */
export const showSuccess = (title: string, message: string) => {
    Swal.fire({
        icon: 'success',
        title: title,
        text: message,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#10B981'
    });
};

/**
 * Show warning alert using SweetAlert2
 */
export const showWarning = (title: string, message: string) => {
    Swal.fire({
        icon: 'warning',
        title: title,
        text: message,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#F59E0B'
    });
};

/**
 * Show info alert using SweetAlert2
 */
export const showInfo = (title: string, message: string) => {
    Swal.fire({
        icon: 'info',
        title: title,
        text: message,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#3B82F6'
    });
};

/**
 * Show confirmation dialog using SweetAlert2
 */
export const showConfirmation = async (
    title: string,
    message: string,
    confirmText: string = 'ยืนยัน',
    cancelText: string = 'ยกเลิก'
): Promise<boolean> => {
    const result = await Swal.fire({
        icon: 'question',
        title: title,
        text: message,
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        confirmButtonColor: '#3B82F6',
        cancelButtonColor: '#6B7280'
    });
    
    return result.isConfirmed;
};

/**
 * Handle API errors based on status code and error response
 */
export const handleApiError = (response: Response, errorData: ApiErrorResponse) => {
    const status = response.status;
    const errorCode = errorData.code;
    const errorMessage = errorData.message || errorData.error;
    
    // Handle authentication errors (401 or AUTHENTICATION_ERROR code)
    if (status === 401 || errorCode === 'AUTHENTICATION_ERROR') {
        handleAuthenticationError(errorMessage);
        return;
    }
    
    // Handle other error status codes
    switch (status) {
        case 400:
            showError('ข้อมูลไม่ถูกต้อง', errorMessage || 'กรุณาตรวจสอบข้อมูลที่กรอกและลองอีกครั้ง');
            break;
            
        case 403:
            showError('ไม่มีสิทธิ์เข้าถึง', errorMessage || 'คุณไม่มีสิทธิ์ในการเข้าถึงข้อมูลนี้');
            break;
            
        case 404:
            showError('ไม่พบข้อมูล', errorMessage || 'ไม่พบข้อมูลที่ต้องการ');
            break;
            
        case 409:
            showError('ข้อมูลซ้ำ', errorMessage || 'ข้อมูลนี้มีอยู่ในระบบแล้ว');
            break;
            
        case 422:
            showError('ข้อมูลไม่ถูกต้อง', errorMessage || 'ข้อมูลที่ส่งมาไม่ถูกต้องหรือไม่สมบูรณ์');
            break;
            
        case 500:
            showError('เกิดข้อผิดพลาด', errorMessage || 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ กรุณาลองอีกครั้งในภายหลัง');
            break;
            
        default:
            showError('เกิดข้อผิดพลาด', errorMessage || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
    }
};

/**
 * Generic API call wrapper with error handling
 */
export const apiCall = async <T = unknown>(
    url: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> => {
    // Check if we're in admin system and API mode is disabled
    const isAdminSystem = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
    
    if (isAdminSystem && !USE_API_MODE) {
        // Use mock data for preview mode
        console.log('[Mock API] Using mock data for apiCall:', url);
        
        try {
            const body = options.body ? JSON.parse(options.body as string) : undefined;
            const method = options.method || 'GET';
            return await getMockResponse<T>(url, method, body);
        } catch (error) {
            console.error('[Mock API] Error generating mock response:', error);
            return {
                success: false,
                error: 'Mock API Error',
                message: 'Failed to generate mock response'
            };
        }
    }
    
    // Normal API mode - proceed with real API call
    try {
        // Add authorization header if token exists
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...((options.headers as Record<string, string>) || {}),
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(url, {
            ...options,
            headers,
        });
        
        const data = await response.json();
        
        // Check if response is successful
        if (response.ok && data.success !== false) {
            return data;
        }
        
        // Handle error response
        handleApiError(response, data as ApiErrorResponse);
        
        return {
            success: false,
            error: data.error || 'Unknown error',
            message: data.message,
            code: data.code
        };
    } catch (error) {
        console.error('API Call Error:', error);
        showError('เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
        
        return {
            success: false,
            error: 'Network Error',
            message: 'Failed to connect to server'
        };
    }
};

/**
 * Check if error response indicates authentication failure
 */
export const isAuthenticationError = (response: ApiErrorResponse | ApiResponse): boolean => {
    return !!(
        response?.code === 'AUTHENTICATION_ERROR' ||
        response?.error === 'Invalid or expired token' ||
        response?.error === 'Unauthorized' ||
        (typeof response === 'object' && response?.success === false && 
         (response?.message?.includes('token') || response?.error?.includes('token')))
    );
};

