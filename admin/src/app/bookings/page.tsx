'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/shared/Sidebar';
import { Table, Input, Select, DatePicker, Button, Space, message, Tag } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { API_BASE_URL, USE_API_MODE } from '@/config/api';
import { checkAuthError } from '@/utils/api';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

interface Booking {
    id: string;
    bookingNumber: string;
    customer: {
        id: string;
        name: string;
        email: string;
    };
    accommodation: {
        id: string;
        name: string;
        imageUrl: string | null;
    };
    checkInDate: string;
    checkOutDate: string;
    dateRange: string;
    bookingTime: string;
    numberOfRooms: number;
    numberOfGuests: number;
    numberOfPets: number;
    totalAmount: number;
    status: string;
    statusThai: string;
    paymentStatus: string;
    paymentStatusThai: string;
    createdAt: string;
}

export default function AdminBookings() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    
    // Filters
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<string | undefined>(undefined);
    const [paymentStatus, setPaymentStatus] = useState<string | undefined>(undefined);
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }
        setIsLoading(false);
        fetchBookings();
    }, [router]);

    useEffect(() => {
        fetchBookings();
    }, [currentPage, pageSize, status, paymentStatus, dateRange]);

    const fetchBookings = async () => {
        if (!USE_API_MODE) return;
        
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            let url = `${API_BASE_URL}/api/admin/bookings?limit=${pageSize}&offset=${(currentPage - 1) * pageSize}`;
            
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (status) params.append('status', status);
            if (paymentStatus) params.append('paymentStatus', paymentStatus);
            if (dateRange && dateRange[0] && dateRange[1]) {
                params.append('startDate', dateRange[0].format('YYYY-MM-DD'));
                params.append('endDate', dateRange[1].format('YYYY-MM-DD'));
            }
            
            if (params.toString()) {
                url += '&' + params.toString();
            }
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();
            if (checkAuthError(response, result)) return;

            if (result.success) {
                setBookings(result.data || []);
                setTotal(result.total || 0);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            message.error('เกิดข้อผิดพลาดในการโหลดข้อมูลการจอง');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchBookings();
    };

    const handleReset = () => {
        setSearch('');
        setStatus(undefined);
        setPaymentStatus(undefined);
        setDateRange(null);
        setCurrentPage(1);
    };

    const getStatusColor = (status: string) => {
        const colorMap: Record<string, string> = {
            'PENDING': 'orange',
            'CONFIRMED': 'blue',
            'CANCELLED': 'red',
            'COMPLETED': 'green',
        };
        return colorMap[status] || 'default';
    };

    const getPaymentStatusColor = (status: string) => {
        const colorMap: Record<string, string> = {
            'PENDING': 'orange',
            'PAID': 'green',
            'FAILED': 'red',
            'REFUNDED': 'purple',
        };
        return colorMap[status] || 'default';
    };

    const columns: ColumnsType<Booking> = [
        {
            title: 'เลขที่จอง',
            dataIndex: 'bookingNumber',
            key: 'bookingNumber',
            width: 150,
        },
        {
            title: 'ลูกค้า',
            key: 'customer',
            render: (_, record) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{record.customer.name}</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>{record.customer.email}</div>
                </div>
            ),
        },
        {
            title: 'ที่พัก',
            dataIndex: ['accommodation', 'name'],
            key: 'accommodation',
        },
        {
            title: 'วันที่เช็คอิน',
            dataIndex: 'dateRange',
            key: 'dateRange',
            width: 150,
        },
        {
            title: 'จำนวนห้อง',
            dataIndex: 'numberOfRooms',
            key: 'numberOfRooms',
            width: 100,
            align: 'center',
        },
        {
            title: 'จำนวนผู้เข้าพัก',
            dataIndex: 'numberOfGuests',
            key: 'numberOfGuests',
            width: 120,
            align: 'center',
        },
        {
            title: 'จำนวนสัตว์เลี้ยง',
            dataIndex: 'numberOfPets',
            key: 'numberOfPets',
            width: 120,
            align: 'center',
        },
        {
            title: 'ยอดรวม',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            width: 120,
            align: 'right',
            render: (amount) => `฿${parseFloat(amount).toLocaleString()}`,
        },
        {
            title: 'สถานะ',
            dataIndex: 'statusThai',
            key: 'status',
            width: 120,
            render: (text, record) => (
                <Tag color={getStatusColor(record.status)}>{text}</Tag>
            ),
        },
        {
            title: 'สถานะการชำระเงิน',
            dataIndex: 'paymentStatusThai',
            key: 'paymentStatus',
            width: 150,
            render: (text, record) => (
                <Tag color={getPaymentStatusColor(record.paymentStatus)}>{text}</Tag>
            ),
        },
        {
            title: 'เวลาจอง',
            dataIndex: 'bookingTime',
            key: 'bookingTime',
            width: 100,
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
            <Sidebar />

            <div className="flex-1" style={{ marginLeft: '250px' }}>
                {/* Header */}
                <div className="p-6" style={{ 
                    background: 'linear-gradient(to right, #C6CEDE, #FFFFFF)'
                }}>
                    <h1 className="text-3xl font-bold" style={{ color: '#333333' }}>
                        รายการจองทั้งหมด
                    </h1>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        {/* Filters */}
                        <div className="mb-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Input
                                    placeholder="ค้นหาเลขที่จอง, ชื่อลูกค้า, หรือชื่อที่พัก"
                                    prefix={<SearchOutlined />}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onPressEnter={handleSearch}
                                    allowClear
                                />
                                <Select
                                    placeholder="สถานะการจอง"
                                    style={{ width: '100%' }}
                                    allowClear
                                    value={status}
                                    onChange={setStatus}
                                    options={[
                                        { value: 'PENDING', label: 'รอชำระ' },
                                        { value: 'CONFIRMED', label: 'ยืนยันแล้ว' },
                                        { value: 'CANCELLED', label: 'ยกเลิกแล้ว' },
                                        { value: 'COMPLETED', label: 'เสร็จสิ้น' },
                                    ]}
                                />
                                <Select
                                    placeholder="สถานะการชำระเงิน"
                                    style={{ width: '100%' }}
                                    allowClear
                                    value={paymentStatus}
                                    onChange={setPaymentStatus}
                                    options={[
                                        { value: 'PENDING', label: 'รอดำเนินการ' },
                                        { value: 'PAID', label: 'ชำระแล้ว' },
                                        { value: 'FAILED', label: 'ล้มเหลว' },
                                        { value: 'REFUNDED', label: 'คืนเงินแล้ว' },
                                    ]}
                                />
                                <RangePicker
                                    style={{ width: '100%' }}
                                    value={dateRange}
                                    onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null] | null)}
                                    format="YYYY-MM-DD"
                                    placeholder={['วันที่เริ่มต้น', 'วันที่สิ้นสุด']}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                                    ค้นหา
                                </Button>
                                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                                    รีเซ็ต
                                </Button>
                            </div>
                        </div>

                        {/* Table */}
                        <Table
                            columns={columns}
                            dataSource={bookings}
                            rowKey="id"
                            loading={loading}
                            pagination={{
                                current: currentPage,
                                pageSize: pageSize,
                                total: total,
                                showSizeChanger: true,
                                showTotal: (total) => `ทั้งหมด ${total} รายการ`,
                                onChange: (page, size) => {
                                    setCurrentPage(page);
                                    setPageSize(size);
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

