'use client';

import { useState, useEffect } from 'react';
import { Input, Button } from 'antd';
import { DownOutlined, UpOutlined, SettingOutlined } from '@ant-design/icons';
import RoomSettingsModal, { RoomDetailRow } from './RoomSettingsModal';

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
    onDeleteService?: (backendId: string | undefined) => Promise<boolean>; // Handler for backend deletion
    onSubmit?: () => void;
    onRoomDetailsChange?: (rowId: number, rooms: RoomDetailRow[]) => void; // Handler for room details changes
    subRoomDetailsData?: {
        room_services?: Array<{ room_type: string; sub_rooms?: Array<{ code: string; name: string; open_time: string; close_time: string; price: number; images: string[] }> }>;
        special_services?: Array<{ service_type: string; sub_services?: Array<{ code: string; name: string; open_time: string; close_time: string; price: number; images: string[] }> }>;
        pet_care_services?: Array<{ service_type: string; sub_services?: Array<{ code: string; name: string; open_time: string; close_time: string; price: number; images: string[] }> }>;
    } | null;
    serviceType?: 'room_service' | 'special_service' | 'pet_care_service'; // Type of service to distinguish data source
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
    onSubmit,
    onRoomDetailsChange,
    subRoomDetailsData,
    serviceType = 'room_service'
}: RoomServiceFormProps) {
    const [localRoomServiceRows, setLocalRoomServiceRows] = useState<RoomServiceRow[]>(
        showDefaultData ? data : []
    );
    const [isLocalExpanded, setIsLocalExpanded] = useState(showDefaultData);
    const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [roomDetailsMap, setRoomDetailsMap] = useState<Map<number, RoomDetailRow[]>>(new Map());

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
        
        // Always call delete handler if it exists (it will handle undefined backendId for new services)
        if (onDeleteService) {
            const backendId: string | undefined = rowToDelete?.backendId;
            const deleteSuccess = await onDeleteService(backendId);
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

    const handleSettingClick = (rowId: number) => {
        setSelectedRowId(rowId);
        
        // Find the selected row to get its room_type/service_type
        const selectedRow = localRoomServiceRows.find(row => row.id === rowId);
        
        if (!selectedRow || !subRoomDetailsData) {
            // No data - clear the map entry
            setRoomDetailsMap(prev => {
                const newMap = new Map(prev);
                newMap.delete(rowId);
                return newMap;
            });
            setIsModalVisible(true);
            return;
        }
        
        // Helper function to format time
        const formatTimeForInput = (time: string | null | undefined): string => {
            if (!time) return '00:00';
            if (typeof time === 'string' && /^\d{2}:\d{2}$/.test(time)) {
                return time;
            }
            try {
                const date = new Date(time);
                if (!isNaN(date.getTime())) {
                    const hours = String(date.getHours()).padStart(2, '0');
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                    return `${hours}:${minutes}`;
                }
            } catch {
                const match = time.match(/(\d{2}):(\d{2})/);
                if (match) {
                    return `${match[1]}:${match[2]}`;
                }
            }
            return '00:00';
        };
        
        // Helper function to format image URLs
        const formatImageUrl = (url: string) => {
            if (!url) return '';
            if (url.startsWith('http://') || url.startsWith('https://')) {
                return url;
            }
            return url.startsWith('/') ? url : `/${url}`;
        };
        
        let roomDetails: RoomDetailRow[] = [];
        let hasApiData = false;
        
        // Handle different service types
        if (serviceType === 'room_service' && subRoomDetailsData.room_services) {
            const matchingRoomService = subRoomDetailsData.room_services.find((rs) => 
                rs.room_type === selectedRow.roomType
            );
            
            if (matchingRoomService && matchingRoomService.sub_rooms && matchingRoomService.sub_rooms.length > 0) {
                hasApiData = true;
                roomDetails = matchingRoomService.sub_rooms.map((subRoom, i: number) => ({
                    id: i + 1,
                    code: subRoom.code || '',
                    name: subRoom.name || matchingRoomService.room_type,
                    openTime: formatTimeForInput(subRoom.open_time) || '00:00',
                    closeTime: formatTimeForInput(subRoom.close_time) || '00:00',
                    price: subRoom.price?.toString() || '0',
                    images: Array.isArray(subRoom.images) 
                        ? subRoom.images.map((img: string) => formatImageUrl(img)).filter((img: string) => img !== '')
                        : []
                }));
            } else if (matchingRoomService) {
                // API data exists but sub_rooms is empty
                hasApiData = true;
                roomDetails = [];
            }
        } else if (serviceType === 'special_service' && subRoomDetailsData.special_services) {
            const matchingSpecialService = subRoomDetailsData.special_services.find((ss) => 
                ss.service_type === selectedRow.roomType
            );
            
            if (matchingSpecialService && matchingSpecialService.sub_services && matchingSpecialService.sub_services.length > 0) {
                hasApiData = true;
                roomDetails = matchingSpecialService.sub_services.map((subService, i: number) => ({
                    id: i + 1,
                    code: subService.code || '',
                    name: subService.name || matchingSpecialService.service_type,
                    openTime: formatTimeForInput(subService.open_time) || '00:00',
                    closeTime: formatTimeForInput(subService.close_time) || '00:00',
                    price: subService.price?.toString() || '0',
                    images: Array.isArray(subService.images) 
                        ? subService.images.map((img: string) => formatImageUrl(img)).filter((img: string) => img !== '')
                        : []
                }));
            } else if (matchingSpecialService) {
                // API data exists but sub_services is empty
                hasApiData = true;
                roomDetails = [];
            }
        } else if (serviceType === 'pet_care_service' && subRoomDetailsData.pet_care_services) {
            const matchingPetCareService = subRoomDetailsData.pet_care_services.find((pcs) => 
                pcs.service_type === selectedRow.roomType
            );
            
            if (matchingPetCareService && matchingPetCareService.sub_services && matchingPetCareService.sub_services.length > 0) {
                hasApiData = true;
                roomDetails = matchingPetCareService.sub_services.map((subService, i: number) => ({
                    id: i + 1,
                    code: subService.code || '',
                    name: subService.name || matchingPetCareService.service_type,
                    openTime: formatTimeForInput(subService.open_time) || '00:00',
                    closeTime: formatTimeForInput(subService.close_time) || '00:00',
                    price: subService.price?.toString() || '0',
                    images: Array.isArray(subService.images) 
                        ? subService.images.map((img: string) => formatImageUrl(img)).filter((img: string) => img !== '')
                        : []
                }));
            } else if (matchingPetCareService) {
                // API data exists but sub_services is empty
                hasApiData = true;
                roomDetails = [];
            }
        }
        
        // Update roomDetailsMap
        setRoomDetailsMap(prev => {
            const newMap = new Map(prev);
            if (hasApiData) {
                newMap.set(rowId, roomDetails);
            } else {
                newMap.delete(rowId);
            }
            return newMap;
        });
        
        // Notify parent component
        if (onRoomDetailsChange && hasApiData) {
            onRoomDetailsChange(rowId, roomDetails);
        }
        
        setIsModalVisible(true);
    };

    const handleModalSave = (rooms: RoomDetailRow[]) => {
        if (selectedRowId !== null) {
            setRoomDetailsMap(prev => {
                const newMap = new Map(prev);
                newMap.set(selectedRowId, rooms);
                return newMap;
            });
            if (onRoomDetailsChange) {
                onRoomDetailsChange(selectedRowId, rooms);
            }
        }
        setIsModalVisible(false);
        setSelectedRowId(null);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedRowId(null);
    };

    const getSelectedRow = () => {
        if (selectedRowId === null) return null;
        return localRoomServiceRows.find(row => row.id === selectedRowId);
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
                                    ) : fieldKey === 'quantity' ? (
                                        // Quantity column - replace with Setting button
                                        <Button
                                            type="default"
                                            icon={<SettingOutlined />}
                                            onClick={() => handleSettingClick(row.id)}
                                            className="w-full"
                                        >
                                            ตั้งค่าห้องพัก
                                        </Button>
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

                    {/* Room Settings Modal */}
                    {selectedRowId !== null && (
                        <RoomSettingsModal
                            visible={isModalVisible}
                            roomType={getSelectedRow()?.roomType || ''}
                            roomQuantity={parseInt(getSelectedRow()?.quantity || '0') || 0}
                            defaultOpenTime={getSelectedRow()?.openTime || '00:00'}
                            defaultCloseTime={getSelectedRow()?.closeTime || '00:00'}
                            defaultPrice={getSelectedRow()?.price || '0'}
                            existingRooms={roomDetailsMap.get(selectedRowId)}
                            hasApiData={roomDetailsMap.has(selectedRowId)} // Check if API data exists
                            onClose={handleModalClose}
                            onSave={handleModalSave}
                        />
                    )}

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
    onDeleteRoomService?: (backendId: string | undefined) => Promise<boolean>;
    onDeleteSpecialService?: (backendId: string | undefined) => Promise<boolean>;
    onDeletePetCareService?: (backendId: string | undefined) => Promise<boolean>;
    onSubmit: () => void;
    onRoomDetailsChange?: (rowId: number, rooms: RoomDetailRow[]) => void; // New prop for room details (room services)
    onSpecialServiceDetailsChange?: (rowId: number, rooms: RoomDetailRow[]) => void; // New prop for special service details
    onPetCareServiceDetailsChange?: (rowId: number, rooms: RoomDetailRow[]) => void; // New prop for pet care service details
    // NEW: Props to conditionally show/hide sections based on Step 2 selections
    showRoomService?: boolean;
    showSpecialService?: boolean;
    showPetCareService?: boolean;
    // NEW: Sub room details data from API
    subRoomDetailsData?: {
        room_services?: Array<{ room_type: string; sub_rooms?: Array<{ code: string; name: string; open_time: string; close_time: string; price: number; images: string[] }> }>;
        special_services?: Array<{ service_type: string; sub_services?: Array<{ code: string; name: string; open_time: string; close_time: string; price: number; images: string[] }> }>;
        pet_care_services?: Array<{ service_type: string; sub_services?: Array<{ code: string; name: string; open_time: string; close_time: string; price: number; images: string[] }> }>;
    } | null;
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
    onSubmit,
    onRoomDetailsChange,
    onSpecialServiceDetailsChange,
    onPetCareServiceDetailsChange,
    showRoomService = true, // Default to true for backward compatibility
    showSpecialService = true,
    showPetCareService = true,
    subRoomDetailsData
}: RoomServiceManagementSectionProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800">
                กรุณากำหนดรายการห้องพักและบริการที่คุณเลือก
            </h3>

            {showRoomService && (
                <>
                    <RoomServiceForm
                        data={defaultRoomServiceData}
                        showDefaultData={true}
                        headers={roomServiceHeaders}
                        onDataChange={onRoomServiceChange}
                        onDeleteService={onDeleteRoomService}
                        onSubmit={onSubmit}
                        onRoomDetailsChange={onRoomDetailsChange}
                        subRoomDetailsData={subRoomDetailsData}
                        serviceType="room_service"
                    />
                    {(showSpecialService || showPetCareService) && (
                        <div className="border border-black mt-15 mb-8"></div>
                    )}
                </>
            )}

            {showSpecialService && (
                <>
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
                            onRoomDetailsChange={onSpecialServiceDetailsChange}
                            subRoomDetailsData={subRoomDetailsData}
                            serviceType="special_service"
                        />
                    </div>
                    {showPetCareService && (
                        <div className="border border-black mt-15 mb-8"></div>
                    )}
                </>
            )}

            {showPetCareService && (
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
                        onRoomDetailsChange={onPetCareServiceDetailsChange}
                        subRoomDetailsData={subRoomDetailsData}
                        serviceType="pet_care_service"
                    />
                </div>
            )}
        </div>
    );
}

