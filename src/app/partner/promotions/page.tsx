'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/partner/shared/Sidebar';
import { MenuOutlined, HomeOutlined, CheckCircleOutlined, PlusOutlined } from '@ant-design/icons';
import DataTable from '@/components/partner/shared/DataTable';
import { useApprovalStatus } from '@/hooks/useApprovalStatus';
import ApprovalModal from '@/components/partner/shared/ApprovalModal';
import { Button, Modal, Input, Radio, DatePicker, Upload, message, Select, Spin } from 'antd';
import type { UploadFile } from 'antd';
import Swal from 'sweetalert2';
import { API_BASE_URL, USE_API_MODE } from '@/config/api';
import dayjs from 'dayjs';
import { checkAuthError } from '@/utils/api';

const { Option } = Select;

// TypeScript interface for Promotion
interface Promotion {
    id: string;
    promotion_code: string;
    discount_type: string;
    base_price: number;
    discount_price: number;
    usage_limit: number | null;
    usage_count: number;
    start_date: string;
    end_date: string;
    usage_limitation_type: string;
    banner_url: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export default function ManagePromotions() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [bannerImage, setBannerImage] = useState<UploadFile | null>(null);
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [totalPromotions, setTotalPromotions] = useState(0);
    
    // Approval status check
    const { isApproved, isLoading: isLoadingApproval } = useApprovalStatus();

    // Form state
    const [formData, setFormData] = useState({
        promotionCode: '',
        discountType: 'room_discount', // room_discount, pet_discount, data_discount
        basePrice: '',
        discountPrice: '',
        usageLimit: '',
        startDate: '',
        endDate: '',
        usageLimitationType: 'unlimited', // unlimited, limited
    });

    // Fetch promotions from API
    useEffect(() => {
        fetchPromotions();
    }, []);

