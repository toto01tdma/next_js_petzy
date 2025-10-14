'use client';

import { useState, useEffect } from 'react';
import { Input } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

const { TextArea } = Input;

// Interface for room service row data
export interface RoomServiceRow {
    id: number;
    backendId?: string; // Backend UUID for DELETE operations
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
    onDeleteService?: (backendId: string) => Promise<boolean>; // Handler for backend deletion
    onSubmit?: () => void;
}

// Room Service Form Component
function RoomServiceForm({
    data = [],
    showDefaultData = true,
    title = "เลือกรูปแบบบริการห้องพัก",
    description = "รหัสห้องพักจะรันตามจำนวนห้องที่มี",
    headers,
    onDataChange,
    onDeleteService,
    onSubmit
}: RoomServiceFormProps) {
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

    const deleteLocalRoomServiceRow = async (id: number) => {
        // Find the row to check if it has a backend ID
        const rowToDelete = localRoomServiceRows.find(row => row.id === id);
        
        // If row has backend ID, call delete handler first
        if (rowToDelete?.backendId && onDeleteService) {
            const deleteSuccess = await onDeleteService(rowToDelete.backendId);
            if (!deleteSuccess) {
                // If backend deletion failed, don't remove from frontend
                return;
            }
        }
        
        // Remove from local state
        const filteredRows = localRoomServiceRows.filter(row => row.id !== id);
        setLocalRoomServiceRows(filteredRows);
        // Update the ref immediately
        if (onDataChange) {
            onDataChange(filteredRows);
        }
    };

    const handleLocalSubmit = () => {
        if (onSubmit) {
            onSubmit();
        }
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
}

// Main Section Component Props
interface RoomServiceManagementSectionProps {
    defaultRoomServiceData: RoomServiceRow[];
    defaultSpecialServicesData: RoomServiceRow[];
    defaultPetCareServicesData?: RoomServiceRow[]; // Add prop for pet care services
    roomServiceHeaders: { [key: string]: string };
    specialServiceHeaders: { [key: string]: string };
    petCareServiceHeaders: { [key: string]: string };
    onRoomServiceChange: (data: RoomServiceRow[]) => void;
    onSpecialServiceChange: (data: RoomServiceRow[]) => void;
    onPetCareServiceChange: (data: RoomServiceRow[]) => void;
    onDeleteRoomService?: (backendId: string) => Promise<boolean>;
    onDeleteSpecialService?: (backendId: string) => Promise<boolean>;
    onDeletePetCareService?: (backendId: string) => Promise<boolean>;
    onSubmit: () => void;
}

export default function RoomServiceManagementSection({
    defaultRoomServiceData,
    defaultSpecialServicesData,
    defaultPetCareServicesData = [], // Default to empty array
    roomServiceHeaders,
    specialServiceHeaders,
    petCareServiceHeaders,
    onRoomServiceChange,
    onSpecialServiceChange,
    onPetCareServiceChange,
    onDeleteRoomService,
    onDeleteSpecialService,
    onDeletePetCareService,
    onSubmit
}: RoomServiceManagementSectionProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800">
                กรุณากำหนดรายการห้องพักและบริการกิจหนดของคุณ5555
            </h3>

            <RoomServiceForm
                data={defaultRoomServiceData}
                showDefaultData={true}
                headers={roomServiceHeaders}
                onDataChange={onRoomServiceChange}
                onDeleteService={onDeleteRoomService}
                onSubmit={onSubmit}
            />

            <div className="border border-black mt-15 mb-8"></div>

            <div className="mt-8">
                <RoomServiceForm
                    data={defaultSpecialServicesData}
                    showDefaultData={true}
                    title="เลือกรูปแบบบริการพิเศษ"
                    description="รหัสบริการพิเศษจะรันตามจำนวนบริการที่มี"
                    headers={specialServiceHeaders}
                    onDataChange={onSpecialServiceChange}
                    onDeleteService={onDeleteSpecialService}
                    onSubmit={onSubmit}
                />
            </div>

            <div className="border border-black mt-15 mb-8"></div>

            {/* Pet Care Services Table */}
            <div className="mt-8">
                <RoomServiceForm
                    data={defaultPetCareServicesData}
                    showDefaultData={true}
                    title="รูปแบบบริการรับฝาก"
                    description="รหัสบริการรับฝากจะรันตามจำนวนบริการที่มี"
                    headers={petCareServiceHeaders}
                    onDataChange={onPetCareServiceChange}
                    onDeleteService={onDeletePetCareService}
                    onSubmit={onSubmit}
                />
            </div>
        </div>
    );
}

