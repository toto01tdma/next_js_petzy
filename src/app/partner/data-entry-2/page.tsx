'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import LogoFirstPage from "@/components/first_page/logo";
import { Button, Input, Select, Checkbox, Spin } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { API_BASE_URL, USE_API_MODE } from '@/config/api';
import HotelServiceConfigSection from '@/components/partner/dataEntry/HotelServiceConfigSection';

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
        postal_code: string;
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
                        hotelNameConfirm: '',
                        hotelNameEng: 'Fahfon Resort',
                        hotelNameEngConfirm: '',
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
                        hotelNameConfirm: data.data.hotelName || '', // Auto-populate with hotelName value
                        hotelNameEng: data.data.hotelNameEng || '',
                        hotelNameEngConfirm: data.data.hotelNameEng || '', // Auto-populate with hotelNameEng value
                        rooms: data.data.rooms || '',
                        customRoomCount: '',
                        province: data.data.roomTypes || '',
                        customRoomType: '',
                        district: data.data.serviceTypes || '',
                        customServiceType: '',
                        subdistrict: data.data.specialServiceTypes || '',
                        specialServiceType: '',
                        postalCode: data.data.postal_code || '',
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
        hotelNameConfirm: '',
        hotelNameEng: '',
        hotelNameEngConfirm: '',
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
        // Validation: Check if hotel names match confirmations
        if (formData.hotelName !== (formData.hotelNameConfirm || formData.hotelName)) {
            await Swal.fire({
                icon: 'error',
                title: 'ข้อมูลไม่ตรงกัน',
                text: 'ชื่อโรงแรมภาษาไทยไม่ตรงกับช่องยืนยัน กรุณาตรวจสอบอีกครั้ง',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#DC2626'
            });
            return;
        }

        if (formData.hotelNameEng !== (formData.hotelNameEngConfirm || formData.hotelNameEng)) {
            await Swal.fire({
                icon: 'error',
                title: 'ข้อมูลไม่ตรงกัน',
                text: 'ชื่อโรงแรมภาษาอังกฤษไม่ตรงกับช่องยืนยัน กรุณาตรวจสอบอีกครั้ง',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#DC2626'
            });
            return;
        }

        setIsLoading(true);

        try {
            // Preview mode: Skip API call and simulate success
            if (!USE_API_MODE) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
                
                await Swal.fire({
                    icon: 'success',
                    title: 'บันทึกข้อมูลสำเร็จ (Preview Mode)',
                    text: 'Data saved successfully.',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#28A7CB'
                });

                router.push('/partner/dashboard');
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

            // Build the payload - only include fields that have input fields on the page
            const payload = {
                hotelName: formData.hotelName,
                hotelNameConfirm: formData.hotelNameConfirm,
                hotelNameEng: formData.hotelNameEng,
                hotelNameEngConfirm: formData.hotelNameEngConfirm,
                rooms: showCustomRoomInput ? formData.customRoomCount : formData.rooms,
                roomTypes: showCustomRoomTypeInput ? formData.customRoomType : formData.province,
                serviceTypes: formData.district,
                specialServiceTypes: showSpecialServiceTypeInput ? formData.specialServiceType : formData.subdistrict,
                roomService: formData.roomService,
                specialService: formData.specialService,
                petCareService: formData.petCareService,
                services: formData.services
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
                    text: 'Data saved successfully.',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#28A7CB'
                });

                // Navigate to dashboard after submission
                router.push('/partner/dashboard');
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
                    <HotelServiceConfigSection
                        formData={formData}
                        showCustomRoomInput={showCustomRoomInput}
                        showCustomRoomTypeInput={showCustomRoomTypeInput}
                        showSpecialServiceTypeInput={showSpecialServiceTypeInput}
                        onInputChange={handleInputChange}
                        onRoomCountChange={handleRoomCountChange}
                        onRoomTypeChange={handleRoomTypeChange}
                        onServiceTypeChange={handleServiceTypeChange}
                        onSpecialServiceTypeChange={handleSpecialServiceTypeChange}
                        onServiceChange={handleServiceChange}
                        disabled={isFetching}
                        approvalStatus={approvalStatus}
                    />
                    )}

                    {/* Submit Button */}
                    {!isFetching && (
                        <div className="w-full flex justify-center mt-20">
                            <Button
                                size="large"
                                onClick={() => handleSubmit()}
                                disabled={isLoading || isFetching}
                                loading={isLoading}
                                className="px-12 py-3 h-auto font-medium w-[90%] rounded-md text-center"
                                style={{ 
                                    backgroundColor: '#0D263B'
                                }}
                            >
                                <span className="text-xl" style={{ color: '#FFFFFF' }}>
                                    ไปสู่หน้าระบบ
                                </span>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
