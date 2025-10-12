'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/partner/shared/Sidebar';
import { Button, Spin } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import LogoFirstPage from "@/components/first_page/logo";
import type { UploadFile } from 'antd';
import Swal from 'sweetalert2';
import { API_BASE_URL, USE_API_MODE } from '@/config/api';

// Import all the separated components
import PersonalInformationSection from '@/components/partner/dataEntry/PersonalInformationSection';
import HotelLocationSection from '@/components/partner/dataEntry/HotelLocationSection';
import BusinessDetailsSection from '@/components/partner/dataEntry/BusinessDetailsSection';
import FileUploadSection from '@/components/partner/dataEntry/FileUploadSection';
import HotelServiceConfigSection from '@/components/partner/dataEntry/HotelServiceConfigSection';
import RoomServiceManagementSection from '@/components/partner/dataEntry/RoomServiceManagementSection';
import type { RoomServiceRow } from '@/components/partner/dataEntry/RoomServiceConfigSection';

// Service type interfaces
interface ApiRoomService {
    room_type: string;
    quantity: number;
    open_time: string;
    close_time: string;
    price: number;
}

interface ApiSpecialService {
    service_type: string;
    quantity: string;
    open_time: string;
    close_time: string;
    price: number;
}

interface ApiPetCareService {
    service_type: string;
    quantity: string;
    open_time?: string;
    close_time?: string;
    price: number;
}

