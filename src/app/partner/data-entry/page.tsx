'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import LogoFirstPage from "@/components/first_page/logo";
import { Button, Input, Modal, Spin } from 'antd';
import type { UploadFile } from 'antd';
import SingleFileAttachment from '@/components/partner/shared/SingleFileAttachment';
import Swal from 'sweetalert2';
import { API_BASE_URL, USE_API_MODE } from '@/config/api';

const { TextArea } = Input;

// Type definitions
type PartnerDataResponse = {
    success: boolean;
    message: string;
    data: {
        first_name: string;
        last_name: string;
        national_id_number: string;
        corporate_tax_id: string;
        additional_details: string;
        backup_phone: string;
        accommodation_name: string;
        accommodation_name_en: string;
        trade_registration_number: string;
        address: string;
        business_email: string;
        office_phone: string;
        google_maps_link: string;
        mobile_phone: string;
        business_additional_details: string;
        national_id_card_url: string;
        trade_registration_cert_url: string;
        tax_documents_url: string;
        house_registration_url: string;
        additional_documents_url: string[];
        bank_account_book_url: string;
        service_location_photos_url: string[];
    };
};

type SaveDataResponse = {
    success: boolean;
    message: string;
    data: {
        accommodation_id: string;
        status: string;
    };
};

export default function DataEntry() {
    const router = useRouter();
    const [,] = useState<UploadFile[]>([]);
    const [uploadedImages, setUploadedImages] = useState<{ [key: number]: UploadFile }>({});
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
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

    // Fetch partner data on component mount
    useEffect(() => {
        const fetchPartnerData = async () => {
            if (hasFetched.current) return;
            hasFetched.current = true;

            try {
                // Preview mode: Skip API call and use mock data
                if (!USE_API_MODE) {
                    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
                    
                    // Set mock data
                    setFormData({
                        firstName: 'John',
                        lastName: 'Doe',
                        firstNameEng: 'John',
                        lastNameEng: 'Doe',
                        nationalIdNumber: '1234567890123',
                        corporateTaxId: 'TAX123456',
                        email: 'john@example.com',
                        phoneNumber: '0812345678',
                        backupPhone: '0898765432',
                        additionalDetails: 'Preview mode data',
                        accommodationName: 'Preview Hotel',
                        accommodationNameEn: 'Preview Hotel',
                        tradeRegistrationNumber: 'REG12345',
                        address: '123 Preview Street, Bangkok',
                        businessEmail: 'business@preview.com',
                        officePhone: '021234567',
                        googleMapsLink: 'https://maps.google.com',
                        mobilePhone: '0812345678',
                        businessAdditionalDetails: 'Preview business details'
                    });
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

                const response = await fetch(`${API_BASE_URL}/api/partner/data-entry`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data: PartnerDataResponse = await response.json();

                if (data.success && data.data) {
                    // Map API response to form data
                    setFormData({
                        firstName: data.data.first_name || '',
                        lastName: data.data.last_name || '',
                        firstNameEng: '',
                        lastNameEng: '',
                        nationalIdNumber: data.data.national_id_number || '',
                        corporateTaxId: data.data.corporate_tax_id || '',
                        email: data.data.business_email || '',
                        phoneNumber: data.data.office_phone || '',
                        backupPhone: data.data.backup_phone || '',
                        additionalDetails: data.data.additional_details || '',
                        accommodationName: data.data.accommodation_name || '',
                        accommodationNameEn: data.data.accommodation_name_en || '',
                        tradeRegistrationNumber: data.data.trade_registration_number || '',
                        address: data.data.address || '',
                        businessEmail: data.data.business_email || '',
                        officePhone: data.data.office_phone || '',
                        googleMapsLink: data.data.google_maps_link || '',
                        mobilePhone: data.data.mobile_phone || '',
                        businessAdditionalDetails: data.data.business_additional_details || ''
                    });

                    // Set uploaded images if URLs exist
                    const newUploadedImages: { [key: number]: UploadFile } = {};
                    if (data.data.national_id_card_url) {
                        newUploadedImages[0] = {
                            uid: '0',
                            name: 'national_id_card',
                            status: 'done',
                            url: data.data.national_id_card_url
                        };
                    }
                    if (data.data.trade_registration_cert_url) {
                        newUploadedImages[1] = {
                            uid: '1',
                            name: 'trade_registration_cert',
                            status: 'done',
                            url: data.data.trade_registration_cert_url
                        };
                    }
                    if (data.data.tax_documents_url) {
                        newUploadedImages[2] = {
                            uid: '2',
                            name: 'tax_documents',
                            status: 'done',
                            url: data.data.tax_documents_url
                        };
                    }
                    if (data.data.house_registration_url) {
                        newUploadedImages[3] = {
                            uid: '3',
                            name: 'house_registration',
                            status: 'done',
                            url: data.data.house_registration_url
                        };
                    }
                    if (data.data.additional_documents_url && data.data.additional_documents_url.length > 0) {
                        newUploadedImages[4] = {
                            uid: '4',
                            name: 'additional_documents',
                            status: 'done',
                            url: data.data.additional_documents_url[0]
                        };
                    }
                    if (data.data.bank_account_book_url) {
                        newUploadedImages[5] = {
                            uid: '5',
                            name: 'bank_account_book',
                            status: 'done',
                            url: data.data.bank_account_book_url
                        };
                    }
                    if (data.data.service_location_photos_url && data.data.service_location_photos_url.length > 0) {
                        newUploadedImages[6] = {
                            uid: '6',
                            name: 'service_location_photos',
                            status: 'done',
                            url: data.data.service_location_photos_url[0]
                        };
                    }
                    setUploadedImages(newUploadedImages);
                }
            } catch (error) {
                console.error('Error fetching partner data:', error);
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

        fetchPartnerData();
    }, [router]);
    const [formData, setFormData] = useState({
        // Basic Information - Personal
        firstName: '',
        lastName: '',
        firstNameEng: '',
        lastNameEng: '',
        nationalIdNumber: '',
        corporateTaxId: '',
        email: '',
        phoneNumber: '',
        backupPhone: '',
        additionalDetails: '',

        // Business Information
        accommodationName: '',
        accommodationNameEn: '',
        tradeRegistrationNumber: '',
        address: '',
        businessEmail: '',
        officePhone: '',
        googleMapsLink: '',
        mobilePhone: '',
        businessAdditionalDetails: ''
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // const handleUpload: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    //     setFileList(newFileList);
    // };

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            // Preview mode: Skip API call and simulate success
            if (!USE_API_MODE) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
                
                setIsSuccessDialogOpen(true);
                setTimeout(() => {
                    setIsSuccessDialogOpen(false);
                    router.push('/partner/policy');
                }, 2000);
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

            // Prepare photo URLs from uploaded images
            const photoUrls: string[] = [];
            if (uploadedImages[6]?.url) photoUrls.push(uploadedImages[6].url);

            // Build the payload according to API requirements
            const payload = {
                first_name: formData.firstName,
                last_name: formData.lastName,
                id_number: formData.nationalIdNumber,
                passport_number: '', // Not collected in current form
                hotel_name: formData.accommodationName,
                registration_number: formData.tradeRegistrationNumber,
                address: formData.address,
                primary_phone: formData.phoneNumber,
                accommodation_name: formData.accommodationName,
                documents: {
                    id_card_url: uploadedImages[0]?.url || '',
                    certificate_url: uploadedImages[1]?.url || '',
                    photo_urls: photoUrls
                },
                approval_status: 'pending'
            };

            const response = await fetch(`${API_BASE_URL}/api/partner/data-entry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data: SaveDataResponse = await response.json();

            if (data.success) {
                // Show success dialog
                setIsSuccessDialogOpen(true);

                // After 2 seconds, close dialog and navigate to policy page
                setTimeout(() => {
                    setIsSuccessDialogOpen(false);
                    router.push('/partner/policy');
                }, 2000);
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

    // const uploadButton = (
    //     <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 transition-colors">
    //         <UploadOutlined className="text-4xl text-gray-400 mb-2" />
    //         <p className="text-gray-600">อัพโหลดรูปภาพ</p>
    //     </div>
    // );

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
                    <div className="text-center mb-4">
                        <LogoFirstPage />
                        <h1 className="text-5xl font-bold text-[#0D263B] mt-4">Pet-Friendly Hotel</h1>
                    </div>

                    <div className="text-center mb-4 bg-[#28A7CB] w-full py-2.5">
                        <span className="text-2xl" style={{ color: '#FFFFFF' }}>กรุณากรอกรายละเอียดข้อมูลส่วนตัวเพื่อเริ่มต้นทำงานกับเรา</span>
                    </div>

                    {/* Loading Spinner */}
                    {isFetching && (
                        <div className="flex justify-center items-center py-20">
                            <Spin size="large" tip="กำลังโหลดข้อมูล..." />
                        </div>
                    )}

                    {/* Form Container */}
                    {!isFetching && (<>
                        <div className="py-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                            ชื่อ *
                                        </label>
                                        <Input
                                            value={formData.firstName}
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                            className="w-full h-12 text-base"
                                            style={{ height: '48px', fontSize: '16px' }}
                                            disabled={isFetching}
                                        />
                                        <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.4rem', color: '#6B7280' }}>*กรุณากรอกชื่อจริงเพื่อยืนยันความถูกต้อง</p>
                                    </div>

                                    <div>
                                        <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                            นามสกุล *
                                        </label>
                                        <Input
                                            value={formData.lastName}
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                            className="w-full h-12 text-base"
                                            style={{ height: '48px', fontSize: '16px' }}
                                            disabled={isFetching}
                                        />
                                        <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.4rem', color: '#FFFFFF' }}>...</p>
                                    </div>

                                    <div>
                                        <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                            รหัสประจำตัวประชาชน *
                                        </label>
                                        <Input
                                            value={formData.nationalIdNumber}
                                            onChange={(e) => handleInputChange('nationalIdNumber', e.target.value)}
                                            className="w-full h-12 text-base"
                                            style={{ height: '48px', fontSize: '16px' }}
                                            disabled={isFetching}
                                        />
                                        <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.4rem', color: '#FFFFFF' }}>...</p>
                                    </div>

                                    <div>
                                        <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                            อีเมล์ *
                                        </label>
                                        <Input
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className="w-full h-12 text-base"
                                            style={{ height: '48px', fontSize: '16px' }}
                                            disabled={isFetching}
                                        />
                                        <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.4rem', color: '#FFFFFF' }}>...</p>
                                    </div>

                                    <div>
                                        <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                            เบอร์โทรศัพท์ติดต่อ *
                                        </label>
                                        <Input
                                            value={formData.phoneNumber}
                                            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                            className="w-full h-12 text-base"
                                            style={{ height: '48px', fontSize: '16px' }}
                                            disabled={isFetching}
                                        />
                                        <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.4rem', color: '#FFFFFF' }}>...</p>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                            ชื่อ *(ภาษาอังกฤษ)
                                        </label>
                                        <Input
                                            value={formData.firstNameEng}
                                            onChange={(e) => handleInputChange('firstNameEng', e.target.value)}
                                            className="w-full h-12 text-base"
                                            style={{ height: '48px', fontSize: '16px' }}
                                            disabled={isFetching}
                                        />
                                        <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.4rem', color: '#FFFFFF' }}>...</p>
                                    </div>

                                    <div>
                                        <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                            นามสกุล *(ภาษาอังกฤษ)
                                        </label>
                                        <Input
                                            value={formData.lastNameEng}
                                            onChange={(e) => handleInputChange('lastNameEng', e.target.value)}
                                            className="w-full h-12 text-base"
                                            style={{ height: '48px', fontSize: '16px' }}
                                            disabled={isFetching}
                                        />
                                        <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.4rem', color: '#FFFFFF' }}>...</p>
                                    </div>

                                    <div>
                                        <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                            รหัสผู้เสียภาษีองค์กร *
                                        </label>
                                        <Input
                                            value={formData.corporateTaxId}
                                            onChange={(e) => handleInputChange('corporateTaxId', e.target.value)}
                                            className="w-full h-12 text-base"
                                            style={{ height: '48px', fontSize: '16px' }}
                                            disabled={isFetching}
                                        />
                                        <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.4rem', color: '#FFFFFF' }}>...</p>
                                    </div>

                                    <div>
                                        <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                            กรอกรายละเอียดเพิ่มเติม เพื่อประกอบการพิจารณา
                                        </label>
                                        <Input
                                            value={formData.additionalDetails}
                                            onChange={(e) => handleInputChange('additionalDetails', e.target.value)}
                                            className="w-full h-12 text-base"
                                            style={{ height: '48px', fontSize: '16px' }}
                                            disabled={isFetching}
                                        />
                                        <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.4rem', color: '#FFFFFF' }}>...</p>
                                    </div>

                                    <div>
                                        <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                            เบอร์โทรศัพท์ติดต่อ(สำรอง) *
                                        </label>
                                        <Input
                                            value={formData.backupPhone}
                                            onChange={(e) => handleInputChange('backupPhone', e.target.value)}
                                            className="w-full h-12 text-base"
                                            style={{ height: '48px', fontSize: '16px' }}
                                            disabled={isFetching}
                                        />
                                        <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.4rem', color: '#FFFFFF' }}>...</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Location Information */}
                        <div className="text-center mb-4 bg-[#28A7CB] w-full py-2.5">
                            <span className="text-2xl" style={{ color: '#FFFFFF' }}>กรุณากรอกข้อมูลเกี่ยวกับสถานที่ตั้งของโรงแรมหรือที่พักของคุณ</span>
                        </div>

                        <div className="py-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                            ชื่อ โรงแรม หรือ สถานที่พัก *
                                        </label>
                                        <Input
                                            value={formData.accommodationName}
                                            onChange={(e) => handleInputChange('accommodationName', e.target.value)}
                                            placeholder="กรุณากรอกชื่อจริงครั้งเพื่อยืนยันความถูกต้อง"
                                            className="w-full h-12 text-base"
                                            style={{ height: '48px', fontSize: '16px' }}
                                            disabled={isFetching}
                                        />
                                        <p className="text-sm text-gray-500 mt-1" style={{ marginBottom: 0, marginTop: '0.4rem' }}>*กรุณากรอกชื่อจริงครั้งเพื่อยืนยันความถูกต้อง</p>
                                    </div>

                                    <div>
                                        <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                            เลขที่ทะเบียนการค้า *
                                        </label>
                                        <Input
                                            value={formData.tradeRegistrationNumber}
                                            onChange={(e) => handleInputChange('tradeRegistrationNumber', e.target.value)}
                                            className="w-full h-12 text-base"
                                            style={{ height: '48px', fontSize: '16px' }}
                                            disabled={isFetching}
                                        />
                                        <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.4rem', color: '#FFFFFF' }}>...</p>
                                    </div>

                                    <div>
                                        <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                            สถานที่อยู่ของสถานที่ให้บริการ *
                                        </label>
                                        <Input
                                            value={formData.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            className="w-full h-12 text-base"
                                            style={{ height: '48px', fontSize: '16px' }}
                                            disabled={isFetching}
                                        />
                                        <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.4rem', color: '#FFFFFF' }}>...</p>
                                    </div>

                                    <div>
                                        <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                            อีเมล์ธุรกิจ *
                                        </label>
                                        <Input
                                            value={formData.businessEmail}
                                            onChange={(e) => handleInputChange('businessEmail', e.target.value)}
                                            className="w-full h-12 text-base"
                                            style={{ height: '48px', fontSize: '16px' }}
                                            disabled={isFetching}
                                        />
                                        <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.4rem', color: '#FFFFFF' }}>...</p>
                                    </div>

                                    <div>
                                        <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                            ใส่ลิงก์ Google map ของสถานที่ให้บริการ *
                                        </label>
                                        <Input
                                            value={formData.googleMapsLink}
                                            onChange={(e) => handleInputChange('googleMapsLink', e.target.value)}
                                            className="w-full h-12 text-base"
                                            style={{ height: '48px', fontSize: '16px' }}
                                            disabled={isFetching}
                                        />
                                        <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.4rem', color: '#FFFFFF' }}>...</p>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                            ชื่อ โรงแรม หรือ สถานที่พัก *(ภาษาอังกฤษ)
                                        </label>
                                        <Input
                                            value={formData.accommodationNameEn}
                                            onChange={(e) => handleInputChange('accommodationNameEn', e.target.value)}
                                            className="w-full h-12 text-base"
                                            style={{ height: '48px', fontSize: '16px' }}
                                            disabled={isFetching}
                                        />
                                        <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.4rem', color: '#FFFFFF' }}>...</p>
                                    </div>

                                    <div>
                                        <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                            เบอร์โทรศัพท์สำนักงาน *
                                        </label>
                                        <Input
                                            value={formData.officePhone}
                                            onChange={(e) => handleInputChange('officePhone', e.target.value)}
                                            className="w-full h-12 text-base"
                                            style={{ height: '48px', fontSize: '16px' }}
                                            disabled={isFetching}
                                        />
                                        <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.4rem', color: '#FFFFFF' }}>...</p>
                                    </div>

                                    <div>
                                        <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                            เบอร์โทรศัพท์มือถือ *
                                        </label>
                                        <Input
                                            value={formData.mobilePhone}
                                            onChange={(e) => handleInputChange('mobilePhone', e.target.value)}
                                            className="w-full h-12 text-base"
                                            style={{ height: '48px', fontSize: '16px' }}
                                            disabled={isFetching}
                                        />
                                        <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.4rem', color: '#FFFFFF' }}>...</p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mt-8">
                                <label className="block text-base font-medium text-gray-800 mb-3">
                                    กรอกรายละเอียดเพิ่มเติมของธุรกิจ เพื่อประกอบการพิจารณา
                                </label>
                                <TextArea
                                    value={formData.businessAdditionalDetails}
                                    onChange={(e) => handleInputChange('businessAdditionalDetails', e.target.value)}
                                    rows={6}
                                    className="w-full text-base"
                                    style={{ fontSize: '16px' }}
                                    disabled={isFetching}
                                />
                            </div>
                        </div>

                        {/* Section 3: Image Upload */}
                        <div className="p-6">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">กรุณาแนบรูปถ่ายเอกสาร</h3>

                            {/* 8 Upload Slots in 4x2 Grid */}
                            <div className="grid md:grid-cols-4 gap-4 grid-cols-1">
                                {/* Slot 1: ID Card */}
                                <SingleFileAttachment
                                    uploadedImage={uploadedImages[0]}
                                    onImageUpload={(file) => {
                                        const newUploadedImages = { ...uploadedImages };
                                        newUploadedImages[0] = {
                                            uid: `0-${Date.now()}`,
                                            name: file.name,
                                            status: 'done',
                                            url: URL.createObjectURL(file),
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            originFileObj: file as any,
                                        };
                                        setUploadedImages(newUploadedImages);
                                    }}
                                    onImageRemove={() => {
                                        const newUploadedImages = { ...uploadedImages };
                                        delete newUploadedImages[0];
                                        setUploadedImages(newUploadedImages);
                                    }}
                                    label="อัพโหลดรูปบัตรประชาชน"
                                    description="กรุณาถ่ายรูปบัตรประชาแบบหน้าตรง"
                                />

                                {/* Slot 2: Business License */}
                                <SingleFileAttachment
                                    uploadedImage={uploadedImages[1]}
                                    onImageUpload={(file) => {
                                        const newUploadedImages = { ...uploadedImages };
                                        newUploadedImages[1] = {
                                            uid: `1-${Date.now()}`,
                                            name: file.name,
                                            status: 'done',
                                            url: URL.createObjectURL(file),
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            originFileObj: file as any,
                                        };
                                        setUploadedImages(newUploadedImages);
                                    }}
                                    onImageRemove={() => {
                                        const newUploadedImages = { ...uploadedImages };
                                        delete newUploadedImages[1];
                                        setUploadedImages(newUploadedImages);
                                    }}
                                    label="อัพโหลดรูปทะเบียนการค้า"
                                    description="กรุณาถ่ายรูปทะเบียนการค้าแบบหน้าตรง"
                                />

                                {/* Slot 3: Tax Document */}
                                <SingleFileAttachment
                                    uploadedImage={uploadedImages[2]}
                                    onImageUpload={(file) => {
                                        const newUploadedImages = { ...uploadedImages };
                                        newUploadedImages[2] = {
                                            uid: `2-${Date.now()}`,
                                            name: file.name,
                                            status: 'done',
                                            url: URL.createObjectURL(file),
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            originFileObj: file as any,
                                        };
                                        setUploadedImages(newUploadedImages);
                                    }}
                                    onImageRemove={() => {
                                        const newUploadedImages = { ...uploadedImages };
                                        delete newUploadedImages[2];
                                        setUploadedImages(newUploadedImages);
                                    }}
                                    label="อัพโหลดรูปเอกสารภาษีอากร"
                                    description="กรุณาถ่ายรูปเอกสารใบกำกับภาษีแบบหน้าตรง"
                                />

                                {/* Slot 4: House Registration */}
                                <SingleFileAttachment
                                    uploadedImage={uploadedImages[3]}
                                    onImageUpload={(file) => {
                                        const newUploadedImages = { ...uploadedImages };
                                        newUploadedImages[3] = {
                                            uid: `3-${Date.now()}`,
                                            name: file.name,
                                            status: 'done',
                                            url: URL.createObjectURL(file),
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            originFileObj: file as any,
                                        };
                                        setUploadedImages(newUploadedImages);
                                    }}
                                    onImageRemove={() => {
                                        const newUploadedImages = { ...uploadedImages };
                                        delete newUploadedImages[3];
                                        setUploadedImages(newUploadedImages);
                                    }}
                                    label="อัพโหลดรูปสำเนาทะเบียนบ้านของสถานที่ตั้งกิจการ"
                                    description="กรุณาถ่ายรูปเอกสารเพิ่มเติม แบบหน้าตรง"
                                />

                                {/* Slot 5: Additional Document */}
                                <SingleFileAttachment
                                    uploadedImage={uploadedImages[4]}
                                    onImageUpload={(file) => {
                                        const newUploadedImages = { ...uploadedImages };
                                        newUploadedImages[4] = {
                                            uid: `4-${Date.now()}`,
                                            name: file.name,
                                            status: 'done',
                                            url: URL.createObjectURL(file),
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            originFileObj: file as any,
                                        };
                                        setUploadedImages(newUploadedImages);
                                    }}
                                    onImageRemove={() => {
                                        const newUploadedImages = { ...uploadedImages };
                                        delete newUploadedImages[4];
                                        setUploadedImages(newUploadedImages);
                                    }}
                                    label="อัพโหลดรูปเอกสารเพิ่มเติม"
                                    description="กรุณาถ่ายรูปเอกสารเพิ่มเติม อาทิ บิลชำระค่าไฟแบบหน้าตรง"
                                />

                                {/* Slot 6: Bank Account */}
                                <SingleFileAttachment
                                    uploadedImage={uploadedImages[5]}
                                    onImageUpload={(file) => {
                                        const newUploadedImages = { ...uploadedImages };
                                        newUploadedImages[5] = {
                                            uid: `5-${Date.now()}`,
                                            name: file.name,
                                            status: 'done',
                                            url: URL.createObjectURL(file),
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            originFileObj: file as any,
                                        };
                                        setUploadedImages(newUploadedImages);
                                    }}
                                    onImageRemove={() => {
                                        const newUploadedImages = { ...uploadedImages };
                                        delete newUploadedImages[5];
                                        setUploadedImages(newUploadedImages);
                                    }}
                                    label="อัพโหลดรูปบัญชีธนาคาร"
                                    description="กรุณาถ่ายรูปเอกสารเพิ่มเติม แบบหน้าตรง *ที่ต้องการให้ระบบโอนค่าที่พัก"
                                />

                                {/* Slot 7: Building Photo */}
                                <SingleFileAttachment
                                    uploadedImage={uploadedImages[6]}
                                    onImageUpload={(file) => {
                                        const newUploadedImages = { ...uploadedImages };
                                        newUploadedImages[6] = {
                                            uid: `6-${Date.now()}`,
                                            name: file.name,
                                            status: 'done',
                                            url: URL.createObjectURL(file),
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            originFileObj: file as any,
                                        };
                                        setUploadedImages(newUploadedImages);
                                    }}
                                    onImageRemove={() => {
                                        const newUploadedImages = { ...uploadedImages };
                                        delete newUploadedImages[6];
                                        setUploadedImages(newUploadedImages);
                                    }}
                                    label="อัพโหลดรูปถ่ายหน้าสถานที่ให้บริการ"
                                    description="กรุณาถ่ายรูปด้านหน้าอาคาร สถานที่ตั้งของบริการ"
                                />

                                {/* Slot 8: Policy Modal */}
                                <div
                                    className="block w-full h-[300px] cursor-pointer"
                                    onClick={() => setIsPolicyModalOpen(true)}
                                >
                                    <div
                                        className={`w-full h-[300px] rounded-md px-3 py-3 transition-colors cursor-pointer`}
                                        style={{ backgroundColor: '#E0E2E6' }}
                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D0D2D6')}
                                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#E0E2E6')}
                                    >
                                        <div className="h-[190px] flex flex-col justify-center items-center">
                                            <div className="text-center mb-4">
                                                <LogoFirstPage subtext='' />
                                                <div className="text-sm" style={{ color: '#4B5563' }}>Pet-Friendly Hotel</div>
                                            </div>
                                        </div>
                                        <div className="text-md text-center text-[#484848] mt-1" style={{ fontWeight: '500' }}>
                                            กรุณาคลิก อ่านเอกสาร
                                            ข้อตกลงในสัญญาและนโยบายคู่ค้า
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 text-sm" style={{ color: '#6B7280' }}>
                                <p>• รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB</p>
                                <p>• กรุณาแนบรูปภาพประจำตัวประชาชน และเอกสารที่เกี่ยวข้อง</p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="w-full flex justify-center">
                            <Button
                                size="large"
                                onClick={handleSubmit}
                                disabled={isLoading || isFetching}
                                loading={isLoading}
                                className="px-12 py-3 h-auto font-medium w-[90%] rounded-md text-center"
                                style={{ backgroundColor: '#0D263B' }}
                            >
                                <span className="text-xl" style={{ color: '#FFFFFF' }}>{isLoading ? 'กำลังบันทึก...' : 'กรุณากดยืนยัน'}</span>
                            </Button>
                        </div>
                    </>)}
                </div>
            </div>

            {/* Success Dialog */}
            <Modal
                open={isSuccessDialogOpen}
                footer={null}
                closable={false}
                centered
                width={400}
                className="success-modal"
            >
                <div className="text-center py-8">
                    <div className="mb-6">
                        <div className="mx-auto w-40 h-40 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#D1FAE5' }}>
                            <div className="w-30 h-30 rounded-full flex items-center justify-center" style={{ backgroundColor: '#10B981' }}>
                                <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#FFFFFF' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: '#1F2937' }}>
                        ข้อมูลที่คุณลงทะเบียนผ่านการอนุมัติแล้ว
                    </h3>
                    <div
                        className="bg-[#0D263B] hover:bg-[#1a3a52] border-[#0D263B] px-8 py-2 h-auto mt-10 rounded-md"
                        onClick={() => {
                            setIsSuccessDialogOpen(false);
                            router.push('/partner/policy');
                        }}
                    >
                        <span className="text-white">เข้าสู่การเพิ่มข้อมูลของคุณ</span>
                    </div>
                </div>
            </Modal>

            {/* Policy Modal */}
            <Modal
                title={
                    <div className="text-center">
                        <div className="text-3xl font-bold mb-1" style={{ color: '#3B82F6' }}>PetZy</div>
                        <div className="text-sm text-gray-600">Pet-Friendly Hotel</div>
                        <div className="text-xl font-semibold mt-2" style={{ color: '#1F2937' }}>นโยบายและข้อตกลงคู่ค้า</div>
                    </div>
                }
                open={isPolicyModalOpen}
                onCancel={() => setIsPolicyModalOpen(false)}
                width="90%"
                style={{ maxWidth: '1200px' }}
                footer={[
                    <Button key="cancel" onClick={() => setIsPolicyModalOpen(false)}>
                        ปิด
                    </Button>,
                ]}
            >
                <div className="max-h-96 overflow-y-auto">
                    <div className="space-y-6 p-4">
                        <section>
                            <h3 className="text-lg font-semibold mb-3" style={{ color: '#1F2937' }}>1. การยอมรับข้อตกลง</h3>
                            <p className="leading-relaxed" style={{ color: '#374151' }}>
                                การใช้บริการของ PetZy ถือว่าท่านได้อ่าน เข้าใจ และยอมรับข้อตกลงและเงื่อนไขทั้งหมดแล้ว
                                หากท่านไม่ยอมรับข้อตกลงใดข้อหนึ่ง กรุณาหยุดการใช้บริการทันที
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold mb-3" style={{ color: '#1F2937' }}>2. การใช้บริการ</h3>
                            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
                                <li>ท่านต้องมีอายุไม่ต่ำกว่า 18 ปี หรือได้รับความยินยอมจากผู้ปกครอง</li>
                                <li>ข้อมูลที่ให้ไว้ต้องเป็นความจริงและถูกต้องครบถ้วน</li>
                                <li>ท่านรับผิดชอบในการรักษาความปลอดภัยของบัญชีผู้ใช้</li>
                                <li>ห้ามใช้บริการเพื่อกิจกรรมที่ผิดกฎหมายหรือไม่เหมาะสม</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold mb-3" style={{ color: '#1F2937' }}>3. นโยบายสัตว์เลี้ยง</h3>
                            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
                                <li>สัตว์เลี้ยงต้องมีใบรับรองสุขภาพและการฉีดวัคซีนครบถ้วน</li>
                                <li>เจ้าของสัตว์เลี้ยงต้องรับผิดชอบความเสียหายที่เกิดขึ้น</li>
                                <li>สัตว์เลี้ยงต้องอยู่ในความดูแลของเจ้าของตลอดเวลา</li>
                                <li>ห้ามทิ้งสัตว์เลี้ยงไว้ในห้องพักโดยลำพัง</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold mb-3" style={{ color: '#1F2937' }}>4. การจองและการชำระเงิน</h3>
                            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
                                <li>การจองจะสมบูรณ์เมื่อได้รับการยืนยันและชำระเงินแล้ว</li>
                                <li>ราคาที่แสดงรวมภาษีและค่าบริการแล้ว</li>
                                <li>การยกเลิกการจองต้องแจ้งล่วงหน้าตามเงื่อนไขของแต่ละที่พัก</li>
                                <li>การคืนเงินจะดำเนินการตามนโยบายการยกเลิก</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold mb-3" style={{ color: '#1F2937' }}>5. ความรับผิดชอบ</h3>
                            <p className="leading-relaxed" style={{ color: '#374151' }}>
                                PetZy ทำหน้าที่เป็นตัวกลางในการเชื่อมต่อระหว่างผู้ใช้บริการและผู้ให้บริการที่พัก
                                เราไม่รับผิดชอบต่อคุณภาพการบริการ ความเสียหาย หรือข้อพิพาทที่เกิดขึ้นระหว่างคู่สัญญา
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold mb-3" style={{ color: '#1F2937' }}>6. ความเป็นส่วนตัว</h3>
                            <p className="leading-relaxed" style={{ color: '#374151' }}>
                                เราเคารพความเป็นส่วนตัวของท่านและจะปกป้องข้อมูลส่วนบุคคลตามนโยบายความเป็นส่วนตัวของเรา
                                ข้อมูลของท่านจะถูกใช้เพื่อการให้บริการและปรับปรุงประสบการณ์การใช้งานเท่านั้น
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold mb-3" style={{ color: '#1F2937' }}>7. การแก้ไขข้อตกลง</h3>
                            <p className="leading-relaxed" style={{ color: '#374151' }}>
                                PetZy ขอสงวนสิทธิ์ในการแก้ไขข้อตกลงและเงื่อนไขได้ตลอดเวลา
                                การแก้ไขจะมีผลทันทีเมื่อประกาศบนเว็บไซต์ การใช้บริการต่อไปถือว่ายอมรับการแก้ไข
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold mb-3" style={{ color: '#1F2937' }}>8. การติดต่อ</h3>
                            <p className="leading-relaxed" style={{ color: '#374151' }}>
                                หากมีข้อสงสัยหรือต้องการความช่วยเหลือ กรุณาติดต่อเราผ่านช่องทางที่กำหนดไว้ในเว็บไซต์
                                ทีมงานของเราพร้อมให้บริการและแก้ไขปัญหาอย่างรวดเร็ว
                            </p>
                        </section>

                        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#EFF6FF' }}>
                            <p className="text-sm text-center" style={{ color: '#1E40AF' }}>
                                ข้อตกลงและเงื่อนไขนี้มีผลบังคับใช้ตั้งแต่วันที่ 1 มกราคม 2024 เป็นต้นไป
                            </p>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
