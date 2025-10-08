'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/shared/Sidebar';
import { Input, Button, Table, Space } from 'antd';
import { SearchOutlined, DownloadOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { API_BASE_URL, USE_API_MODE } from '@/config/api';
import type { ColumnsType } from 'antd/es/table';

interface AppPromotion {
    id: string;
    image: string;
    conditions: string;
    discountRate: string;
    amount: string;
    validFrom: string;
    validUntil: string;
}

interface PartnerPromotion {
    id: string;
    partnerName: string;
    email: string;
    phone: string;
    serviceTypes: string[];
    systemId: string;
    address: string;
}

export default function AdminPromotions() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'app' | 'partner'>('app');
    const [isLoading, setIsLoading] = useState(false);
    const [appPromotions, setAppPromotions] = useState<AppPromotion[]>([]);
    const [partnerPromotions, setPartnerPromotions] = useState<PartnerPromotion[]>([]);
    const [searchText, setSearchText] = useState('');
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
        
        fetchPromotions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router, activeTab, pagination.current, pagination.pageSize]);

    const fetchPromotions = async () => {
        setIsLoading(true);
        try {
            if (!USE_API_MODE) {
                await new Promise(resolve => setTimeout(resolve, 500));
                
                if (activeTab === 'app') {
                    const mockAppPromotions: AppPromotion[] = [
                        {
                            id: '1',
                            image: '/assets/images/logo/logo.png',
                            conditions: 'สำหรับลูกค้าที่จองบริการที่กว่า500 บาท',
                            discountRate: '5 %',
                            amount: '1000 ครั้ง',
                            validFrom: 'เริ่ม 20 ต.ค.68',
                            validUntil: 'สิ้นสุด 20 ก.ค. 68'
                        },
                        {
                            id: '2',
                            image: '/assets/images/logo/logo.png',
                            conditions: 'สำหรับลูกค้าที่จองบริการเกิน500 บาท',
                            discountRate: '5 %',
                            amount: '1000 ครั้ง',
                            validFrom: 'เริ่ม 20 ต.ค.68',
                            validUntil: 'สิ้นสุด 20 ก.ค. 68'
                        }
                    ];
                    setAppPromotions(mockAppPromotions);
                    setPagination(prev => ({ ...prev, total: mockAppPromotions.length }));
                } else {
                    const mockPartnerPromotions: PartnerPromotion[] = Array.from({ length: 8 }, (_, i) => ({
                        id: `partner-${i + 1}`,
                        partnerName: 'Leslie Alexander',
                        email: 'georgia@example.com',
                        phone: '064-2525852',
                        serviceTypes: ['โรงแรมสัตว์เลี้ยง', 'รับฝากสัตว์เลี้ยง', 'สปาสัตว์เลี้ยง'],
                        systemId: 'Pz25258',
                        address: '2972 Westheimer Rd. Santa Ana, Illinois 85486'
                    }));
                    setPartnerPromotions(mockPartnerPromotions);
                    setPagination(prev => ({ ...prev, total: mockPartnerPromotions.length }));
                }
            } else {
                const token = localStorage.getItem('accessToken');
                const endpoint = activeTab === 'app' 
                    ? '/api/admin/promotions/app'
                    : '/api/admin/promotions/partner';
                
                const response = await fetch(
                    `${API_BASE_URL}${endpoint}?page=${pagination.current}&limit=${pagination.pageSize}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!response.ok) throw new Error('Failed to fetch promotions');

                const data = await response.json();
                if (activeTab === 'app') {
                    setAppPromotions(data.data || []);
                } else {
                    setPartnerPromotions(data.data || []);
                }
                setPagination(prev => ({
                    ...prev,
                    total: data.pagination?.total || 0,
                }));
            }
        } catch (error) {
            console.error('Error fetching promotions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const appColumns: ColumnsType<AppPromotion> = [
        {
            title: '',
            key: 'checkbox',
            width: 50,
            render: () => (
                <input type="checkbox" className="w-4 h-4" />
            ),
        },
        {
            title: '',
            key: 'image',
            width: 150,
            render: () => (
                <div 
                    className="rounded-lg flex items-center justify-center"
                    style={{ 
                        width: '120px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #A855F7 0%, #8B5CF6 100%)',
                        position: 'relative'
                    }}
                >
                    <div style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: '20px' }}>
                        โปรโมชั่น
                    </div>
                    <div style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: '32px' }}>
                        5%
                    </div>
                    <div 
                        style={{ 
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            color: '#FFFFFF',
                            fontSize: '24px'
                        }}
                    >
                        🐾
                    </div>
                </div>
            ),
        },
        {
            title: 'ตั้งเงื่อนไข',
            key: 'conditions',
            render: (record: AppPromotion) => (
                <div style={{ color: '#333333' }}>
                    {record.conditions}
                    <div className="text-xs mt-1" style={{ color: '#666666' }}>
                        *1 คูปองต่อ 1 ผู้ใช้
                    </div>
                </div>
            ),
        },
        {
            title: 'เปอร์เซนต์ส่วนลด',
            key: 'discountRate',
            render: (record: AppPromotion) => (
                <div style={{ color: '#333333' }}>{record.discountRate}</div>
            ),
        },
        {
            title: 'จำนวนสิทธิ์',
            key: 'amount',
            render: (record: AppPromotion) => (
                <div style={{ color: '#333333' }}>{record.amount}</div>
            ),
        },
        {
            title: 'ระยะเวลาที่กำหนด',
            key: 'validity',
            render: (record: AppPromotion) => (
                <div style={{ color: '#333333' }}>
                    <div>{record.validFrom}</div>
                    <div>{record.validUntil}</div>
                </div>
            ),
        },
    ];

    const partnerColumns: ColumnsType<PartnerPromotion> = [
        {
            title: '',
            key: 'checkbox',
            width: 50,
            render: () => (
                <input type="checkbox" className="w-4 h-4" />
            ),
        },
        {
            title: 'รายชื่อ พาร์ทเนอร์',
            key: 'partnerName',
            render: (record: PartnerPromotion) => (
                <div>
                    <div style={{ color: '#2C62D8', fontWeight: 500 }}>
                        โรงแรมสัตว์เลี้ยง
                    </div>
                    <div style={{ color: '#333333' }}>{record.partnerName}</div>
                </div>
            ),
        },
        {
            title: 'ข้อมูลติดต่อ',
            key: 'contact',
            render: (record: PartnerPromotion) => (
                <div style={{ color: '#333333' }}>
                    <div>{record.email}</div>
                    <div>{record.phone}</div>
                </div>
            ),
        },
        {
            title: 'ประเภทบริการ',
            key: 'serviceTypes',
            render: (record: PartnerPromotion) => (
                <div style={{ color: '#333333' }}>
                    {record.serviceTypes.map((type, idx) => (
                        <div key={idx}>{type}</div>
                    ))}
                </div>
            ),
        },
        {
            title: 'รหัสระบบ',
            key: 'systemId',
            render: (record: PartnerPromotion) => (
                <div style={{ color: '#333333' }}>{record.systemId}</div>
            ),
        },
        {
            title: 'สถานที่ให้บริการ',
            key: 'address',
            render: (record: PartnerPromotion) => (
                <div style={{ color: '#333333' }}>{record.address}</div>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            width: 120,
            render: () => (
                <Space size="middle">
                    <button className="p-2 hover:bg-gray-100 rounded">
                        <EyeOutlined style={{ fontSize: '18px', color: '#666666' }} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded">
                        <EditOutlined style={{ fontSize: '18px', color: '#666666' }} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded">
                        <DeleteOutlined style={{ fontSize: '18px', color: '#FF4D4F' }} />
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
                    <h1 className="text-3xl font-bold" style={{ color: '#333333' }}>
                        จัดการ โปรโมชั่น
                    </h1>
                </div>

                {/* Content */}
                <div className="p-6" style={{backgroundColor: "#FFFFFF"}}>
                    {/* Tabs */}
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => setActiveTab('app')}
                            className="px-6 py-3 rounded-lg font-medium transition-colors"
                            style={{
                                backgroundColor: activeTab === 'app' ? '#0D263B' : '#4A4A4A',
                                color: '#FFFFFF'
                            }}
                        >
                            รายการโปรโมชั่นในแอป ทั้งหมด
                        </button>
                        <button
                            onClick={() => setActiveTab('partner')}
                            className="px-6 py-3 rounded-lg font-medium transition-colors"
                            style={{
                                backgroundColor: activeTab === 'partner' ? '#0D263B' : '#4A4A4A',
                                color: '#FFFFFF'
                            }}
                        >
                            รายการโปรโมชั่นของพาร์เนอร์ที่เข้าร่วม ทั้งหมด
                        </button>
                    </div>

                    {activeTab === 'partner' && (
                        <>
                            {/* Category Buttons */}
                            <div className="flex gap-4 mb-6">
                                <button
                                    className="px-6 py-3 rounded-lg font-medium"
                                    style={{
                                        backgroundColor: '#0D263B',
                                        color: '#FFFFFF'
                                    }}
                                >
                                    ประเภท ร้านค้าร่วมรายการลด 10 %
                                </button>
                                <button
                                    className="px-6 py-3 rounded-lg font-medium"
                                    style={{
                                        backgroundColor: '#4A4A4A',
                                        color: '#FFFFFF'
                                    }}
                                >
                                    ประเภท ร้านค้าร่วมรายการด้งยอดว่า 10 %
                                </button>
                            </div>

                            {/* Search and Actions */}
                            <div className="flex justify-between items-center mb-6">
                                <Input
                                    placeholder="Search for id, name Partner"
                                    prefix={<SearchOutlined style={{ color: '#999999' }} />}
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    style={{
                                        width: '400px',
                                        height: '45px',
                                        borderRadius: '8px',
                                        border: '1px solid #D9D9D9'
                                    }}
                                />
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
                        </>
                    )}

                    {activeTab === 'app' && (
                        <div className="mb-6">
                            <Button
                                size="large"
                                style={{
                                    backgroundColor: '#FDB930',
                                    color: '#000000',
                                    border: 'none',
                                    fontWeight: 600,
                                    height: '50px',
                                    paddingLeft: '48px',
                                    paddingRight: '48px',
                                    borderRadius: '8px'
                                }}
                            >
                                ยืนยันข้อมูล
                            </Button>
                        </div>
                    )}

                    {/* Table */}
                    {activeTab === 'app' ? (
                        <Table
                            columns={appColumns}
                            dataSource={appPromotions}
                            loading={isLoading}
                            rowKey="id"
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
                            columns={partnerColumns}
                            dataSource={partnerPromotions}
                            loading={isLoading}
                            rowKey="id"
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
