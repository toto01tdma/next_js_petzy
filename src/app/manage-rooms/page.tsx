'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { MenuOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Input, Calendar, Badge } from 'antd';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';

export default function ManageRooms() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Room data
    const rooms = [
        {
            id: 'PZ1',
            title: 'รายการห้องพักกับหมดของคุณ',
            subtitle: '10 ห้อง',
            color: 'bg-blue-600',
            icon: '👁️'
        },
        {
            id: 'PZ2',
            title: 'บริการรับฝากสัตว์เลี้ยงของคุณ',
            subtitle: '3 บริการ',
            color: 'bg-gray-600',
            icon: '👁️'
        },
        {
            id: 'PZ3',
            title: 'บริการสปาสัตว์เลี้ยง',
            subtitle: '3 บริการ',
            color: 'bg-gray-600',
            icon: '👁️'
        }
    ];

    // Sample room details
    const roomDetails = [
        {
            id: 1,
            roomCode: 'PZ01-001',
            roomType: 'ห้องเดี่ยวเตียง',
            dailyRate: '100.- บาท',
            monthlyRate: '1,000.-บาท',
            deposit: '900.-บาท',
            status: 'ว่าง'
        }
    ];

    // Calendar event data
    const getListData = (value: Dayjs) => {
        let listData;
        switch (value.date()) {
            case 7:
                listData = [
                    { type: 'success', content: 'Available' },
                ];
                break;
            default:
        }
        return listData || [];
    };

    const dateCellRender: CalendarProps<Dayjs>['dateCellRender'] = (value) => {
        const listData = getListData(value);
        return (
            <ul className="events">
                {listData.map((item) => (
                    <li key={item.content}>
                        <Badge status={item.type as any} text={item.content} />
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
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
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />}
                            className="bg-teal-500 hover:bg-teal-600 border-teal-500"
                        >
                            สร้างบริการของคุณเพิ่มเติม
                        </Button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-6">
                    {/* Section Title */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            รายการห้องพักและบริการกับหมดของคุณ
                        </h2>

                        {/* Room Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {rooms.map((room) => (
                                <div key={room.id} className={`${room.color} rounded-2xl p-6 text-white relative`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium mb-2">{room.title}</h3>
                                            <p className="text-2xl font-bold">{room.subtitle}</p>
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            <EyeOutlined className="text-2xl" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Room Details Section */}
                    <div className="bg-white rounded-lg shadow-sm mb-8">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">
                                รายการห้องพักกับหมดของคุณ 10 ห้อง
                            </h3>
                        </div>

                        {/* Room Details Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ลำดับรายการ
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            รหัสห้องพัก
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ประเภทห้องพัก
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ราคาต่อวัน
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ราคาต่อเดือน
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ยอดเงินมัดจำ
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            สถานะ
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ยกเลิกจองเดอร์
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {roomDetails.map((room) => (
                                        <tr key={room.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {room.id}.
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {room.roomCode}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {room.roomType}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {room.dailyRate}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {room.monthlyRate}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {room.deposit}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                                    {room.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Button size="small" icon={<EyeOutlined />} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bottom Section with Room Management and Calendar */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Room Management Section */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="space-y-4">
                                {/* Room Code Input */}
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-400">
                                            รหัสห้องพัก
                                        </Button>
                                    </div>
                                    <div className="flex-1">
                                        <Input placeholder="SB1-001" className="w-full" />
                                    </div>
                                </div>

                                {/* Room Management Button */}
                                <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white border-teal-500">
                                    กำหนด วันเวลา ให้บริการ
                                </Button>

                                {/* Price Inputs */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Button className="w-full mb-2 bg-teal-500 hover:bg-teal-600 text-white border-teal-500">
                                            ราคาต่อหมด
                                        </Button>
                                        <Input placeholder="900" className="w-full" />
                                    </div>
                                    <div>
                                        <Button className="w-full mb-2 bg-teal-500 hover:bg-teal-600 text-white border-teal-500">
                                            กำหนดราคาใหม่
                                        </Button>
                                        <Input placeholder="900" className="w-full" />
                                    </div>
                                </div>

                                {/* Room Code and Update Buttons */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Button className="w-full mb-2 bg-teal-500 hover:bg-teal-600 text-white border-teal-500">
                                            รหัสห้องพัก
                                        </Button>
                                        <Input placeholder="SB1-001" className="w-full" />
                                    </div>
                                    <div>
                                        <Button className="w-full mb-2 bg-teal-500 hover:bg-teal-600 text-white border-teal-500">
                                            เปลี่ยนรหัสห้องพัก
                                        </Button>
                                        <Input placeholder="SB1-001" className="w-full" />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-4">
                                    <Button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-400">
                                        อัพเดทข้อมูล
                                    </Button>
                                    <Button className="flex-1 bg-gray-800 hover:bg-gray-900 text-white border-gray-800">
                                        ปิดหน้าต่าง
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Calendar Section */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <Calendar 
                                dateCellRender={dateCellRender}
                                className="custom-calendar"
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
