'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/shared/Sidebar';
import { Select, Calendar, Spin, Avatar } from 'antd';
import { API_BASE_URL, USE_API_MODE } from '@/config/api';
import { checkAuthError } from '@/utils/api';
import { getProfileImageUrl } from '@/utils/profileImageUrl';

interface Conversation {
    id: string;
    participant: {
        id: string;
        name: string;
        avatar: string | null;
    } | null;
    last_message: {
        content: string;
        sent_at: string;
    } | null;
    unread_count: number;
}

interface Booking {
    id: string;
    bookingNumber: string;
    customerName: string;
    accommodationName: string;
    bookingTime: string;
    status: string;
    paymentStatus: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [loadingBookings, setLoadingBookings] = useState(false);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }
        setIsLoading(false);
        fetchConversations();
        fetchTodayBookings();
    }, [router]);

    const fetchConversations = async () => {
        if (!USE_API_MODE) return;
        
        try {
            setLoadingMessages(true);
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/api/chats/conversations?status=open&limit=5`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();
            if (checkAuthError(response, result)) return;

            if (result.success && result.data) {
                setConversations(result.data.conversations || []);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoadingMessages(false);
        }
    };

    const fetchTodayBookings = async () => {
        if (!USE_API_MODE) return;
        
        try {
            setLoadingBookings(true);
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/api/admin/bookings/today`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();
            if (checkAuthError(response, result)) return;

            if (result.success && result.data) {
                setBookings(result.data || []);
            }
        } catch (error) {
            console.error('Error fetching today bookings:', error);
        } finally {
            setLoadingBookings(false);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        return `${day}/${month}`;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1" style={{ marginLeft: '250px' }}>
                {/* Header with Gradient */}
                <div className="p-6" style={{ 
                    background: 'linear-gradient(to right, #C6CEDE, #FFFFFF)',
                }}>
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold" style={{ color: '#333333' }}>
                            หน้ารวมรายการ
                        </h1>
                        <div className="flex items-center gap-4">
                            {/* Date and Time Display */}
                            <div className="flex items-center gap-2">
                                <span style={{ color: '#666666' }}>🕐 16:00น.</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-gray-100 rounded">
                                    <span style={{ fontSize: '20px' }}>🔔</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6" style={{backgroundColor: "#FFFFFF"}}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Section - 2 columns */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Work Overview Section */}
                            <div>
                                <h2 className="text-lg font-semibold mb-4" style={{ color: '#333333' }}>
                                    ภาพรวมการทำงาน
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Partner Progress */}
                                    <div className="p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-base font-medium" style={{ color: '#666666' }}>Partner</h3>
                                            <button className="text-sm" style={{ color: '#999999' }}>⋮</button>
                                        </div>
                                        <div className="mb-2">
                                            <div className="text-sm mb-1" style={{ color: '#666666' }}>Progress</div>
                                            <div className="text-2xl font-bold" style={{ color: '#5B8DEE' }}>55%</div>
                                        </div>
                                        <div className="w-full rounded-full mb-2" style={{ backgroundColor: '#E0E0E0', height: '8px' }}>
                                            <div className="rounded-full" style={{ backgroundColor: '#5B8DEE', height: '8px', width: '55%' }}></div>
                                        </div>
                                        <div className="text-sm" style={{ color: '#666666' }}>8/100</div>
                                    </div>

                                    {/* Customer Progress */}
                                    <div className="p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-base font-medium" style={{ color: '#666666' }}>CUSTOMER</h3>
                                            <button className="text-sm" style={{ color: '#999999' }}>⋮</button>
                                        </div>
                                        <div className="mb-2">
                                            <div className="text-sm mb-1" style={{ color: '#666666' }}>Progress</div>
                                            <div className="text-2xl font-bold" style={{ color: '#FF69B4' }}>30%</div>
                                        </div>
                                        <div className="w-full rounded-full mb-2" style={{ backgroundColor: '#E0E0E0', height: '8px' }}>
                                            <div className="rounded-full" style={{ backgroundColor: '#FF69B4', height: '8px', width: '30%' }}></div>
                                        </div>
                                        <div className="text-sm" style={{ color: '#666666' }}>8/40</div>
                                    </div>

                                    {/* Petzy App Progress */}
                                    <div className="p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-base font-medium" style={{ color: '#666666' }}>Petzy App</h3>
                                            <button className="text-sm" style={{ color: '#999999' }}>⋮</button>
                                        </div>
                                        <div className="mb-2">
                                            <div className="text-sm mb-1" style={{ color: '#666666' }}>Progress</div>
                                            <div className="text-2xl font-bold" style={{ color: '#FFA500' }}>89%</div>
                                        </div>
                                        <div className="w-full rounded-full mb-2" style={{ backgroundColor: '#E0E0E0', height: '8px' }}>
                                            <div className="rounded-full" style={{ backgroundColor: '#FFA500', height: '8px', width: '89%' }}></div>
                                        </div>
                                        <div className="text-sm" style={{ color: '#666666' }}>-</div>
                                    </div>
                                </div>
                            </div>

                            {/* Booking List Section */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold" style={{ color: '#333333' }}>
                                        รายการจอง วันนี้ <span style={{ color: '#999999' }}>({bookings.length})</span>
                                    </h2>
                                    <button 
                                        className="text-sm" 
                                        style={{ color: '#5B8DEE' }}
                                        onClick={() => router.push('/bookings')}
                                    >
                                        ดูทั้งหมด →
                                    </button>
                                </div>

                                {/* Booking Items */}
                                {loadingBookings ? (
                                    <div className="flex justify-center items-center py-8">
                                        <Spin />
                                    </div>
                                ) : bookings.length === 0 ? (
                                    <div className="text-center py-8" style={{ color: '#999999' }}>
                                        ไม่มีรายการจองวันนี้
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {bookings.map((booking) => (
                                            <div 
                                                key={booking.id}
                                                className="p-4 rounded-lg flex items-center justify-between"
                                                style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <input type="checkbox" className="mr-2" style={{ width: '18px', height: '18px' }} />
                                                    <div>
                                                        <div className="font-medium" style={{ color: '#333333' }}>
                                                            {booking.customerName} จองห้องพัก {booking.bookingNumber} /{booking.bookingTime} น /{booking.accommodationName}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="px-3 py-1 rounded text-sm" style={{ backgroundColor: '#FFF3E0', color: '#F57C00' }}>
                                                        {booking.status === 'PENDING' ? 'กำลังจองห้องพัก' : booking.status}
                                                    </span>
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E0E0E0' }}>
                                                        <span className="text-xs">👤</span>
                                                    </div>
                                                    <button className="text-sm" style={{ color: '#999999' }}>⋮</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Popular Services Section */}
                            <div>
                                <h2 className="text-lg font-semibold mb-4" style={{ color: '#333333' }}>
                                    ภาพรวมบริการที่ได้รับความนิยม
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    <button 
                                        className="px-6 py-2 rounded-lg font-medium"
                                        style={{ backgroundColor: '#17A2B8', color: '#FFFFFF' }}
                                    >
                                        บริการห้องพัก
                                    </button>
                                    <button 
                                        className="px-6 py-2 rounded-lg font-medium"
                                        style={{ backgroundColor: '#17A2B8', color: '#FFFFFF' }}
                                    >
                                        บริการพิเศษ
                                    </button>
                                    <button 
                                        className="px-6 py-2 rounded-lg font-medium"
                                        style={{ backgroundColor: '#17A2B8', color: '#FFFFFF' }}
                                    >
                                        บริการรับฝากสัตว์เลี้ยง
                                    </button>
                                </div>
                            </div>

                            {/* Activity Chart */}
                            <div className="p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold" style={{ color: '#333333' }}>Activity</h2>
                                    <Select 
                                        defaultValue="weekly" 
                                        style={{ width: 120 }}
                                        options={[
                                            { value: 'weekly', label: 'Weekly' },
                                            { value: 'monthly', label: 'Monthly' },
                                            { value: 'yearly', label: 'Yearly' }
                                        ]}
                                    />
                                </div>
                                {/* Simple Line Chart Representation */}
                                <div className="relative h-64" style={{ backgroundColor: '#F9F9F9', borderRadius: '8px', padding: '20px' }}>
                                    <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="none">
                                        <polyline
                                            fill="none"
                                            stroke="#5B8DEE"
                                            strokeWidth="3"
                                            points="0,150 100,120 200,80 300,140 400,50 500,100 600,130 700,80 800,100"
                                        />
                                        <circle cx="400" cy="50" r="6" fill="#5B8DEE" />
                                    </svg>
                                    <div className="absolute" style={{ bottom: '40px', left: '50%', transform: 'translateX(-50%)' }}>
                                        <div className="px-3 py-1 rounded" style={{ backgroundColor: '#333333', color: '#FFFFFF' }}>
                                            <div className="text-xs">5 tasks</div>
                                            <div className="text-xs">Almost completed</div>
                                        </div>
                                    </div>
                                    {/* X-axis labels */}
                                    <div className="flex justify-between mt-4">
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                            <span key={day} className="text-xs" style={{ color: day === 'Wed' ? '#5B8DEE' : '#999999' }}>
                                                {day}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Section - 1 column */}
                        <div className="space-y-6">
                            {/* Calendar */}
                            <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold" style={{ color: '#333333' }}>June 2025</h3>
                                    <div className="flex gap-2">
                                        <button className="text-sm" style={{ color: '#999999' }}>◀</button>
                                        <button className="text-sm" style={{ color: '#999999' }}>▶</button>
                                    </div>
                                </div>
                                <Calendar 
                                    fullscreen={false}
                                />
                            </div>

                            {/* Recent Messages */}
                            <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold" style={{ color: '#333333' }}>ข้อความใหม่ที่ส่งมาหา</h3>
                                </div>
                                {loadingMessages ? (
                                    <div className="flex justify-center items-center py-8">
                                        <Spin />
                                    </div>
                                ) : conversations.length === 0 ? (
                                    <div className="text-center py-8" style={{ color: '#999999' }}>
                                        ไม่มีข้อความใหม่
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {conversations.slice(0, 3).map((conv) => (
                                            <div key={conv.id} className="flex items-center gap-3">
                                                <Avatar 
                                                    src={conv.participant?.avatar ? getProfileImageUrl(conv.participant.avatar) : null}
                                                    style={{ backgroundColor: '#E0E0E0' }}
                                                >
                                                    {conv.participant?.name?.charAt(0) || '👤'}
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <div className="font-medium text-sm" style={{ color: '#333333' }}>
                                                                {conv.participant?.name || 'Unknown'}
                                                                {conv.unread_count > 0 && (
                                                                    <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs" style={{ backgroundColor: '#5B8DEE', color: '#FFFFFF' }}>
                                                                        {conv.unread_count}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-xs" style={{ color: '#999999' }}>
                                                                {conv.last_message?.content || 'ไม่มีข้อความ'}
                                                            </div>
                                                        </div>
                                                        <div className="text-xs" style={{ color: '#999999' }}>
                                                            {conv.last_message?.sent_at ? formatTime(conv.last_message.sent_at) : ''}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* See All Button */}
                                        <div className="text-center pt-2">
                                            <button 
                                                className="text-sm font-medium" 
                                                style={{ color: '#5B8DEE' }}
                                                onClick={() => router.push('/chats')}
                                            >
                                                See All
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
