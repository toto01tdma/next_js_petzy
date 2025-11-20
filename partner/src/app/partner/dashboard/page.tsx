'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/partner/shared/Sidebar';
import { MenuOutlined, CalendarOutlined, SearchOutlined, CheckCircleOutlined, HomeOutlined } from '@ant-design/icons';
import { Input, Select, Button, Spin, message, DatePicker } from 'antd';
import DataTable from '@/components/partner/shared/DataTable';
import { useApprovalStatus } from '@/hooks/useApprovalStatus';
import ApprovalModal from '@/components/partner/shared/ApprovalModal';
import { API_BASE_URL } from '@/config/api';
import type { Dayjs } from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

// Interfaces moved from partner.service.ts
interface BookingData {
  [key: string]: unknown;
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

interface BookingsResponse {
  success: boolean;
  data: BookingData[];
  total: number;
  limit: number;
  offset: number;
}

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [bookingsData, setBookingsData] = useState<BookingData[]>([]);
    const [isLoadingBookings, setIsLoadingBookings] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
    
    // Approval status check
    const { isApproved, isLoading: isLoadingApproval } = useApprovalStatus();

    // Function moved from partner.service.ts
    const getBookings = useCallback(async (params?: {
        search?: string;
        status?: string;
        startDate?: string;
        endDate?: string;
        limit?: number;
        offset?: number;
    }): Promise<BookingsResponse> => {
        try {
            const queryParams = new URLSearchParams();
            
            if (params?.search) queryParams.append('search', params.search);
            if (params?.status) queryParams.append('status', params.status);
            if (params?.startDate) queryParams.append('startDate', params.startDate);
            if (params?.endDate) queryParams.append('endDate', params.endDate);
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
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Fetch bookings data
    const fetchBookings = useCallback(async () => {
        setIsLoadingBookings(true);
        try {
            const params: any = {
                limit: 100,
                offset: 0,
            };

            // Add search if there's search text
            if (searchText.trim()) {
                params.search = searchText.trim();
            }

            // Add status filter if not 'all'
            if (statusFilter !== 'all') {
                const statusMap: Record<string, string> = {
                    'pending': 'PENDING',
                    'paid': 'PAID',
                };
                params.status = statusMap[statusFilter];
            }

            // Add date range filter if selected
            if (dateRange && dateRange[0] && dateRange[1]) {
                params.startDate = dateRange[0].format('YYYY-MM-DD');
                params.endDate = dateRange[1].format('YYYY-MM-DD');
            }

            const response = await getBookings(params);
            
            if (response.success) {
                setBookingsData(response.data);
            } else {
                message.error('ไม่สามารถโหลดข้อมูลการจองได้');
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            message.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
        } finally {
            setIsLoadingBookings(false);
        }
    }, [searchText, statusFilter, dateRange, getBookings]);

    // Load bookings on mount
    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    // Handle search button click
    const handleSearch = useCallback(() => {
        fetchBookings();
    }, [fetchBookings]);

    // Dashboard table columns configuration
    const dashboardColumns = [
        {
            title: 'รหัสการจอง',
            dataIndex: 'bookingCode',
            key: 'bookingCode',
        },
        {
            title: 'ชื่อลูกค้า',
            dataIndex: 'customerName',
            key: 'customerName',
        },
        {
            title: 'ยอดราคา',
            dataIndex: 'price',
            key: 'totalPrice',
            render: (text: string) => <span className="text-red-500">{text}</span>,
        },
        {
            title: 'เวลาในการจอง',
            dataIndex: 'budget',
            key: 'bookingTime',
        },
        {
            title: 'วันที่เข้าพัก',
            dataIndex: 'checkInDate',
            key: 'checkInDate',
        },
        {
            title: 'รายได้ของคุณ',
            dataIndex: 'dailyIncome',
            key: 'yourIncome',
        },
        {
            title: 'สถานะล่าสุด',
            dataIndex: 'paymentStatus',
            key: 'latestStatus',
            render: (status: string) => (
                <span className={`px-2 py-1 rounded text-xs ${status === 'รอดำเนินการ' ? 'bg-yellow-100 text-yellow-800' :
                    status === 'ชำระแล้ว' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                    {status}
                </span>
            ),
        },
        {
            title: 'อัพเดทสถานะ',
            dataIndex: 'updateStatus',
            key: 'updateStatus',
            render: (status: string) => (
                <span className={`px-2 py-1 rounded text-xs ${status === 'ชำระแล้ว' ? 'bg-green-100 text-green-800' :
                    status === 'รอชำระ' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {status}
                </span>
            ),
        },
        {
            title: 'รูปแบบที่ใช้บริการ',
            dataIndex: 'paymentMethod',
            key: 'serviceType',
            render: (method: string) => (
                <span className={`px-2 py-1 rounded text-xs ${method === 'โอนเงินออนไลน์' ? 'bg-blue-100 text-blue-800' :
                    method === 'สมาชิกสำคัญ' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {method}
                </span>
            ),
        },
        {
            title: 'ดูรายละเอียด',
            dataIndex: 'action',
            key: 'viewDetails',
            render: () => (
                <Button type="link" size="small">
                    👁️
                </Button>
            ),
        },
    ];


    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-gradient-to-r from-[#C6CEDE] to-[#FFFFFF] shadow-sm border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between" style={{backgroundColor: "inherit"}}>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleSidebar}
                                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                            >
                                <MenuOutlined className="text-xl" />
                            </button>
                            <h1 className="text-2xl font-semibold text-gray-800">Home</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <CalendarOutlined className="text-xl text-gray-600" />
                            <span className="text-gray-600">June 2025</span>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-auto p-6" style={{ backgroundColor: '#FFFFFF' }}>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gradient-to-r from-[#0097EC] to-[#003AD2] rounded-2xl p-6" style={{ color: '#FFFFFF' }}>
                            <div className="">
                                <div>
                                    <div className="flex items-center justify-between w-full">
                                        <h3 className="text-lg font-medium opacity-90">ลูกค้าที่พักของคุณ</h3>
                                        <HomeOutlined className='text-3xl' />
                                    </div>
                                    <p className="text-5xl" style={{ marginBottom: '0.5rem' }}>24</p>
                                    <p className="text-sm" style={{ marginBottom: '0rem' }}>คุณทำได้ดีมาก</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-[#1FD071] to-[#00A843] rounded-2xl p-6" style={{ color: '#FFFFFF' }}>
                            <div className="">
                                <div>
                                    <div className="flex items-center justify-between w-full">
                                        <h3 className="text-lg font-medium opacity-90">รายได้ทั้งหมดของคุณ</h3>
                                        <CheckCircleOutlined className='text-3xl' />
                                    </div>
                                    <p className="text-5xl" style={{ marginBottom: '0.5rem' }}>24</p>
                                    <p className="text-sm" style={{ marginBottom: '0rem' }}>คุณทำได้ดีมาก</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full border-1 border-black rounded-lg"></div>
                    {/* Table Section */}
                    <div className="">
                        <div className="py-3 px-2 border-gray-200">
                            <h2 className="text-3xl font-semibold text-gray-800 mb-4">รายงานสำคัญประจำวัน</h2>

                            {/* Filters */}
                            <div className="flex flex-wrap gap-4 items-center">
                                <div className="flex-1 min-w-64">
                                    <Input
                                        placeholder="ค้นหาจากชื่อหรือรหัสการจอง..."
                                        prefix={<SearchOutlined />}
                                        className="w-full min-h-[40px]"
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        onPressEnter={handleSearch}
                                    />
                                </div>
                                <RangePicker
                                    className="min-h-[40px]"
                                    format="DD/MM/YYYY"
                                    placeholder={['วันที่เริ่มต้น', 'วันที่สิ้นสุด']}
                                    value={dateRange}
                                    onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null] | null)}
                                />
                                <Button 
                                    type="primary" 
                                    icon={<SearchOutlined />}
                                    className="min-h-[40px] px-6"
                                    onClick={handleSearch}
                                    loading={isLoadingBookings}
                                >
                                    ค้นหา
                                </Button>
                                <Select 
                                    value={statusFilter}
                                    onChange={(value) => setStatusFilter(value)}
                                    className="w-40 min-h-[40px]"
                                >
                                    <Option value="all">ค้นหาสถานะ</Option>
                                    <Option value="pending">รอดำเนินการ</Option>
                                    <Option value="paid">ชำระแล้ว</Option>
                                </Select>
                            </div>
                        </div>

                        <div className="">
                            {isLoadingBookings ? (
                                <div className="flex justify-center items-center py-20">
                                    <Spin size="large" tip="กำลังโหลดข้อมูล..." />
                                </div>
                            ) : (
                                <DataTable
                                    columns={dashboardColumns}
                                    data={bookingsData}
                                />
                            )}
                        </div>
                    </div>
                </main>
            </div>
            
            {/* Approval Status Modal */}
            <ApprovalModal isOpen={!isLoadingApproval && !isApproved} />
        </div>
    );
}
