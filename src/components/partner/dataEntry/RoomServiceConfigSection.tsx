'use client';

import { useState } from 'react';
import { Input, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

// Interface for room service row data
export interface RoomServiceRow {
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

// Room Service Form Component
function RoomServiceForm({
    data = [],
    title = "กรุณาเลือกประเภทห้องพัก",
    description = "รหัสห้องพักจะรันตามจำนวนห้องที่มี",
    headers,
    onDataChange
}: RoomServiceFormProps) {
    const [localData, setLocalData] = useState<RoomServiceRow[]>(data);
    const [showRows, setShowRows] = useState<boolean[]>(data.map(() => true));

    const handleInputChange = (index: number, field: keyof RoomServiceRow, value: string) => {
        const newData = [...localData];
        newData[index] = { ...newData[index], [field]: value };
        setLocalData(newData);
        if (onDataChange) {
            onDataChange(newData);
        }
    };

    const toggleRow = (index: number) => {
        const newShowRows = [...showRows];
        newShowRows[index] = !newShowRows[index];
        setShowRows(newShowRows);
    };

    return (
        <div className="space-y-4">
            <div>
                <h4 className="text-xl font-bold mb-2" style={{ color: '#484848' }}>
                    {title}
                </h4>
                <p className="text-sm text-gray-600 mb-4">{description}</p>
            </div>

            {localData.map((row, index) => (
                <div key={row.id} className="border border-gray-300 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                        <h5 className="text-lg font-semibold">
                            {headers.roomType} {row.id}
                        </h5>
                        <Button
                            type="text"
                            icon={showRows[index] ? <UpOutlined /> : <DownOutlined />}
                            onClick={() => toggleRow(index)}
                        />
                    </div>

                    {showRows[index] && (
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div>
                                <label className="block text-sm mb-1">{headers.roomType}</label>
                                <Input
                                    value={row.roomType}
                                    onChange={(e) => handleInputChange(index, 'roomType', e.target.value)}
                                    placeholder="ประเภทห้องพัก"
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">{headers.quantity}</label>
                                <Input
                                    value={row.quantity}
                                    onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                                    placeholder="จำนวน"
                                    type="number"
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">{headers.openTime}</label>
                                <Input
                                    value={row.openTime}
                                    onChange={(e) => handleInputChange(index, 'openTime', e.target.value)}
                                    placeholder="เวลาเปิด"
                                    type="time"
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">{headers.closeTime}</label>
                                <Input
                                    value={row.closeTime}
                                    onChange={(e) => handleInputChange(index, 'closeTime', e.target.value)}
                                    placeholder="เวลาปิด"
                                    type="time"
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">{headers.price}</label>
                                <Input
                                    value={row.price}
                                    onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                                    placeholder="ราคา"
                                    type="number"
                                />
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

interface RoomServiceConfigSectionProps {
    roomServiceData?: RoomServiceRow[];
    specialServicesData?: RoomServiceRow[];
    petCareServicesData?: RoomServiceRow[];
    onRoomServiceChange?: (data: RoomServiceRow[]) => void;
    onSpecialServiceChange?: (data: RoomServiceRow[]) => void;
    onPetCareServiceChange?: (data: RoomServiceRow[]) => void;
}

export default function RoomServiceConfigSection({
    roomServiceData = [],
    specialServicesData = [],
    petCareServicesData = [],
    onRoomServiceChange,
    onSpecialServiceChange,
    onPetCareServiceChange
}: RoomServiceConfigSectionProps) {
    const roomServiceHeaders = {
        roomType: "รูปแบบห้องพักที่คุณเลือก",
        quantity: "จำนวนห้องพัก",
        openTime: "เวลาเปิด",
        closeTime: "เวลาปิด",
        price: "ราคาที่กำหนด"
    };

    const specialServiceHeaders = {
        roomType: "รูปแบบบริการ",
        quantity: "ประเภทบริการ",
        openTime: "เวลาเปิด",
        closeTime: "เวลาปิด",
        price: "ราคาที่กำหนด"
    };

    const petCareServiceHeaders = {
        roomType: "รูปแบบบริการ",
        quantity: "ประเภทบริการ",
        openTime: "เวลาเปิด",
        closeTime: "เวลาปิด",
        price: "ราคาที่กำหนด"
    };

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800">
                กรุณากำหนดรายการห้องพักและบริการกิจหนดของคุณ
            </h3>

            <RoomServiceForm
                data={roomServiceData}
                showDefaultData={true}
                headers={roomServiceHeaders}
                onDataChange={onRoomServiceChange}
            />

            <div className="border border-black mt-15 mb-8"></div>

            <div className="mt-8">
                <RoomServiceForm
                    data={specialServicesData}
                    showDefaultData={true}
                    title="เลือกรูปแบบบริการพิเศษ"
                    description="รหัสบริการพิเศษจะรันตามจำนวนบริการที่มี"
                    headers={specialServiceHeaders}
                    onDataChange={onSpecialServiceChange}
                />
            </div>

            <div className="border border-black mt-15 mb-8"></div>

            <div className="mt-8">
                <RoomServiceForm
                    data={petCareServicesData}
                    showDefaultData={true}
                    title="รูปแบบบริการรับฝาก"
                    description="รหัสบริการรับฝากจะรันตามจำนวนบริการที่มี"
                    headers={petCareServiceHeaders}
                    onDataChange={onPetCareServiceChange}
                />
            </div>
        </div>
    );
}

