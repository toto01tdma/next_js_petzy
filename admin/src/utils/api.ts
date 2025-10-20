/**
 * API Utility with Automatic Authentication Error Handling
 * 
 * This utility provides a wrapper around fetch that automatically:
 * - Adds authentication headers
 * - Handles authentication errors (401, token expiration)
 * - Redirects to appropriate login page
 * - Clears expired tokens
 */

import { handleApiError, isAuthenticationError, ApiResponse, ApiErrorResponse } from './apiErrorHandler';

/**
 * Detect current system (partner or admin) based on URL pathname
 */
const getCurrentSystem = (): 'partner' | 'admin' => {
    if (typeof window === 'undefined') return 'partner';
    const pathname = window.location.pathname;
    return pathname.startsWith('/admin') ? 'admin' : 'partner';
};

/**
 * Get appropriate login page based on current system
 */
const getLoginPage = (): string => {
    const system = getCurrentSystem();
    return system === 'admin' ? '/admin/login' : '/partner/login';
};

/**
 * Clear all authentication data from localStorage
 */
const clearAuthData = () => {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('approvalStatus');
    localStorage.removeItem('accommodationName');
};

/**
 * Handle authentication error - clear tokens and redirect
 */
const handleAuthError = () => {
    clearAuthData();
    const loginPage = getLoginPage();
    
    if (typeof window !== 'undefined') {
        // Redirect after a short delay
        setTimeout(() => {
            window.location.href = loginPage;
        }, 1500);
    }
};

/**
 * Enhanced fetch with automatic authentication error handling
 * 
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @returns Promise with typed response
 * 
 * @example
 * const result = await apiFetch<{ user: User }>('/api/user/profile');
 * if (result.success) {
 *   console.log(result.data.user);
 * }
 */
export async function apiFetch<T = unknown>(
    url: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        // Get token from localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        
        // Prepare headers
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...((options.headers as Record<string, string>) || {}),
        };
        
        // Add authorization header if token exists
        if (token && !headers['Authorization']) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Make the fetch call
        const response = await fetch(url, {
            ...options,
            headers,
        });
        
        // Parse JSON response
        const data = await response.json();
        
        // Check for authentication errors first
        if (response.status === 401 || isAuthenticationError(data)) {
            console.warn('Authentication error detected - clearing tokens and redirecting');
            handleAuthError();
            
            return {
                success: false,
                error: 'Authentication failed',
                message: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง',
                code: 'AUTHENTICATION_ERROR'
            };
        }
        
        // Handle other error responses
        if (!response.ok || data.success === false) {
            handleApiError(response, data);
            return data;
        }
        
        // Return successful response
        return data;
        
    } catch (error) {
        console.error('API Fetch Error:', error);
        
        return {
            success: false,
            error: 'Network Error',
            message: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้'
        };
    }
}

/**
 * GET request with authentication handling
 */
export async function apiGet<T = unknown>(url: string): Promise<ApiResponse<T>> {
    return apiFetch<T>(url, { method: 'GET' });
}

/**
 * POST request with authentication handling
 */
export async function apiPost<T = unknown>(url: string, body?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return apiFetch<T>(url, {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
    });
}

/**
 * PUT request with authentication handling
 */
export async function apiPut<T = unknown>(url: string, body?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return apiFetch<T>(url, {
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined,
    });
}

/**
 * PATCH request with authentication handling
 */
export async function apiPatch<T = unknown>(url: string, body?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return apiFetch<T>(url, {
        method: 'PATCH',
        body: body ? JSON.stringify(body) : undefined,
    });
}

/**
 * DELETE request with authentication handling
 */
export async function apiDelete<T = unknown>(url: string): Promise<ApiResponse<T>> {
    return apiFetch<T>(url, { method: 'DELETE' });
}

/**
 * Upload file with authentication handling
 */
export async function apiUpload<T = unknown>(
    url: string,
    formData: FormData
): Promise<ApiResponse<T>> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                // Don't set Content-Type for FormData - browser will set it with boundary
            },
            body: formData,
        });
        
        const data = await response.json();
        
        // Check for authentication errors
        if (response.status === 401 || isAuthenticationError(data)) {
            console.warn('Authentication error detected - clearing tokens and redirecting');
            handleAuthError();
            
            return {
                success: false,
                error: 'Authentication failed',
                message: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง',
                code: 'AUTHENTICATION_ERROR'
            };
        }
        
        // Handle other error responses
        if (!response.ok || data.success === false) {
            handleApiError(response, data);
            return data;
        }
        
        return data;
        
    } catch (error) {
        console.error('API Upload Error:', error);
        
        return {
            success: false,
            error: 'Network Error',
            message: 'ไม่สามารถอัปโหลดไฟล์ได้'
        };
    }
}

/**
 * Check authentication manually in existing code
 * 
 * @param response - Fetch response object
 * @param data - Parsed JSON data
 * @returns true if authentication error detected
 * 
 * @example
 * const response = await fetch(url);
 * const data = await response.json();
 * 
 * if (checkAuthError(response, data)) {
 *   return; // Will auto-redirect to login
 * }
 */
export function checkAuthError(response: Response, data: ApiResponse | ApiErrorResponse): boolean {
    if (response.status === 401 || isAuthenticationError(data)) {
        console.warn('Authentication error detected - clearing tokens and redirecting');
        handleAuthError();
        return true;
    }
    return false;
}

