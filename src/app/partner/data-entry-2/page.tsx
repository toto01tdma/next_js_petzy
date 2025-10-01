'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import LogoFirstPage from "@/components/first_page/logo";
import { Button, Input, Select, Checkbox, Spin } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { API_BASE_URL, USE_API_MODE } from '@/config/api';

const { Option } = Select;

// TypeScript Types
type HotelDataResponse = {
    success: boolean;
    message: string;
    data: {
        hotelName: string;
        hotelNameEng: string;
        rooms: string;
        roomTypes: string;
        serviceTypes: string;
        specialServiceTypes: string;
        latitude: string;
        longitude: string;
        roomService: boolean;
        specialService: boolean;
        petCareService: boolean;
        services: string[];
        approvalStatus: string;
    };
};

type SaveDataResponse = {
    success: boolean;
    message: string;
    data: {
        status: string;
        approvalStatus: string;
    };
};

// Custom Service Checkbox Component
interface ServiceCheckboxProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const ServiceCheckbox: React.FC<ServiceCheckboxProps> = ({ label, checked, onChange }) => {
    return (
        <div className="space-y-2">
            <div
                className="w-full py-2 px-4 rounded-lg flex items-center font-medium cursor-pointer transition-colors"
                onClick={() => onChange(!checked)}
                style={{ backgroundColor: '#00B6AA' }}
            >
                <span className="flex-1 text-center" style={{ color: '#FFFFFF' }}>{label}</span>
                <div className="ml-auto">
                    {checked ? (
                        <div className="border px-0.5 py-0.2 rounded-sm border-white bg-transparent" style={{ color: '#FFFFFF' }}>
                            <CheckOutlined className="text-sm" style={{ color: '#FFFFFF' }}/>
                        </div>
                    ) : (
                        <div className="border px-0.5 py-0.2 rounded-sm border-white bg-transparent" style={{ color: '#00B6AA' }}>
                            <CheckOutlined className="text-sm" style={{ color: '#00B6AA' }}/>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function DataEntry2() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [approvalStatus, setApprovalStatus] = useState('DRAFT');
    const hasFetched = useRef(false);

    // Suppress Ant Design React 19 compatibility warning for this page
    useEffect(() => {
        const originalWarn = console.warn;
        console.warn = (...args) => {
            const message = String(args[0] || '');
            if (
                message.includes('antd: compatible') ||
                message.includes('React is 16 ~ 18') ||
                message.includes('v5-for-19') ||
                message.includes('antd v5 support React is 16')
            ) {
                return;
            }
            originalWarn(...args);
        };

        return () => {
            console.warn = originalWarn;
        };
    }, []);

    // Fetch hotel data on component mount
    useEffect(() => {
        const fetchHotelData = async () => {
            if (hasFetched.current) return;
            hasFetched.current = true;
            
            try {
                // Preview mode: Skip API call and use mock data
                if (!USE_API_MODE) {
                    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
                    
                    // Set mock data
                    setFormData({
                        hotelName: 'Fahfon Resort',
                        hotelNameEng: 'Fahfon Resort',
                        rooms: '10',
                        customRoomCount: '',
                        province: 'ห้องขนาด 2เตียง',
                        customRoomType: '',
                        district: 'pet-hotel',
                        customServiceType: '',
                        subdistrict: 'สุนัขและแมว',
                        specialServiceType: '',
                        postalCode: '',
                        latitude: '18.7953',
                        longitude: '98.9986',
                        services: ['aircon', 'tv', 'pool'],
                        description: '',
                        roomService: true,
                        specialService: false,
                        petCareService: true
                    });
                    setApprovalStatus('DRAFT');
                    setIsFetching(false);
                    return;
                }

                // API mode: Make actual API call
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    await Swal.fire({
                        icon: 'error',
                        title: 'ไม่พบข้อมูลการเข้าสู่ระบบ',
                        text: 'กรุณาเข้าสู่ระบบอีกครั้ง',
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#28A7CB'
                    });
                    router.push('/login');
                    return;
                }

                const response = await fetch(`${API_BASE_URL}/api/partner/data-entry-2`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data: HotelDataResponse = await response.json();

                if (data.success && data.data) {
                    // Map API response to form data
                    setFormData({
                        hotelName: data.data.hotelName || '',
                        hotelNameEng: data.data.hotelNameEng || '',
                        rooms: data.data.rooms || '',
                        customRoomCount: '',
                        province: data.data.roomTypes || '',
                        customRoomType: '',
                        district: data.data.serviceTypes || '',
                        customServiceType: '',
                        subdistrict: data.data.specialServiceTypes || '',
                        specialServiceType: '',
                        postalCode: '',
                        latitude: data.data.latitude || '',
                        longitude: data.data.longitude || '',
                        services: data.data.services || [],
                        description: '',
                        roomService: data.data.roomService || false,
                        specialService: data.data.specialService || false,
                        petCareService: data.data.petCareService || false
                    });
                    setApprovalStatus(data.data.approvalStatus || 'DRAFT');
                }
            } catch (error) {
                console.error('Error fetching hotel data:', error);
                await Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#28A7CB'
                });
            } finally {
                setIsFetching(false);
            }
        };

        fetchHotelData();
    }, [router]);

    const [formData, setFormData] = useState({
        hotelName: '',
        hotelNameEng: '',
        rooms: '',
        customRoomCount: '',
        province: '',
        customRoomType: '',
        district: '',
        customServiceType: '',
        subdistrict: '',
        specialServiceType: '',
        postalCode: '',
        latitude: '',
        longitude: '',
        services: [] as string[],
        description: '',
        // Service selections
        roomService: false,
        specialService: false,
        petCareService: false
    });
    const [showCustomRoomInput, setShowCustomRoomInput] = useState(false);
    const [showCustomRoomTypeInput, setShowCustomRoomTypeInput] = useState(false);
    const [showSpecialServiceTypeInput, setShowSpecialServiceTypeInput] = useState(false);

    const handleInputChange = (field: string, value: string | string[] | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleRoomCountChange = (value: string) => {
        if (value === 'custom') {
            setShowCustomRoomInput(true);
            handleInputChange('rooms', '');
        } else {
            setShowCustomRoomInput(false);
            handleInputChange('rooms', value);
            handleInputChange('customRoomCount', '');
        }
    };

    const handleRoomTypeChange = (value: string) => {
        if (value === 'custom') {
            setShowCustomRoomTypeInput(true);
            handleInputChange('province', '');
        } else {
            setShowCustomRoomTypeInput(false);
            handleInputChange('province', value);
            handleInputChange('customRoomType', '');
        }
    };

    const handleServiceTypeChange = (value: string) => {
        if (value === 'custom') {
            setShowSpecialServiceTypeInput(true);
            handleInputChange('district', '');
        } else {
            handleInputChange('district', value);
            handleInputChange('customServiceType', '');
            setShowSpecialServiceTypeInput(false);
        }
    };

    const handleSpecialServiceTypeChange = (value: string) => {
        if (value === 'custom') {
            setShowSpecialServiceTypeInput(true);
            handleInputChange('subdistrict', '');
        } else {
            setShowSpecialServiceTypeInput(false);
            handleInputChange('subdistrict', value);
            handleInputChange('specialServiceType', '');
        }
    };

    const handleServiceChange = (service: string, checked: boolean) => {
        const newServices = checked
            ? [...formData.services, service]
            : formData.services.filter(s => s !== service);
        handleInputChange('services', newServices);
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            // Preview mode: Skip API call and simulate success
            if (!USE_API_MODE) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
                
                await Swal.fire({
                    icon: 'success',
                    title: 'บันทึกข้อมูลสำเร็จ (Preview Mode)',
                    text: 'Data saved successfully. Please wait for admin approval.',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#28A7CB'
                });

                router.push('/partner/data-entry-3');
                setIsLoading(false);
                return;
            }

            // API mode: Make actual API call
            const token = localStorage.getItem('accessToken');
            if (!token) {
                await Swal.fire({
                    icon: 'error',
                    title: 'ไม่พบข้อมูลการเข้าสู่ระบบ',
                    text: 'กรุณาเข้าสู่ระบบอีกครั้ง',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#28A7CB'
                });
                router.push('/login');
                return;
            }

            // Get user data from localStorage
            const userDataStr = localStorage.getItem('user');
            const userData = userDataStr ? JSON.parse(userDataStr) : {};

            // Build the payload according to API requirements
            const payload = {
                first_name: userData.profile?.firstName || '',
                last_name: userData.profile?.lastName || '',
                id_number: '',
                passport_number: '',
                hotel_name: formData.hotelName,
                hotelName: formData.hotelName,
                hotelNameEng: formData.hotelNameEng,
                registration_number: '',
                address: '',
                phone: '',
                email: '',
                primary_phone: '',
                accommodation_name: formData.hotelName,
                rooms: showCustomRoomInput ? formData.customRoomCount : formData.rooms,
                roomTypes: showCustomRoomTypeInput ? formData.customRoomType : formData.province,
                serviceTypes: formData.district,
                specialServiceTypes: showSpecialServiceTypeInput ? formData.specialServiceType : formData.subdistrict,
                latitude: formData.latitude,
                longitude: formData.longitude,
                roomService: formData.roomService,
                specialService: formData.specialService,
                petCareService: formData.petCareService,
                services: formData.services,
                documents: {
                    id_card_url: '',
                    certificate_url: '',
                    photo_urls: []
                },
                approval_status: 'pending'
            };

            const response = await fetch(`${API_BASE_URL}/api/partner/data-entry-2`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data: SaveDataResponse = await response.json();

            if (data.success) {
                // Show success message
                await Swal.fire({
                    icon: 'success',
                    title: 'บันทึกข้อมูลสำเร็จ',
                    text: 'Data saved successfully. Please wait for admin approval.',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#28A7CB'
                });

                // Navigate to data-entry-3 after submission
                router.push('/partner/data-entry-3');
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'ไม่สามารถบันทึกข้อมูลได้',
                    text: data.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#28A7CB'
                });
            }
        } catch (error) {
            console.error('Error saving data:', error);
            await Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#28A7CB'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat relative"
            style={{
                backgroundImage: "url('/assets/images/background/bg1.png')"
            }}
        >
            {/* Background Overlay */}
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}></div>

