'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/shared/Sidebar';
import { Input, Button, Table, Space, DatePicker } from 'antd';
import { SearchOutlined, DownloadOutlined, EyeOutlined, CalendarOutlined } from '@ant-design/icons';
import { API_BASE_URL, USE_API_MODE } from '@/config/api';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';

interface UserProfile {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    fullName: string;
    avatarUrl: string | null;
    dateOfBirth: string | null;
    gender: string | null;
    nationality: string | null;
    nationalIdNumber: string | null;
    corporateTaxId: string | null;
    backupPhone: string | null;
    additionalDetails: string | null;
    preferences: Record<string, unknown> | null;
    createdAt: string;
    updatedAt: string;
}

interface User {
    id: string;
    email: string;
    phone: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    status: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

interface CustomerData {
    profile: UserProfile;
    user: User;
}

export default function AdminCustomers() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'all' | 'new'>('all');
    const [isLoading, setIsLoading] = useState(false);
    const [customers, setCustomers] = useState<CustomerData[]>([]);
    const [searchText, setSearchText] = useState('');
    const [selectedMonth, setSelectedMonth] = useState<Dayjs | null>(dayjs());
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }
        
        fetchCustomers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router, activeTab, pagination.current, pagination.pageSize, searchText]);

    const fetchCustomers = async () => {
        setIsLoading(true);
        try {
            if (!USE_API_MODE) {
                // Mock data for preview
                await new Promise(resolve => setTimeout(resolve, 500));
                const mockCustomers: CustomerData[] = Array.from({ length: 4 }, (_, i) => ({
                    profile: {
                        id: `profile-${i + 1}`,
                        userId: `user-${i + 1}`,
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
                        createdAt: '2025-05-12T00:00:00.000Z',
                        updatedAt: '2025-05-12T00:00:00.000Z'
                    },
                    user: {
                        id: `user-${i + 1}`,
                        email: 'georgia@example.com',
                        phone: '064-2525852',
                        isEmailVerified: true,
                        isPhoneVerified: true,
                        status: 'active',
                        role: 'USER',
                        createdAt: '2025-05-12T00:00:00.000Z',
                        updatedAt: '2025-05-12T00:00:00.000Z'
                    }
                }));
                setCustomers(mockCustomers);
                setPagination(prev => ({ ...prev, total: mockCustomers.length }));
            } else {
                const token = localStorage.getItem('accessToken');
                
                // Build query parameters
                const params = new URLSearchParams({
                    page: pagination.current.toString(),
                    limit: pagination.pageSize.toString(),
                    role: 'USER' // Only fetch regular users (customers)
                });
                
                if (searchText) {
                    params.append('name', searchText);
                }

                const response = await fetch(
                    `${API_BASE_URL}/api/admin/user_profiles?${params.toString()}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!response.ok) throw new Error('Failed to fetch customers');

                const result = await response.json();
                
                if (result.success) {
                    let filteredData = result.data || [];
                    
                    // For "new" tab, filter by date (e.g., last 30 days)
                    if (activeTab === 'new') {
                        const thirtyDaysAgo = dayjs().subtract(30, 'days');
                        filteredData = filteredData.filter((item: CustomerData) => 
                            dayjs(item.user.createdAt).isAfter(thirtyDaysAgo)
                        );
                    }
                    
                    setCustomers(filteredData);
                    setPagination(prev => ({
                        ...prev,
                        total: result.pagination?.totalItems || 0,
                    }));
                }
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = () => {
        setPagination(prev => ({ ...prev, current: 1 }));
        fetchCustomers();
    };

    const allColumns: ColumnsType<CustomerData> = [
        {
            title: '',
            key: 'checkbox',
            width: 50,
            render: () => (
                <input type="checkbox" className="w-4 h-4" />
            ),
        },
        {
            title: 'รายชื่อ ลูกค้า',
            key: 'fullName',
            render: (record: CustomerData) => (
                <div>
                    <div style={{ color: '#2C62D8', fontWeight: 500 }}>
                        โรงแรมสัตว์เลี้ยง
                    </div>
                    <div style={{ color: '#333333' }}>{record.profile.fullName}</div>
                </div>
            ),
        },
        {
            title: 'ข้อมูลติดต่อ',
            key: 'contact',
            render: (record: CustomerData) => (
                <div style={{ color: '#333333' }}>
                    <div>{record.user.email}</div>
                    <div>{record.user.phone}</div>
                </div>
            ),
        },
        {
            title: 'ประเภทบริการที่ใช้',
            key: 'serviceType',
            render: () => (
                <div style={{ color: '#333333' }}>
                    ยังไม่มีข้อมูล
                </div>
            ),
        },
        {
            title: 'วันที่สมัคร',
            key: 'registrationDate',
            render: (record: CustomerData) => (
                <div style={{ color: '#333333' }}>
                    {dayjs(record.user.createdAt).format('DD/MM/YY')}
                </div>
            ),
        },
        {
            title: 'พาร์ทเนอร์ที่ให้บริการ',
            key: 'partner',
            render: () => (
                <div style={{ color: '#333333' }}>
                    ยังไม่มีข้อมูล
                </div>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            width: 80,
            render: () => (
                <Space size="middle">
                    <button className="p-2 hover:bg-gray-100 rounded">
                        <EyeOutlined style={{ fontSize: '18px', color: '#666666' }} />
                    </button>
                </Space>
            ),
        },
    ];

    const newColumns: ColumnsType<CustomerData> = [
        {
            title: '',
            key: 'checkbox',
            width: 50,
            render: () => (
                <input type="checkbox" className="w-4 h-4" />
            ),
        },
        {
            title: 'รายชื่อ ลูกค้า',
            key: 'fullName',
            render: (record: CustomerData) => (
                <div>
                    <div style={{ color: '#2C62D8', fontWeight: 500 }}>
                        โรงแรมสัตว์เลี้ยง
                    </div>
                    <div style={{ color: '#333333' }}>{record.profile.fullName}</div>
                </div>
            ),
        },
        {
            title: 'ข้อมูลติดต่อ',
            key: 'contact',
            render: (record: CustomerData) => (
                <div style={{ color: '#333333' }}>
                    <div>{record.user.email}</div>
                    <div>{record.user.phone}</div>
                </div>
            ),
        },
        {
            title: 'ประเภทบริการที่ใช้',
            key: 'serviceType',
            render: () => (
                <div style={{ color: '#333333' }}>
                    ยังไม่มีข้อมูล
                </div>
            ),
        },
        {
            title: 'วันที่สมัคร',
            key: 'registrationDate',
            render: (record: CustomerData) => (
                <div style={{ color: '#333333' }}>
                    {dayjs(record.user.createdAt).format('DD/MM/YY')}
                </div>
            ),
        },
        {
            title: 'พาร์ทเนอร์ที่ให้บริการ',
            key: 'partner',
            render: () => (
                <div style={{ color: '#333333' }}>
                    ยังไม่มีข้อมูล
                </div>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            width: 80,
            render: () => (
                <Space size="middle">
                    <button className="p-2 hover:bg-gray-100 rounded">
                        <EyeOutlined style={{ fontSize: '18px', color: '#666666' }} />
                    </button>
                </Space>
            ),
        },
    ];

    const handleTableChange = (page: number, pageSize: number) => {
        setPagination(prev => ({
            ...prev,
            current: page,
            pageSize: pageSize,
        }));
    };

    return (
        <div className="flex min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
            <Sidebar />

            <div className="flex-1" style={{ marginLeft: '250px' }}>
                {/* Header */}
                <div className="p-6" style={{ 
                    background: 'linear-gradient(to right, #C6CEDE, #FFFFFF)'
                }}>
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold" style={{ color: '#333333' }}>
                            จัดการ ลูกค้า
                        </h1>
                        
                        {/* Month Selector */}
                        <div className="flex items-center gap-4">
                            <button className="p-2 hover:bg-gray-100 rounded">
                                <span style={{ color: '#666666' }}>◀</span>
                            </button>
                            <div className="flex items-center gap-2">
                                <CalendarOutlined style={{ fontSize: '20px', color: '#666666' }} />
                                <DatePicker
                                    value={selectedMonth}
                                    onChange={setSelectedMonth}
                                    picker="month"
                                    format="MMMM YYYY"
                                    style={{
                                        border: 'none',
                                        boxShadow: 'none'
                                    }}
                                    suffixIcon={null}
                                />
                            </div>
                            <button className="p-2 hover:bg-gray-100 rounded">
                                <span style={{ color: '#666666' }}>▶</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6" style={{backgroundColor: "#FFFFFF"}}>
                    {/* Tabs */}
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => setActiveTab('all')}
                            className="px-6 py-3 rounded-lg font-medium transition-colors"
                            style={{
                                backgroundColor: activeTab === 'all' ? '#0D263B' : '#4A4A4A',
                                color: '#FFFFFF'
                            }}
                        >
                            จัดการ ลูกค้า ทั้งหมด
                        </button>
                        <button
                            onClick={() => setActiveTab('new')}
                            className="px-6 py-3 rounded-lg font-medium transition-colors"
                            style={{
                                backgroundColor: activeTab === 'new' ? '#0D263B' : '#4A4A4A',
                                color: '#FFFFFF'
                            }}
                        >
                            จัดการ ลูกค้า ใหม่
                        </button>
                    </div>

                    {/* Search and Actions */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="Search for id, name Costumer"
                                prefix={<SearchOutlined style={{ color: '#999999' }} />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onPressEnter={handleSearch}
                                style={{
                                    width: '400px',
                                    height: '45px',
                                    borderRadius: '8px',
                                    border: '1px solid #D9D9D9'
                                }}
                            />
                        </div>
                        <Button
                            icon={<DownloadOutlined />}
                            style={{
                                height: '45px',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                border: '1px solid #D9D9D9'
                            }}
                        >
                            Export
                        </Button>
                    </div>

                    {/* Table */}
                    {activeTab === 'all' ? (
                        <Table
                            columns={allColumns}
                            dataSource={customers}
                            loading={isLoading}
                            rowKey={(record) => record.user.id}
                            pagination={{
                                current: pagination.current,
                                pageSize: pagination.pageSize,
                                total: pagination.total,
                                showSizeChanger: false,
                                onChange: handleTableChange,
                                position: ['bottomCenter'],
                                showTotal: (total, range) => (
                                    <span style={{ color: '#333333' }}>
                                        {range[0]} - {range[1]} of {total} Pages
                                    </span>
                                ),
                                itemRender: (page, type, originalElement) => {
                                    if (type === 'prev') {
                                        return <button style={{ color: '#333333' }}>‹</button>;
                                    }
                                    if (type === 'next') {
                                        return <button style={{ color: '#333333' }}>›</button>;
                                    }
                                    return originalElement;
                                },
                            }}
                            style={{
                                backgroundColor: '#FFFFFF',
                            }}
                        />
                    ) : (
                        <Table
                            columns={newColumns}
                            dataSource={customers}
                            loading={isLoading}
                            rowKey={(record) => record.user.id}
                            pagination={{
                                current: pagination.current,
                                pageSize: pagination.pageSize,
                                total: pagination.total,
                                showSizeChanger: false,
                                onChange: handleTableChange,
                                position: ['bottomCenter'],
                                showTotal: (total, range) => (
                                    <span style={{ color: '#333333' }}>
                                        {range[0]} - {range[1]} of {total} Pages
                                    </span>
                                ),
                                itemRender: (page, type, originalElement) => {
                                    if (type === 'prev') {
                                        return <button style={{ color: '#333333' }}>‹</button>;
                                    }
                                    if (type === 'next') {
                                        return <button style={{ color: '#333333' }}>›</button>;
                                    }
                                    return originalElement;
                                },
                            }}
                            style={{
                                backgroundColor: '#FFFFFF',
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
