'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/shared/Sidebar';
import { Input, Button, Table, Space, DatePicker, InputNumber, message } from 'antd';
import Image from 'next/image';
import { SearchOutlined, DownloadOutlined, EyeOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { API_BASE_URL, USE_API_MODE } from '@/config/api';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import { getPromotionImageUrl } from '@/utils/fileImageUrl';
import { checkAuthError } from '@/utils/api';

interface AppPromotion {
    id: string;
    imageUrl: string | null;
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
    
    // New promotion form state
    const [newPromotion, setNewPromotion] = useState({
        conditions: '',
        discountRate: undefined as number | undefined,
        amount: '',
        validFrom: null as Dayjs | null,
        validUntil: null as Dayjs | null,
        imageUrl: null as string | null,
        imageFile: null as File | null,
        imagePreview: null as string | null,
        color: '#5283FF' as string,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                            imageUrl: '/assets/images/logo/logo.png',
                            conditions: 'สำหรับลูกค้าที่จองบริการที่กว่า500 บาท',
                            discountRate: '5%',
                            amount: '1000 ครั้ง',
                            validFrom: new Date().toISOString(),
                            validUntil: new Date().toISOString()
                        },
                        {
                            id: '2',
                            imageUrl: '/assets/images/logo/logo.png',
                            conditions: 'สำหรับลูกค้าที่จองบริการเกิน500 บาท',
                            discountRate: '5%',
                            amount: '1000 ครั้ง',
                            validFrom: new Date().toISOString(),
                            validUntil: new Date().toISOString()
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
                    if (data.success && data.data) {
                    setAppPromotions(data.data || []);
                        setPagination(prev => ({
                            ...prev,
                            total: data.pagination?.totalItems || 0,
                        }));
                    }
                } else {
                    setPartnerPromotions(data.data || []);
                setPagination(prev => ({
                    ...prev,
                    total: data.pagination?.total || 0,
                }));
                }
            }
        } catch (error) {
            console.error('Error fetching promotions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = (file: File) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            message.error('กรุณาเลือกไฟล์รูปภาพ (PNG)');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            message.error('ไฟล์ใหญ่เกินไป (สูงสุด 5 MB)');
            return;
        }

        setNewPromotion(prev => ({
            ...prev,
            imageFile: file,
        }));

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewPromotion(prev => ({
                ...prev,
                imagePreview: reader.result as string,
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmitPromotion = async () => {
        // Validate form
        if (!newPromotion.conditions.trim()) {
            message.error('กรุณากรอกเงื่อนไข');
            return;
        }
        if (newPromotion.discountRate === undefined || newPromotion.discountRate <= 0) {
            message.error('กรุณากรอกเปอร์เซนต์ส่วนลด');
            return;
        }
        if (!newPromotion.amount.trim()) {
            message.error('กรุณากรอกจำนวนสิทธิ์');
            return;
        }
        if (!newPromotion.validFrom || !newPromotion.validUntil) {
            message.error('กรุณาเลือกวันที่เริ่มต้นและสิ้นสุด');
            return;
        }
        if (newPromotion.validFrom.isAfter(newPromotion.validUntil)) {
            message.error('วันที่เริ่มต้นต้องมาก่อนวันที่สิ้นสุด');
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('accessToken');
            let imageUrl = newPromotion.imageUrl;

            // Upload image first if a new file is selected
            if (newPromotion.imageFile) {
                const formData = new FormData();
                formData.append('image', newPromotion.imageFile);

                const uploadResponse = await fetch(
                    `${API_BASE_URL}/api/admin/promotions/app/image/upload`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                        body: formData,
                    }
                );

                const uploadResult = await uploadResponse.json();
                if (checkAuthError(uploadResponse, uploadResult)) {
                    return;
                }

                if (uploadResult.success && uploadResult.data) {
                    imageUrl = uploadResult.data.imageUrl;
                } else {
                    throw new Error(uploadResult.message || 'Failed to upload image');
                }
            }

            // Create promotion
            const createResponse = await fetch(
                `${API_BASE_URL}/api/admin/promotions/app`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        conditions: newPromotion.conditions,
                        discountRate: newPromotion.discountRate,
                        amount: newPromotion.amount,
                        validFrom: newPromotion.validFrom.toISOString(),
                        validUntil: newPromotion.validUntil.toISOString(),
                        imageUrl: imageUrl,
                        color: newPromotion.color,
                    }),
                }
            );

            const createResult = await createResponse.json();
            if (checkAuthError(createResponse, createResult)) {
                return;
            }

            if (createResult.success) {
                message.success('เพิ่มโปรโมชั่นสำเร็จ');
                // Reset form
                setNewPromotion({
                    conditions: '',
                    discountRate: undefined,
                    amount: '',
                    validFrom: null,
                    validUntil: null,
                    imageUrl: null,
                    imageFile: null,
                    imagePreview: null,
                    color: '#5283FF',
                });
                // Refresh list
                fetchPromotions();
            } else {
                throw new Error(createResult.message || 'Failed to create promotion');
            }
        } catch (error) {
            console.error('Error creating promotion:', error);
            message.error('เกิดข้อผิดพลาดในการเพิ่มโปรโมชั่น');
        } finally {
            setIsSubmitting(false);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

                    {/* Promotions Display */}
                    {activeTab === 'app' ? (
                        <div className="space-y-6">
                            {isLoading ? (
                                <div className="flex justify-center items-center py-20">
                                    <div className="text-gray-500">Loading...</div>
                                </div>
                            ) : (
                                <>
                                    {appPromotions.map((promotion) => {
                                        const imageUrl = promotion.imageUrl ? getPromotionImageUrl(promotion.imageUrl) : null;
                                        const validFromDate = promotion.validFrom ? dayjs(promotion.validFrom) : null;
                                        const validUntilDate = promotion.validUntil ? dayjs(promotion.validUntil) : null;
                                        
                                        return (
                                            <div
                                                key={promotion.id}
                                                className="flex items-start gap-6 p-6 rounded-lg border border-gray-200"
                                                style={{ backgroundColor: '#FFFFFF' }}
                                            >
                                                {/* Promotion Image/Icon - Left Side */}
                                                {imageUrl ? (
                                                    <div 
                                                        className="rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                                                        style={{ 
                                                            width: '200px',
                                                            height: '200px',
                                                            position: 'relative'
                                                        }}
                                                    >
                                                        {imageUrl.startsWith('data:') || imageUrl.startsWith('blob:') ? (
                                                            <img 
                                                                src={imageUrl} 
                                                                alt="Promotion" 
                                                                style={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    objectFit: 'cover'
                                                                }}
                                                            />
                                                        ) : (
                                                            <Image 
                                                                src={imageUrl} 
                                                                alt="Promotion" 
                                                                width={200}
                                                                height={200}
                                                                style={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    objectFit: 'cover'
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div 
                                                        className="rounded-lg flex flex-col items-center justify-center flex-shrink-0"
                                                        style={{ 
                                                            width: '200px',
                                                            height: '200px',
                                                            background: 'linear-gradient(135deg, #A855F7 0%, #8B5CF6 100%)',
                                                            position: 'relative',
                                                            padding: '20px'
                                                        }}
                                                    >
                                                        <div className="text-center">
                                                            <div style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>
                                                                โปรโมชั่น
                                                            </div>
                                                            <div style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: '36px', marginBottom: '8px' }}>
                                                                {promotion.discountRate}
                                                            </div>
                                                            <div style={{ color: '#FFFFFF', fontSize: '14px', textAlign: 'center' }}>
                                                                {promotion.conditions}
                                                            </div>
                                                        </div>
                                                        <div 
                                                            style={{ 
                                                                position: 'absolute',
                                                                top: '12px',
                                                                right: '12px',
                                                                color: '#FFFFFF',
                                                                fontSize: '24px'
                                                            }}
                                                        >
                                                            🐾
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {/* Promotion Details - Right Side with Input Fields */}
                                                <div className="flex-1 grid grid-cols-2 gap-6">
                                                    <div>
                                                        <div className="text-sm font-medium mb-2" style={{ color: '#333333' }}>ตั้งเงื่อนไข</div>
                                                        <Input
                                                            value={promotion.conditions}
                                                            readOnly
                                                            style={{
                                                                borderRadius: '8px',
                                                                border: '1px solid #D9D9D9'
                                                            }}
                                                        />
                                                        <div className="text-xs mt-1" style={{ color: '#666666' }}>
                                                            *1 ครั้งต่อ 1 ผู้ใช้
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium mb-2" style={{ color: '#333333' }}>เปอร์เซนต์ที่ลด</div>
                                                        <Input
                                                            value={promotion.discountRate}
                                                            readOnly
                                                            style={{
                                                                borderRadius: '8px',
                                                                border: '1px solid #D9D9D9'
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium mb-2" style={{ color: '#333333' }}>จำนวนสิทธิ</div>
                                                        <Input
                                                            value={promotion.amount}
                                                            readOnly
                                                            style={{
                                                                borderRadius: '8px',
                                                                border: '1px solid #D9D9D9'
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium mb-2" style={{ color: '#333333' }}>ระยะเวลาที่กำหนด</div>
                                                        <div className="flex gap-2">
                                                            <DatePicker
                                                                value={validFromDate}
                                                                format="DD/MM/YY"
                                                                disabled
                                                                style={{
                                                                    borderRadius: '8px',
                                                                    border: '1px solid #D9D9D9',
                                                                    flex: 1
                                                                }}
                                                            />
                                                            <DatePicker
                                                                value={validUntilDate}
                                                                format="DD/MM/YY"
                                                                disabled
                                                                style={{
                                                                    borderRadius: '8px',
                                                                    border: '1px solid #D9D9D9',
                                                                    flex: 1
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    
                                    {/* Add Promotion Box - Always at the end */}
                                    <div
                                        className="flex items-start gap-6 p-6 rounded-lg border border-gray-200"
                                        style={{ backgroundColor: '#FFFFFF' }}
                                    >
                                        {/* Upload Image Box - Left Side */}
                                        <div 
                                            className="rounded-lg flex flex-col items-center justify-center flex-shrink-0 relative overflow-hidden"
                                            style={{ 
                                                width: '200px',
                                                height: '200px',
                                                backgroundColor: '#F5F5F5',
                                                border: '2px dashed #D9D9D9',
                                                padding: '20px',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => {
                                                const input = document.createElement('input');
                                                input.type = 'file';
                                                input.accept = 'image/*';
                                                input.onchange = (e) => {
                                                    const file = (e.target as HTMLInputElement).files?.[0];
                                                    if (file) {
                                                        handleImageUpload(file);
                                                    }
                                                };
                                                input.click();
                                            }}
                                        >
                                            {newPromotion.imagePreview ? (
                                                newPromotion.imagePreview.startsWith('data:') || newPromotion.imagePreview.startsWith('blob:') ? (
                                                    <img 
                                                        src={newPromotion.imagePreview} 
                                                        alt="Preview" 
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0
                                                        }}
                                                    />
                                                ) : (
                                                    <Image 
                                                        src={newPromotion.imagePreview} 
                                                        alt="Preview" 
                                                        fill
                                                        style={{
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                )
                                            ) : (
                                                <>
                                                    <UploadOutlined style={{ fontSize: '48px', color: '#999999', marginBottom: '12px' }} />
                                                    <div style={{ color: '#666666', fontSize: '14px', textAlign: 'center', marginBottom: '4px' }}>
                                                        อัพโหลดรูปโปรโมชั่นของคุณ
                                                    </div>
                                                    <div style={{ color: '#999999', fontSize: '12px', textAlign: 'center' }}>
                                                        ขนาดรูปไม่เกิน 500x500 pixel png.
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        
                                        {/* Promotion Form - Right Side */}
                                        <div className="flex-1 grid grid-cols-2 gap-6">
                                            <div>
                                                <div className="text-sm font-medium mb-2" style={{ color: '#333333' }}>ตั้งเงื่อนไข</div>
                                                <Input
                                                    placeholder="สำหรับลูกค้าที่จองที่พัก500 บาท"
                                                    value={newPromotion.conditions}
                                                    onChange={(e) => setNewPromotion(prev => ({ ...prev, conditions: e.target.value }))}
                                                    style={{
                                                        borderRadius: '8px',
                                                        border: '1px solid #D9D9D9'
                                                    }}
                                                />
                                                <div className="text-xs mt-1" style={{ color: '#666666' }}>
                                                    *1 ครั้งต่อ 1 ผู้ใช้
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium mb-2" style={{ color: '#333333' }}>เปอร์เซนต์ที่ลด</div>
                                                <InputNumber
                                                    placeholder="5"
                                                    value={newPromotion.discountRate}
                                                    onChange={(value) => setNewPromotion(prev => ({ ...prev, discountRate: value || undefined }))}
                                                    min={0}
                                                    max={100}
                                                    formatter={(value) => value ? `${value}%` : ''}
                                                    parser={(value): number => {
                                                        if (!value) return 0;
                                                        const parsed = parseFloat(value.replace('%', ''));
                                                        return isNaN(parsed) ? 0 : parsed;
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        borderRadius: '8px'
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium mb-2" style={{ color: '#333333' }}>จำนวนสิทธิ</div>
                                                <Input
                                                    placeholder="1,000 ครั้ง"
                                                    value={newPromotion.amount}
                                                    onChange={(e) => setNewPromotion(prev => ({ ...prev, amount: e.target.value }))}
                                                    style={{
                                                        borderRadius: '8px',
                                                        border: '1px solid #D9D9D9'
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium mb-2" style={{ color: '#333333' }}>ระยะเวลาที่กำหนด</div>
                                                <div className="flex gap-2">
                                                    <DatePicker
                                                        placeholder="เริ่ม"
                                                        value={newPromotion.validFrom}
                                                        onChange={(date) => setNewPromotion(prev => ({ ...prev, validFrom: date }))}
                                                        format="DD/MM/YY"
                                                        style={{
                                                            borderRadius: '8px',
                                                            border: '1px solid #D9D9D9',
                                                            flex: 1
                                                        }}
                                                    />
                                                    <DatePicker
                                                        placeholder="สิ้นสุด"
                                                        value={newPromotion.validUntil}
                                                        onChange={(date) => setNewPromotion(prev => ({ ...prev, validUntil: date }))}
                                                        format="DD/MM/YY"
                                                        style={{
                                                            borderRadius: '8px',
                                                            border: '1px solid #D9D9D9',
                                                            flex: 1
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium mb-2" style={{ color: '#333333' }}>สีพื้นหลัง</div>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="color"
                                                        value={newPromotion.color}
                                                        onChange={(e) => setNewPromotion(prev => ({ ...prev, color: e.target.value }))}
                                                        style={{
                                                            width: '60px',
                                                            height: '40px',
                                                            borderRadius: '8px',
                                                            border: '1px solid #D9D9D9',
                                                            cursor: 'pointer'
                                                        }}
                                                    />
                                                    <Input
                                                        placeholder="#5283FF"
                                                        value={newPromotion.color}
                                                        onChange={(e) => setNewPromotion(prev => ({ ...prev, color: e.target.value }))}
                                                        style={{
                                                            borderRadius: '8px',
                                                            border: '1px solid #D9D9D9',
                                                            flex: 1
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Confirm Button - Bottom Right */}
                                        <div className="flex items-end">
                                            <Button
                                                size="large"
                                                loading={isSubmitting}
                                                onClick={handleSubmitPromotion}
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
                                    </div>
                                </>
                            )}
                        </div>
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