            {/* Content Container */}
            <div className="relative z-10 min-h-screen py-8 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Logo */}
                    <div className="text-center mb-3">
                        <LogoFirstPage subtext='Find Your Perfect Stay, Anytime, Anywhere' />
                        <h1 className="text-5xl font-bold mt-4" style={{ color: '#0D263B' }}>Pet-Friendly Hotel</h1>
                    </div>

                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold mt-4" style={{ color: '#484848' }}>เริ่มสร้างบริการของคุณ เพื่อเริ่มต้นทำงานกับเรา</h1>
                    </div>
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold mt-4" style={{ color: '#484848' }}>สร้างหมวดหมู่หลักบริการของคุณ</h1>
                    </div>

                    {/* Loading Spinner */}
                    {isFetching && (
                        <div className="flex justify-center items-center py-20">
                            <Spin size="large" tip="กำลังโหลดข้อมูล..." />
                        </div>
                    )}

                    {/* Form Container */}
                    {!isFetching && (
                    <div className="py-6 px-12 border border-black rounded-lg">
                        <div className="space-y-4">
                            <p style={{ marginBottom: '0.75rem', color: '#484848' }}><span className="text-xl font-bold me-4">กรุณาเลือกบริการที่คุณมี</span> <span className="text-md">สามารถเลือกได้หลายบริการตามความจริงที่คุณให้บริการ</span></p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <ServiceCheckbox
                                    label="รูปแบบบริการห้องพัก"
                                    checked={formData.roomService}
                                    onChange={(checked) => handleInputChange('roomService', checked)}
                                />
                                <ServiceCheckbox
                                    label="รูปแบบบริการพิเศษ"
                                    checked={formData.specialService}
                                    onChange={(checked) => handleInputChange('specialService', checked)}
                                />
                                <ServiceCheckbox
                                    label="รูปแบบบริการรับฝากสัตว์เลี้ยง"
                                    checked={formData.petCareService}
                                    onChange={(checked) => handleInputChange('petCareService', checked)}
                                />
                            </div>
                            {/* Two-column grid for regular fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-2">
                                    <div>
                                        <label className="block text-base font-medium mb-2" style={{ color: '#1F2937' }}>
                                            ชื่อ โรงแรม หรือ สถานที่พัก
                                        </label>
                                        <Input
                                            value={formData.hotelName}
                                            onChange={(e) => handleInputChange('hotelName', e.target.value)}
                                            placeholder="สุขสม โรงแรมสวัสดี"
                                            className="w-full h-12 text-base"
                                            style={{ height: '48px', fontSize: '16px' }}
                                            disabled={isFetching || approvalStatus !== 'DRAFT'}
                                        />
                                        <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.2rem', color: '#FFFFFF' }}>...</p>
                                    </div>

                                    <div>
                                        <label className="block text-base font-medium mb-2" style={{ color: '#1F2937' }}>
                                            ชื่อ โรงแรม หรือ สถานที่พัก
                                        </label>
                                        <Input
                                            value={formData.hotelNameEng}
                                            onChange={(e) => handleInputChange('hotelNameEng', e.target.value)}
                                            placeholder="Adedecsws"
                                            className="w-full h-12 text-base"
                                            style={{ height: '48px', fontSize: '16px' }}
                                        />
                                        <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.2rem', color: '#6B7280' }}>*กรุณากรอกชื่อจริงครั้งเพื่อยืนยันความถูกต้อง</p>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-2">
                                    <div>
                                        <label className="block text-base font-medium mb-2" style={{ color: '#1F2937' }}>
                                            ชื่อ โรงแรม หรือ สถานที่พัก (ภาษาอังกฤษ)
                                        </label>
                                        <Input
                                            value={formData.hotelNameEng}
                                            onChange={(e) => handleInputChange('hotelNameEng', e.target.value)}
                                            placeholder="สุขสม โรงแรมสวัสดี"
                                            className="w-full h-12 text-base"
                                            style={{ height: '48px', fontSize: '16px' }}
                                        />
                                        <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.2rem', color: '#FFFFFF' }}>...</p>
                                    </div>

                                    <div>
                                        <label className="block text-base font-medium mb-2" style={{ color: '#1F2937' }}>
                                            ชื่อ โรงแรม หรือ สถานที่พัก (ภาษาอังกฤษ)
                                        </label>
                                        <Input
                                            value={formData.hotelNameEng}
                                            onChange={(e) => handleInputChange('hotelNameEng', e.target.value)}
                                            placeholder="สุขสม โรงแรมสวัสดี"
                                            className="w-full h-12 text-base"
                                            style={{ height: '48px', fontSize: '16px' }}
                                        />
                                        <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.2rem', color: '#FFFFFF' }}>...</p>
                                    </div>
                                </div>
                            </div>

                            {/* Full-width field: Total number of rooms */}
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-base font-medium mb-2" style={{ color: '#1F2937' }}>
                                        ระบุจำนวนห้องพักทั้งหมดของคุณ
                                    </label>
                                    <Select
                                        value={showCustomRoomInput ? 'custom' : formData.rooms}
                                        onChange={handleRoomCountChange}
                                        placeholder="5 ห้องพัก"
                                        className="w-full"
                                        style={{ height: '48px' }}
                                        size="large"
                                    >
                                        <Option value="2">2 ห้องพัก</Option>
                                        <Option value="4">4 ห้องพัก</Option>
                                        <Option value="6">6 ห้องพัก</Option>
                                        <Option value="custom">ระบุ</Option>
                                    </Select>
                                    {showCustomRoomInput && (
                                        <Input
                                            value={formData.customRoomCount}
                                            onChange={(e) => handleInputChange('customRoomCount', e.target.value)}
                                            placeholder="กรุณาระบุจำนวนห้องพัก"
                                            className="w-full h-12 text-base mt-2"
                                            style={{ height: '48px', fontSize: '16px' }}
                                            type="number"
                                        />
                                    )}
                                    <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.2rem', color: '#FFFFFF' }}>...</p>
                                </div>
                            </div>

                            {/* Full-width field: All room types */}
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-base font-medium mb-2" style={{ color: '#1F2937' }}>
                                        ประเภทห้องพักทั้งหมดของคุณ
                                    </label>
                                    <Select
                                        value={showCustomRoomTypeInput ? 'custom' : formData.province}
                                        onChange={handleRoomTypeChange}
                                        placeholder="ห้องขนาด 2เตียง"
                                        className="w-full"
                                        style={{ height: '48px' }}
                                        size="large"
                                    >
                                        <Option value="เตียงเดี่ยว">เตียงเดี่ยว</Option>
                                        <Option value="เตียงคู่">เตียงคู่</Option>
                                        <Option value="ห้องขนาด 2เตียง">ห้องขนาด 2เตียง</Option>
                                        <Option value="มีเตียงเสริม">มีเตียงเสริม</Option>
                                        <Option value="ห้องสวีท">ห้องสวีท</Option>
                                        <Option value="custom">ระบุ</Option>
                                    </Select>
                                    {showCustomRoomTypeInput && (
                                        <Input
                                            value={formData.customRoomType}
                                            onChange={(e) => handleInputChange('customRoomType', e.target.value)}
                                            placeholder="กรุณาระบุประเภทห้องพัก"
                                            className="w-full h-12 text-base mt-2"
                                            style={{ height: '48px', fontSize: '16px' }}
                                        />
                                    )}
                                    <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.2rem', color: '#FFFFFF' }}>...</p>
                                </div>
                            </div>

                            {/* Two-column grid for remaining fields */}
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-base font-medium mb-2" style={{ color: '#1F2937' }}>
                                        ประเภทห้องพักทั้งหมดของคุณ
                                    </label>
                                    <Select
                                        value={showSpecialServiceTypeInput ? 'custom' : formData.district}
                                        onChange={handleServiceTypeChange}
                                        placeholder="โรงแรมรับสัตว์เลี้ยง"
                                        className="w-full"
                                        style={{ height: '48px' }}
                                        size="large"
                                    >
                                        <Option value="pet-hotel">โรงแรมสัตว์เลี้ยง</Option>
                                        <Option value="pet-spa">สปา สัตว์เลี้ยง</Option>
                                        <Option value="pet-boarding">สถานที่รับฝากสัตว์เลี้ยง</Option>
                                    </Select>
                                    <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.2rem', color: '#FFFFFF' }}>...</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div>
                                    <label className="block text-base font-medium mb-2" style={{ color: '#1F2937' }}>
                                        ประเภทรับบริการพิเศษของคุณ
                                    </label>
                                    <Select
                                        value={showSpecialServiceTypeInput ? 'custom' : formData.subdistrict}
                                        onChange={handleSpecialServiceTypeChange}
                                        placeholder="สุนัข, แมว"
                                        className="w-full"
                                        style={{ height: '48px' }}
                                        size="large"
                                    >
                                        <Option value="สุนัข">สุนัข</Option>
                                        <Option value="แมว">แมว</Option>
                                        <Option value="สุนัขและแมว">สุนัข, แมว</Option>
                                        <Option value="นก">นก</Option>
                                        <Option value="เต่า">เต่า</Option>
                                        <Option value="สัตว์เลี้ยงทุกประเภท">สัตว์เลี้ยงทุกประเภท</Option>
                                        <Option value="custom">ระบุ</Option>
                                    </Select>
                                    {showSpecialServiceTypeInput && (
                                        <Input
                                            value={formData.specialServiceType}
                                            onChange={(e) => handleInputChange('specialServiceType', e.target.value)}
                                            placeholder="กรุณาระบุประเภทการให้บริการ"
                                            className="w-full h-12 text-base mt-2"
                                            style={{ height: '48px', fontSize: '16px' }}
                                        />
                                    )}
                                    <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.2rem', color: '#FFFFFF' }}>...</p>
                                </div>
                            </div>
                        </div>

                        {/* Map Section */}
                        <div className="mt-8">
                            <p style={{ marginBottom: '0.5rem' }}>
                                <span className="text-lg font-semibold text-gray-800 mb-4 me-4">ปักหมุดพิกัด สถานที่ให้บริการ</span> <span>กรุณาเลื่อนหาตำแหน่งที่ให้บริการของคุณเพื่อปักหมุด</span>
                            </p>

                            {/* Latitude and Longitude Inputs */}
                            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-base font-medium mb-2" style={{ color: '#1F2937' }}>
                                        Latitude (ละติจูด)
                                    </label>
                                    <Input
                                        value={formData.latitude}
                                        onChange={(e) => handleInputChange('latitude', e.target.value)}
                                        placeholder="13.7563"
                                        className="w-full h-12 text-base"
                                        style={{ height: '48px', fontSize: '16px' }}
                                        type="number"
                                        step="any"
                                    />
                                </div>
                                <div>
                                    <label className="block text-base font-medium mb-2" style={{ color: '#1F2937' }}>
                                        Longitude (ลองจิจูด)
                                    </label>
                                    <Input
                                        value={formData.longitude}
                                        onChange={(e) => handleInputChange('longitude', e.target.value)}
                                        placeholder="100.5018"
                                        className="w-full h-12 text-base"
                                        style={{ height: '48px', fontSize: '16px' }}
                                        type="number"
                                        step="any"
                                    />
                                </div>
                            </div> */}

                            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F3F4F6' }}>
                                <div className="text-center">
                                    <div className="text-4xl mb-2">🗺️</div>
                                    <p className="text-gray-600">Google Maps Integration</p>
                                    <p className="text-sm text-gray-500">Map will be displayed here</p>
                                    {formData.latitude && formData.longitude && (
                                        <p className="text-sm text-blue-600 mt-2">
                                            Location: {formData.latitude}, {formData.longitude}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Services Section */}
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-800 text-center border-b border-t border-black pt-3 pb-3" style={{ marginBottom: '2.5rem' }}>
                                เลือกระบุข้างบนความสะดวกและสิ่งอำนวยความสะดวกของคุณ
                            </h3>
                            <div className="grid grid-cols-5 divide-x border-b border-black pb-3">
                                {/* คอลัมน์ 1 */}
                                <div className="flex flex-col space-y-2 p-4">
                                    <label className="flex items-center justify-between">
                                        <span style={{ color: '#1F2937' }}>เครื่องปรับอากาศ</span>
                                        <Checkbox
                                            checked={formData.services.includes("aircon")}
                                            onChange={(e) => handleServiceChange("aircon", e.target.checked)}
                                        />
                                    </label>
                                    <label className="flex items-center justify-between">
                                        <span style={{ color: '#1F2937' }}>เครื่องทำน้ำอุ่น</span>
                                        <Checkbox
                                            checked={formData.services.includes("heater")}
                                            onChange={(e) => handleServiceChange("heater", e.target.checked)}
                                        />
                                    </label>
                                </div>

                                {/* คอลัมน์ 2 */}
                                <div className="flex flex-col space-y-2 p-4">
                                    <label className="flex items-center justify-between">
                                        <span style={{ color: '#1F2937' }}>โทรทัศน์</span>
                                        <Checkbox
                                            checked={formData.services.includes("tv")}
                                            onChange={(e) => handleServiceChange("tv", e.target.checked)}
                                        />
                                    </label>
                                    <label className="flex items-center justify-between">
                                        <span style={{ color: '#1F2937' }}>อ่างอาบน้ำ</span>
                                        <Checkbox
                                            checked={formData.services.includes("bathtub")}
                                            onChange={(e) => handleServiceChange("bathtub", e.target.checked)}
                                        />
                                    </label>
                                </div>

                                {/* คอลัมน์ 3 */}
                                <div className="flex flex-col space-y-2 p-4">
                                    <label className="flex items-center justify-between">
                                        <span style={{ color: '#1F2937' }}>สระว่ายน้ำ</span>
                                        <Checkbox
                                            checked={formData.services.includes("pool")}
                                            onChange={(e) => handleServiceChange("pool", e.target.checked)}
                                        />
                                    </label>
                                    <label className="flex items-center justify-between">
                                        <span style={{ color: '#1F2937' }}>ร้านอาหาร</span>
                                        <Checkbox
                                            checked={formData.services.includes("restaurant")}
                                            onChange={(e) => handleServiceChange("restaurant", e.target.checked)}
                                        />
                                    </label>
                                </div>

                                {/* คอลัมน์ 4 */}
                                <div className="flex flex-col space-y-2 p-4">
                                    <label className="flex items-center justify-between">
                                        <span style={{ color: '#1F2937' }}>สปา</span>
                                        <Checkbox
                                            checked={formData.services.includes("spa")}
                                            onChange={(e) => handleServiceChange("spa", e.target.checked)}
                                        />
                                    </label>
                                    <label className="flex items-center justify-between">
                                        <span style={{ color: '#1F2937' }}>บริการซักรีด</span>
                                        <Checkbox
                                            checked={formData.services.includes("laundry")}
                                            onChange={(e) => handleServiceChange("laundry", e.target.checked)}
                                        />
                                    </label>
                                </div>

                                {/* คอลัมน์ 5 */}
                                <div className="flex flex-col space-y-2 p-4">
                                    <label className="flex items-center justify-between">
                                        <span style={{ color: '#1F2937' }}>สนามหญ้า</span>
                                        <Checkbox
                                            checked={formData.services.includes("garden")}
                                            onChange={(e) => handleServiceChange("garden", e.target.checked)}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="w-full flex justify-center mt-20">
                            <Button
                                size="large"
                                onClick={handleSubmit}
                                disabled={isLoading || isFetching || approvalStatus !== 'DRAFT'}
                                loading={isLoading}
                                className="px-12 py-3 h-auto font-medium w-[90%] rounded-md text-center"
                                style={{ 
                                    backgroundColor: approvalStatus !== 'DRAFT' ? '#6B7280' : '#0D263B',
                                    opacity: approvalStatus !== 'DRAFT' ? 0.6 : 1
                                }}
                            >
                                <span className="text-xl" style={{ color: '#FFFFFF' }}>
                                    {approvalStatus !== 'DRAFT' ? 'Waiting for review' : (isLoading ? 'กำลังบันทึก...' : 'กรุณากดยืนยัน')}
                                </span>
                            </Button>
                        </div>

                    </div>
                    )}
                </div>
            </div>
        </div>
    );
}
