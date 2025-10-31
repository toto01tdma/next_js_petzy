/**
 * Mock API Handler for Admin System
 * 
 * This module provides mock data responses when NEXT_PUBLIC_USE_API_MODE=false
 * Used for UI preview mode without making actual API requests
 */

import { ApiResponse } from './apiErrorHandler';

/**
 * Generate mock delay to simulate network latency
 */
const mockDelay = (ms: number = 300) => 
    new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get mock data based on URL pattern and method
 */
export async function getMockResponse<T = unknown>(
    url: string,
    method: string = 'GET',
    body?: unknown
): Promise<ApiResponse<T>> {
    await mockDelay(300);

    // Parse URL to extract endpoint
    const urlObj = new URL(url, 'http://localhost');
    const pathname = urlObj.pathname;
    const searchParams = urlObj.searchParams;

    // User Profiles endpoints
    if (pathname.includes('/api/admin/user_profiles')) {
        if (method === 'GET') {
            const page = parseInt(searchParams.get('page') || '1');
            const limit = parseInt(searchParams.get('limit') || '10');
            const role = searchParams.get('role') || 'USER';
            
            const mockCustomers = Array.from({ length: limit }, (_, i) => ({
                profile: {
                    id: `profile-${page}-${i + 1}`,
                    userId: `user-${page}-${i + 1}`,
                    firstName: 'Leslie',
                    lastName: 'Alexander',
                    fullName: 'Leslie Alexander',
                    avatarUrl: null,
                    dateOfBirth: '1990-01-15',
                    gender: 'female',
                    nationality: 'Thai',
                    nationalIdNumber: null,
                    corporateTaxId: null,
                    backupPhone: null,
                    additionalDetails: null,
                    preferences: null,
                    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
                    updatedAt: new Date(Date.now() - i * 86400000).toISOString()
                },
                user: {
                    id: `user-${page}-${i + 1}`,
                    email: `customer${i + 1}@example.com`,
                    phone: `064-2525${String(i + 1).padStart(3, '0')}`,
                    isEmailVerified: true,
                    isPhoneVerified: true,
                    status: 'active',
                    role: role,
                    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
                    updatedAt: new Date(Date.now() - i * 86400000).toISOString()
                }
            }));

            return {
                success: true,
                data: mockCustomers,
                pagination: {
                    currentPage: page,
                    pageSize: limit,
                    totalItems: 25,
                    totalPages: Math.ceil(25 / limit)
                }
            } as unknown as ApiResponse<T>;
        }
    }

    // Partner Approvals endpoints
    if (pathname.includes('/api/admin/partner_approvals')) {
        if (method === 'GET') {
            const page = parseInt(searchParams.get('page') || '1');
            const limit = parseInt(searchParams.get('limit') || '10');
            const status = searchParams.get('status');
            
            const mockPartners = Array.from({ length: limit }, (_, i) => ({
                id: `partner-${page}-${i + 1}`,
                userId: `user-${page}-${i + 1}`,
                accommodationId: `Pz${String(page * 100 + i + 1).padStart(5, '0')}`,
                status: status || (i % 2 === 0 ? 'APPROVED' : 'PENDING'),
                user: {
                    email: `partner${i + 1}@example.com`,
                    firstName: 'Leslie',
                    lastName: 'Alexander',
                    fullName: 'Leslie Alexander'
                },
                accommodation: {
                    name: `โรงแรมสับชายดี ${i + 1}`,
                    nameEn: `Hotel Sabchaydee ${i + 1}`,
                    address: '2972 Westheimer Rd. Santa Ana, Illinois 85486'
                },
                review: {
                    reviewedBy: status === 'APPROVED' ? 'admin-1' : null,
                    reviewedAt: status === 'APPROVED' ? new Date().toISOString() : null,
                    reviewNotes: status === 'APPROVED' ? 'Approved for preview' : null,
                    rejectionReason: null,
                    reviewer: status === 'APPROVED' ? { id: 'admin-1', name: 'Admin' } : null
                },
                submittedAt: new Date(Date.now() - i * 86400000).toISOString(),
                approvedAt: status === 'APPROVED' ? new Date(Date.now() - i * 43200000).toISOString() : null,
                createdAt: new Date(Date.now() - i * 86400000).toISOString(),
                updatedAt: new Date(Date.now() - i * 86400000).toISOString()
            }));

            return {
                success: true,
                data: mockPartners,
                pagination: {
                    currentPage: page,
                    pageSize: limit,
                    totalItems: 20,
                    totalPages: Math.ceil(20 / limit)
                }
            } as unknown as ApiResponse<T>;
        }

        if (method === 'POST' || method === 'PATCH' || method === 'PUT') {
            // Mock approval/rejection
            const bodyObj = body && typeof body === 'object' ? body as Record<string, unknown> : {};
            return {
                success: true,
                message: method === 'POST' ? 'Approval submitted successfully' : 'Status updated successfully',
                data: {
                    id: 'partner-1',
                    status: (typeof bodyObj.status === 'string' ? bodyObj.status : 'APPROVED') as string,
                    reviewedAt: new Date().toISOString()
                }
            } as ApiResponse<T>;
        }
    }

    // Chat endpoints
    if (pathname.includes('/api/chats/conversations')) {
        if (pathname.includes('/messages')) {
            // Get messages for a conversation
            const conversationId = pathname.split('/').pop()?.replace('/messages', '') || 'conv-1';
            const mockMessages = [
                {
                    id: 'msg-1',
                    conversation_id: conversationId,
                    sender: {
                        id: 'user-1',
                        name: 'Alexandra Michu',
                        role: 'partner',
                        online: true
                    },
                    content: 'แจ้งขอยกเลิกห้องพัก',
                    message_type: 'text',
                    sent_at: new Date(Date.now() - 60000).toISOString(),
                    read_at: new Date().toISOString(),
                    delivered_at: new Date().toISOString()
                },
                {
                    id: 'msg-2',
                    conversation_id: conversationId,
                    sender: {
                        id: 'admin-1',
                        name: 'Petzy Support',
                        role: 'admin',
                        online: true
                    },
                    content: 'สวัสดีค่ะ กรุณายกเลิกโรงแรมของคุณ',
                    message_type: 'text',
                    sent_at: new Date().toISOString(),
                    read_at: null,
                    delivered_at: new Date().toISOString()
                }
            ];

            return {
                success: true,
                data: { messages: mockMessages }
            } as ApiResponse<T>;
        }

        if (pathname.includes('/mark-read')) {
            return {
                success: true,
                message: 'Marked as read'
            } as ApiResponse<T>;
        }

        if (method === 'GET') {
            // Get conversations list
            const status = searchParams.get('status') || 'open';
            const mockConversations = [
                {
                    id: 'conv-1',
                    participant: {
                        id: 'user-1',
                        name: 'Andreana Viola',
                        role: 'partner',
                        online: true
                    },
                    last_message: {
                        id: 'msg-1',
                        conversation_id: 'conv-1',
                        sender: {
                            id: 'user-1',
                            name: 'Andreana Viola',
                            role: 'partner',
                            online: true
                        },
                        content: 'Hi, How are you today?',
                        message_type: 'text',
                        sent_at: new Date().toISOString(),
                        read_at: null,
                        delivered_at: new Date().toISOString()
                    },
                    unread_count: 2,
                    status: status,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    id: 'conv-2',
                    participant: {
                        id: 'user-2',
                        name: 'Francesco Long',
                        role: 'partner',
                        online: false
                    },
                    last_message: {
                        id: 'msg-2',
                        conversation_id: 'conv-2',
                        sender: {
                            id: 'admin-1',
                            name: 'Petzy Support',
                            role: 'admin',
                            online: true
                        },
                        content: 'ฉันจะช่วยคุณได้อย่างไร',
                        message_type: 'text',
                        sent_at: new Date(Date.now() - 3600000).toISOString(),
                        read_at: null,
                        delivered_at: new Date().toISOString()
                    },
                    unread_count: 0,
                    status: status,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ].filter(conv => conv.status === status);

            return {
                success: true,
                data: { conversations: mockConversations }
            } as ApiResponse<T>;
        }

        if (method === 'POST' && pathname.endsWith('/messages')) {
            // Send message
            const bodyObj = body && typeof body === 'object' ? body as Record<string, unknown> : {};
            const mockMessage = {
                id: `msg-${Date.now()}`,
                conversation_id: (typeof bodyObj.conversation_id === 'string' ? bodyObj.conversation_id : 'conv-1') as string,
                sender: {
                    id: 'admin-1',
                    name: 'Admin',
                    role: 'admin',
                    online: true
                },
                content: (typeof bodyObj.content === 'string' ? bodyObj.content : '') as string,
                message_type: (typeof bodyObj.message_type === 'string' ? bodyObj.message_type : 'text') as string,
                sent_at: new Date().toISOString(),
                read_at: null,
                delivered_at: null
            };

            return {
                success: true,
                data: mockMessage
            } as ApiResponse<T>;
        }
    }

    // Petzy App Banner endpoints
    if (pathname.includes('/api/admin/app-banner')) {
        if (method === 'GET') {
            return {
                success: true,
                data: {
                    bannerUrl: null,
                    isEnabled: false
                }
            } as ApiResponse<T>;
        }

        if (method === 'POST' || method === 'PUT') {
            return {
                success: true,
                message: 'Banner updated successfully',
                data: {
                    bannerUrl: 'https://example.com/banner.jpg',
                    isEnabled: true
                }
            } as ApiResponse<T>;
        }
    }

    // Policy endpoints
    if (pathname.includes('/api/admin/policy')) {
        if (method === 'GET') {
            return {
                success: true,
                data: {
                    id: 'policy-1',
                    title: 'Privacy Policy',
                    content: 'This is a sample privacy policy content...',
                    version: '1.0',
                    uploaded_by: 'admin',
                    file_url: null,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            } as ApiResponse<T>;
        }

        if (method === 'POST' || method === 'PUT') {
            const bodyObj = body && typeof body === 'object' ? body as Record<string, unknown> : {};
            return {
                success: true,
                message: 'Policy updated successfully',
                data: {
                    id: 'policy-1',
                    ...bodyObj
                }
            } as ApiResponse<T>;
        }
    }

    // Promotions endpoints
    if (pathname.includes('/api/admin/promotions')) {
        if (method === 'GET') {
            const page = parseInt(searchParams.get('page') || '1');
            const limit = parseInt(searchParams.get('limit') || '10');
            
            const mockPromotions = Array.from({ length: limit }, (_, i) => ({
                id: `promo-${page}-${i + 1}`,
                title: `Promotion ${i + 1}`,
                description: `Sample promotion description ${i + 1}`,
                discount: (i + 1) * 10,
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 86400000 * 30).toISOString(),
                isActive: i % 2 === 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }));

            return {
                success: true,
                data: mockPromotions,
                pagination: {
                    currentPage: page,
                    pageSize: limit,
                    totalItems: 15,
                    totalPages: Math.ceil(15 / limit)
                }
            } as unknown as ApiResponse<T>;
        }

        if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
            const bodyObj = body && typeof body === 'object' ? body as Record<string, unknown> : {};
            return {
                success: true,
                message: 'Promotion saved successfully',
                data: {
                    id: `promo-${Date.now()}`,
                    ...bodyObj
                }
            } as ApiResponse<T>;
        }

        if (method === 'DELETE') {
            return {
                success: true,
                message: 'Promotion deleted successfully'
            } as ApiResponse<T>;
        }
    }

    // Transactions endpoints
    if (pathname.includes('/api/admin/transactions')) {
        if (method === 'GET') {
            const page = parseInt(searchParams.get('page') || '1');
            const limit = parseInt(searchParams.get('limit') || '10');
            
            const mockTransactions = Array.from({ length: limit }, (_, i) => ({
                id: `trans-${page}-${i + 1}`,
                userId: `user-${i + 1}`,
                amount: (i + 1) * 1000,
                status: i % 3 === 0 ? 'completed' : i % 3 === 1 ? 'pending' : 'failed',
                type: i % 2 === 0 ? 'booking' : 'refund',
                createdAt: new Date(Date.now() - i * 3600000).toISOString(),
                updatedAt: new Date(Date.now() - i * 3600000).toISOString()
            }));

            return {
                success: true,
                data: mockTransactions,
                pagination: {
                    currentPage: page,
                    pageSize: limit,
                    totalItems: 30,
                    totalPages: Math.ceil(30 / limit)
                }
            } as unknown as ApiResponse<T>;
        }
    }

    // Dashboard/Stats endpoints
    if (pathname.includes('/api/admin/stats') || pathname.includes('/api/admin/dashboard')) {
        return {
            success: true,
            data: {
                totalPartners: 8,
                totalCustomers: 40,
                totalBookings: 150,
                totalRevenue: 500000,
                recentBookings: [
                    {
                        id: 'booking-1',
                        customer: 'Tex25258',
                        hotel: 'โรงแรมสับชายดี',
                        time: '18:00 น',
                        status: 'กำลังจองห้องพัก'
                    }
                ]
            }
        } as ApiResponse<T>;
    }

    // Profile endpoints
    if (pathname.includes('/api/admin/profile')) {
        if (method === 'GET') {
            return {
                success: true,
                data: {
                    id: 'admin-1',
                    email: 'admin@petzy.com',
                    name: 'Admin User',
                    role: 'admin',
                    avatarUrl: null,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            } as ApiResponse<T>;
        }

        if (method === 'PUT' || method === 'PATCH') {
            const bodyObj = body && typeof body === 'object' ? body as Record<string, unknown> : {};
            return {
                success: true,
                message: 'Profile updated successfully',
                data: {
                    id: 'admin-1',
                    ...bodyObj
                }
            } as ApiResponse<T>;
        }
    }

    // Login/Auth endpoints - return success for mock
    if (pathname.includes('/api/auth/login') || pathname.includes('/api/admin/login')) {
        return {
            success: true,
            message: 'Login successful (mock mode)',
            data: {
                accessToken: 'mock-token-' + Date.now(),
                refreshToken: 'mock-refresh-token',
                user: {
                    id: 'admin-1',
                    email: 'admin@petzy.com',
                    name: 'Admin User',
                    role: 'admin'
                }
            }
        } as ApiResponse<T>;
    }

    // Default response for unmatched endpoints
    return {
        success: true,
        message: 'Mock response - endpoint not specifically handled',
        data: {} as T
    } as ApiResponse<T>;
}
