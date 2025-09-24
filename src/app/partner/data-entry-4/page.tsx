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

    // Default room service data
    const defaultRoomServiceData: ServiceRow[] = [
        { id: 1, code: 'SR-001', name: 'ห้องเดี่ยว (Single Room)', openTime: '00:00', closeTime: '23:59', price: '900' },
        { id: 2, code: 'SR-002', name: 'ห้องเดี่ยว (Single Room)', openTime: '00:00', closeTime: '00:00', price: '900' },
        { id: 3, code: 'SR-003', name: 'ห้องเดี่ยว (Single Room)', openTime: '00:00', closeTime: '00:00', price: '900' },
        { id: 4, code: 'SR-004', name: 'ห้องเดี่ยว (Single Room)', openTime: '00:00', closeTime: '00:00', price: '900' },
        { id: 5, code: 'SR-005', name: 'ห้องเดี่ยว (Single Room)', openTime: '00:00', closeTime: '00:00', price: '900' },
        { id: 6, code: 'SR-006', name: 'ห้องเดี่ยว (Single Room)', openTime: '00:00', closeTime: '00:00', price: '900' },
        { id: 7, code: 'SR-007', name: 'ห้องเดี่ยว (Single Room)', openTime: '00:00', closeTime: '00:00', price: '900' },
        { id: 8, code: 'SR-008', name: 'ห้องเดี่ยว (Single Room)', openTime: '00:00', closeTime: '00:00', price: '900' },
        { id: 9, code: 'SR-009', name: 'ห้องเดี่ยว (Single Room)', openTime: '00:00', closeTime: '00:00', price: '900' },
        { id: 10, code: 'SR-010', name: 'ห้องเดี่ยว (Single Room)', openTime: '00:00', closeTime: '00:00', price: '900' }
    ];

    // Twin room service data
    const twinRoomServiceData: ServiceRow[] = [
        { id: 1, code: 'TR-001', name: 'ห้องเตียงคู่ (Twin Room)', openTime: '00:00', closeTime: '00:00', price: '900' },
        { id: 2, code: 'TR-002', name: 'ห้องเตียงคู่ (Twin Room)', openTime: '00:00', closeTime: '00:00', price: '900' }
    ];

    // Special services data
    const specialServicesData: ServiceRow[] = [
        { id: 1, code: 'PS-001', name: 'ดื่มน้ำ', openTime: '00:00', closeTime: '00:00', price: '900' },
        { id: 2, code: 'PS-002', name: 'อาหารสำหรับสัตว์เลี้ยง', openTime: '00:00', closeTime: '00:00', price: '900' }
    ];

    // Pet grooming services
    const petGroomingData: ServiceRow[] = [
        { id: 1, code: 'PG-001', name: 'ดื่มน้ำ', openTime: '00:00', closeTime: '00:00', price: '900' },
        { id: 2, code: 'PG-002', name: 'ดื่มน้ำ', openTime: '00:00', closeTime: '00:00', price: '900' }
    ];

    // Pet care services
    const petCareData: ServiceRow[] = [
        { id: 1, code: 'PC-001', name: 'ดูแลสัตว์', openTime: '00:00', closeTime: '00:00', price: '900' },
        { id: 2, code: 'PC-002', name: 'ดูแลสัตว์', openTime: '00:00', closeTime: '00:00', price: '900' }
    ];

    // Pet training services
    const petTrainingData: ServiceRow[] = [
        { id: 1, code: 'PT-001', name: 'ดื่มน้ำ', openTime: '00:00', closeTime: '00:00', price: '900' },
        { id: 2, code: 'PT-002', name: 'ดื่มน้ำ', openTime: '00:00', closeTime: '00:00', price: '900' }
    ];

    // Pet boarding services
    const petBoardingData: ServiceRow[] = [
        { id: 1, code: 'PB-001', name: 'รับฝากสัตว์เลี้ยงขนาดเล็ก', openTime: '00:00', closeTime: '00:00', price: '900' },
        { id: 2, code: 'PB-002', name: 'รับฝากสัตว์เลี้ยงขนาดใหญ่', openTime: '00:00', closeTime: '00:00', price: '900' },
        { id: 3, code: 'PB-003', name: 'รับฝากสัตว์เลี้ยงขนาดกลาง', openTime: '00:00', closeTime: '00:00', price: '900' }
    ];

    // State for validation
    const [allServiceRows, setAllServiceRows] = useState<ServiceRow[]>([]);

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
        titleColor = "bg-[#1F4173]"
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
            // Update the parent state with local data
            setAllServiceRows(prev => [...prev, ...localServiceRows]);
            handleSubmit();
        };

        return (
            <div className="mb-8">
                <div className="flex">
                    <div
                        className={`${titleColor} px-4 py-2 rounded-lg w-[300px] flex items-center justify-between mb-2 me-2 cursor-pointer`}
                        onClick={() => setIsLocalExpanded(!isLocalExpanded)}
                    >
                        <span className="text-white">{title[0]}</span>
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
                            <span className="text-white">{t}</span>
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
                                <div key={key} className="bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center justify-between">
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
                                className="bg-[#FCBC00] px-4 py-2 rounded-lg cursor-pointer"
                                onClick={handleLocalSubmit}
                            >
                                <span className="text-white text-sm">ยืนยันข้อมูล</span>
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
                <div className="bg-white">
                    <div className="text-center mb-4">
                        <LogoFirstPage />
                        <h1 className="text-5xl font-bold text-[#0D263B] mt-4">Pet-Friendly Hotel</h1>
                    </div>

                    <div className="border border-black mt-8 mb-20"></div>

                    {/* Form Container */}
                    <div className="py-6 px-6">
                        <div className="flex justify-center items-center bg-[#00B6AA] rounded-lg py-1.5 mb-5 w-[220px]">
                            <span className="text-white text-lg">รูปแบบห้องพักของคุณ</span>
                        </div>
                        {/* Room Services Section */}
                        <ServiceForm
                            data={defaultRoomServiceData}
                            showDefaultData={true}
                            title={["รูปแบบบริการห้องพัก", "จำนวน 10 ห้อง"]}
                            headers={{
                                code: "รหัสห้องพัก",
                                name: "รูปแบบห้องพักที่คุณเลือก",
                                openTime: "เวลาเปิด",
                                closeTime: "เวลาปิด",
                                price: "ราคาที่กำหนด"
                            }}
                            titleColor="bg-[#1F4173]"
                        />

                        <div className="border border-black mt-15 mb-8"></div>

                        {/* Twin Room Services Section */}
                        <ServiceForm
                            data={twinRoomServiceData}
                            showDefaultData={true}
                            title={["ประเภท - ห้องเตียงคู่ (Twin Room)", "จำนวน 2 ห้อง"]}
                            headers={{
                                code: "ประเภท - ห้องเตียงคู่ (Twin Room)",
                                name: "จำนวน 2 ห้อง",
                                openTime: "เวลาเปิด",
                                closeTime: "เวลาปิด",
                                price: "ราคาที่กำหนด"
                            }}
                            titleColor="bg-[#1F4173]"
                        />

                        <div className="border border-black mt-15 mb-8"></div>

                        <div className="flex justify-start items-center">
                            <div className="flex justify-center items-center bg-[#00B6AA] rounded-lg py-1.5 mb-5 w-[220px]">
                                <span className="text-white text-lg">รูปแบบบริการพิเศษ</span>
                            </div>
                        </div>

                        {/* Special Services Section */}
                        <ServiceForm
                            data={specialServicesData}
                            showDefaultData={true}
                            title={["ประเภท - ตัดขนแมว"]}
                            headers={{
                                code: "ประเภท - ตัดขนแมว",
                                name: "จำนวน 2 ห้อง",
                                openTime: "เวลาเปิด",
                                closeTime: "เวลาปิด",
                                price: "ราคาที่กำหนด"
                            }}
                            titleColor="bg-[#1F4173]"
                        />

                        <div className="border border-black mt-15 mb-8"></div>

                        {/* Pet Grooming Section */}
                        <ServiceForm
                            data={petGroomingData}
                            showDefaultData={true}
                            title={["ประเภท - ตัดขนสุนัข"]}
                            description=""
                            headers={{
                                code: "ประเภท - ตัดขนสุนัข",
                                name: "จำนวน 2 ห้อง",
                                openTime: "เวลาเปิด",
                                closeTime: "เวลาปิด",
                                price: "ราคาที่กำหนด"
                            }}
                            titleColor="bg-[#1F4173]"
                        />

                        <div className="border border-black mt-15 mb-8"></div>

                        {/* Pet Care Section */}
                        <ServiceForm
                            data={petCareData}
                            showDefaultData={true}
                            title={["ประเภท - อาบน้ำสุนัข"]}
                            description=""
                            headers={{
                                code: "ประเภท - อาบน้ำสุนัข",
                                name: "จำนวน 2 ห้อง",
                                openTime: "เวลาเปิด",
                                closeTime: "เวลาปิด",
                                price: "ราคาที่กำหนด"
                            }}
                            titleColor="bg-[#1F4173]"
                        />

                        <div className="border border-black mt-15 mb-8"></div>

                        <div className="flex justify-start items-center">
                            <div className="flex justify-center items-center bg-[#00B6AA] rounded-lg py-1.5 mb-5 w-[300px]">
                                <span className="text-white text-lg">รูปแบบบริการรับฝากสัตว์เลี้ยง</span>
                            </div>
                        </div>

                        {/* Pet Training Section */}
                        <ServiceForm
                            data={petTrainingData}
                            showDefaultData={true}
                            title={["ประเภท - ตัดขนสุนัข"]}
                            description=""
                            headers={{
                                code: "ประเภท - ตัดขนสุนัข",
                                name: "จำนวน 2 ห้อง",
                                openTime: "เวลาเปิด",
                                closeTime: "เวลาปิด",
                                price: "ราคาที่กำหนด"
                            }}
                            titleColor="bg-[#1F4173]"
                        />

                        <div className="border border-black mt-15 mb-8"></div>
                    </div>

                    {/* Submit Button */}
                    <div className="w-full flex justify-center mt-8 pb-8">
                        <Button
                            size="large"
                            onClick={handleSubmit}
                            className="px-12 py-3 h-auto font-medium w-[90%] rounded-md text-center"
                            style={{ backgroundColor: '#0D263B' }}
                        >
                            <span className="text-white text-xl">กรุณากดยืนยัน</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