export default function CreateService() {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    // Personal Information State
    const [personalInfo, setPersonalInfo] = useState({
        firstName: '',
        lastName: '',
        nationalIdNumber: '',
        email: '',
        phoneNumber: '',
        firstNameEng: '',
        lastNameEng: '',
        corporateTaxId: '',
        additionalDetails: '',
        backupPhone: '',
    });

    // Hotel Location State
    const [hotelLocation, setHotelLocation] = useState({
        accommodationName: '',
        accommodationNameEn: '',
        tradeRegistrationNumber: '',
        address: '',
        businessEmail: '',
        officePhone: '',
        googleMapsLink: '',
        mobilePhone: '',
    });

    // Business Details State
    const [businessDetails, setBusinessDetails] = useState('');

    // Document Upload State
    const [uploadedDocs, setUploadedDocs] = useState<{ [key: number]: UploadFile }>({});

    // Hotel Service Config State
    const [hotelServiceConfig, setHotelServiceConfig] = useState({
        roomService: false,
        specialService: false,
        petCareService: false,
        hotelName: '',
        hotelNameConfirm: '',
        hotelNameEng: '',
        hotelNameEngConfirm: '',
        rooms: '',
        customRoomCount: '',
        province: '',
        customRoomType: '',
        district: '',
        subdistrict: '',
        specialServiceType: '',
        services: [] as string[],
    });

    const [showCustomRoomInput, setShowCustomRoomInput] = useState(false);
    const [showCustomRoomTypeInput, setShowCustomRoomTypeInput] = useState(false);
    const [showSpecialServiceTypeInput, setShowSpecialServiceTypeInput] = useState(false);

    // Accommodation Photos State
    const [uploadedPhotos, setUploadedPhotos] = useState<{ [key: number]: UploadFile }>({});
    const [roomServiceData, setRoomServiceData] = useState<RoomServiceRow[]>([
        { id: 1, roomType: '', quantity: '', openTime: '', closeTime: '', price: '' },
        { id: 2, roomType: '', quantity: '', openTime: '', closeTime: '', price: '' },
        { id: 3, roomType: '', quantity: '', openTime: '', closeTime: '', price: '' },
    ]);
    const [specialServicesData, setSpecialServicesData] = useState<RoomServiceRow[]>([
        { id: 1, roomType: '', quantity: '', openTime: '', closeTime: '', price: '' },
    ]);
    const [petCareServicesData, setPetCareServicesData] = useState<RoomServiceRow[]>([
        { id: 1, roomType: '', quantity: '', openTime: '', closeTime: '', price: '' },
    ]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Fetch existing service data if editing
    useEffect(() => {
        const fetchServiceData = async () => {
            setIsFetching(true);
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    setIsFetching(false);
                    return; // No token, this is a new service creation
                }

                if (!USE_API_MODE) {
                    // Preview mode - skip fetch
                    setIsFetching(false);
                    return;
                }

                // Fetch service data from API
                const response = await fetch(`${API_BASE_URL}/api/partner/service-data`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (data.success && data.data) {
                    // Populate personal information
                    if (data.data.personal_info) {
                        setPersonalInfo({
                            firstName: data.data.personal_info.first_name || '',
                            lastName: data.data.personal_info.last_name || '',
                            nationalIdNumber: data.data.personal_info.national_id_number || '',
                            email: data.data.personal_info.email || '',
                            phoneNumber: data.data.personal_info.phone_number || '',
                            firstNameEng: data.data.personal_info.first_name_eng || '',
                            lastNameEng: data.data.personal_info.last_name_eng || '',
                            corporateTaxId: data.data.personal_info.corporate_tax_id || '',
                            additionalDetails: data.data.personal_info.additional_details || '',
                            backupPhone: data.data.personal_info.backup_phone || '',
                        });
                    }

                    // Populate hotel location
                    if (data.data.hotel_location) {
                        setHotelLocation({
                            accommodationName: data.data.hotel_location.accommodation_name || '',
                            accommodationNameEn: data.data.hotel_location.accommodation_name_en || '',
                            tradeRegistrationNumber: data.data.hotel_location.trade_registration_number || '',
                            address: data.data.hotel_location.address || '',
                            businessEmail: data.data.hotel_location.business_email || '',
                            officePhone: data.data.hotel_location.office_phone || '',
                            googleMapsLink: data.data.hotel_location.google_maps_link || '',
                            mobilePhone: data.data.hotel_location.mobile_phone || '',
                        });
                        setBusinessDetails(data.data.hotel_location.business_additional_details || '');
                    }

                    // Populate documents (NEW: from API response)
                    if (data.data.documents) {
                        const docs = data.data.documents;
                        const newUploadedDocs: { [key: number]: UploadFile } = {};

                        // Helper function to get full image URL
                        const getFullImageUrl = (path: string) => {
                            if (!path) return '';
                            if (path.startsWith('http://') || path.startsWith('https://')) {
                                return path;
                            }
                            return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
                        };

                        // Map document URLs to uploadedDocs state (indices 0-6)
                        if (docs.national_id_card_url) {
                            newUploadedDocs[0] = {
                                uid: '0',
                                name: 'national_id_card',
                                status: 'done',
                                url: getFullImageUrl(docs.national_id_card_url)
                            };
                        }
                        if (docs.trade_registration_cert_url) {
                            newUploadedDocs[1] = {
                                uid: '1',
                                name: 'trade_registration_cert',
                                status: 'done',
                                url: getFullImageUrl(docs.trade_registration_cert_url)
                            };
                        }
                        if (docs.tax_documents_url) {
                            newUploadedDocs[2] = {
                                uid: '2',
                                name: 'tax_documents',
                                status: 'done',
                                url: getFullImageUrl(docs.tax_documents_url)
                            };
                        }
                        if (docs.house_registration_url) {
                            newUploadedDocs[3] = {
                                uid: '3',
                                name: 'house_registration',
                                status: 'done',
                                url: getFullImageUrl(docs.house_registration_url)
                            };
                        }
                        if (docs.additional_documents_url && docs.additional_documents_url.length > 0) {
                            newUploadedDocs[4] = {
                                uid: '4',
                                name: 'additional_documents',
                                status: 'done',
                                url: getFullImageUrl(docs.additional_documents_url[0])
                            };
                        }
                        if (docs.bank_account_book_url) {
                            newUploadedDocs[5] = {
                                uid: '5',
                                name: 'bank_account_book',
                                status: 'done',
                                url: getFullImageUrl(docs.bank_account_book_url)
                            };
                        }
                        if (docs.service_location_photos_url && docs.service_location_photos_url.length > 0) {
                            newUploadedDocs[6] = {
                                uid: '6',
                                name: 'service_location_photos',
                                status: 'done',
                                url: getFullImageUrl(docs.service_location_photos_url[0])
                            };
                        }

                        setUploadedDocs(newUploadedDocs);
                    }

                    // Populate service configuration
                    if (data.data.service_configuration) {
                        setHotelServiceConfig({
                            roomService: data.data.service_configuration.room_service || false,
                            specialService: data.data.service_configuration.special_service || false,
                            petCareService: data.data.service_configuration.pet_care_service || false,
                            hotelName: data.data.service_configuration.hotel_name || '',
                            hotelNameConfirm: data.data.service_configuration.hotel_name || '',
                            hotelNameEng: data.data.service_configuration.hotel_name_eng || '',
                            hotelNameEngConfirm: data.data.service_configuration.hotel_name_eng || '',
                            rooms: data.data.service_configuration.total_rooms || '',
                            customRoomCount: '',
                            province: data.data.service_configuration.room_type || '',
                            customRoomType: '',
                            district: data.data.service_configuration.service_type || '',
                            subdistrict: data.data.service_configuration.special_service_type || '',
                            specialServiceType: '',
                            services: data.data.service_configuration.additional_services || [],
                        });
                    }

                    // Populate room services
                    if (data.data.room_services && data.data.room_services.length > 0) {
                        setRoomServiceData(data.data.room_services.map((service: ApiRoomService, index: number) => ({
                            id: index + 1,
                            roomType: service.room_type || '',
                            quantity: service.quantity?.toString() || '',
                            openTime: service.open_time || '',
                            closeTime: service.close_time || '',
                            price: service.price?.toString() || ''
                        })));
                    }

                    // Populate special services
                    if (data.data.special_services && data.data.special_services.length > 0) {
                        setSpecialServicesData(data.data.special_services.map((service: ApiSpecialService, index: number) => ({
                            id: index + 1,
                            roomType: service.service_type || '',
                            quantity: service.quantity || '',
                            openTime: service.open_time || '',
                            closeTime: service.close_time || '',
                            price: service.price?.toString() || ''
                        })));
                    }

                    // Populate pet care services
                    if (data.data.pet_care_services && data.data.pet_care_services.length > 0) {
                        setPetCareServicesData(data.data.pet_care_services.map((service: ApiPetCareService, index: number) => ({
                            id: index + 1,
                            roomType: service.service_type || '',
                            quantity: service.quantity || '',
                            openTime: service.open_time || '',
                            closeTime: service.close_time || '',
                            price: service.price?.toString() || ''
                        })));
                    }
                }
            } catch (error) {
                console.error('Error fetching service data:', error);
                // Don't show error for new service creation
            } finally {
                setIsFetching(false);
            }
        };

        fetchServiceData();
    }, [router]);

    // Complete form submission handler
    const handleCompleteSubmit = async () => {
        setIsSubmitting(true);
        
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                await Swal.fire({
                    icon: 'error',
                    title: 'กรุณาเข้าสู่ระบบ',
                    text: 'ไม่พบข้อมูลการเข้าสู่ระบบ กรุณาเข้าสู่ระบบใหม่',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#DC2626'
                });
                router.push('/login');
                return;
            }

            // Step 1: Upload documents from Step 1
            let documentUrls = {
                national_id_card_url: '',
                trade_registration_cert_url: '',
                tax_documents_url: '',
                house_registration_url: '',
                additional_documents_url: [] as string[],
                bank_account_book_url: '',
                service_location_photos_url: [] as string[]
            };

            if (USE_API_MODE) {
                // Check which documents need uploading (new files vs existing URLs)
                const hasNewFiles = uploadedDocs[0]?.originFileObj || uploadedDocs[1]?.originFileObj || 
                                   uploadedDocs[2]?.originFileObj || uploadedDocs[3]?.originFileObj || 
                                   uploadedDocs[4]?.originFileObj || uploadedDocs[5]?.originFileObj || 
                                   uploadedDocs[6]?.originFileObj;

                if (hasNewFiles) {
                    // Upload new documents
                    const formData = new FormData();
                    if (uploadedDocs[0]?.originFileObj) formData.append('national_id_card', uploadedDocs[0].originFileObj as Blob);
                    if (uploadedDocs[1]?.originFileObj) formData.append('trade_registration_cert', uploadedDocs[1].originFileObj as Blob);
                    if (uploadedDocs[2]?.originFileObj) formData.append('tax_documents', uploadedDocs[2].originFileObj as Blob);
                    if (uploadedDocs[3]?.originFileObj) formData.append('house_registration', uploadedDocs[3].originFileObj as Blob);
                    if (uploadedDocs[4]?.originFileObj) formData.append('additional_documents', uploadedDocs[4].originFileObj as Blob);
                    if (uploadedDocs[5]?.originFileObj) formData.append('bank_account_book', uploadedDocs[5].originFileObj as Blob);
                    if (uploadedDocs[6]?.originFileObj) formData.append('service_location_photo', uploadedDocs[6].originFileObj as Blob);

                    const docResponse = await fetch(`${API_BASE_URL}/api/upload/documents`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        body: formData
                    });

                    const docResult = await docResponse.json();
                    if (docResult.success && docResult.data) {
                        documentUrls = { ...documentUrls, ...docResult.data };
                    }
                }

                // Preserve existing URLs for documents that weren't re-uploaded
                // Convert full URLs back to relative paths if needed
                const getRelativePath = (url: string) => {
                    if (!url) return '';
                    if (url.startsWith('/uploads/')) return url;
                    if (url.includes('/uploads/')) {
                        return url.substring(url.indexOf('/uploads/'));
                    }
                    return url;
                };

                if (uploadedDocs[0]?.url && !uploadedDocs[0]?.originFileObj) {
                    documentUrls.national_id_card_url = getRelativePath(uploadedDocs[0].url);
                }
                if (uploadedDocs[1]?.url && !uploadedDocs[1]?.originFileObj) {
                    documentUrls.trade_registration_cert_url = getRelativePath(uploadedDocs[1].url);
                }
                if (uploadedDocs[2]?.url && !uploadedDocs[2]?.originFileObj) {
                    documentUrls.tax_documents_url = getRelativePath(uploadedDocs[2].url);
                }
                if (uploadedDocs[3]?.url && !uploadedDocs[3]?.originFileObj) {
                    documentUrls.house_registration_url = getRelativePath(uploadedDocs[3].url);
                }
                if (uploadedDocs[4]?.url && !uploadedDocs[4]?.originFileObj) {
                    documentUrls.additional_documents_url = [getRelativePath(uploadedDocs[4].url)];
                }
                if (uploadedDocs[5]?.url && !uploadedDocs[5]?.originFileObj) {
                    documentUrls.bank_account_book_url = getRelativePath(uploadedDocs[5].url);
                }
                if (uploadedDocs[6]?.url && !uploadedDocs[6]?.originFileObj) {
                    documentUrls.service_location_photos_url = [getRelativePath(uploadedDocs[6].url)];
                }
            }

            // Step 2: Upload accommodation photos from Step 3
            let coverImageUrl = '';
            const roomImageUrls: string[] = [];

            if (USE_API_MODE) {
                // Upload cover image
                if (uploadedPhotos[0]?.originFileObj) {
                    const coverFormData = new FormData();
                    coverFormData.append('cover', uploadedPhotos[0].originFileObj as Blob);

                    const coverResponse = await fetch(`${API_BASE_URL}/api/upload/accommodation-photos`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        body: coverFormData
                    });

                    const coverResult = await coverResponse.json();
                    if (coverResult.success && coverResult.data?.cover_url) {
                        coverImageUrl = coverResult.data.cover_url;
                    }
                }

                // Upload room images
                for (let i = 1; i <= 6; i++) {
                    const image = uploadedPhotos[i];
                    if (image?.originFileObj) {
                        const roomFormData = new FormData();
                        roomFormData.append('room_image', image.originFileObj as Blob);

                        const roomResponse = await fetch(`${API_BASE_URL}/api/upload/accommodation-photos`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            },
                            body: roomFormData
                        });

                        const roomResult = await roomResponse.json();
                        if (roomResult.success && roomResult.data?.room_image_url) {
                            roomImageUrls.push(roomResult.data.room_image_url);
                        }
                    }
                }
            }

            // Step 3: Prepare complete payload
            const completePayload = {
                // Step 1: Personal Information
                personal_info: {
                    first_name: personalInfo.firstName,
                    last_name: personalInfo.lastName,
                    first_name_eng: personalInfo.firstNameEng,
                    last_name_eng: personalInfo.lastNameEng,
                    national_id_number: personalInfo.nationalIdNumber,
                    corporate_tax_id: personalInfo.corporateTaxId,
                    email: personalInfo.email,
                    phone_number: personalInfo.phoneNumber,
                    backup_phone: personalInfo.backupPhone,
                    additional_details: personalInfo.additionalDetails
                },

                // Step 1: Hotel Location
                hotel_location: {
                    accommodation_name: hotelLocation.accommodationName,
                    accommodation_name_en: hotelLocation.accommodationNameEn,
                    trade_registration_number: hotelLocation.tradeRegistrationNumber,
                    address: hotelLocation.address,
                    business_email: hotelLocation.businessEmail,
                    office_phone: hotelLocation.officePhone,
                    google_maps_link: hotelLocation.googleMapsLink,
                    mobile_phone: hotelLocation.mobilePhone,
                    business_additional_details: businessDetails
                },

                // Step 1: Documents
                documents: documentUrls,

                // Step 2: Hotel Service Configuration
                service_configuration: {
                    room_service: hotelServiceConfig.roomService,
                    special_service: hotelServiceConfig.specialService,
                    pet_care_service: hotelServiceConfig.petCareService,
                    hotel_name: hotelServiceConfig.hotelName,
                    hotel_name_eng: hotelServiceConfig.hotelNameEng,
                    total_rooms: showCustomRoomInput ? hotelServiceConfig.customRoomCount : hotelServiceConfig.rooms,
                    room_type: showCustomRoomTypeInput ? hotelServiceConfig.customRoomType : hotelServiceConfig.province,
                    service_type: hotelServiceConfig.district,
                    special_service_type: showSpecialServiceTypeInput ? hotelServiceConfig.specialServiceType : hotelServiceConfig.subdistrict,
                    additional_services: hotelServiceConfig.services
                },

                // Step 3: Accommodation Photos
                accommodation_photos: {
                    cover_image_url: coverImageUrl,
                    room_image_urls: roomImageUrls
                },

                // Step 3: Room Services
                room_services: roomServiceData.map(service => ({
                    room_type: service.roomType,
                    quantity: parseInt(service.quantity) || 0,
                    open_time: service.openTime,
                    close_time: service.closeTime,
                    price: parseFloat(service.price) || 0
                })),

                // Step 3: Special Services
                special_services: specialServicesData.map(service => ({
                    service_type: service.roomType,
                    quantity: service.quantity,
                    open_time: service.openTime,
                    close_time: service.closeTime,
                    price: parseFloat(service.price) || 0
                })),

                // Step 3: Pet Care Services
                pet_care_services: petCareServicesData.map(service => ({
                    service_type: service.roomType,
                    quantity: service.quantity,
                    open_time: service.openTime,
                    close_time: service.closeTime,
                    price: parseFloat(service.price) || 0
                }))
            };

            // Step 4: Submit to API
            if (USE_API_MODE) {
                const response = await fetch(`${API_BASE_URL}/api/partner/create-service`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(completePayload)
                });

                const result = await response.json();

                if (result.success) {
                    await Swal.fire({
                        icon: 'success',
                        title: 'บันทึกข้อมูลสำเร็จ',
                        text: 'ข้อมูลบริการของคุณถูกบันทึกเรียบร้อยแล้ว',
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true
                    });
                    
                    router.push('/partner/manage-rooms');
                } else {
                    throw new Error(result.message || 'Failed to create service');
                }
            } else {
                // Preview mode
                await Swal.fire({
                    icon: 'success',
                    title: 'บันทึกข้อมูลสำเร็จ (Preview Mode)',
                    text: 'ข้อมูลบริการของคุณถูกบันทึกเรียบร้อยแล้ว',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true
                });
                
                router.push('/partner/manage-rooms');
            }
        } catch (error) {
            console.error('Error submitting service:', error);
            await Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: error instanceof Error ? error.message : 'ไม่สามารถบันทึกข้อมูลได้',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#DC2626'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePersonalInfoChange = (field: string, value: string) => {
        setPersonalInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleHotelLocationChange = (field: string, value: string) => {
        setHotelLocation(prev => ({ ...prev, [field]: value }));
    };

    const handleBusinessDetailsChange = (field: string, value: string) => {
        setBusinessDetails(value);
    };

    const handleDocUpload = (index: number, file: File) => {
        const newDocs = { ...uploadedDocs };
        newDocs[index] = {
            uid: `${index}-${Date.now()}`,
            name: file.name,
            status: 'done',
            url: URL.createObjectURL(file),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            originFileObj: file as any,
        };
        setUploadedDocs(newDocs);
    };

    const handleDocRemove = (index: number) => {
        const newDocs = { ...uploadedDocs };
        delete newDocs[index];
        setUploadedDocs(newDocs);
    };

    const handleServiceConfigChange = (field: string, value: string | boolean | string[]) => {
        setHotelServiceConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleRoomCountChange = (value: string) => {
        if (value === 'custom') {
            setShowCustomRoomInput(true);
            handleServiceConfigChange('rooms', '');
        } else {
            setShowCustomRoomInput(false);
            handleServiceConfigChange('rooms', value);
        }
    };

    const handleRoomTypeChange = (value: string) => {
        if (value === 'custom') {
            setShowCustomRoomTypeInput(true);
            handleServiceConfigChange('province', '');
        } else {
            setShowCustomRoomTypeInput(false);
            handleServiceConfigChange('province', value);
        }
    };

    const handleServiceTypeChange = (value: string) => {
        handleServiceConfigChange('district', value);
    };

    const handleSpecialServiceTypeChange = (value: string) => {
        if (value === 'custom') {
            setShowSpecialServiceTypeInput(true);
            handleServiceConfigChange('subdistrict', '');
        } else {
            setShowSpecialServiceTypeInput(false);
            handleServiceConfigChange('subdistrict', value);
        }
    };

    const handleServiceChange = (service: string, checked: boolean) => {
        const currentServices = [...hotelServiceConfig.services];
        if (checked) {
            if (!currentServices.includes(service)) {
                currentServices.push(service);
            }
        } else {
            const index = currentServices.indexOf(service);
            if (index > -1) {
                currentServices.splice(index, 1);
            }
        }
        handleServiceConfigChange('services', currentServices);
    };

    const handlePhotoUpload = (index: number, file: File) => {
        const newPhotos = { ...uploadedPhotos };
        newPhotos[index] = {
            uid: `${index}-${Date.now()}`,
            name: file.name,
            status: 'done',
            url: URL.createObjectURL(file),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            originFileObj: file as any,
        };
        setUploadedPhotos(newPhotos);
    };

    const handlePhotoRemove = (index: number) => {
        const newPhotos = { ...uploadedPhotos };
        delete newPhotos[index];
        setUploadedPhotos(newPhotos);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        <PersonalInformationSection
                            formData={personalInfo}
                            onInputChange={handlePersonalInfoChange}
                        />
                        <HotelLocationSection
                            formData={hotelLocation}
                            onInputChange={handleHotelLocationChange}
                        />
                        <BusinessDetailsSection
                            businessAdditionalDetails={businessDetails}
                            onInputChange={handleBusinessDetailsChange}
                        />
                        <FileUploadSection
                            uploadedImages={uploadedDocs}
                            onImageUpload={handleDocUpload}
                            onImageRemove={handleDocRemove}
                            onPolicyModalOpen={() => setIsPolicyModalOpen(true)}
                        />
                    </>
                );
            case 2:
                return (
                    <HotelServiceConfigSection
                        formData={hotelServiceConfig}
                        showCustomRoomInput={showCustomRoomInput}
                        showCustomRoomTypeInput={showCustomRoomTypeInput}
                        showSpecialServiceTypeInput={showSpecialServiceTypeInput}
                        onInputChange={handleServiceConfigChange}
                        onRoomCountChange={handleRoomCountChange}
                        onRoomTypeChange={handleRoomTypeChange}
                        onServiceTypeChange={handleServiceTypeChange}
                        onSpecialServiceTypeChange={handleSpecialServiceTypeChange}
                        onServiceChange={handleServiceChange}
                    />
                );
            case 3:
                return (
                    <RoomServiceManagementSection
                        defaultRoomServiceData={roomServiceData}
                        defaultSpecialServicesData={specialServicesData}
                        roomServiceHeaders={{
                            roomType: "รูปแบบห้องพักที่คุณเลือก",
                            quantity: "จำนวนห้องพัก",
                            openTime: "เวลาเปิด",
                            closeTime: "เวลาปิด",
                            price: "ราคาที่กำหนด"
                        }}
                        specialServiceHeaders={{
                            roomType: "รูปแบบบริการ",
                            quantity: "ประเภทบริการ",
                            openTime: "เวลาเปิด",
                            closeTime: "เวลาปิด",
                            price: "ราคาที่กำหนด"
                        }}
                        petCareServiceHeaders={{
                            roomType: "รูปแบบบริการ",
                            quantity: "ประเภทบริการ",
                            openTime: "เวลาเปิด",
                            closeTime: "เวลาปิด",
                            price: "ราคาที่กำหนด"
                        }}
                        onRoomServiceChange={setRoomServiceData}
                        onSpecialServiceChange={setSpecialServicesData}
                        onPetCareServiceChange={setPetCareServicesData}
                        onSubmit={() => {}}
                    />
                );
            default:
                return null;
        }
    };

    const stepTitles = [
        'ข้อมูลส่วนตัวและธุรกิจ',
        'การกำหนดค่าบริการโรงแรม',
        'รูปภาพและรายละเอียดบริการ'
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

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
                            <h1 className="text-2xl font-semibold text-gray-800">สร้างบริการใหม่</h1>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-6" style={{ backgroundColor: '#FFFFFF' }}>
                    {isFetching ? (
                        <div className="flex items-center justify-center min-h-[400px]">
                            <Spin size="large" tip="กำลังโหลดข้อมูล..." />
                        </div>
                    ) : (
                        <>
                            {/* Logo */}
                            <div className="text-center mb-6">
                                <LogoFirstPage />
                                <h1 className="text-4xl font-bold mt-4" style={{ color: '#0D263B' }}>Pet-Friendly Hotel</h1>
                                <p className="text-lg text-gray-600 mt-2">กรอกข้อมูลบริการของคุณเพื่อเริ่มต้น</p>
                            </div>

                    {/* Step Indicator */}
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center space-x-4">
                            {[1, 2, 3].map((step) => (
                                <div key={step} className="flex items-center">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                            currentStep === step
                                                ? 'bg-blue-600 text-white'
                                                : currentStep > step
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-300 text-gray-600'
                                        }`}
                                    >
                                        {step}
                                    </div>
                                    {step < 3 && (
                                        <div
                                            className={`w-20 h-1 ${
                                                currentStep > step ? 'bg-green-500' : 'bg-gray-300'
                                            }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step Title */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            {stepTitles[currentStep - 1]}
                        </h2>
                    </div>

                    {/* Form Content */}
                    <div className="max-w-6xl mx-auto">
                        {renderStepContent()}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center mt-8 max-w-6xl mx-auto">
                        <Button
                            size="large"
                            onClick={() => {
                                if (currentStep > 1) {
                                    setCurrentStep(currentStep - 1);
                                } else {
                                    router.back();
                                }
                            }}
                            className="px-8"
                        >
                            {currentStep === 1 ? 'ย้อนกลับ' : 'ก่อนหน้า'}
                        </Button>

                        <div className="text-sm text-gray-600">
                            ขั้นตอน {currentStep} จาก 3
                        </div>

                        <Button
                            size="large"
                            type="primary"
                            onClick={() => {
                                if (currentStep < 3) {
                                    setCurrentStep(currentStep + 1);
                                } else {
                                    handleCompleteSubmit();
                                }
                            }}
                            className="px-8"
                            style={{ backgroundColor: '#0D263B' }}
                            loading={isSubmitting}
                            disabled={isSubmitting}
                        >
                            {currentStep === 3 ? (isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล') : 'ถัดไป'}
                        </Button>
                    </div>
                        </>
                    )}
                </main>
            </div>

            {/* Policy Modal - Placeholder */}
            {isPolicyModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setIsPolicyModalOpen(false)}
                >
                    <div className="bg-white rounded-lg p-8 max-w-2xl">
                        <h2 className="text-2xl font-bold mb-4">นโยบายและข้อตกลง</h2>
                        <p className="text-gray-600 mb-4">
                            เนื้อหานโยบายและข้อตกลงจะแสดงที่นี่...
                        </p>
                        <Button
                            type="primary"
                            onClick={() => setIsPolicyModalOpen(false)}
                        >
                            ปิด
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

