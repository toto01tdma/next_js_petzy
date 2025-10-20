'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LogoFirstPage from "@/components/first_page/logo";
import { Button, Input } from 'antd';
import Swal from 'sweetalert2';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

// Interface for service row data
interface ServiceRow {
    id: number;
    code: string;
    name: string;
    openTime: string;
    closeTime: string;
    price: string;
}

interface DataEntry3Data {
    roomServices: RoomServiceRow[];
    specialServices: RoomServiceRow[];
    petCareServices: RoomServiceRow[];
    description: string;
    uploadedImages: unknown[];
}

interface RoomServiceRow {
    id: number;
    roomType: string;
    quantity: string;
    openTime: string;
    closeTime: string;
    price: string;
}

interface DynamicServiceForm {
    id: string;
    title: string;
    data: ServiceRow[];
}

// Interface for ServiceForm props
interface ServiceFormProps {
    data?: ServiceRow[];
    showDefaultData?: boolean;
    title?: string[];
    description?: string;
    headers: {
        [key: string]: string;
    };
    titleColor?: string;
}

export default function DataEntry4() {
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


    
    // State for data from data-entry-3
    const [dynamicRoomServices, setDynamicRoomServices] = useState<DynamicServiceForm[]>([]);
    const [dynamicSpecialServices, setDynamicSpecialServices] = useState<DynamicServiceForm[]>([]);
    const [dynamicPetCareServices, setDynamicPetCareServices] = useState<DynamicServiceForm[]>([]);

    // Load data from sessionStorage on component mount
    useEffect(() => {
        const storedData = sessionStorage.getItem('dataEntry3Data');
        console.log('Data-entry-4: Stored data from sessionStorage:', storedData);
        if (storedData) {
            const parsedData: DataEntry3Data = JSON.parse(storedData);
            console.log('Data-entry-4: Parsed data:', parsedData);
            
            // Process room services - create forms based on number of rooms
            if (parsedData.roomServices && parsedData.roomServices.length > 0) {
                const roomServiceForms: DynamicServiceForm[] = parsedData.roomServices.map((service: RoomServiceRow, index: number) => ({
                    id: `room-service-${index}`,
                    title: `${service.roomType} (${service.quantity} ห้อง)`,
                    data: Array.from({ length: parseInt(service.quantity) || 1 }, (_, i) => ({
                        id: i + 1,
                        code: `${service.roomType.substring(0, 2).toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
                        name: service.roomType,
                        openTime: service.openTime || '00:00',
                        closeTime: service.closeTime || '00:00',
                        price: service.price || '0'
                    }))
                }));
                setDynamicRoomServices(roomServiceForms);
                console.log('Generated room service forms:', roomServiceForms);
            }
            
            // Process special services - create separate forms for each type
            if (parsedData.specialServices && parsedData.specialServices.length > 0) {
                const specialServiceForms: DynamicServiceForm[] = parsedData.specialServices.map((service: RoomServiceRow, index: number) => ({
                    id: `special-service-${index}`,
                    title: service.roomType,
                    data: [{
                        id: 1,
                        code: `SP-${String(index + 1).padStart(3, '0')}`,
                        name: service.roomType,
                        openTime: service.openTime || '00:00',
                        closeTime: service.closeTime || '00:00',
                        price: service.price || '0'
                    }]
                }));
                setDynamicSpecialServices(specialServiceForms);
                console.log('Generated special service forms:', specialServiceForms);
            }
            
            // Process pet care services - create separate forms for each type
            if (parsedData.petCareServices && parsedData.petCareServices.length > 0) {
                const petCareServiceForms: DynamicServiceForm[] = parsedData.petCareServices.map((service: RoomServiceRow, index: number) => ({
                    id: `pet-care-service-${index}`,
                    title: service.roomType,
                    data: [{
                        id: 1,
                        code: `PC-${String(index + 1).padStart(3, '0')}`,
                        name: service.roomType,
                        openTime: service.openTime || '00:00',
                        closeTime: service.closeTime || '00:00',
                        price: service.price || '0'
                    }]
                }));
                setDynamicPetCareServices(petCareServiceForms);
                console.log('Generated pet care service forms:', petCareServiceForms);
            }
        } else {
            console.log('No data found in sessionStorage');
        }
    }, []);

    // Validation function
    const validateForm = async () => {
        // Basic validation - can be expanded as needed
        // if (allServiceRows.length === 0) {
        //     await Swal.fire({
        //         icon: 'error',
        //         title: 'ข้อมูลไม่ครบถ้วน',
        //         text: 'กรุณากรอกข้อมูลบริการให้ครบถ้วน',
        //         confirmButtonText: 'ตกลง',
        //         confirmButtonColor: '#0D263B'
        //     });
        //     return false;
        // }

        return true;
    };

    const handleSubmit = async () => {
        const isValid = await validateForm();
        if (isValid) {
            // Show success dialog
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

            // Navigate to dashboard
            router.push('/partner/dashboard');
        }
    };

    // Service Form Component
    const ServiceForm = ({
        data = [],
        showDefaultData = true,
        title = ["บริการ"],
        description = "",
        headers,
        titleColor = "#1F4173"
    }: ServiceFormProps) => {
        const [localServiceRows, setLocalServiceRows] = useState<ServiceRow[]>(
            showDefaultData ? data : []
        );
        const [isLocalExpanded, setIsLocalExpanded] = useState(showDefaultData);

        // Local functions for the component
        const addLocalServiceRow = () => {
            const newId = localServiceRows.length > 0
                ? Math.max(...localServiceRows.map(row => row.id)) + 1
                : 1;
            setLocalServiceRows([...localServiceRows, {
                id: newId,
                code: '',
                name: '',
                openTime: '00:00',
                closeTime: '00:00',
                price: ''
            }]);
        };

        const updateLocalServiceRow = (id: number, field: keyof ServiceRow, value: string) => {
            setLocalServiceRows(localServiceRows.map(row =>
                row.id === id ? { ...row, [field]: value } : row
            ));
        };

        const deleteLocalServiceRow = (id: number) => {
            setLocalServiceRows(localServiceRows.filter(row => row.id !== id));
        };

        const handleLocalSubmit = () => {
            // Submit the form
            handleSubmit();
        };

        return (
            <div className="mb-8">
                <div className="flex">
                    <div
                        className="px-4 py-2 rounded-lg w-[300px] flex items-center justify-between mb-2 me-2 cursor-pointer"
                        style={{ backgroundColor: titleColor }}
                        onClick={() => setIsLocalExpanded(!isLocalExpanded)}
                    >
                        <span style={{ color: '#FFFFFF' }}>{title[0]}</span>
                        <div className="border-white border-2 rounded-lg pt-0.5 pb-0.25 px-1">
                            {isLocalExpanded ?
                                <UpOutlined style={{ fontSize: '14px', color: 'white' }} /> :
                                <DownOutlined style={{ fontSize: '14px', color: 'white' }} />
                            }
                        </div>
                    </div>
                    {title.slice(1).map((t: string, index: number) => (
                        <div
                            key={index}
                            className={`${titleColor} px-4 py-2 rounded-lg w-[300px] flex items-center justify-center mb-2 me-2`}
                        >
                            <span style={{ color: '#FFFFFF' }}>{t}</span>
                        </div>
                    ))}
                </div>
                <p className="text-sm mb-4">{description}</p>

                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isLocalExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="space-y-4 pt-4">
                        {/* Header Row */}
                        <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${Object.keys(headers).length}, minmax(0, 1fr))` }}>
                            {Object.entries(headers).map(([key, value], index) => (
                                <div key={key} className="bg-teal-500 px-4 py-2 rounded-lg flex items-center justify-between" style={{ color: '#FFFFFF' }}>
                                    <span className="text-sm">{value}</span>
                                    {index === 0 && (
                                        <button
                                            className="border border-white rounded-lg px-2 py-0.5"
                                            onClick={addLocalServiceRow}
                                        >
                                            +
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Data Rows */}
                        {localServiceRows.map((row) => (
                            <div key={row.id} className={`grid gap-4 items-center`} style={{ gridTemplateColumns: `repeat(${Object.keys(headers).length}, minmax(0, 1fr))` }}>
                                {Object.keys(headers).map((fieldKey, index) => (
                                    <div key={fieldKey} className="border rounded-lg px-2 py-2 text-center">
                                        {index === 0 ? (
                                            // First column with delete button
                                            <div className="flex justify-between items-center px-2">
                                                <Input
                                                    value={row[fieldKey as keyof ServiceRow] as string}
                                                    onChange={(e) => updateLocalServiceRow(row.id, fieldKey as keyof ServiceRow, e.target.value)}
                                                    placeholder="รหัส"
                                                    className="border-0 p-0 text-sm"
                                                />
                                                <button
                                                    className="text-red-500 ml-2"
                                                    onClick={() => deleteLocalServiceRow(row.id)}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ) : (
                                            // Other columns
                                            <Input
                                                type={fieldKey.includes('Time') ? 'time' : 'text'}
                                                value={row[fieldKey as keyof ServiceRow] as string}
                                                onChange={(e) => updateLocalServiceRow(row.id, fieldKey as keyof ServiceRow, e.target.value)}
                                                className="border-0 p-0 text-center text-sm"
                                                placeholder={fieldKey.includes('price') ? 'ราคา' : fieldKey.includes('name') ? 'ชื่อบริการ' : ''}
                                                suffix={fieldKey.includes('price') ? 'บาท' : undefined}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}

                        {/* Confirm Button - Inside the expandable section */}
                        <div className="flex justify-end mt-4">
                            <div
                                className="px-4 py-2 rounded-lg cursor-pointer"
                                style={{ backgroundColor: '#FCBC00' }}
                                onClick={handleLocalSubmit}
                            >
                                <span className="text-sm" style={{ color: '#FFFFFF' }}>ยืนยันข้อมูล</span>
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

                    <div className="border border-black mt-8 mb-20"></div>

                    {/* Form Container */}
                    <div className="py-6 px-6">
                        {/* Dynamic Room Services Section */}
                        {dynamicRoomServices.length > 0 && (
                            <>
                                <div className="flex justify-center items-center rounded-lg py-1.5 mb-5 w-[220px]" style={{ backgroundColor: '#00B6AA' }}>
                                    <span className="text-lg" style={{ color: '#FFFFFF' }}>รูปแบบห้องพักของคุณ</span>
                                </div>
                                {dynamicRoomServices.map((roomService, index) => (
                                    <div key={roomService.id}>
                                        <ServiceForm
                                            data={roomService.data}
                                            showDefaultData={true}
                                            title={[roomService.title]}
                                            headers={{
                                                code: "รหัสห้องพัก",
                                                name: "รูปแบบห้องพักที่คุณเลือก",
                                                openTime: "เวลาเปิด",
                                                closeTime: "เวลาปิด",
                                                price: "ราคาที่กำหนด"
                                            }}
                                            titleColor="#1F4173"
                                        />
                                        {index < dynamicRoomServices.length - 1 && (
                                            <div className="border border-black mt-15 mb-8"></div>
                                        )}
                                    </div>
                                ))}
                                <div className="border border-black mt-15 mb-8"></div>
                            </>
                        )}

                        {/* Dynamic Special Services Section */}
                        {dynamicSpecialServices.length > 0 && (
                            <>
                                <div className="flex justify-start items-center">
                                    <div className="flex justify-center items-center rounded-lg py-1.5 mb-5 w-[220px]" style={{ backgroundColor: '#00B6AA' }}>
                                        <span className="text-lg" style={{ color: '#FFFFFF' }}>รูปแบบบริการพิเศษ</span>
                                    </div>
                                </div>
                                {dynamicSpecialServices.map((specialService, index) => (
                                    <div key={specialService.id}>
                                        <ServiceForm
                                            data={specialService.data}
                                            showDefaultData={true}
                                            title={[specialService.title]}
                                            headers={{
                                                code: "รหัสบริการ",
                                                name: "ประเภทบริการ",
                                                openTime: "เวลาเปิด",
                                                closeTime: "เวลาปิด",
                                                price: "ราคาที่กำหนด"
                                            }}
                                            titleColor="#1F4173"
                                        />
                                        {index < dynamicSpecialServices.length - 1 && (
                                            <div className="border border-black mt-15 mb-8"></div>
                                        )}
                                    </div>
                                ))}
                                <div className="border border-black mt-15 mb-8"></div>
                            </>
                        )}

                        {/* Dynamic Pet Care Services Section */}
                        {dynamicPetCareServices.length > 0 && (
                            <>
                                <div className="flex justify-start items-center">
                                    <div className="flex justify-center items-center rounded-lg py-1.5 mb-5 w-[300px]" style={{ backgroundColor: '#00B6AA' }}>
                                        <span className="text-lg" style={{ color: '#FFFFFF' }}>รูปแบบบริการรับฝากสัตว์เลี้ยง</span>
                                    </div>
                                </div>
                                {dynamicPetCareServices.map((petCareService, index) => (
                                    <div key={petCareService.id}>
                                        <ServiceForm
                                            data={petCareService.data}
                                            showDefaultData={true}
                                            title={[petCareService.title]}
                                            headers={{
                                                code: "รหัสบริการ",
                                                name: "ประเภทบริการ",
                                                openTime: "เวลาเปิด",
                                                closeTime: "เวลาปิด",
                                                price: "ราคาที่กำหนด"
                                            }}
                                            titleColor="#1F4173"
                                        />
                                        {index < dynamicPetCareServices.length - 1 && (
                                            <div className="border border-black mt-15 mb-8"></div>
                                        )}
                                    </div>
                                ))}
                                <div className="border border-black mt-15 mb-8"></div>
                            </>
                        )}

                        {/* Fallback: Show message if no data from data-entry-3 */}
                        {dynamicRoomServices.length === 0 && dynamicSpecialServices.length === 0 && dynamicPetCareServices.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-gray-600 text-lg">ไม่พบข้อมูลจากหน้าก่อนหน้า</p>
                                <p className="text-gray-500 text-sm mt-2">กรุณากลับไปกรอกข้อมูลในหน้า data-entry-3 ก่อน</p>
                                <button 
                                    onClick={() => router.push('/partner/data-entry-3')}
                                    className="mt-4 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
                                    style={{ color: '#FFFFFF' }}
                                >
                                    กลับไปหน้า data-entry-3
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="w-full flex justify-center mt-8 pb-8">
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
