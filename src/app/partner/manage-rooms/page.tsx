'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/partner/shared/Sidebar';
import { MenuOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import DataTable from '@/components/partner/shared/DataTable';
import Swal from 'sweetalert2';
import { API_BASE_URL, USE_API_MODE } from '@/config/api';
import { useApprovalStatus } from '@/hooks/useApprovalStatus';
import ApprovalModal from '@/components/partner/shared/ApprovalModal';
import { checkAuthError } from '@/utils/api';

interface RoomSummary {
    id: string;
    type: string;
    title: string;
    count: number;
    countLabel: string;
    color: string;
    icon: string;
}

interface RoomDetail {
    [key: string]: unknown;
    key: string;
    id: string;
    roomCode: string;
    roomType: string;
    pricing: {
        dailyRate: number;
        monthlyRate?: number;
        deposit?: number;
        discountRate?: number;
        actualReceived: number;
        currency: string;
    };
    status: string;
    statusLabel: string;
    isOpen: boolean;
    schedule?: {
        availableDays: number[];
        openTime: string;
        closeTime: string;
        unavailableDates?: string[];
        timezone?: string;
    };
}

export default function ManageRooms() {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
    
    // Approval status check
    const { isApproved, isLoading: isLoadingApproval } = useApprovalStatus();
    
    // API Data
    const [roomSummary, setRoomSummary] = useState<RoomSummary[]>([]);
    const [roomDetails, setRoomDetails] = useState<RoomDetail[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingDetails, setIsFetchingDetails] = useState(false);
    
    // Edit Form State
    const [selectedRoom, setSelectedRoom] = useState<RoomDetail | null>(null);
    const [newPrice, setNewPrice] = useState('');
    const [newRoomCode, setNewRoomCode] = useState('');
    const [isOpen, setIsOpen] = useState(true);
    const [selectedDate, setSelectedDate] = useState(7);
    const [unavailableDates, setUnavailableDates] = useState<string[]>([]);

    const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }
        
        fetchRoomSummary();
        fetchRoomDetails();
    }, [router]);

    const fetchRoomSummary = async () => {
        try {
            if (!USE_API_MODE) {
                // Mock data
                setRoomSummary([
                    { id: 'PZ1', type: 'ROOM', title: 'รายการห้องพักทั้งหมดของคุณ', count: 10, countLabel: 'ห้อง', color: '#1F4173', icon: 'eye' },
                    { id: 'PZ2', type: 'BOARDING', title: 'บริการรับฝากสัตว์เลี้ยงของคุณ', count: 3, countLabel: 'บริการ', color: '#484848', icon: 'eye' },
                    { id: 'PZ3', type: 'SPA', title: 'บริการสปาสัตว์เลี้ยง', count: 3, countLabel: 'บริการ', color: '#484848', icon: 'eye' }
                ]);
                return;
            }

            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/api/partner/rooms/summary`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            // Check for authentication error
            if (checkAuthError(response, result)) {
                return;
            }

            if (result.success) {
                setRoomSummary(result.data.accommodation || []);
            }
        } catch (error) {
            console.error('Error fetching room summary:', error);
        }
    };

    const fetchRoomDetails = async () => {
        setIsFetchingDetails(true);
        try {
            if (!USE_API_MODE) {
                // Mock data
                setRoomDetails([
                    {
                        key: '1',
                        id: 'room-1',
                        roomCode: 'PZ01-001',
                        roomType: 'ห้องเดี่ยวเตียง',
                        pricing: {
                            dailyRate: 100,
                            monthlyRate: 1000,
                            deposit: 900,
                            discountRate: 10,
                            actualReceived: 90,
                            currency: 'THB'
                        },
                        status: 'AVAILABLE',
                        statusLabel: 'ว่าง',
                        isOpen: true
                    }
                ]);
                setIsFetchingDetails(false);
                return;
            }

            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/api/partner/rooms`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            // Check for authentication error
            if (checkAuthError(response, result)) {
                return;
            }

            if (result.success) {
                const formatted = result.data.map((room: RoomDetail, index: number) => ({
                    ...room,
                    key: room.id || `${index + 1}`
                }));
                setRoomDetails(formatted);
            }
        } catch (error) {
            console.error('Error fetching room details:', error);
        } finally {
            setIsFetchingDetails(false);
        }
    };

    const handleEditRoom = async (roomId: string) => {
        setEditingRoomId(roomId);
        
        try {
            if (!USE_API_MODE) {
                const room = roomDetails.find(r => r.key === roomId);
                if (room) {
                    setSelectedRoom(room);
                    setNewPrice(room.pricing.dailyRate.toString());
                    setNewRoomCode(room.roomCode);
                    setIsOpen(room.isOpen);
                    setEditMode(true);
                }
                return;
            }

            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/api/partner/rooms/${roomId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            // Check for authentication error
            if (checkAuthError(response, result)) {
                return;
            }

            if (result.success) {
                setSelectedRoom(result.data);
                setNewPrice(result.data.pricing.dailyRate.toString());
                setNewRoomCode(result.data.roomCode);
                setIsOpen(result.data.isOpen);
                setUnavailableDates(result.data.schedule?.unavailableDates || []);
                setEditMode(true);
            }
        } catch (error) {
            console.error('Error fetching room:', error);
            await Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถโหลดข้อมูลห้องได้',
                confirmButtonColor: '#0D263B'
            });
        }
    };

    const handleUpdate = async () => {
        if (!selectedRoom) return;

        setIsLoading(true);
        try {
            if (!USE_API_MODE) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                await Swal.fire({
                    icon: 'success',
                    title: 'อัปเดตสำเร็จ',
                    text: `ราคาใหม่: ${newPrice} บาท\nรหัสห้องพัก: ${newRoomCode}`,
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true
                });
                setEditMode(false);
                fetchRoomDetails();
                return;
            }

            const token = localStorage.getItem('accessToken');
            const updatePayload: Record<string, unknown> = {};
            
            if (newRoomCode !== selectedRoom.roomCode) {
                updatePayload.roomCode = newRoomCode;
            }
            if (parseFloat(newPrice) !== selectedRoom.pricing.dailyRate) {
                updatePayload.pricing = {
                    dailyRate: parseFloat(newPrice)
                };
            }
            if (isOpen !== selectedRoom.isOpen) {
                updatePayload.isOpen = isOpen;
            }

            const response = await fetch(`${API_BASE_URL}/api/partner/rooms/${selectedRoom.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatePayload)
            });

            const result = await response.json();

            // Check for authentication error
            if (checkAuthError(response, result)) {
                return;
            }

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Failed to update room');
            }

            await Swal.fire({
                icon: 'success',
                title: 'อัปเดตสำเร็จ',
                text: 'อัปเดตข้อมูลห้องพักสำเร็จ',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true
            });

            setEditMode(false);
            fetchRoomDetails();
            fetchRoomSummary();
        } catch (error) {
            console.error('Error updating room:', error);
            await Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: error instanceof Error ? error.message : 'ไม่สามารถอัปเดตข้อมูลได้',
                confirmButtonColor: '#0D263B'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleDateAvailability = async (date: number) => {
        if (!selectedRoom) return;

        const dateStr = `2025-06-${date.toString().padStart(2, '0')}`;
        const newUnavailable = unavailableDates.includes(dateStr)
            ? unavailableDates.filter(d => d !== dateStr)
            : [...unavailableDates, dateStr];

        setUnavailableDates(newUnavailable);

        // Update schedule on API
        if (USE_API_MODE) {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await fetch(`${API_BASE_URL}/api/partner/rooms/${selectedRoom.id}/schedule`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        unavailableDates: newUnavailable
                    })
                });

                const result = await response.json();

                // Check for authentication error
                if (checkAuthError(response, result)) {
                    return;
                }
            } catch (error) {
                console.error('Error updating schedule:', error);
            }
        }
    };

    const roomTableColumns = [
        {
            key: 'itemOrder',
            title: 'ลำดับรายการ',
            dataIndex: 'id',
            render: (value: unknown, record: RoomDetail) => {
                const index = roomDetails.findIndex(r => r.key === record.key);
                return `${index + 1}.`;
            }
        },
        {
            key: 'roomCode',
            title: 'รหัสห้องพัก',
            dataIndex: 'roomCode'
        },
        {
            key: 'roomType',
            title: 'ประเภทห้องพัก',
            dataIndex: 'roomType'
        },
        {
            key: 'discountPrice',
            title: 'ราคาส่วนลด',
            dataIndex: 'pricing',
            render: (pricing: unknown) => {
                const p = pricing as RoomDetail['pricing'];
                return `${p.dailyRate}.- บาท`;
            }
        },
        {
            key: 'yourOfferedPrice',
            title: 'ราคาที่คุณเสนอ',
            dataIndex: 'pricing',
            render: (pricing: unknown) => {
                const p = pricing as RoomDetail['pricing'];
                return `${p.monthlyRate || p.dailyRate}.-บาท`;
            }
        },
        {
            key: 'actualReceived',
            title: 'ยอดรับเงินจริง',
            dataIndex: 'pricing',
            render: (pricing: unknown) => {
                const p = pricing as RoomDetail['pricing'];
                return `${p.actualReceived}.-บาท`;
            }
        },
        {
            key: 'status',
            title: 'สถานะ',
            dataIndex: 'statusLabel',
            render: (value: unknown) => (
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                    {value as string}
                </span>
            )
        },
        {
            key: 'edit',
            title: 'แก้ไข',
            dataIndex: 'action',
            render: (_value: unknown, record: unknown) => {
                const room = record as RoomDetail;
                return (
                    <div className="flex items-center justify-center">
                        <Pencil
                            className="w-5 h-5 text-blue-600 cursor-pointer hover:text-blue-800"
                            onClick={() => handleEditRoom(room.id)}
                        />
                    </div>
                );
            }
        }
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="shadow-sm border-gray-200 px-6 py-4" style={{ backgroundColor: '#FFFFFF' }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleSidebar}
                                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                            >
                                <MenuOutlined className="text-xl" />
                            </button>
                            <h1 className="text-2xl font-semibold text-gray-800">จัดการห้องพักของคุณ</h1>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-6" style={{ backgroundColor: '#FFFFFF' }}>
                    {/* Section Title */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-semibold text-gray-800 px-2" style={{ marginBottom: '0px' }}>
                                รายการห้องพักและบริการกับหมดของคุณ
                            </h2>
                            <Button
                                size="large"
                                className="bg-teal-500 hover:bg-teal-600 border-teal-500"
                                style={{ backgroundColor: '#00B6AA' }}
                                onClick={() => router.push('/partner/create-service')}
                            >
                                <span className="font-bold text-lg" style={{ color: '#FFFFFF' }}>สร้างบริการของคุณเพิ่มเติม</span>
                                <PlusOutlined style={{ color: 'white' }} />
                            </Button>
                        </div>
                        <div className="w-full border-1 border-black rounded-lg mb-6 mt-1"></div>

                        {/* Room Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {roomSummary.map((room) => (
                                <div
                                    key={room.id}
                                    className="rounded-2xl px-6 pt-6 pb-0 relative flex items-center justify-center"
                                    style={{ backgroundColor: room.color, color: '#FFFFFF' }}
                                >
                                    <div className="absolute top-4 right-4">
                                        <EyeOutlined className="text-2xl" />
                                    </div>
                                    <div className="text-center mt-4">
                                        <p className="text-lg font-medium mb-2" style={{ marginBottom: '0.25rem' }}>{room.title}</p>
                                        <p className="text-2xl">{room.count} {room.countLabel}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Room Details Section */}
                    <div className="rounded-xl shadow-md mb-8 border-1 border-gray-200" style={{ backgroundColor: '#FFFFFF' }}>
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-800">
                                รายการห้องพักทั้งหมดของคุณ {roomDetails.length} ห้อง
                            </h3>
                        </div>

                        {/* Room Details Table */}
                        <div className="">
                            {isFetchingDetails ? (
                                <div className="flex justify-center items-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                </div>
                            ) : (
                                <DataTable
                                    columns={roomTableColumns}
                                    data={roomDetails}
                                />
                            )}
                        </div>
                    </div>

                    {/* Bottom Section with Room Management and Calendar */}
                    {editMode && editingRoomId && selectedRoom && (
                        <div className="flex justify-between w-full border-b">
                            <div className="flex-[1] min-h-screen flex flex-col items-center justify-start py-6 px-0" style={{ backgroundColor: '#FFFFFF' }}>
                                {/* Header */}
                                <div className="flex flex-col gap-4 w-full max-w-md">
                                    {/* Room Code */}
                                    <div className="flex justify-between items-center">
                                        <div className="px-4 py-2 bg-yellow-400 rounded-md font-bold" style={{ color: '#FFFFFF' }}>
                                            <span>รหัสห้องพัก</span> <span className="text-black">{selectedRoom.roomCode}</span>
                                        </div>
                                        {/* Toggle */}
                                        <div className="flex items-center gap-2">
                                            <span className={`${!isOpen ? "text-black" : "text-gray-400"}`}>ปิด</span>
                                            <div
                                                className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition ${isOpen ? "bg-green-500" : "bg-gray-300"}`}
                                                onClick={() => setIsOpen(!isOpen)}
                                            >
                                                <div
                                                    className={`w-6 h-6 rounded-full shadow-md transform transition ${isOpen ? "translate-x-6" : "translate-x-0"}`}
                                                    style={{ backgroundColor: '#FFFFFF' }}
                                                />
                                            </div>
                                            <span className={`${isOpen ? "text-black" : "text-gray-400"}`}>เปิด</span>
                                        </div>
                                    </div>

                                    {/* Set Time Button */}
                                    <button className="bg-teal-500 py-2 rounded-md font-bold">
                                        <span style={{ color: '#FFFFFF' }}>กำหนด วันเวลา ให้บริการ</span>
                                    </button>
                                </div>

                                {/* Calendar */}
                                <div className="mt-6 w-full max-w-md">
                                    <div className="flex justify-between items-center px-2">
                                        <button>
                                            <ChevronLeft />
                                        </button>
                                        <h2 className="font-bold text-lg">June 2025</h2>
                                        <button>
                                            <ChevronRight />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-7 gap-2 mt-4 text-center font-medium text-gray-500">
                                        <span>Sun</span>
                                        <span>Mon</span>
                                        <span>Tue</span>
                                        <span>Wed</span>
                                        <span>Thu</span>
                                        <span>Fri</span>
                                        <span>Sat</span>
                                    </div>
                                    <div className="grid grid-cols-7 gap-2 mt-2 text-center">
                                        {/* Blank before 1st June */}
                                        <span></span><span></span>
                                        {daysInMonth.map((day) => {
                                            const dateStr = `2025-06-${day.toString().padStart(2, '0')}`;
                                            const isUnavailable = unavailableDates.includes(dateStr);
                                            return (
                                                <button
                                                    key={day}
                                                    className={`py-2 rounded-full ${
                                                        selectedDate === day ? "bg-green-200 text-green-800 font-bold" : 
                                                        isUnavailable ? "bg-red-200 text-red-800 line-through" :
                                                        "hover:bg-gray-100"
                                                    }`}
                                                    onClick={() => {
                                                        setSelectedDate(day);
                                                        handleToggleDateAvailability(day);
                                                    }}
                                                >
                                                    {day}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="flex-[1] min-h-screen flex flex-col items-center justify-start p-6 space-y-10" style={{ backgroundColor: '#FFFFFF' }}>
                                {/* Grid Form */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                                    {/* ราคาที่กำหนด */}
                                    <div>
                                        <div className="bg-teal-500 text-center font-bold rounded-md py-2 mb-3" style={{ color: '#FFFFFF' }}>
                                            ราคาที่กำหนด
                                        </div>
                                        <input
                                            type="text"
                                            value={selectedRoom.pricing.dailyRate}
                                            readOnly
                                            className="w-full border border-gray-400 rounded-md px-3 py-2 mt-2 text-center"
                                        />
                                    </div>

                                    {/* กำหนดราคาใหม่ */}
                                    <div>
                                        <div className="bg-teal-500 text-center font-bold rounded-md py-2 mb-3" style={{ color: '#FFFFFF' }}>
                                            กำหนดราคาใหม่
                                        </div>
                                        <div className="relative mt-2">
                                            <input
                                                type="text"
                                                value={newPrice}
                                                onChange={(e) => setNewPrice(e.target.value)}
                                                className="w-full border border-gray-400 rounded-md px-3 py-2 pr-8 text-center"
                                            />
                                            <Pencil className="absolute right-2 top-2.5 w-5 h-5 text-gray-500" />
                                        </div>
                                    </div>

                                    {/* รหัสห้องพัก */}
                                    <div>
                                        <div className="bg-teal-500 text-center font-bold rounded-md py-2 mb-3" style={{ color: '#FFFFFF' }}>
                                            รหัสห้องพัก
                                        </div>
                                        <input
                                            type="text"
                                            value={selectedRoom.roomCode}
                                            readOnly
                                            className="w-full border border-gray-400 rounded-md px-3 py-2 mt-2 text-center"
                                        />
                                    </div>

                                    {/* เปลี่ยนรหัสห้องพัก */}
                                    <div>
                                        <div className="bg-teal-500 text-center font-bold rounded-md py-2 mb-3" style={{ color: '#FFFFFF' }}>
                                            เปลี่ยนรหัสห้องพัก
                                        </div>
                                        <div className="relative mt-2">
                                            <input
                                                type="text"
                                                value={newRoomCode}
                                                onChange={(e) => setNewRoomCode(e.target.value)}
                                                className="w-full border border-gray-400 rounded-md px-3 py-2 pr-8 text-center"
                                            />
                                            <Pencil className="absolute right-2 top-2.5 w-5 h-5 text-gray-500" />
                                        </div>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-4 mt-10 justify-end">
                                    <button
                                        onClick={handleUpdate}
                                        disabled={isLoading}
                                        className="bg-yellow-400 font-bold px-6 py-3 rounded-xl shadow disabled:opacity-50"
                                    >
                                        <span style={{ color: '#FFFFFF' }}>
                                            {isLoading ? 'กำลังอัปเดท...' : 'อัพเดทข้อมูล'}
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditMode(false);
                                            setEditingRoomId(null);
                                        }}
                                        className="bg-gray-800 font-bold px-6 py-3 rounded-xl shadow"
                                    >
                                        <span style={{ color: '#FFFFFF' }}>ปิดหน้าต่างนี้</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
            
            {/* Approval Status Modal */}
            <ApprovalModal isOpen={!isLoadingApproval && !isApproved} />
        </div>
    );
}
