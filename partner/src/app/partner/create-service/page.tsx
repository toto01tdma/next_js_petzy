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
import { checkAuthError } from '@/utils/api';

// Import all the separated components
import PersonalInformationSection from '@/components/partner/dataEntry/PersonalInformationSection';
import HotelLocationSection from '@/components/partner/dataEntry/HotelLocationSection';
import BusinessDetailsSection from '@/components/partner/dataEntry/BusinessDetailsSection';
import FileUploadSection from '@/components/partner/dataEntry/FileUploadSection';
import HotelServiceConfigSection from '@/components/partner/dataEntry/HotelServiceConfigSection';
import RoomServiceManagementSection from '@/components/partner/dataEntry/RoomServiceManagementSection';
import AccommodationPhotosSection from '@/components/partner/dataEntry/AccommodationPhotosSection';
import type { RoomServiceRow } from '@/components/partner/dataEntry/RoomServiceConfigSection';
import type { RoomDetailRow } from '@/components/partner/dataEntry/RoomSettingsModal';

// Helper function to format time from backend (Date string or HH:mm format) to HH:mm for input
const formatTimeForInput = (time: string | null | undefined): string => {
    if (!time) return '00:00';
    // If it's already in HH:mm format, return as is
    if (typeof time === 'string' && /^\d{2}:\d{2}$/.test(time)) {
        return time;
    }
    // If it's a Date string, extract HH:mm
    try {
        const date = new Date(time);
        if (!isNaN(date.getTime())) {
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${hours}:${minutes}`;
        }
    } catch {
        // If parsing fails, try to extract time from string
        const match = time.match(/(\d{2}):(\d{2})/);
        if (match) {
            return `${match[1]}:${match[2]}`;
        }
    }
    return '00:00';
};

interface ApiRoomService {
    id?: string; // Backend ID (UUID)
    room_type: string;
    quantity: number;
    open_time: string;
    close_time: string;
    price: number;
}

interface ApiSpecialService {
    id?: string; // Backend ID (UUID)
    service_type: string;
    quantity: string;
    open_time: string;
    close_time: string;
    price: number;
}

interface ApiPetCareService {
    id?: string; // Backend ID (UUID)
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
    const [accommodationDescription, setAccommodationDescription] = useState('');
    const [roomServiceData, setRoomServiceData] = useState<RoomServiceRow[]>([]);
    const [specialServicesData, setSpecialServicesData] = useState<RoomServiceRow[]>([
        { id: 1, roomType: '', quantity: '', openTime: '', closeTime: '', price: '' },
    ]);
    const [petCareServicesData, setPetCareServicesData] = useState<RoomServiceRow[]>([
        { id: 1, roomType: '', quantity: '', openTime: '', closeTime: '', price: '' },
    ]);

    // Room Details State (replaces Step 4)
    const [roomDetailsMap, setRoomDetailsMap] = useState<Map<number, RoomDetailRow[]>>(new Map());
    const [specialServiceDetailsMap, setSpecialServiceDetailsMap] = useState<Map<number, RoomDetailRow[]>>(new Map());
    const [petCareServiceDetailsMap, setPetCareServiceDetailsMap] = useState<Map<number, RoomDetailRow[]>>(new Map());
    
    // Store sub_room_details data from API for modal population
    const [subRoomDetailsData, setSubRoomDetailsData] = useState<{
        room_services?: Array<{ room_type: string; sub_rooms?: Array<{ code: string; name: string; open_time: string; close_time: string; price: number; images: string[] }> }>;
        special_services?: Array<{ service_type: string; sub_services?: Array<{ code: string; name: string; open_time: string; close_time: string; price: number; images: string[] }> }>;
        pet_care_services?: Array<{ service_type: string; sub_services?: Array<{ code: string; name: string; open_time: string; close_time: string; price: number; images: string[] }> }>;
    } | null>(null);

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

                // Check for authentication error
                if (checkAuthError(response, data)) {
                    return;
                }

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

                    // Store sub_room_details data for later use in modal
                    if (data.data.sub_room_details) {
                        setSubRoomDetailsData(data.data.sub_room_details);
                    } else {
                        setSubRoomDetailsData(null);
                    }
                    
                    // Populate room services from data.data.room_services (not from sub_room_details)
                    if (data.data.room_services && data.data.room_services.length > 0) {
                        setRoomServiceData(data.data.room_services.map((service: ApiRoomService, index: number) => ({
                            id: index + 1,
                            backendId: service.id,
                            roomType: service.room_type || '',
                            quantity: service.quantity?.toString() || '',
                            openTime: service.open_time || '',
                            closeTime: service.close_time || '',
                            price: service.price?.toString() || ''
                        })));
                    } else {
                        // If no room_services data, keep empty
                        setRoomServiceData([]);
                    }

                    // Populate special services
                    if (data.data.special_services && data.data.special_services.length > 0) {
                        setSpecialServicesData(data.data.special_services.map((service: ApiSpecialService, index: number) => ({
                            id: index + 1, // Local ID for React keys
                            backendId: service.id, // Backend UUID for DELETE operations
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
                            id: index + 1, // Local ID for React keys
                            backendId: service.id, // Backend UUID for DELETE operations
                            roomType: service.service_type || '',
                            quantity: service.quantity || '',
                            openTime: service.open_time || '',
                            closeTime: service.close_time || '',
                            price: service.price?.toString() || ''
                        })));
                    }

                    // Populate accommodation photos (Step 3)
                    if (data.data.accommodation_photos) {
                        const photos = data.data.accommodation_photos;
                        const newPhotos: { [key: number]: UploadFile } = {};

                        // Helper function to get full image URL
                        const getFullImageUrl = (path: string) => {
                            if (!path) return '';
                            if (path.startsWith('http://') || path.startsWith('https://')) {
                                return path;
                            }
                            return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
                        };

                        // Cover image (index 0)
                        if (photos.cover_image_url) {
                            newPhotos[0] = {
                                uid: '0',
                                name: 'cover_image',
                                status: 'done',
                                url: getFullImageUrl(photos.cover_image_url)
                            };
                        }

                        // Room images (indices 1-6)
                        if (photos.room_image_urls && Array.isArray(photos.room_image_urls)) {
                            photos.room_image_urls.forEach((url: string, index: number) => {
                                if (url) {
                                    newPhotos[index + 1] = {
                                        uid: `${index + 1}`,
                                        name: `room_image_${index + 1}`,
                                        status: 'done',
                                        url: getFullImageUrl(url)
                                    };
                                }
                            });
                        }

                        setUploadedPhotos(newPhotos);

                        // Set accommodation description
                        if (photos.description) {
                            setAccommodationDescription(photos.description);
                        }
                    }

                    // console.log("data.data.sub_room_details", data.data.sub_room_details);
                    // Populate Room Details (from sub_room_details)
                    // IMPORTANT: Use data directly from API response, not from state variables
                    // because state updates are asynchronous
                    if (data.data.sub_room_details) {
                        const subRoomDetails = data.data.sub_room_details;
                        
                        // Handle room_services - generate from sub_room_details.room_services
                        if (subRoomDetails.room_services && subRoomDetails.room_services.length > 0) {
                            const newRoomDetailsMap = new Map<number, RoomDetailRow[]>();
                            
                            // Helper function to ensure image URLs are properly formatted
                            const formatImageUrl = (url: string) => {
                                if (!url) return '';
                                // If already a full URL, return as is
                                if (url.startsWith('http://') || url.startsWith('https://')) {
                                    return url;
                                }
                                // If relative path, ensure it starts with /
                                return url.startsWith('/') ? url : `/${url}`;
                            };
                            
                            // Generate room details from sub_room_details.room_services
                            subRoomDetails.room_services.forEach((roomService: { room_type: string; sub_rooms?: Array<{ code: string; name: string; open_time: string; close_time: string; price: number; images: string[] }> }, index: number) => {
                                const localServiceId = index + 1; // Match the ID assigned in setRoomServiceData
                                
                                if (roomService.sub_rooms && roomService.sub_rooms.length > 0) {
                                    const roomDetails: RoomDetailRow[] = roomService.sub_rooms.map((subRoom: { code: string; name: string; open_time: string; close_time: string; price: number; images: string[] }, i: number) => ({
                                        id: i + 1,
                                        code: subRoom.code || '',
                                        name: subRoom.name || roomService.room_type,
                                        openTime: formatTimeForInput(subRoom.open_time) || '00:00',
                                        closeTime: formatTimeForInput(subRoom.close_time) || '00:00',
                                        price: subRoom.price?.toString() || '0',
                                        // Format image URLs properly - ensure they're arrays and URLs are formatted
                                        images: Array.isArray(subRoom.images) 
                                            ? subRoom.images.map((img: string) => formatImageUrl(img)).filter((img: string) => img !== '')
                                            : []
                                    }));
                                    newRoomDetailsMap.set(localServiceId, roomDetails);
                                } else {
                                    // If sub_rooms exists but is empty, set empty array to indicate API data exists but is empty
                                    newRoomDetailsMap.set(localServiceId, []);
                                }
                            });
                            setRoomDetailsMap(newRoomDetailsMap);
                        } else {
                            // If no sub_room_details.room_services, clear the room details map
                            setRoomDetailsMap(new Map());
                        }
                        
                        // Handle special_services - use data.data.special_services directly
                        if (subRoomDetails.special_services && subRoomDetails.special_services.length > 0 &&
                            data.data.special_services && data.data.special_services.length > 0) {
                            const newSpecialServiceDetailsMap = new Map<number, RoomDetailRow[]>();
                            
                            // Use API data directly instead of state
                            data.data.special_services.forEach((apiService: ApiSpecialService, index: number) => {
                                const localServiceId = index + 1; // Match the ID assigned in setSpecialServicesData
                                const matchingSpecialService = subRoomDetails.special_services.find((ss: { service_type: string; sub_services?: Array<{ code: string; name: string; open_time: string; close_time: string; price: number; images: string[] }> }) => 
                                    ss.service_type === apiService.service_type
                                );
                                
                                if (matchingSpecialService && matchingSpecialService.sub_services && matchingSpecialService.sub_services.length > 0) {
                                    const serviceDetails: RoomDetailRow[] = matchingSpecialService.sub_services.map((subService: { code: string; name: string; open_time: string; close_time: string; price: number; images: string[] }, i: number) => ({
                                        id: i + 1,
                                        code: subService.code || '',
                                        name: subService.name || apiService.service_type,
                                        openTime: formatTimeForInput(subService.open_time) || '00:00',
                                        closeTime: formatTimeForInput(subService.close_time) || '00:00',
                                        price: subService.price?.toString() || '0',
                                        images: subService.images || []
                                    }));
                                    newSpecialServiceDetailsMap.set(localServiceId, serviceDetails);
                                }
                            });
                            setSpecialServiceDetailsMap(newSpecialServiceDetailsMap);
                        }
                        
                        // Handle pet_care_services - use data.data.pet_care_services directly
                        if (subRoomDetails.pet_care_services && subRoomDetails.pet_care_services.length > 0 &&
                            data.data.pet_care_services && data.data.pet_care_services.length > 0) {
                            const newPetCareServiceDetailsMap = new Map<number, RoomDetailRow[]>();
                            
                            // Use API data directly instead of state
                            data.data.pet_care_services.forEach((apiService: ApiPetCareService, index: number) => {
                                const localServiceId = index + 1; // Match the ID assigned in setPetCareServicesData
                                const matchingPetCareService = subRoomDetails.pet_care_services.find((pcs: { service_type: string; sub_services?: Array<{ code: string; name: string; open_time: string; close_time: string; price: number; images: string[] }> }) => 
                                    pcs.service_type === apiService.service_type
                                );
                                
                                if (matchingPetCareService && matchingPetCareService.sub_services && matchingPetCareService.sub_services.length > 0) {
                                    const serviceDetails: RoomDetailRow[] = matchingPetCareService.sub_services.map((subService: { code: string; name: string; open_time: string; close_time: string; price: number; images: string[] }, i: number) => ({
                                        id: i + 1,
                                        code: subService.code || '',
                                        name: subService.name || apiService.service_type,
                                        openTime: formatTimeForInput(subService.open_time) || '00:00',
                                        closeTime: formatTimeForInput(subService.close_time) || '00:00',
                                        price: subService.price?.toString() || '0',
                                        images: subService.images || []
                                    }));
                                    newPetCareServiceDetailsMap.set(localServiceId, serviceDetails);
                                }
                            });
                            setPetCareServiceDetailsMap(newPetCareServiceDetailsMap);
                        }
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

    // Save Step 3 images when clicking "บันทึก" button
    const handleStep3Save = async () => {
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
                return;
            }

            if (!USE_API_MODE) {
                await Swal.fire({
                    icon: 'success',
                    title: 'บันทึกข้อมูลสำเร็จ (Preview Mode)',
                    text: 'ข้อมูลรูปภาพถูกบันทึกเรียบร้อยแล้ว',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true
                });
                return;
            }

            let hasNewImages = false;
            let savedCount = 0;
            let coverImageUrl = '';
            const roomImageUrls: string[] = [];

            // Upload cover image if it's a new file
            if (uploadedPhotos[0]?.originFileObj) {
                hasNewImages = true;
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
                    savedCount++;
                    coverImageUrl = coverResult.data.cover_url;
                    
                    // Update the uploadedPhotos state with the new URL
                    const getFullImageUrl = (path: string) => {
                        if (!path) return '';
                        if (path.startsWith('http://') || path.startsWith('https://')) {
                            return path;
                        }
                        return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
                    };

                    setUploadedPhotos(prev => ({
                        ...prev,
                        0: {
                            ...prev[0],
                            url: getFullImageUrl(coverResult.data.cover_url),
                            status: 'done',
                            originFileObj: undefined // Clear the file object since it's now saved
                        }
                    }));
                }
            } else if (uploadedPhotos[0]?.url) {
                // Use existing cover image URL
                const getRelativePath = (url: string) => {
                    if (!url) return '';
                    if (url.startsWith('/uploads/')) return url;
                    if (url.includes('/uploads/')) {
                        return url.substring(url.indexOf('/uploads/'));
                    }
                    return url;
                };
                coverImageUrl = getRelativePath(uploadedPhotos[0].url);
            }

            // Upload room images if they're new files
            for (let i = 1; i <= 6; i++) {
                const image = uploadedPhotos[i];
                if (image?.originFileObj) {
                    hasNewImages = true;
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
                        savedCount++;
                        const getRelativePath = (url: string) => {
                            if (!url) return '';
                            if (url.startsWith('/uploads/')) return url;
                            if (url.includes('/uploads/')) {
                                return url.substring(url.indexOf('/uploads/'));
                            }
                            return url;
                        };
                        roomImageUrls.push(getRelativePath(roomResult.data.room_image_url));
                        
                        // Update the uploadedPhotos state with the new URL
                        const getFullImageUrl = (path: string) => {
                            if (!path) return '';
                            if (path.startsWith('http://') || path.startsWith('https://')) {
                                return path;
                            }
                            return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
                        };

                        setUploadedPhotos(prev => ({
                            ...prev,
                            [i]: {
                                ...prev[i],
                                url: getFullImageUrl(roomResult.data.room_image_url),
                                status: 'done',
                                originFileObj: undefined // Clear the file object since it's now saved
                            }
                        }));
                    }
                } else if (image?.url) {
                    // Use existing room image URL
                    const getRelativePath = (url: string) => {
                        if (!url) return '';
                        if (url.startsWith('/uploads/')) return url;
                        if (url.includes('/uploads/')) {
                            return url.substring(url.indexOf('/uploads/'));
                        }
                        return url;
                    };
                    roomImageUrls.push(getRelativePath(image.url));
                }
            }

            // Save accommodation photos data to backend
            // Check if we have existing user/hotel data to create a valid payload
            const hasExistingData = personalInfo.firstName && personalInfo.email && hotelLocation.accommodationName && hotelLocation.address;
            
            if (hasExistingData) {
                // Use existing data to create a valid payload
                const savePayload = {
                    personal_info: {
                        first_name: personalInfo.firstName,
                        last_name: personalInfo.lastName,
                        first_name_eng: personalInfo.firstNameEng || '',
                        last_name_eng: personalInfo.lastNameEng || '',
                        national_id_number: personalInfo.nationalIdNumber || '',
                        corporate_tax_id: personalInfo.corporateTaxId || '',
                        email: personalInfo.email,
                        phone_number: personalInfo.phoneNumber,
                        backup_phone: personalInfo.backupPhone || '',
                        additional_details: personalInfo.additionalDetails || ''
                    },
                    hotel_location: {
                        accommodation_name: hotelLocation.accommodationName,
                        accommodation_name_en: hotelLocation.accommodationNameEn,
                        trade_registration_number: hotelLocation.tradeRegistrationNumber || '',
                        address: hotelLocation.address,
                        business_email: hotelLocation.businessEmail || '',
                        office_phone: hotelLocation.officePhone || '',
                        google_maps_link: hotelLocation.googleMapsLink || '',
                        mobile_phone: hotelLocation.mobilePhone || '',
                        business_additional_details: businessDetails || ''
                    },
                    accommodation_photos: {
                        cover_image_url: coverImageUrl,
                        room_image_urls: roomImageUrls,
                        description: accommodationDescription
                    }
                };

                const saveResponse = await fetch(`${API_BASE_URL}/api/partner/create-service`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(savePayload)
                });

                const saveResult = await saveResponse.json();
                
                if (checkAuthError(saveResponse, saveResult)) {
                    return;
                }
                
                if (saveResult.success) {
                    await Swal.fire({
                        icon: 'success',
                        title: 'บันทึกข้อมูลสำเร็จ',
                        text: hasNewImages 
                            ? `บันทึกรูปภาพ ${savedCount} รูปเรียบร้อยแล้ว` 
                            : 'บันทึกข้อมูลเรียบร้อยแล้ว',
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true
                    });
                } else {
                    // Display error messages from API
                    let errorMessage = '';
                    if (Array.isArray(saveResult.message)) {
                        errorMessage = saveResult.message.map((msg: string, idx: number) => `${idx + 1}. ${msg}`).join('\n');
                    } else {
                        errorMessage = saveResult.message || saveResult.error || 'Failed to save images';
                    }
                    
                    await Swal.fire({
                        icon: 'error',
                        title: 'เกิดข้อผิดพลาด',
                        html: `<pre style="text-align: left; white-space: pre-wrap; word-wrap: break-word;">${errorMessage}</pre>`,
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#DC2626'
                    });
                    return; // Don't throw, just return
                }
            } else {
                // If no existing data, just show success message
                // Images are uploaded but will be saved when the full form is submitted
                await Swal.fire({
                    icon: 'success',
                    title: 'อัพโหลดรูปภาพสำเร็จ',
                    text: hasNewImages 
                        ? `อัพโหลดรูปภาพ ${savedCount} รูปเรียบร้อยแล้ว\nรูปภาพจะถูกบันทึกเมื่อคุณบันทึกข้อมูลทั้งหมด` 
                        : 'ไม่มีรูปภาพใหม่ที่ต้องบันทึก',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true
                });
            }
        } catch (error) {
            console.error('Error saving Step 3 images:', error);
            await Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: error instanceof Error ? error.message : 'ไม่สามารถบันทึกรูปภาพได้',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#DC2626'
            });
        }
    };


    // Delete handlers for backend services
    const handleDeleteRoomService = async (backendId: string | undefined): Promise<boolean> => {
        // If no backendId, it's a new service not yet saved - just return true to allow local deletion
        if (!backendId) {
            return true;
        }

        const token = localStorage.getItem('accessToken');
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/partner/room-services/${backendId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            // Check for authentication error
            if (checkAuthError(response, result)) {
                return false;
            }

            if (result.success) {
                await Swal.fire({
                    icon: 'success',
                    title: 'ลบบริการสำเร็จ',
                    text: 'บริการห้องพักถูกลบออกจากระบบแล้ว',
                    showConfirmButton: false,
                    timer: 1500
                });
                return true;
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'ไม่สามารถลบบริการได้',
                    text: result.message || 'เกิดข้อผิดพลาด',
                    confirmButtonColor: '#d33'
                });
                return false;
            }
        } catch (error) {
            console.error('Error deleting room service:', error);
            await Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
                confirmButtonColor: '#d33'
            });
            return false;
        }
    };

    const handleDeleteSpecialService = async (backendId: string | undefined): Promise<boolean> => {
        // If no backendId, it's a new service not yet saved - just return true to allow local deletion
        if (!backendId) {
            return true;
        }

        const token = localStorage.getItem('accessToken');
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/partner/special-services/${backendId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            // Check for authentication error
            if (checkAuthError(response, result)) {
                return false;
            }

            if (result.success) {
                await Swal.fire({
                    icon: 'success',
                    title: 'ลบบริการสำเร็จ',
                    text: 'บริการพิเศษถูกลบออกจากระบบแล้ว',
                    showConfirmButton: false,
                    timer: 1500
                });
                return true;
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'ไม่สามารถลบบริการได้',
                    text: result.message || 'เกิดข้อผิดพลาด',
                    confirmButtonColor: '#d33'
                });
                return false;
            }
        } catch (error) {
            console.error('Error deleting special service:', error);
            await Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
                confirmButtonColor: '#d33'
            });
            return false;
        }
    };

    const handleDeletePetCareService = async (backendId: string | undefined): Promise<boolean> => {
        // If no backendId, it's a new service not yet saved - just return true to allow local deletion
        if (!backendId) {
            return true;
        }

        const token = localStorage.getItem('accessToken');
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/partner/pet-care-services/${backendId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            // Check for authentication error
            if (checkAuthError(response, result)) {
                return false;
            }

            if (result.success) {
                await Swal.fire({
                    icon: 'success',
                    title: 'ลบบริการสำเร็จ',
                    text: 'บริการรับฝากสัตว์เลี้ยงถูกลบออกจากระบบแล้ว',
                    showConfirmButton: false,
                    timer: 1500
                });
                return true;
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'ไม่สามารถลบบริการได้',
                    text: result.message || 'เกิดข้อผิดพลาด',
                    confirmButtonColor: '#d33'
                });
                return false;
            }
        } catch (error) {
            console.error('Error deleting pet care service:', error);
            await Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
                confirmButtonColor: '#d33'
            });
            return false;
        }
    };

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

            // Helper function to get relative path from URL
            const getRelativePath = (url: string) => {
                if (!url) return '';
                if (url.startsWith('/uploads/')) return url;
                if (url.includes('/uploads/')) {
                    return url.substring(url.indexOf('/uploads/'));
                }
                return url;
            };

            if (USE_API_MODE) {
                // Upload cover image if it's a new file
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
                } else if (uploadedPhotos[0]?.url) {
                    // Use existing cover image URL if no new file was uploaded
                    coverImageUrl = getRelativePath(uploadedPhotos[0].url);
                }

                // Upload room images if they're new files, otherwise use existing URLs
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
                    } else if (image?.url) {
                        // Use existing room image URL if no new file was uploaded
                        roomImageUrls.push(getRelativePath(image.url));
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
                    room_image_urls: roomImageUrls,
                    description: accommodationDescription
                },

                // Step 3: Room Services (only include if enabled in Step 2)
                // Calculate quantity, open_time, close_time from sub_room_details
                ...(hotelServiceConfig.roomService ? {
                    room_services: roomServiceData
                        .filter(service => {
                            // Include service if it has roomType AND price, OR if it has configured sub-rooms
                            const hasBasicData = service.roomType && service.price;
                            const hasRoomDetails = roomDetailsMap.has(service.id) && (roomDetailsMap.get(service.id) || []).length > 0;
                            return hasBasicData || hasRoomDetails;
                        })
                        .map(service => {
                            const roomDetails = roomDetailsMap.get(service.id) || [];
                            // Calculate quantity from sub_rooms count
                            const quantity = roomDetails.length;
                            // Use first room's data as defaults
                            const firstRoom = roomDetails[0];
                            return {
                                room_type: service.roomType || firstRoom?.name || 'Room',
                                quantity: quantity,
                                open_time: firstRoom?.openTime || service.openTime || '00:00',
                                close_time: firstRoom?.closeTime || service.closeTime || '00:00',
                                price: parseFloat(service.price) || (firstRoom ? parseFloat(firstRoom.price) : 0)
                            };
                        })
                } : {}),

                // Step 3: Special Services (only include if enabled in Step 2)
                ...(hotelServiceConfig.specialService ? {
                    special_services: specialServicesData
                        .filter(service => {
                            // Include service if it has roomType AND price, OR if it has configured sub-services
                            const hasBasicData = service.roomType && service.price;
                            const hasServiceDetails = specialServiceDetailsMap.has(service.id) && (specialServiceDetailsMap.get(service.id) || []).length > 0;
                            return hasBasicData || hasServiceDetails;
                        })
                        .map(service => {
                            const serviceDetails = specialServiceDetailsMap.get(service.id) || [];
                            // Calculate quantity from sub_services count
                            const quantity = serviceDetails.length;
                            // Use first service's data as defaults
                            const firstService = serviceDetails[0];
                            return {
                                service_type: service.roomType || firstService?.name || 'Service',
                                quantity: quantity.toString(),
                                open_time: firstService?.openTime || service.openTime || '00:00',
                                close_time: firstService?.closeTime || service.closeTime || '00:00',
                                price: parseFloat(service.price) || (firstService ? parseFloat(firstService.price) : 0)
                            };
                        })
                } : {}),

                // Step 3: Pet Care Services (only include if enabled in Step 2)
                ...(hotelServiceConfig.petCareService ? {
                    pet_care_services: petCareServicesData
                        .filter(service => {
                            // Include service if it has roomType AND price, OR if it has configured sub-services
                            const hasBasicData = service.roomType && service.price;
                            const hasServiceDetails = petCareServiceDetailsMap.has(service.id) && (petCareServiceDetailsMap.get(service.id) || []).length > 0;
                            return hasBasicData || hasServiceDetails;
                        })
                        .map(service => {
                            const serviceDetails = petCareServiceDetailsMap.get(service.id) || [];
                            // Calculate quantity from sub_services count
                            const quantity = serviceDetails.length;
                            // Use first service's data as defaults
                            const firstService = serviceDetails[0];
                            return {
                                service_type: service.roomType || firstService?.name || 'Service',
                                quantity: quantity.toString(),
                                open_time: firstService?.openTime || service.openTime || '00:00',
                                close_time: firstService?.closeTime || service.closeTime || '00:00',
                                price: parseFloat(service.price) || (firstService ? parseFloat(firstService.price) : 0)
                            };
                        })
                } : {}),
                // Sub-Room Details (individual room configurations from modal) - only include enabled services
                sub_room_details: {
                    ...(hotelServiceConfig.roomService ? {
                        room_services: roomServiceData
                            .filter(service => {
                                // Include if has basic data OR has room details configured
                                const hasBasicData = service.roomType && service.price;
                                const hasRoomDetails = roomDetailsMap.has(service.id) && (roomDetailsMap.get(service.id) || []).length > 0;
                                return hasBasicData || hasRoomDetails;
                            })
                            .map((service) => {
                                const roomDetails = roomDetailsMap.get(service.id) || [];
                                const firstRoom = roomDetails[0];
                                return {
                                    room_type: service.roomType || firstRoom?.name || 'Room',
                                    sub_rooms: roomDetails.map(room => ({
                                        code: room.code,
                                        name: room.name,
                                        open_time: room.openTime,
                                        close_time: room.closeTime,
                                        price: parseFloat(room.price) || 0,
                                        images: room.images || []
                                    }))
                                };
                            }).filter(service => service.sub_rooms.length > 0)
                    } : { room_services: [] }),
                    
                    ...(hotelServiceConfig.specialService ? {
                        special_services: specialServicesData
                            .filter(service => {
                                // Include if has basic data OR has service details configured
                                const hasBasicData = service.roomType && service.price;
                                const hasServiceDetails = specialServiceDetailsMap.has(service.id) && (specialServiceDetailsMap.get(service.id) || []).length > 0;
                                return hasBasicData || hasServiceDetails;
                            })
                            .map((service) => {
                                const serviceDetails = specialServiceDetailsMap.get(service.id) || [];
                                const firstService = serviceDetails[0];
                                return {
                                    service_type: service.roomType || firstService?.name || 'Service',
                                    sub_services: serviceDetails.map(detail => ({
                                        code: detail.code,
                                        name: detail.name,
                                        open_time: detail.openTime,
                                        close_time: detail.closeTime,
                                        price: parseFloat(detail.price) || 0,
                                        images: detail.images || []
                                    }))
                                };
                            }).filter(service => service.sub_services.length > 0)
                    } : { special_services: [] }),
                    
                    ...(hotelServiceConfig.petCareService ? {
                        pet_care_services: petCareServicesData
                            .filter(service => {
                                // Include if has basic data OR has service details configured
                                const hasBasicData = service.roomType && service.price;
                                const hasServiceDetails = petCareServiceDetailsMap.has(service.id) && (petCareServiceDetailsMap.get(service.id) || []).length > 0;
                                return hasBasicData || hasServiceDetails;
                            })
                            .map((service) => {
                                const serviceDetails = petCareServiceDetailsMap.get(service.id) || [];
                                const firstService = serviceDetails[0];
                                return {
                                    service_type: service.roomType || firstService?.name || 'Service',
                                    sub_services: serviceDetails.map(detail => ({
                                        code: detail.code,
                                        name: detail.name,
                                        open_time: detail.openTime,
                                        close_time: detail.closeTime,
                                        price: parseFloat(detail.price) || 0,
                                        images: detail.images || []
                                    }))
                                };
                            }).filter(service => service.sub_services.length > 0)
                    } : { pet_care_services: [] })
                }
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

                // Check for authentication error
                if (checkAuthError(response, result)) {
                    return;
                }

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
                    // Display error messages from API
                    let errorMessage = '';
                    if (Array.isArray(result.message)) {
                        // If message is an array, format each message on a new line
                        errorMessage = result.message.map((msg: string, idx: number) => `${idx + 1}. ${msg}`).join('\n');
                    } else {
                        errorMessage = result.message || 'Failed to create service';
                    }
                    
                    await Swal.fire({
                        icon: 'error',
                        title: 'เกิดข้อผิดพลาด',
                        html: `<pre style="text-align: left; white-space: pre-wrap; word-wrap: break-word;">${errorMessage}</pre>`,
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#DC2626'
                    });
                    return; // Don't throw, just return to stay on the page
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

    // Accommodation Photos Handlers
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
                            showConfirmationFields={true}
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
                    <>
                        <AccommodationPhotosSection
                            uploadedImages={uploadedPhotos}
                            description={accommodationDescription}
                            onImageUpload={handlePhotoUpload}
                            onImageRemove={handlePhotoRemove}
                            onDescriptionChange={setAccommodationDescription}
                        />

                        <div className="mt-8">
                            <RoomServiceManagementSection
                                defaultRoomServiceData={roomServiceData}
                                defaultSpecialServicesData={specialServicesData}
                                defaultPetCareServicesData={petCareServicesData}
                                roomServiceHeaders={{
                            roomType: "รูปแบบห้องพักที่คุณเลือก",
                            quantity: "ตั้งค่าห้องพัก"
                        }}
                        subRoomDetailsData={subRoomDetailsData}
                        onRoomDetailsChange={(rowId, rooms) => {
                            setRoomDetailsMap(prev => {
                                const newMap = new Map(prev);
                                newMap.set(rowId, rooms);
                                return newMap;
                            });
                        }}
                        onSpecialServiceDetailsChange={(rowId, rooms) => {
                            setSpecialServiceDetailsMap(prev => {
                                const newMap = new Map(prev);
                                newMap.set(rowId, rooms);
                                return newMap;
                            });
                        }}
                        onPetCareServiceDetailsChange={(rowId, rooms) => {
                            setPetCareServiceDetailsMap(prev => {
                                const newMap = new Map(prev);
                                newMap.set(rowId, rooms);
                                return newMap;
                            });
                        }}
                        specialServiceHeaders={{
                            roomType: "รูปแบบบริการ",
                            quantity: "ประเภทบริการ"
                        }}
                        petCareServiceHeaders={{
                            roomType: "รูปแบบบริการ",
                            quantity: "ประเภทบริการ"
                        }}
                        onRoomServiceChange={setRoomServiceData}
                        onSpecialServiceChange={setSpecialServicesData}
                        onPetCareServiceChange={setPetCareServicesData}
                        onDeleteRoomService={handleDeleteRoomService}
                        onDeleteSpecialService={handleDeleteSpecialService}
                        onDeletePetCareService={handleDeletePetCareService}
                        onSubmit={handleStep3Save}
                        showRoomService={hotelServiceConfig.roomService}
                        showSpecialService={hotelServiceConfig.specialService}
                        showPetCareService={hotelServiceConfig.petCareService}
                    />
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    const stepTitles = [
        'ข้อมูลส่วนตัวและธุรกิจ',
        'การกำหนดค่าบริการโรงแรม',
        'รูปภาพที่พักและรายละเอียดบริการ'
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
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
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

