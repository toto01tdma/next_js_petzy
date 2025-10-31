/**
 * Fetch Interceptor for Admin System
 * 
 * Intercepts all fetch calls when NEXT_PUBLIC_USE_API_MODE=false
 * and returns mock data instead of making actual API requests
 */

import { USE_API_MODE } from '@/config/api';
import { getMockResponse } from './mockApi';

let isInterceptorActive = false;

/**
 * Initialize fetch interceptor for admin system
 * This should be called early in the app initialization
 */
export function initializeFetchInterceptor() {
    // Only activate interceptor in admin system when API mode is disabled
    if (typeof window === 'undefined') return;
    
    const isAdminSystem = window.location.pathname.startsWith('/admin');
    
    if (!isAdminSystem || USE_API_MODE) {
        // Don't intercept - either not admin system or API mode is enabled
        return;
    }
    
    if (isInterceptorActive) {
        // Already initialized
        return;
    }
    
    console.log('[Mock API] Initializing fetch interceptor for admin preview mode');
    
    // Store original fetch
    const originalFetch = window.fetch;
    
    // Override fetch
    window.fetch = async function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
        const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
        
        // Only intercept API calls (calls to API_BASE_URL or relative API paths)
        const isApiCall = url.includes('/api/') || url.startsWith('http');
        
        if (!isApiCall) {
            // Let non-API calls through normally
            return originalFetch(input, init);
        }
        
        // Intercept API calls and return mock response
        console.log('[Mock API] Intercepting fetch call:', url);
        
        try {
            const method = init?.method || 'GET';
            let body: unknown = undefined;
            
            // Parse body if it exists
            if (init?.body) {
                if (init.body instanceof FormData) {
                    // For FormData, create a mock object
                    body = { 
                        isFormData: true,
                        file: 'mock-file-upload'
                    };
                } else if (typeof init.body === 'string') {
                    try {
                        body = JSON.parse(init.body);
                    } catch {
                        body = init.body;
                    }
                } else {
                    body = init.body;
                }
            }
            
            // Get mock response
            const mockResponse = await getMockResponse(url, method, body);
            
            // Create a Response object with the mock data
            return new Response(JSON.stringify(mockResponse), {
                status: mockResponse.success ? 200 : 400,
                statusText: mockResponse.success ? 'OK' : 'Bad Request',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error('[Mock API] Error generating mock response:', error);
            
            // Return error response
            return new Response(JSON.stringify({
                success: false,
                error: 'Mock API Error',
                message: 'Failed to generate mock response'
            }), {
                status: 500,
                statusText: 'Internal Server Error',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    } as typeof fetch;
    
    isInterceptorActive = true;
};

/**
 * Restore original fetch (for cleanup/testing)
 */
export function restoreFetch() {
    if (!isInterceptorActive || typeof window === 'undefined') return;
    
    // Note: We can't fully restore since we don't store the original reference
    // This is mainly for testing purposes
    isInterceptorActive = false;
    console.log('[Mock API] Fetch interceptor disabled (note: fetch may not be fully restored)');
}
