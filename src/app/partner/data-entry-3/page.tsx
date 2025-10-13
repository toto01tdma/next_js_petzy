'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import LogoFirstPage from "@/components/first_page/logo";
import { Button, Input } from 'antd';
import Swal from 'sweetalert2';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { API_BASE_URL, USE_API_MODE } from '@/config/api';
import { checkAuthError } from '@/utils/api';

const { TextArea } = Input;
import type { UploadFile } from 'antd/es/upload/interface';
import SingleFileAttachment from '@/components/partner/shared/SingleFileAttachment';
import RoomServiceManagementSection from '@/components/partner/dataEntry/RoomServiceManagementSection';

// Interface for room service row data
interface RoomServiceRow {
    id: number;
    roomType: string;
    quantity: string;
    openTime: string;
    closeTime: string;
    price: string;
}

// Interface for RoomServiceForm props
interface RoomServiceFormProps {
    data?: RoomServiceRow[];
    showDefaultData?: boolean;
    title?: string;
    description?: string;
    headers: {
        [key: string]: string;
    };
    onDataChange?: (data: RoomServiceRow[]) => void;
}


export default function DataEntry3() {
    const router = useRouter();

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

    const [uploadedImages, setUploadedImages] = useState<{ [key: number]: UploadFile }>({});
    const [description, setDescription] = useState('');

    // Default room service data
    const defaultRoomServiceData: RoomServiceRow[] = [
        { id: 1, roomType: 'ห้องเดี่ยว (Single Room)', quantity: '10', openTime: '00:00', closeTime: '00:00', price: '900' },
        { id: 2, roomType: 'ห้องเตียงคู่ (Twin Room)', quantity: '5', openTime: '00:00', closeTime: '00:00', price: '900' }
    ];

    // Default special services data
    const defaultSpecialServicesData: RoomServiceRow[] = [
        { id: 1, roomType: 'รับฝากสัตว์เลี้ยงขนาดเล็ก', quantity: '24 ชม.', openTime: '00:00', closeTime: '00:00', price: '900' },
        { id: 2, roomType: 'รับฝากสัตว์เลี้ยงขนาดใหญ่', quantity: '24 ชม.', openTime: '00:00', closeTime: '00:00', price: '900' },
        { id: 3, roomType: 'รับฝากสัตว์เลี้ยงขนาดกลาง', quantity: '24 ชม.', openTime: '00:00', closeTime: '00:00', price: '900' }
    ];

    // Room service form state (for validation and data collection)
    const [roomServiceRows, setRoomServiceRows] = useState<RoomServiceRow[]>(defaultRoomServiceData);
    
    // Refs to store the current data from each form
    const roomServiceRef = useRef<RoomServiceRow[]>(defaultRoomServiceData);
    const specialServiceRef = useRef<RoomServiceRow[]>([]);
    const petCareServiceRef = useRef<RoomServiceRow[]>([]);

    // Memoized callback functions to prevent unnecessary re-renders of RoomServiceForm
    const handleRoomServiceChange = useCallback((data: RoomServiceRow[]) => {
        roomServiceRef.current = data;
    }, []);

    const handleSpecialServiceChange = useCallback((data: RoomServiceRow[]) => {
        specialServiceRef.current = data;
    }, []);

    const handlePetCareServiceChange = useCallback((data: RoomServiceRow[]) => {
        petCareServiceRef.current = data;
    }, []);

    // Memoized headers objects to prevent unnecessary re-renders of RoomServiceForm
    const roomServiceHeaders = useMemo(() => ({
        roomType: "รูปแบบห้องพักที่คุณเลือก",
        quantity: "จำนวนห้องพัก",
        openTime: "เวลาเปิด",
        closeTime: "เวลาปิด",
        price: "ราคาที่กำหนด"
    }), []);

    const specialServiceHeaders = useMemo(() => ({
        roomType: "รูปแบบบริการ",
        quantity: "ประเภทบริการ",
        openTime: "เวลาเปิด",
        closeTime: "เวลาปิด",
        price: "ราคาที่กำหนด"
    }), []);

    const petCareServiceHeaders = useMemo(() => ({
        roomType: "รูปแบบบริการ",
        quantity: "ประเภทบริการ",
        price: "ราคาที่กำหนด"
    }), []);


    // Validation function
    const validateForm = async () => {
        // Check if main image is uploaded
        if (!uploadedImages[0]) {
            await Swal.fire({
                icon: 'error',
                title: 'ข้อมูลไม่ครบถ้วน',
                text: 'กรุณาอัพโหลดรูปหน้าปกหลัก',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#0D263B'
            });
            return false;
        }

        // Check if description is filled
        if (!description.trim()) {
            await Swal.fire({
                icon: 'error',
                title: 'ข้อมูลไม่ครบถ้วน',
                text: 'กรุณากรอกรายละเอียดข้อมูลที่พัก',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#0D263B'
            });
            return false;
        }

        // Check if room service rows are properly filled
        for (const row of roomServiceRows) {
            if (!row.roomType || !row.quantity || !row.price) {
                await Swal.fire({
                    icon: 'error',
                    title: 'ข้อมูลไม่ครบถ้วน',
                    text: 'กรุณากรอกข้อมูลห้องพักและบริการให้ครบถ้วน',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#0D263B'
                });
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async () => {
        const isValid = await validateForm();
        if (!isValid) {
            return;
        }

        try {
            // Preview mode check
            if (!USE_API_MODE) {
                // Store data in sessionStorage for data-entry-4 (preview mode)
            const dataToPass = {
                roomServices: roomServiceRef.current,
                specialServices: specialServiceRef.current,
                petCareServices: petCareServiceRef.current,
                description: description,
                uploadedImages: uploadedImages
            };
            sessionStorage.setItem('dataEntry3Data', JSON.stringify(dataToPass));

            await Swal.fire({
                icon: 'success',
                title: 'ยืนยันข้อมูลสำเร็จ',
                text: '',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                background: '#fff',
                customClass: {
                    popup: 'rounded-lg'
                }
            });
            
            router.push('/partner/data-entry-4');
                return;
            }

            // Step 1: Upload accommodation photos if they exist
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

            let coverImageUrl = '';
            const roomImageUrls: string[] = [];

            // Upload cover image (main image at index 0)
            if (uploadedImages[0]?.originFileObj) {
                const formData = new FormData();
                formData.append('cover', uploadedImages[0].originFileObj);

                const coverResponse = await fetch(`${API_BASE_URL}/api/upload/accommodation-photos`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                const coverResult = await coverResponse.json();
                if (coverResult.success && coverResult.data?.cover_url) {
                    coverImageUrl = coverResult.data.cover_url;
                }
            }

            // Upload room images (indexes 1-6)
            for (let i = 1; i <= 6; i++) {
                const image = uploadedImages[i];
                if (image?.originFileObj) {
                    const formData = new FormData();
                    formData.append('room_image', image.originFileObj as Blob);

                    const roomResponse = await fetch(`${API_BASE_URL}/api/upload/accommodation-photos`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        body: formData
                    });

                    const roomResult = await roomResponse.json();
                    if (roomResult.success && roomResult.data?.room_image_url) {
                        roomImageUrls.push(roomResult.data.room_image_url);
                    }
                }
            }

            // Step 2: Prepare the main payload
            const payload = {
                description: description,
                cover_image_url: coverImageUrl,
                room_image_urls: roomImageUrls,
                room_services: roomServiceRef.current.map(service => ({
                    room_type: service.roomType,
                    quantity: parseInt(service.quantity) || 0,
                    open_time: service.openTime,
                    close_time: service.closeTime,
                    price: parseFloat(service.price) || 0
                })),
                special_services: specialServiceRef.current.map(service => ({
                    service_type: service.roomType,
                    quantity: service.quantity,
                    open_time: service.openTime,
                    close_time: service.closeTime,
                    price: parseFloat(service.price) || 0
                })),
                pet_care_services: petCareServiceRef.current.map(service => ({
                    service_type: service.roomType,
                    quantity: service.quantity,
                    price: parseFloat(service.price) || 0
                }))
            };

            // Step 3: Submit to API
            const response = await fetch(`${API_BASE_URL}/api/partner/data-entry-3`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            // Check for authentication error
            if (checkAuthError(response, result)) {
                return;
            }

            if (result.success) {
                await Swal.fire({
                    icon: 'success',
                    title: 'ยืนยันข้อมูลสำเร็จ',
                    text: 'ข้อมูลที่พักของคุณถูกบันทึกเรียบร้อยแล้ว',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    background: '#fff',
                    customClass: {
                        popup: 'rounded-lg'
                    }
                });
                
                router.push('/partner/dashboard');
            } else {
                throw new Error(result.message || 'Failed to submit data');
            }
        } catch (error) {
            console.error('Error submitting data-entry-3:', error);
            await Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: error instanceof Error ? error.message : 'ไม่สามารถบันทึกข้อมูลได้',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#DC2626'
            });
        }
    };

    // Room Service Component (legacy - replaced by RoomServiceManagementSection)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const RoomServiceForm = ({
        data = defaultRoomServiceData,
        showDefaultData = true,
        title = "เลือกรูปแบบบริการห้องพัก",
        description = "รหัสห้องพักจะรันตามจำนวนห้องที่มี",
        headers,
        onDataChange
    }: RoomServiceFormProps) => {
        const [localRoomServiceRows, setLocalRoomServiceRows] = useState<RoomServiceRow[]>(
            showDefaultData ? data : []
        );
        const [isLocalExpanded, setIsLocalExpanded] = useState(showDefaultData);

        // Initialize the parent ref with default data
        useEffect(() => {
            if (onDataChange && showDefaultData && data && data.length > 0) {
                onDataChange(data);
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []); // Empty dependency array - only run once on mount

        // Local functions for the component
        const addLocalRoomServiceRow = () => {
            const newId = localRoomServiceRows.length > 0
                ? Math.max(...localRoomServiceRows.map(row => row.id)) + 1
                : 1;
            const newRows = [...localRoomServiceRows, {
                id: newId,
                roomType: '',
                quantity: '',
                openTime: '00:00',
                closeTime: '00:00',
                price: ''
            }];
            setLocalRoomServiceRows(newRows);
            // Update the ref immediately
            if (onDataChange) {
                onDataChange(newRows);
            }
        };

        const updateLocalRoomServiceRow = (id: number, field: keyof RoomServiceRow, value: string) => {
            const updatedRows = localRoomServiceRows.map(row =>
                row.id === id ? { ...row, [field]: value } : row
            );
            setLocalRoomServiceRows(updatedRows);
            // Update the ref immediately
            if (onDataChange) {
                onDataChange(updatedRows);
            }
        };

        const deleteLocalRoomServiceRow = (id: number) => {
            const filteredRows = localRoomServiceRows.filter(row => row.id !== id);
            setLocalRoomServiceRows(filteredRows);
            // Update the ref immediately
            if (onDataChange) {
                onDataChange(filteredRows);
            }
        };

        const handleLocalSubmit = () => {
            // Update the parent state with local data
            setRoomServiceRows(localRoomServiceRows);
            handleSubmit();
        };

        return (
            <div style={{ backgroundColor: '#FFFFFF' }}>
                <div
                    className="px-4 py-2 rounded-lg w-[300px] flex items-center justify-between mb-2 cursor-pointer"
                    style={{ backgroundColor: '#1F4173' }}
                    onClick={() => setIsLocalExpanded(!isLocalExpanded)}
                >
                    <span style={{ color: '#FFFFFF' }}>{title}</span>
                    <div className="border-white border-2 rounded-lg pt-0.5 pb-0.25 px-1">
                        {isLocalExpanded ?
                            <UpOutlined style={{ fontSize: '14px', color: 'white' }} /> :
                            <DownOutlined style={{ fontSize: '14px', color: 'white' }} />
                        }
                    </div>
                </div>
                <p className="text-sm" style={{ color: '#1F2937' }}>{description}</p>

                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isLocalExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="space-y-4 pt-4">
                        {/* Header Row */}
                        <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${Object.keys(headers).length}, minmax(0, 1fr))` }}>
                            {Object.entries(headers).map(([key, value], index) => (
                                <div key={key} className="bg-teal-500 px-4 py-2 rounded-lg flex items-center justify-between" style={{ color: '#FFFFFF' }}>
                                    <span>{value}</span>
                                    {index === 0 && (
                                        <button
                                            className="border border-white rounded-lg px-2 py-0.5"
                                            onClick={addLocalRoomServiceRow}
                                        >
                                            +
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Data Rows */}
                        {localRoomServiceRows.map((row) => (
                            <div key={row.id} className={`grid gap-4 items-center`} style={{ gridTemplateColumns: `repeat(${Object.keys(headers).length}, minmax(0, 1fr))` }}>
                                {Object.keys(headers).map((fieldKey, index) => (
                                    <div key={fieldKey} className="border rounded-lg px-2 py-2 text-center">
                                        {index === 0 ? (
                                            // First column with delete button
                                            <div className="flex justify-between items-start px-2">
                                                <TextArea
                                                    value={row[fieldKey as keyof RoomServiceRow] as string}
                                                    onChange={(e) => updateLocalRoomServiceRow(row.id, fieldKey as keyof RoomServiceRow, e.target.value)}
                                                    placeholder="ประเภท"
                                                    className="border-0 p-0"
                                                    autoSize={{ minRows: 2, maxRows: 6 }}
                                                />
                                                <button
                                                    className="text-red-500 ml-2"
                                                    onClick={() => deleteLocalRoomServiceRow(row.id)}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ) : (
                                            // Other columns
                                            <Input
                                                type={fieldKey.includes('Time') ? 'time' : 'text'}
                                                value={row[fieldKey as keyof RoomServiceRow] as string}
                                                onChange={(e) => updateLocalRoomServiceRow(row.id, fieldKey as keyof RoomServiceRow, e.target.value)}
                                                className="border-0 p-0 text-center"
                                                placeholder={fieldKey.includes('price') ? 'ราคา' : ''}
                                                suffix={fieldKey.includes('price') ? 'บาท' : undefined}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}

                        {/* Confirm Button - Now inside the expandable section */}
                        <div className="flex justify-end mt-4">
                            <div
                                className="px-4 py-2 rounded-lg cursor-pointer"
                                style={{ backgroundColor: '#FCBC00' }}
                                onClick={handleLocalSubmit}
                            >
                                <span style={{ color: '#FFFFFF' }}>ยืนยันข้อมูล</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen pb-20 pt-10">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div style={{ backgroundColor: '#FFFFFF' }}>
                    <div className="text-center mb-4">
                        <LogoFirstPage />
                        <h1 className="text-5xl font-bold mt-4" style={{ color: '#0D263B' }}>Pet-Friendly Hotel</h1>
                    </div>

                    {/* Form Container */}
                    <div className="py-6 px-6">
                        {/* Image Upload Section */}
                        <div className="mb-8">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                                เพิ่มรูปภาพหน้าปก
                            </h3>
                            <div className="flex col-span-6 gap-4">
                                {/* Left Column */}
                                <div className="flex-[2] p-0">
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
                                        label="อัพโหลดรูปหน้าที่พักของคุณ"
                                        description="ขนาดรูปไม่เกิน 500x500 pixel* png."
                                        labelClass="text-center"
                                        descriptionClass="text-center"
                                        slotHeight="h-[348px]"
                                        childHeight={uploadedImages[0] ? "mt-0" : "mt-30"}
                                    />
                                </div>
                                {/* Right Column Grid */}
                                <div className="flex-[2] grid grid-cols-3 gap-2 w-full">
                                    <div className="p-0">
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
                                            label="อัพโหลดรูปภายในห้องพักของคุณ"
                                            labelClass="text-center text-[10px]"
                                            descriptionClass="text-center"
                                            slotHeight="h-[170px]"
                                            childHeight={uploadedImages[1] ? "mt-0" : "h-[100px]"}
                                            imageHeight={120}
                                        />
                                    </div>
                                    <div className="p-0">
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
                                            label="อัพโหลดรูปภายในห้องพักของคุณ"
                                            labelClass="text-center text-[10px]"
                                            descriptionClass="text-center"
                                            slotHeight="h-[170px]"
                                            childHeight={uploadedImages[2] ? "mt-0" : "h-[100px]"}
                                            imageHeight={120}
                                        />
                                    </div>
                                    <div className="p-0">
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
                                            label="อัพโหลดรูปภายในห้องพักของคุณ"
                                            labelClass="text-center text-[10px]"
                                            descriptionClass="text-center"
                                            slotHeight="h-[170px]"
                                            childHeight={uploadedImages[3] ? "mt-0" : "h-[100px]"}
                                            imageHeight={120}
                                        />
                                    </div>
                                    <div className="p-0">
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
                                            label="อัพโหลดรูปภายในห้องพักของคุณ"
                                            labelClass="text-center text-[10px]"
                                            descriptionClass="text-center"
                                            slotHeight="h-[170px]"
                                            childHeight={uploadedImages[4] ? "mt-0" : "h-[100px]"}
                                            imageHeight={120}
                                        />
                                    </div>
                                    <div className="p-0">
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
                                            label="อัพโหลดรูปภายในห้องพักของคุณ"
                                            labelClass="text-center text-[10px]"
                                            descriptionClass="text-center"
                                            slotHeight="h-[170px]"
                                            childHeight={uploadedImages[5] ? "mt-0" : "h-[100px]"}
                                            imageHeight={120}
                                        />
                                    </div>
                                    <div className="p-0">
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
                                            label="อัพโหลดรูปภายในห้องพักของคุณ"
                                            labelClass="text-center text-[10px]"
                                            descriptionClass="text-center"
                                            slotHeight="h-[170px]"
                                            childHeight={uploadedImages[6] ? "mt-0" : "h-[100px]"}
                                            imageHeight={120}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border border-black mt-15 mb-8"></div>

                        {/* Description Section */}
                        <div className="mb-8">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                                กรอกรายละเอียดข้อมูลที่พัก
                            </h3>
                            <TextArea
                                rows={6}
                                placeholder="กรอกรายละเอียดข้อมูลที่พัก..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full rounded-lg"
                            />
                        </div>

                        <div className="border border-black mt-15 mb-8"></div>

                        {/* Services Management */}
                        <RoomServiceManagementSection
                            defaultRoomServiceData={defaultRoomServiceData}
                            defaultSpecialServicesData={defaultSpecialServicesData}
                            roomServiceHeaders={roomServiceHeaders}
                            specialServiceHeaders={specialServiceHeaders}
                            petCareServiceHeaders={petCareServiceHeaders}
                            onRoomServiceChange={handleRoomServiceChange}
                            onSpecialServiceChange={handleSpecialServiceChange}
                            onPetCareServiceChange={handlePetCareServiceChange}
                            onSubmit={handleSubmit}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="w-full flex justify-center mt-8">
                        <Button
                            size="large"
                            onClick={handleSubmit}
                            className="px-12 py-3 h-auto font-medium w-[90%] rounded-md text-center"
                            style={{ backgroundColor: '#0D263B' }}
                        >
                            <span className="text-xl" style={{ color: '#FFFFFF' }}>กรุณากดยืนยัน</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}