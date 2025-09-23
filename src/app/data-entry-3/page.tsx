'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LogoFirstPage from "@/component/first_page/logo";
import { Button, Select, Input, message } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

const { TextArea } = Input;
import type { UploadFile } from 'antd/es/upload/interface';
import SingleFileAttachment from '@/components/shared/SingleFileAttachment';

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
    headers?: {
        roomType: string;
        quantity: string;
        openTime: string;
        closeTime: string;
        price: string;
    };
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
    const [formData, setFormData] = useState({
        description: ''
    });

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

    // Room service form state (for validation)
    const [roomServiceRows, setRoomServiceRows] = useState<RoomServiceRow[]>(defaultRoomServiceData);


    // Validation function
    const validateForm = () => {
        // Check if main image is uploaded
        if (!uploadedImages[0]) {
            message.error('กรุณาอัพโหลดรูปหน้าปกหลัก');
            return false;
        }

        // Check if description is filled
        if (!formData.description.trim()) {
            message.error('กรุณากรอกรายละเอียดข้อมูลที่พัก');
            return false;
        }

        // Check if room service rows are properly filled
        for (const row of roomServiceRows) {
            if (!row.roomType || !row.quantity || !row.price) {
                message.error('กรุณากรอกข้อมูลห้องพักและบริการให้ครบถ้วน');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = () => {
        // if (validateForm()) {
        //     message.success('บันทึกข้อมูลเรียบร้อยแล้ว');
            // Navigate or perform submit action
            router.push('/dashboard');
        // }
    };

    // Room Service Component
    const RoomServiceForm = ({
        data = defaultRoomServiceData,
        showDefaultData = true,
        title = "เลือกรูปแบบบริการห้องพัก",
        description = "รหัสห้องพักจะรันตามจำนวนห้องที่มี",
        headers = {
            roomType: "รูปแบบห้องพักที่คุณเลือก",
            quantity: "จำนวนห้องพัก",
            openTime: "เวลาเปิด",
            closeTime: "เวลาปิด",
            price: "ราคาที่กำหนด"
        }
    }: RoomServiceFormProps) => {
        const [localRoomServiceRows, setLocalRoomServiceRows] = useState<RoomServiceRow[]>(
            showDefaultData ? data : []
        );
        const [isLocalExpanded, setIsLocalExpanded] = useState(showDefaultData);

        // Local functions for the component
        const addLocalRoomServiceRow = () => {
            const newId = localRoomServiceRows.length > 0
                ? Math.max(...localRoomServiceRows.map(row => row.id)) + 1
                : 1;
            setLocalRoomServiceRows([...localRoomServiceRows, {
                id: newId,
                roomType: '',
                quantity: '',
                openTime: '00:00',
                closeTime: '00:00',
                price: ''
            }]);
        };

        const updateLocalRoomServiceRow = (id: number, field: keyof RoomServiceRow, value: string) => {
            setLocalRoomServiceRows(localRoomServiceRows.map(row =>
                row.id === id ? { ...row, [field]: value } : row
            ));
        };

        const deleteLocalRoomServiceRow = (id: number) => {
            setLocalRoomServiceRows(localRoomServiceRows.filter(row => row.id !== id));
        };

        const handleLocalSubmit = () => {
            // Update the parent state with local data
            setRoomServiceRows(localRoomServiceRows);
            handleSubmit();
        };

        return (
            <div>
                <div
                    className="bg-[#1F4173] px-4 py-2 rounded-lg w-[300px] flex items-center justify-between mb-2 cursor-pointer"
                    onClick={() => setIsLocalExpanded(!isLocalExpanded)}
                >
                    <span className="text-white">{title}</span>
                    <div className="border-white border-2 rounded-lg pt-0.5 pb-0.25 px-1">
                        {isLocalExpanded ?
                            <UpOutlined style={{ fontSize: '14px', color: 'white' }} /> :
                            <DownOutlined style={{ fontSize: '14px', color: 'white' }} />
                        }
                    </div>
                </div>
                <p className="text-sm">{description}</p>

                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isLocalExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="space-y-4 pt-4">
                        {/* Header Row */}
                        <div className="grid grid-cols-5 gap-4">
                            <div className="bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center justify-between">
                                <span>{headers.roomType}</span>
                                <button
                                    className="border border-white rounded-lg px-2 py-0.5"
                                    onClick={addLocalRoomServiceRow}
                                >
                                    +
                                </button>
                            </div>
                            <div className="bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center justify-center">
                                {headers.quantity}
                            </div>
                            <div className="bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center justify-center">
                                {headers.openTime}
                            </div>
                            <div className="bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center justify-center">
                                {headers.closeTime}
                            </div>
                            <div className="bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center justify-center">
                                {headers.price}
                            </div>
                        </div>

                        {/* Data Rows */}
                        {localRoomServiceRows.map((row) => (
                            <div key={row.id} className="grid grid-cols-5 gap-4 items-center">
                                <div className="border rounded-lg px-4 py-2 flex justify-between items-center">
                                    <Input
                                        value={row.roomType}
                                        onChange={(e) => updateLocalRoomServiceRow(row.id, 'roomType', e.target.value)}
                                        placeholder="ประเภทห้อง"
                                        className="border-0 p-0"
                                    />
                                    <button
                                        className="text-red-500 ml-2"
                                        onClick={() => deleteLocalRoomServiceRow(row.id)}
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="border rounded-lg px-2 py-2 text-center">
                                    <Input
                                        value={row.quantity}
                                        onChange={(e) => updateLocalRoomServiceRow(row.id, 'quantity', e.target.value)}
                                        className="border-0 p-0 text-center"
                                        placeholder="จำนวน"
                                    />
                                </div>
                                <div className="border rounded-lg px-2 py-2 text-center">
                                    <Input
                                        type="time"
                                        value={row.openTime}
                                        onChange={(e) => updateLocalRoomServiceRow(row.id, 'openTime', e.target.value)}
                                        className="border-0 p-0 text-center"
                                    />
                                </div>
                                <div className="border rounded-lg px-2 py-2 text-center">
                                    <Input
                                        type="time"
                                        value={row.closeTime}
                                        onChange={(e) => updateLocalRoomServiceRow(row.id, 'closeTime', e.target.value)}
                                        className="border-0 p-0 text-center"
                                    />
                                </div>
                                <div className="border rounded-lg px-2 py-2 text-center">
                                    <Input
                                        value={row.price}
                                        onChange={(e) => updateLocalRoomServiceRow(row.id, 'price', e.target.value)}
                                        className="border-0 p-0 text-center"
                                        placeholder="ราคา"
                                        suffix="บาท"
                                    />
                                </div>
                            </div>
                        ))}

                        {/* Confirm Button - Now inside the expandable section */}
                        <div className="flex justify-end mt-4">
                            <div
                                className="bg-[#FCBC00] px-4 py-2 rounded-lg cursor-pointer"
                                onClick={handleLocalSubmit}
                            >
                                <span className="text-white">ยืนยันข้อมูล</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="bg-white">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <LogoFirstPage subtext='' />
                                <span className="text-lg font-semibold text-gray-900">Pet-Friendly Hotel</span>
                            </div>
                        </div>
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
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full rounded-lg"
                            />
                        </div>

                        <div className="border border-black mt-15 mb-8"></div>

                        {/* Services Management */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-semibold text-gray-800">
                                กรุณากำหนดรายการห้องพักและบริการกิจหนดของคุณ
                            </h3>

                            <RoomServiceForm
                                data={defaultRoomServiceData}
                                showDefaultData={true}
                            />

                            <div className="border border-black mt-15 mb-8"></div>

                            <div className="mt-8">
                                <RoomServiceForm
                                    data={defaultSpecialServicesData}
                                    showDefaultData={true}
                                    title="เลือกรูปแบบบริการพิเศษ"
                                    description="รหัสบริการพิเศษจะรันตามจำนวนบริการที่มี"
                                    headers={{
                                        roomType: "รูปแบบบริการ",
                                        quantity: "ประเภทบริการ",
                                        openTime: "เวลาเปิด",
                                        closeTime: "เวลาปิด",
                                        price: "ราคาที่กำหนด"
                                    }}
                                />
                            </div>

                            <div className="border border-black mt-15 mb-8"></div>

                            {/* Special Services Table */}
                            <div className="mt-8">
                                <RoomServiceForm
                                    data={defaultSpecialServicesData}
                                    showDefaultData={true}
                                    title="รูปแบบบริการรับฝาก"
                                    description="รหัสบริการรับฝากจะรันตามจำนวนบริการที่มี"
                                    headers={{
                                        roomType: "รูปแบบบริการ",
                                        quantity: "ประเภทบริการ",
                                        openTime: "เวลาเปิด",
                                        closeTime: "เวลาปิด",
                                        price: "ราคาที่กำหนด"
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="w-full flex justify-center mt-8">
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