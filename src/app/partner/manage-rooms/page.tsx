'use client';

import { useState } from 'react';
import Sidebar from '@/components/partner/shared/Sidebar';
import { MenuOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import DataTable from '@/components/partner/shared/DataTable';

export default function ManageRooms() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingRowId, setEditingRowId] = useState<string | null>(null);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Room data
    const rooms = [
        {
            id: 'PZ1',
            title: 'รายการห้องพักทั้งหมดของคุณ',
            subtitle: '10 ห้อง',
            color: '#1F4173',
            icon: '👁️'
        },
        {
            id: 'PZ2',
            title: 'บริการรับฝากสัตว์เลี้ยงของคุณ',
            subtitle: '3 บริการ',
            color: '#484848',
            icon: '👁️'
        },
        {
            id: 'PZ3',
            title: 'บริการสปาสัตว์เลี้ยง',
            subtitle: '3 บริการ',
            color: '#484848',
            icon: '👁️'
        }
    ];

    // Sample room details
    const roomDetails = [
        {
            key: '1',
            id: 1,
            roomCode: 'PZ01-001',
            roomType: 'ห้องเดี่ยวเตียง',
            dailyRate: '100.- บาท',
            monthlyRate: '1,000.-บาท',
            deposit: '900.-บาท',
            status: 'ว่าง'
        }
    ];

    // Table columns configuration
    const roomTableColumns = [
        {
            key: 'itemOrder',
            title: 'ลำดับรายการ',
            dataIndex: 'id',
            render: (value: number) => `${value}.`
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
            dataIndex: 'dailyRate'
        },
        {
            key: 'yourOfferedPrice',
            title: 'ราคาที่คุณเสนอ',
            dataIndex: 'monthlyRate'
        },
        {
            key: 'actualReceived',
            title: 'ยอดรับเงินจริง',
            dataIndex: 'deposit'
        },
        {
            key: 'status',
            title: 'สถานะ',
            dataIndex: 'status',
            render: (value: string) => (
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                    {value}
                </span>
            )
        },
        {
            key: 'edit',
            title: 'แก้ไข',
            dataIndex: 'action',
            render: (value: string, record: { key: string; [key: string]: unknown }) => (
                <div className="flex items-center justify-center">
                    <Pencil
                        className="w-5 h-5 text-blue-600 cursor-pointer hover:text-blue-800"
                        onClick={() => {
                            setEditingRowId(record.key);
                            setEditMode(true);
                        }}
                    />
                </div>
            )
        }
    ];


    const [isOpen, setIsOpen] = useState(true);
    const [selectedDate, setSelectedDate] = useState(7);

    const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

    const [price] = useState("900");
    const [newPrice, setNewPrice] = useState("900");
    const [roomCode] = useState("SBI-001");
    const [newRoomCode, setNewRoomCode] = useState("SBI-001");

    const handleUpdate = () => {
        alert(`✅ อัปเดตข้อมูลแล้ว!
  ราคาใหม่: ${newPrice}
  รหัสห้องพักใหม่: ${newRoomCode}`);
    };

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
                            >
                                <span className="font-bold text-lg" style={{ color: '#FFFFFF' }}>สร้างบริการของคุณเพิ่มเติม</span>
                                <PlusOutlined style={{ color: 'white' }} />
                            </Button>
                        </div>
                        <div className="w-full border-1 border-black rounded-lg mb-6 mt-1"></div>

                        {/* Room Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {rooms.map((room) => (
                                <div
                                    key={room.id}
                                    className="rounded-2xl px-6 pt-6 pb-0 relative flex items-center justify-center"
                                    style={{ backgroundColor: room.color, color: '#FFFFFF' }}
                                >
                                    {/* ไอคอนขวาบน */}
                                    <div className="absolute top-4 right-4">
                                        <EyeOutlined className="text-2xl" />
                                    </div>

                                    {/* เนื้อหาตรงกลาง */}
                                    <div className="text-center mt-4">
                                        <p className="text-lg font-medium mb-2" style={{ marginBottom: '0.25rem' }}>{room.title}</p>
                                        <p className="text-2xl">{room.subtitle}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Room Details Section */}
                    <div className="rounded-xl shadow-md mb-8 border-1 border-gray-200" style={{ backgroundColor: '#FFFFFF' }}>
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-800">
                                รายการห้องพักทั้งหมดของคุณ 10 ห้อง
                            </h3>
                        </div>

                        {/* Room Details Table */}
                        <div className="">
                            <DataTable
                                columns={roomTableColumns}
                                data={roomDetails}
                            />
                        </div>
                    </div>

                    {/* Bottom Section with Room Management and Calendar - Only show when editing a specific row */}
                    {editMode && editingRowId && (
                        <div className="flex justify-between w-full border-b">
                            <div className="flex-[1] min-h-screen flex flex-col items-center justify-start py-6 px-0" style={{ backgroundColor: '#FFFFFF' }}>
                                {/* Header */}
                                <div className="flex flex-col gap-4 w-full max-w-md">
                                    {/* Room Code */}
                                    <div className="flex justify-between items-center">
                                        <div className="px-4 py-2 bg-yellow-400 rounded-md font-bold" style={{ color: '#FFFFFF' }}>
                                            <span>รหัสห้องพัก</span> <span className="text-black">{roomDetails.find(room => room.key === editingRowId)?.roomCode || 'SBI-001'}</span>
                                        </div>
                                        {/* Toggle */}
                                        <div className="flex items-center gap-2">
                                            <span className={`${!isOpen ? "text-black" : "text-gray-400"}`}>ปิด</span>
                                            <div
                                                className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition ${isOpen ? "bg-green-500" : "bg-gray-300"
                                                    }`}
                                                onClick={() => setIsOpen(!isOpen)}
                                            >
                                                <div
                                                    className={`w-6 h-6 rounded-full shadow-md transform transition ${isOpen ? "translate-x-6" : "translate-x-0"
                                                        }`}
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
                                        {daysInMonth.map((day) => (
                                            <button
                                                key={day}
                                                className={`py-2 rounded-full ${selectedDate === day ? "bg-green-200 text-green-800 font-bold" : "hover:bg-gray-100"
                                                    }`}
                                                onClick={() => setSelectedDate(day)}
                                            >
                                                {day}
                                            </button>
                                        ))}
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
                                            value={price}
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
                                            value={roomCode}
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
                                        className="bg-yellow-400 font-bold px-6 py-3 rounded-xl shadow"
                                    >
                                        <span style={{ color: '#FFFFFF' }}>อัพเดทข้อมูล</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditMode(false);
                                            setEditingRowId(null);
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
        </div>
    );
}
