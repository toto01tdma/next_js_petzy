'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import LogoFirstPage from "@/components/first_page/logo";
import { Button, Modal, Spin } from 'antd';
import type { UploadFile } from 'antd';
import PersonalInformationSection from '@/components/partner/dataEntry/PersonalInformationSection';
import HotelLocationSection from '@/components/partner/dataEntry/HotelLocationSection';
import BusinessDetailsSection from '@/components/partner/dataEntry/BusinessDetailsSection';
import FileUploadSection from '@/components/partner/dataEntry/FileUploadSection';
import Swal from 'sweetalert2';
import { API_BASE_URL, USE_API_MODE } from '@/config/api';
import { checkAuthError } from '@/utils/api';

// Type definitions
type PartnerDataResponse = {
    success: boolean;
    message: string;
    data: {
        first_name: string;
        last_name: string;
        first_name_eng: string;
        last_name_eng: string;
        national_id_number: string;
        corporate_tax_id: string;
        email: string;
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
    error: string;
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

                // Check for authentication error
                if (checkAuthError(response, data)) {
                    return;
                }

                if (data.success && data.data) {
                    // Map API response to form data
                    setFormData({
                        firstName: data.data.first_name || '',
                        lastName: data.data.last_name || '',
                        firstNameEng: data.data.first_name_eng || '',
                        lastNameEng: data.data.last_name_eng || '',
                        nationalIdNumber: data.data.national_id_number || '',
                        corporateTaxId: data.data.corporate_tax_id || '',
                        email: data.data.email || '',
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
                    // Helper function to get full image URL
                    const getFullImageUrl = (path: string) => {
                        if (!path) return '';
                        // If path already starts with http:// or https://, return as is
                        if (path.startsWith('http://') || path.startsWith('https://')) {
                            return path;
                        }
                        // Otherwise, prepend the API base URL
                        return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
                    };

                    const newUploadedImages: { [key: number]: UploadFile } = {};
                    if (data.data.national_id_card_url) {
                        newUploadedImages[0] = {
                            uid: '0',
                            name: 'national_id_card',
                            status: 'done',
                            url: getFullImageUrl(data.data.national_id_card_url)
                        };
                    }
                    if (data.data.trade_registration_cert_url) {
                        newUploadedImages[1] = {
                            uid: '1',
                            name: 'trade_registration_cert',
                            status: 'done',
                            url: getFullImageUrl(data.data.trade_registration_cert_url)
                        };
                    }
                    if (data.data.tax_documents_url) {
                        newUploadedImages[2] = {
                            uid: '2',
                            name: 'tax_documents',
                            status: 'done',
                            url: getFullImageUrl(data.data.tax_documents_url)
                        };
                    }
                    if (data.data.house_registration_url) {
                        newUploadedImages[3] = {
                            uid: '3',
                            name: 'house_registration',
                            status: 'done',
                            url: getFullImageUrl(data.data.house_registration_url)
                        };
                    }
                    if (data.data.additional_documents_url && data.data.additional_documents_url.length > 0) {
                        newUploadedImages[4] = {
                            uid: '4',
                            name: 'additional_documents',
                            status: 'done',
                            url: getFullImageUrl(data.data.additional_documents_url[0])
                        };
                    }
                    if (data.data.bank_account_book_url) {
                        newUploadedImages[5] = {
                            uid: '5',
                            name: 'bank_account_book',
                            status: 'done',
                            url: getFullImageUrl(data.data.bank_account_book_url)
                        };
                    }
                    if (data.data.service_location_photos_url && data.data.service_location_photos_url.length > 0) {
                        newUploadedImages[6] = {
                            uid: '6',
                            name: 'service_location_photos',
                            status: 'done',
                            url: getFullImageUrl(data.data.service_location_photos_url[0])
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

    // Check for REJECTED status and fetch rejection details on component mount
    useEffect(() => {
        const checkApprovalStatus = async () => {
            const approvalStatus = localStorage.getItem('approvalStatus');
            
            if (approvalStatus === 'REJECTED') {
                // Fetch detailed rejection information from API
                try {
                    const token = localStorage.getItem('accessToken');
                    if (token && USE_API_MODE) {
                        const response = await fetch(`${API_BASE_URL}/api/partner/approval-status`, {
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
                        
                        if (result.success && result.data.status === 'REJECTED') {
                            const { review } = result.data;
                            
                            // Build rejection message with both rejectionReason and reviewNotes
                            let rejectionMessage = '';
                            
                            if (review?.rejectionReason) {
                                rejectionMessage = `<div style="text-align: left; margin-bottom: 12px;">
                                    <strong style="color: #DC2626; font-size: 16px;">เหตุผลที่ปฏิเสธ:</strong><br/>
                                    <div style="border: 1px solid #6B7280; padding: 10px; border-radius: 5px;">
                                    <p style="font-size: 14px;">${review.rejectionReason}</p>
                                    </div>
                                </div>`;
                            }
                            
                            if (review?.reviewNotes) {
                                rejectionMessage += `<div style="text-align: left; margin-top: 16px;">
                                    <strong style="font-size: 14px;">หมายเหตุจากผู้ตรวจสอบ:</strong><br/>
                                    <div style="border: 1px solid #6B7280; padding: 10px; border-radius: 5px;">
                                        <p style="font-size: 14px; color: #6B7280;">${review.reviewNotes}</p>
                                    </div>
                                </div>`;
                            }
                            
                            if (!rejectionMessage) {
                                rejectionMessage = 'กรุณาตรวจสอบข้อมูลแล้วยื่นส่งข้อมูลอีกครั้ง';
                            }

                            await Swal.fire({
                                icon: 'error',
                                title: 'คำขออนุมัติถูกปฏิเสธ',
                                html: rejectionMessage,
                                confirmButtonText: 'ตกลง แก้ไขข้อมูล',
                                confirmButtonColor: '#DC2626',
                                width: '600px'
                            });
                        } else {
                            // Fallback if API call fails or status doesn't match
                            await Swal.fire({
                                icon: 'warning',
                                title: 'ท่านไม่ผ่านการตรวจสอบ',
                                text: 'กรุณาตรวจสอบข้อมูลแล้วยื่นส่งข้อมูลอีกครั้ง',
                                confirmButtonText: 'ตกลง',
                                confirmButtonColor: '#DC2626'
                            });
                        }
                    } else {
                        // Preview mode or no token - show generic message
                        await Swal.fire({
                            icon: 'warning',
                            title: 'ท่านไม่ผ่านการตรวจสอบ',
                            text: 'กรุณาตรวจสอบข้อมูลแล้วยื่นส่งข้อมูลอีกครั้ง',
                            confirmButtonText: 'ตกลง',
                            confirmButtonColor: '#DC2626'
                        });
                    }
                } catch (error) {
                    console.error('Error fetching rejection details:', error);
                    // Fallback to generic message on error
                    await Swal.fire({
                        icon: 'warning',
                        title: 'ท่านไม่ผ่านการตรวจสอบ',
                        text: 'กรุณาตรวจสอบข้อมูลแล้วยื่นส่งข้อมูลอีกครั้ง',
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#DC2626'
                    });
                }
            }
        };

        checkApprovalStatus();
    }, []);
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

    // Upload documents to server
    const uploadDocuments = async () => {
        const token = localStorage.getItem('accessToken');
        const formDataUpload = new FormData();
        let hasFiles = false;

        // Add files to FormData if they exist and are File objects
        if (uploadedImages[0]?.originFileObj) {
            formDataUpload.append('national_id_card', uploadedImages[0].originFileObj);
            hasFiles = true;
        }
        if (uploadedImages[1]?.originFileObj) {
            formDataUpload.append('trade_registration_cert', uploadedImages[1].originFileObj);
            hasFiles = true;
        }
        if (uploadedImages[2]?.originFileObj) {
            formDataUpload.append('tax_documents', uploadedImages[2].originFileObj);
            hasFiles = true;
        }
        if (uploadedImages[3]?.originFileObj) {
            formDataUpload.append('house_registration', uploadedImages[3].originFileObj);
            hasFiles = true;
        }
        if (uploadedImages[4]?.originFileObj) {
            formDataUpload.append('additional_documents', uploadedImages[4].originFileObj);
            hasFiles = true;
        }
        if (uploadedImages[5]?.originFileObj) {
            formDataUpload.append('bank_account_book', uploadedImages[5].originFileObj);
            hasFiles = true;
        }
        if (uploadedImages[6]?.originFileObj) {
            formDataUpload.append('service_location_photos', uploadedImages[6].originFileObj);
            hasFiles = true;
        }

        // If no new files to upload, return existing URLs
        if (!hasFiles) {
            return {
                national_id_card_url: uploadedImages[0]?.url || '',
                trade_registration_cert_url: uploadedImages[1]?.url || '',
                tax_documents_url: uploadedImages[2]?.url || '',
                house_registration_url: uploadedImages[3]?.url || '',
                additional_documents_url: uploadedImages[4]?.url ? [uploadedImages[4].url] : [],
                bank_account_book_url: uploadedImages[5]?.url || '',
                service_location_photos_url: uploadedImages[6]?.url ? [uploadedImages[6].url] : []
            };
        }

        // Upload files to server
        const uploadResponse = await fetch(`${API_BASE_URL}/api/upload/documents`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formDataUpload
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResult.success) {
            throw new Error(uploadResult.error || 'Failed to upload documents');
        }

        return uploadResult.data;
    };

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

            // Step 1: Upload documents first
            const uploadedUrls = await uploadDocuments();

            // Build the payload according to API requirements
            const payload = {
                first_name: formData.firstName,
                last_name: formData.lastName,
                first_name_eng: formData.firstNameEng,
                last_name_eng: formData.lastNameEng,
                national_id_number: formData.nationalIdNumber,
                passport_number: '', // Not collected in current form
                corporate_tax_id: formData.corporateTaxId,
                email: formData.email,
                backup_phone: formData.backupPhone,
                additional_details: formData.additionalDetails,
                hotel_name: formData.accommodationName,
                trade_registration_number: formData.tradeRegistrationNumber,
                address: formData.address,
                primary_phone: formData.phoneNumber,
                accommodation_name: formData.accommodationName,
                accommodation_name_en: formData.accommodationNameEn,
                business_email: formData.businessEmail,
                office_phone: formData.officePhone,
                google_maps_link: formData.googleMapsLink,
                mobile_phone: formData.mobilePhone,
                business_additional_details: formData.businessAdditionalDetails,
                national_id_card_url: uploadedUrls.national_id_card_url,
                trade_registration_cert_url: uploadedUrls.trade_registration_cert_url,
                tax_documents_url: uploadedUrls.tax_documents_url,
                house_registration_url: uploadedUrls.house_registration_url,
                additional_documents_url: uploadedUrls.additional_documents_url,
                bank_account_book_url: uploadedUrls.bank_account_book_url,
                service_location_photos_url: uploadedUrls.service_location_photos_url,
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

            // Check for authentication error
            if (checkAuthError(response, data)) {
                return;
            }

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
                    text: data.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#28A7CB'
                });
            }
        } catch (error) {
            console.error('Error saving data:', error);
            await Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: error instanceof Error ? error.message : 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง',
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
                        <h1 className="text-5xl font-bold mt-4" style={{ color: '#0D263B' }}>Pet-Friendly Hotel</h1>
                    </div>

                    {/* Loading Spinner */}
                    {isFetching && (
                        <div className="flex justify-center items-center py-20">
                            <Spin size="large" tip="กำลังโหลดข้อมูล..." />
                        </div>
                    )}

                    {/* Form Container */}
                    {!isFetching && (<>
                        {/* Personal Information Section */}
                        <PersonalInformationSection
                            formData={{
                                firstName: formData.firstName,
                                lastName: formData.lastName,
                                nationalIdNumber: formData.nationalIdNumber,
                                email: formData.email,
                                phoneNumber: formData.phoneNumber,
                                firstNameEng: formData.firstNameEng,
                                lastNameEng: formData.lastNameEng,
                                corporateTaxId: formData.corporateTaxId,
                                additionalDetails: formData.additionalDetails,
                                backupPhone: formData.backupPhone,
                            }}
                            onInputChange={handleInputChange}
                                            disabled={isFetching}
                                        />

                        {/* Hotel Location Section */}
                        <HotelLocationSection
                            formData={{
                                accommodationName: formData.accommodationName,
                                accommodationNameEn: formData.accommodationNameEn,
                                tradeRegistrationNumber: formData.tradeRegistrationNumber,
                                address: formData.address,
                                businessEmail: formData.businessEmail,
                                officePhone: formData.officePhone,
                                googleMapsLink: formData.googleMapsLink,
                                mobilePhone: formData.mobilePhone,
                            }}
                            onInputChange={handleInputChange}
                                            disabled={isFetching}
                                        />

                        {/* Business Details Section */}
                        <BusinessDetailsSection
                            businessAdditionalDetails={formData.businessAdditionalDetails}
                            onInputChange={handleInputChange}
                                            disabled={isFetching}
                                        />

                        {/* File Upload Section */}
                        <FileUploadSection
                            uploadedImages={uploadedImages}
                            onImageUpload={(index, file) => {
                                        const newUploadedImages = { ...uploadedImages };
                                newUploadedImages[index] = {
                                    uid: `${index}-${Date.now()}`,
                                            name: file.name,
                                            status: 'done',
                                            url: URL.createObjectURL(file),
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            originFileObj: file as any,
                                        };
                                        setUploadedImages(newUploadedImages);
                                    }}
                            onImageRemove={(index) => {
                                        const newUploadedImages = { ...uploadedImages };
                                delete newUploadedImages[index];
                                        setUploadedImages(newUploadedImages);
                                    }}
                            onPolicyModalOpen={() => setIsPolicyModalOpen(true)}
                        />

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
                        className="px-8 py-2 h-auto mt-10 rounded-md"
                        style={{ backgroundColor: '#0D263B', borderColor: '#0D263B' }}
                        onClick={() => {
                            setIsSuccessDialogOpen(false);
                            router.push('/partner/policy');
                        }}
                    >
                        <span style={{ color: '#FFFFFF' }}>เข้าสู่การเพิ่มข้อมูลของคุณ</span>
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
