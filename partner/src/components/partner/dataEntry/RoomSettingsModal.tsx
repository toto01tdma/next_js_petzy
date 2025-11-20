'use client';

import { useState, useEffect, useRef } from 'react';
import { Modal, Input, Button, Upload } from 'antd';
import { DownOutlined, UpOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { API_BASE_URL } from '@/config/api';

const { TextArea } = Input;

// Interface for room detail row
export interface RoomDetailRow {
    id: number;
    code: string;
    name: string;
    openTime: string;
    closeTime: string;
    price: string;
    images?: string[]; // Array of image URLs
}

interface RoomSettingsModalProps {
    visible: boolean;
    roomType: string;
    roomQuantity: number;
    defaultOpenTime: string;
    defaultCloseTime: string;
    defaultPrice: string;
    existingRooms?: RoomDetailRow[];
    onClose: () => void;
    onSave: (rooms: RoomDetailRow[]) => void;
    hasApiData?: boolean; // Flag to indicate if API data exists (if false, don't generate defaults)
}

export default function RoomSettingsModal({
    visible,
    roomType,
    roomQuantity,
    defaultOpenTime,
    defaultCloseTime,
    defaultPrice,
    existingRooms = [],
    onClose,
    onSave,
    hasApiData = false
}: RoomSettingsModalProps) {
    const [roomDetails, setRoomDetails] = useState<RoomDetailRow[]>([]);
    const [isExpanded, setIsExpanded] = useState(true);
    const prevVisibleRef = useRef(false);
    const initializedRef = useRef(false);

    // Initialize room details when modal opens or when existingRooms changes
    useEffect(() => {
        // When modal becomes visible for the first time
        console.log('existingRooms', existingRooms);
        console.log('prevVisibleRef.current', prevVisibleRef.current);
        if (visible && !prevVisibleRef.current) {
            if (existingRooms && Array.isArray(existingRooms) && existingRooms.length > 0) {
                // Use existing rooms if available - create a deep copy to avoid reference issues
                console.log('📦 Using existingRooms from API:', existingRooms);
                setRoomDetails(existingRooms.map(room => ({ ...room })));
                initializedRef.current = true;
            } else if (hasApiData && existingRooms && Array.isArray(existingRooms) && existingRooms.length === 0) {
                // API data exists but is empty array - don't generate anything
                console.log('📭 API data exists but is empty - showing empty state');
                setRoomDetails([]);
                initializedRef.current = true;
            } else if (!hasApiData) {
                // No API data - generate rooms based on quantity (normal flow for new entries)
                console.log('🆕 Generating new rooms with defaults');
                const generatedRooms: RoomDetailRow[] = Array.from({ length: roomQuantity || 1 }, (_, i) => ({
                    id: i + 1,
                    code: `${roomType.substring(0, 2).toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
                    name: roomType,
                    openTime: defaultOpenTime || '00:00',
                    closeTime: defaultCloseTime || '00:00',
                    price: defaultPrice || '0',
                    images: []
                }));
                setRoomDetails(generatedRooms);
                initializedRef.current = true;
            } else {
                // Fallback: show empty if hasApiData is true but no existingRooms
                console.log('📭 No existing rooms and hasApiData is true - showing empty');
                setRoomDetails([]);
                initializedRef.current = true;
            }
        }
        
        // Update room details when existingRooms changes (e.g., after API loads)
        // This handles the case where API data arrives after modal opens
        if (visible && prevVisibleRef.current && existingRooms && Array.isArray(existingRooms) && existingRooms.length > 0) {
            // Check if current roomDetails are just defaults (by checking if all have same openTime/closeTime/price)
            const areDefaultValues = roomDetails.length > 0 && roomDetails.every(room => 
                room.openTime === defaultOpenTime && 
                room.closeTime === defaultCloseTime && 
                room.price === defaultPrice
            );
            
            // Update if we haven't initialized properly OR if current data is just defaults
            if (!initializedRef.current || roomDetails.length === 0 || areDefaultValues) {
                console.log('🔄 Updating with API data that arrived late:', existingRooms);
                setRoomDetails(existingRooms.map(room => ({ ...room })));
                initializedRef.current = true;
            }
        }
        
        // Reset when modal closes
        if (!visible && prevVisibleRef.current) {
            setRoomDetails([]);
            initializedRef.current = false;
        }
        
        prevVisibleRef.current = visible;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, existingRooms]); // Watch both visible and existingRooms

    const addRoom = (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        setRoomDetails(prev => {
            const newId = prev.length > 0
                ? Math.max(...prev.map(room => room.id)) + 1
                : 1;
            const newRoom: RoomDetailRow = {
                id: newId,
                code: `${roomType.substring(0, 2).toUpperCase()}-${String(newId).padStart(3, '0')}`,
                name: roomType,
                openTime: defaultOpenTime || '00:00',
                closeTime: defaultCloseTime || '00:00',
                price: defaultPrice || '0',
                images: []
            };
            return [...prev, newRoom];
        });
    };

    const updateRoom = (id: number, field: keyof RoomDetailRow, value: string) => {
        setRoomDetails(prev => prev.map(room =>
            room.id === id ? { ...room, [field]: value } : room
        ));
    };

    const deleteRoom = (id: number) => {
        setRoomDetails(prev => prev.filter(room => room.id !== id));
    };

    const handleSave = () => {
        onSave(roomDetails);
        onClose();
    };

    const handleCancel = () => {
        // Reset to original state
        if (existingRooms && existingRooms.length > 0) {
            setRoomDetails(existingRooms);
        } else if (hasApiData) {
            // If API data exists but is empty, reset to empty
            setRoomDetails([]);
        } else {
            // No API data - reset to generated defaults
            const generatedRooms: RoomDetailRow[] = Array.from({ length: roomQuantity || 1 }, (_, i) => ({
                id: i + 1,
                code: `${roomType.substring(0, 2).toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
                name: roomType,
                openTime: defaultOpenTime || '00:00',
                closeTime: defaultCloseTime || '00:00',
                price: defaultPrice || '0',
                images: []
            }));
            setRoomDetails(generatedRooms);
        }
        onClose();
    };

    return (
        <Modal
            title={
                <div className="flex items-center justify-between">
                    <span>ตั้งค่าห้องพัก: {roomType}</span>
                    <div
                        className="cursor-pointer"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? <UpOutlined /> : <DownOutlined />}
                    </div>
                </div>
            }
            open={visible}
            onCancel={handleCancel}
            width={900}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    ยกเลิก
                </Button>,
                <Button key="save" type="primary" onClick={handleSave} style={{ backgroundColor: '#0D263B' }}>
                    บันทึก
                </Button>
            ]}
        >
            <div className="mt-4">
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    <div className="space-y-4 pt-4">
                        {/* Header Row */}
                        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}>
                            <div className="bg-teal-500 px-4 py-2 rounded-lg flex items-center justify-between" style={{ color: '#FFFFFF' }}>
                                <span className="text-sm">รหัสห้องพัก</span>
                                <button
                                    type="button"
                                    className="border border-white rounded-lg px-2 py-0.5"
                                    onClick={addRoom}
                                    onMouseDown={(e) => e.preventDefault()}
                                >
                                    +
                                </button>
                            </div>
                            <div className="bg-teal-500 px-4 py-2 rounded-lg" style={{ color: '#FFFFFF' }}>
                                <span className="text-sm">รูปแบบห้องพัก</span>
                            </div>
                            <div className="bg-teal-500 px-4 py-2 rounded-lg" style={{ color: '#FFFFFF' }}>
                                <span className="text-sm">เวลาเปิด</span>
                            </div>
                            <div className="bg-teal-500 px-4 py-2 rounded-lg" style={{ color: '#FFFFFF' }}>
                                <span className="text-sm">เวลาปิด</span>
                            </div>
                            <div className="bg-teal-500 px-4 py-2 rounded-lg" style={{ color: '#FFFFFF' }}>
                                <span className="text-sm">ราคาที่กำหนด</span>
                            </div>
                        </div>

                        {/* Data Rows */}
                        {roomDetails.map((room) => {
                            const roomImages = room.images || [];
                            const getFullImageUrl = (url: string) => {
                                if (!url) return '';
                                if (url.startsWith('http://') || url.startsWith('https://')) return url;
                                return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
                            };

                            const handleImageUpload = async (file: File, roomId: number) => {
                                const token = localStorage.getItem('accessToken');
                                if (!token) return false;

                                try {
                                    const formData = new FormData();
                                    formData.append('images', file);

                                    const response = await fetch(`${API_BASE_URL}/api/upload/rooms`, {
                                        method: 'POST',
                                        headers: {
                                            'Authorization': `Bearer ${token}`
                                        },
                                        body: formData
                                    });

                                    const result = await response.json();
                                    if (result.success && result.data?.images && result.data.images.length > 0) {
                                        const uploadedImageUrl = result.data.images[0]; // Get first image from array
                                        const relativePath = uploadedImageUrl.startsWith('/uploads/') 
                                            ? uploadedImageUrl 
                                            : `/uploads/${uploadedImageUrl}`;
                                        
                                        setRoomDetails(prev => prev.map(r => 
                                            r.id === roomId 
                                                ? { ...r, images: [...(r.images || []), relativePath] }
                                                : r
                                        ));
                                        return false; // Prevent default upload
                                    }
                                } catch (error) {
                                    console.error('Error uploading image:', error);
                                }
                                return false;
                            };

                            const handleImageRemove = (roomId: number, imageIndex: number) => {
                                setRoomDetails(prev => prev.map(r => 
                                    r.id === roomId 
                                        ? { ...r, images: (r.images || []).filter((_, i) => i !== imageIndex) }
                                        : r
                                ));
                            };

                            const uploadProps: UploadProps = {
                                beforeUpload: (file) => {
                                    handleImageUpload(file, room.id);
                                    return false; // Prevent default upload
                                },
                                listType: 'picture-card',
                                maxCount: 10,
                                showUploadList: {
                                    showPreviewIcon: true,
                                    showRemoveIcon: true,
                                },
                            };

                            return (
                                <div key={room.id} className="space-y-2">
                                    <div className="grid gap-4 items-center" style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}>
                                        <div className="border rounded-lg px-2 py-2 text-center">
                                            <div className="flex justify-between items-center px-2">
                                                <Input
                                                    value={room.code}
                                                    onChange={(e) => updateRoom(room.id, 'code', e.target.value)}
                                                    placeholder="รหัส"
                                                    className="border-0 p-0 text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    className="text-red-500 ml-2"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        deleteRoom(room.id);
                                                    }}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                        <div className="border rounded-lg px-2 py-2 text-center">
                                            <TextArea
                                                value={room.name}
                                                onChange={(e) => updateRoom(room.id, 'name', e.target.value)}
                                                placeholder="ชื่อห้อง"
                                                className="border-0 p-0"
                                                autoSize={{ minRows: 1, maxRows: 3 }}
                                            />
                                        </div>
                                        <div className="border rounded-lg px-2 py-2 text-center">
                                            <Input
                                                type="time"
                                                value={room.openTime}
                                                onChange={(e) => updateRoom(room.id, 'openTime', e.target.value)}
                                                className="border-0 p-0 text-center text-sm"
                                            />
                                        </div>
                                        <div className="border rounded-lg px-2 py-2 text-center">
                                            <Input
                                                type="time"
                                                value={room.closeTime}
                                                onChange={(e) => updateRoom(room.id, 'closeTime', e.target.value)}
                                                className="border-0 p-0 text-center text-sm"
                                            />
                                        </div>
                                        <div className="border rounded-lg px-2 py-2 text-center">
                                            <Input
                                                type="text"
                                                value={room.price}
                                                onChange={(e) => updateRoom(room.id, 'price', e.target.value)}
                                                className="border-0 p-0 text-center text-sm"
                                                placeholder="ราคา"
                                                suffix="บาท"
                                            />
                                        </div>
                                    </div>
                                    {/* Image Upload Section for each room */}
                                    <div className="border rounded-lg p-4 bg-gray-50">
                                        <div className="text-sm font-semibold mb-2">อัพโหลดรูปภาพสำหรับห้อง: {room.code || room.name}</div>
                                        <Upload
                                            {...uploadProps}
                                            fileList={roomImages.map((url, index) => ({
                                                uid: `-${index}`,
                                                name: `image-${index + 1}.jpg`,
                                                status: 'done',
                                                url: getFullImageUrl(url),
                                            }))}
                                            onRemove={(file) => {
                                                const index = roomImages.findIndex((_, i) => 
                                                    getFullImageUrl(roomImages[i]) === file.url
                                                );
                                                if (index !== -1) {
                                                    handleImageRemove(room.id, index);
                                                }
                                            }}
                                        >
                                            {roomImages.length < 10 && (
                                                <div>
                                                    <PlusOutlined />
                                                    <div style={{ marginTop: 8 }}>อัพโหลด</div>
                                                </div>
                                            )}
                                        </Upload>
                                    </div>
                                </div>
                            );
                        })}

                        {roomDetails.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                ไม่มีห้องพัก กรุณาเพิ่มห้องพัก
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}