    const fetchPromotions = async () => {
        setIsFetching(true);
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/api/partner/promotions`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            // Check for authentication error
            if (checkAuthError(response, result)) {
                return;
            }

            if (result.success && result.data) {
                setPromotions(result.data);
                setTotalPromotions(result.pagination?.total || result.data.length);
            } else {
                console.error('Failed to fetch promotions:', result.message);
                message.error('ไม่สามารถโหลดข้อมูลโปรโมชันได้');
            }
        } catch (error) {
            console.error('Error fetching promotions:', error);
            message.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
        } finally {
            setIsFetching(false);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            promotionCode: '',
            discountType: 'room_discount',
            basePrice: '',
            discountPrice: '',
            usageLimit: '',
            startDate: '',
            endDate: '',
            usageLimitationType: 'unlimited',
        });
        setBannerImage(null);
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleBannerUpload = (file: UploadFile) => {
        setBannerImage(file);
        return false; // Prevent automatic upload
    };

    const uploadBannerImage = async () => {
        if (!bannerImage?.originFileObj) {
            return null;
        }

        const token = localStorage.getItem('accessToken');
        const formDataUpload = new FormData();
        formDataUpload.append('banner', bannerImage.originFileObj);

        try {
            const uploadResponse = await fetch(`${API_BASE_URL}/api/upload/promotion-banner`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataUpload
            });

            const uploadResult = await uploadResponse.json();

            if (!uploadResult.success) {
                throw new Error(uploadResult.error || 'Failed to upload banner');
            }

            return uploadResult.data.banner_url;
        } catch (error) {
            console.error('Banner upload error:', error);
            throw error;
        }
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.promotionCode) {
            message.error('กรุณากรอกโค้ดส่วนลด');
            return;
        }
        if (!formData.basePrice || !formData.discountPrice) {
            message.error('กรุณากรอกจำนวนเงินให้ครบถ้วน');
            return;
        }
        if (!formData.startDate || !formData.endDate) {
            message.error('กรุณาเลือกวันที่เริ่มต้นและสิ้นสุด');
            return;
        }

        setIsLoading(true);
        try {
            // Preview mode check
            if (!USE_API_MODE) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                await Swal.fire({
                    icon: 'success',
                    title: 'สร้างโปรโมชันสำเร็จ!',
                    text: 'โปรโมชันของคุณถูกบันทึกเรียบร้อยแล้ว',
                    confirmButtonText: 'ตรวจสอบ',
                    confirmButtonColor: '#0D263B',
                });
                handleCancel();
                setIsLoading(false);
                return;
            }

            const token = localStorage.getItem('accessToken');
            if (!token) {
                message.error('กรุณาเข้าสู่ระบบอีกครั้ง');
                setIsLoading(false);
                return;
            }

            // Step 1: Upload banner image if exists
            let bannerUrl = null;
            if (bannerImage) {
                bannerUrl = await uploadBannerImage();
            }

            // Step 2: Create promotion
            const payload = {
                promotion_code: formData.promotionCode,
                discount_type: formData.discountType,
                base_price: parseFloat(formData.basePrice),
                discount_price: parseFloat(formData.discountPrice),
                usage_limit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
                start_date: formData.startDate,
                end_date: formData.endDate,
                usage_limitation_type: formData.usageLimitationType,
                banner_url: bannerUrl,
            };

            const response = await fetch(`${API_BASE_URL}/api/partner/promotions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            // Check for authentication error
            if (checkAuthError(response, result)) {
                return;
            }

            if (result.success) {
                await Swal.fire({
                    icon: 'success',
                    title: 'สร้างโปรโมชันสำเร็จ!',
                    text: 'โปรโมชันของคุณถูกบันทึกเรียบร้อยแล้ว',
                    confirmButtonText: 'ตรวจสอบ',
                    confirmButtonColor: '#0D263B',
                });
                handleCancel();
                // Refresh promotions list
                fetchPromotions();
            } else {
                throw new Error(result.error || 'Failed to create promotion');
            }
        } catch (error) {
            console.error('Error creating promotion:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: error instanceof Error ? error.message : 'ไม่สามารถสร้างโปรโมชันได้',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#0D263B',
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Helper function to format discount type
    const formatDiscountType = (type: string) => {
        switch (type) {
            case 'room_discount':
                return 'ส่วนลดห้องพัก';
            case 'pet_discount':
                return 'ส่วนลดสัตว์เลี้ยง';
            case 'data_discount':
                return 'ส่วนลดข้อมูล';
            default:
                return type;
        }
    };

    // Helper function to format date
    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return dayjs(dateString).format('DD/MM/YYYY');
    };

    // Promotions table columns configuration
    const promotionsColumns = [
        {
            title: 'ลำดับ',
            key: 'itemOrder',
            dataIndex: 'id',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render: (_value: any, _record: any) => {
                const index = tableData.findIndex(item => item.id === _record.id);
                return `${index + 1}.`;
            },
        },
        {
            title: 'โค้ดโปรโมชัน',
            dataIndex: 'promotion_code',
            key: 'promotion_code',
        },
        {
            title: 'ประเภทส่วนลด',
            dataIndex: 'discount_type',
            key: 'discount_type',
            render: (type: string) => formatDiscountType(type),
        },
        {
            title: 'ราคาปกติ',
            dataIndex: 'base_price',
            key: 'base_price',
            render: (price: number) => `${price.toLocaleString()} บาท`,
        },
        {
            title: 'ราคาส่วนลด',
            dataIndex: 'discount_price',
            key: 'discount_price',
            render: (price: number) => `${price.toLocaleString()} บาท`,
        },
        {
            title: 'จำนวนการใช้',
            key: 'usage',
            dataIndex: 'usage_count',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render: (_value: any, record: Promotion) => {
                const limit = record.usage_limitation_type === 'unlimited' 
                    ? 'ไม่จำกัด' 
                    : record.usage_limit;
                return `${record.usage_count} / ${limit}`;
            },
        },
        {
            title: 'วันที่เริ่มต้น',
            dataIndex: 'start_date',
            key: 'start_date',
            render: (date: string) => formatDate(date),
        },
        {
            title: 'วันที่สิ้นสุด',
            dataIndex: 'end_date',
            key: 'end_date',
            render: (date: string) => formatDate(date),
        },
        {
            title: 'สถานะ',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <span className={`px-2 py-1 rounded text-xs ${
                    status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                }`}>
                    {status === 'active' ? 'ใช้งาน' : 'ปิดใช้งาน'}
                </span>
            ),
        },
    ];

    // Transform promotions data for table
    const tableData = promotions.map((promo) => ({
        ...promo,
        key: promo.id,
    }));

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-gradient-to-r from-[#C6CEDE] to-[#FFFFFF] shadow-sm border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleSidebar}
                                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                            >
                                <MenuOutlined className="text-xl" />
                            </button>
                            <h1 className="text-2xl font-semibold text-gray-800">จัดการโปรโมชันของคุณ</h1>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-6" style={{ backgroundColor: '#FFFFFF' }}>
                    {/* Add Promotion Button */}
                    <div className="mb-6 flex justify-end">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            size="large"
                            onClick={showModal}
                            style={{ backgroundColor: '#0D263B', borderColor: '#0D263B' }}
                        >
                            สร้างโค้ดส่วนลด
                        </Button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gradient-to-r from-[#0097EC] to-[#003AD2] rounded-2xl p-6" style={{ color: '#FFFFFF' }}>
                            <div className="">
                                <div>
                                    <div className="flex items-center justify-between w-full">
                                        <h3 className="text-lg font-medium opacity-90">โปรโมชันส่วนลด</h3>
                                        <HomeOutlined className='text-3xl' />
                                    </div>
                                    <div className="flex">
                                        <p className="text-5xl mx-2" style={{ marginBottom: '0.5rem' }}>
                                            {isFetching ? <Spin size="large" /> : totalPromotions}
                                        </p>
                                        <p className="text-5xl mx-2" style={{ marginBottom: '0rem' }}>รายการ</p>
                                    </div>
                                    <p className="text-sm" style={{ marginBottom: '0rem' }}>รายการที่คุณเข้าร่วม</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-[#1FD071] to-[#00A843] rounded-2xl p-6" style={{ color: '#FFFFFF' }}>
                            <div className="">
                                <div>
                                    <div className="flex items-center justify-between w-full">
                                        <h3 className="text-lg font-medium opacity-90">โปรโมชันที่ใช้งานอยู่</h3>
                                        <CheckCircleOutlined className='text-3xl' />
                                    </div>
                                    <div className="flex">
                                        <p className="text-5xl mx-2" style={{ marginBottom: '0.5rem' }}>
                                            {isFetching ? <Spin size="large" /> : promotions.filter(p => p.status === 'active').length}
                                        </p>
                                        <p className="text-5xl mx-2" style={{ marginBottom: '0rem' }}>รายการ</p>
                                    </div>
                                    <p className="text-sm" style={{ marginBottom: '0rem' }}>โปรโมชันที่กำลังใช้งาน</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="">
                        <div className="py-3 px-2 border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                รายการโปรโมชันที่เข้าร่วมรายการ
                            </h2>
                        </div>

                        <div className="">
                            {isFetching ? (
                                <div className="flex justify-center items-center py-12">
                                    <Spin size="large" tip="กำลังโหลดข้อมูล..." />
                                </div>
                            ) : (
                                <DataTable
                                    columns={promotionsColumns}
                                    data={tableData}
                                />
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Add Promotion Modal */}
            <Modal
                title={<span className="text-xl font-semibold">สร้างโค้ดส่วนลด</span>}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={700}
                centered
            >
                <div className="py-4">
                    {/* Existing Promotions Dropdown */}
                    <div className="mb-4">
                        <label className="block text-base font-medium mb-2">เลือกโปรโมชันที่มีอยู่ (ถ้ามี)</label>
                        <Select
                            placeholder="เลือกโปรโมชันเพื่อดูรายละเอียด"
                            size="large"
                            className="w-full"
                            allowClear
                            onChange={(value) => {
                                if (value) {
                                    const selectedPromo = promotions.find(p => p.id === value);
                                    if (selectedPromo) {
                                        setFormData({
                                            promotionCode: selectedPromo.promotion_code,
                                            discountType: selectedPromo.discount_type,
                                            basePrice: selectedPromo.base_price.toString(),
                                            discountPrice: selectedPromo.discount_price.toString(),
                                            usageLimit: selectedPromo.usage_limit?.toString() || '',
                                            startDate: selectedPromo.start_date,
                                            endDate: selectedPromo.end_date,
                                            usageLimitationType: selectedPromo.usage_limitation_type,
                                        });
                                    }
                                }
                            }}
                        >
                            {promotions.map((promo) => (
                                <Option key={promo.id} value={promo.id}>
                                    {promo.promotion_code} - {formatDiscountType(promo.discount_type)} ({promo.status === 'active' ? 'ใช้งาน' : 'ปิดใช้งาน'})
                                </Option>
                            ))}
                        </Select>
                    </div>

                    {/* Promotion Code */}
                    <div className="mb-4">
                        <label className="block text-base font-medium mb-2">โค้ดส่วนลด</label>
                        <Input
                            value={formData.promotionCode}
                            onChange={(e) => handleInputChange('promotionCode', e.target.value)}
                            placeholder="กรอกโค้ดส่วนลด"
                            size="large"
                        />
                    </div>

                    {/* Discount Type */}
                    <div className="mb-4">
                        <label className="block text-base font-medium mb-2">เลือกประเภทการส่วนลด</label>
                        <Radio.Group
                            value={formData.discountType}
                            onChange={(e) => handleInputChange('discountType', e.target.value)}
                            className="w-full"
                        >
                            <Radio value="room_discount" className="block mb-2">ลดค่าห้องพัก</Radio>
                            <Radio value="pet_discount" className="block mb-2">กำหนดลดค่าสัตว์เลี้ยงตัวละเอง</Radio>
                            <Radio value="data_discount" className="block">คืนค่าข้อมูลตัดยอดหัว</Radio>
                        </Radio.Group>
                    </div>

                    {/* Pricing */}
                    <div className="mb-4">
                        <label className="block text-base font-medium mb-2">จำนวนเงิน (ลด/บาท)</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">ราคาเดิม (บาท)</label>
                                <Input
                                    type="number"
                                    value={formData.basePrice}
                                    onChange={(e) => handleInputChange('basePrice', e.target.value)}
                                    placeholder="0"
                                    size="large"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">ราคาหลังหัก (บาท)</label>
                                <Input
                                    type="number"
                                    value={formData.discountPrice}
                                    onChange={(e) => handleInputChange('discountPrice', e.target.value)}
                                    placeholder="0"
                                    size="large"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Usage Limit */}
                    <div className="mb-4">
                        <label className="block text-base font-medium mb-2">จำนวนการใช้งาน</label>
                        <Input
                            type="number"
                            value={formData.usageLimit}
                            onChange={(e) => handleInputChange('usageLimit', e.target.value)}
                            placeholder="ไม่จำกัด"
                            size="large"
                        />
                    </div>

                    {/* Date Range */}
                    <div className="mb-4">
                        <label className="block text-base font-medium mb-2">วันที่เริ่มต้น - วันที่สิ้นสุด</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <DatePicker
                                    value={formData.startDate ? undefined : undefined}
                                    onChange={(date, dateString) => handleInputChange('startDate', dateString as string)}
                                    placeholder="วว/ดด/ปปปป"
                                    size="large"
                                    className="w-full"
                                    format="DD/MM/YYYY"
                                />
                            </div>
                            <div>
                                <DatePicker
                                    value={formData.endDate ? undefined : undefined}
                                    onChange={(date, dateString) => handleInputChange('endDate', dateString as string)}
                                    placeholder="วว/ดด/ปปปป"
                                    size="large"
                                    className="w-full"
                                    format="DD/MM/YYYY"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Usage Limitation */}
                    <div className="mb-4">
                        <label className="block text-base font-medium mb-2">การจำกัดการใช้โค้ด</label>
                        <Radio.Group
                            value={formData.usageLimitationType}
                            onChange={(e) => handleInputChange('usageLimitationType', e.target.value)}
                            className="w-full"
                        >
                            <Radio value="unlimited" className="block mb-2">ไม่จำกัดจำนวนครั้ง/คน</Radio>
                            <Radio value="limited" className="block">จำกัดครั้ง</Radio>
                        </Radio.Group>
                    </div>

                    {/* Banner Upload */}
                    <div className="mb-6">
                        <label className="block text-base font-medium mb-2">ภาพ Banner</label>
                        <Upload
                            listType="picture-card"
                            maxCount={1}
                            beforeUpload={handleBannerUpload}
                            onRemove={() => setBannerImage(null)}
                        >
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>อัพโหลดภาพ</div>
                            </div>
                        </Upload>
                        <p className="text-sm text-gray-500 mt-2">
                            อัพโหลดภาพขนาด 800x200 หรือ 1:1 ขนาดไม่เกิน 10MB
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            size="large"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            ✕ ปิด
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleSubmit}
                            loading={isLoading}
                            style={{ backgroundColor: '#0D263B', borderColor: '#0D263B' }}
                        >
                            + สร้างโค้ดใหม่
                        </Button>
                    </div>
                </div>
            </Modal>
            
            {/* Approval Status Modal */}
            <ApprovalModal isOpen={!isLoadingApproval && !isApproved} />
        </div>
    );
}
