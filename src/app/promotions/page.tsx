'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { MenuOutlined, EyeOutlined } from '@ant-design/icons';
import { Table } from 'antd';

export default function ManagePromotions() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Table columns
    const columns = [
        {
            title: 'ลำดับรายการ',
            dataIndex: 'id',
            key: 'id',
            render: (text: number) => `${text}.`,
        },
        {
            title: 'ประเภทห้องพัก',
            dataIndex: 'roomType',
            key: 'roomType',
        },
        {
            title: 'ราคาต่อวัน',
            dataIndex: 'dailyPrice',
            key: 'dailyPrice',
        },
        {
            title: 'ราคาต่อเดือน',
            dataIndex: 'monthlyPrice',
            key: 'monthlyPrice',
        },
        {
            title: 'ยอดเงินมัดจำ',
            dataIndex: 'deposit',
            key: 'deposit',
        },
        {
            title: 'วันที่เข้าร่วม',
            dataIndex: 'joinDate',
            key: 'joinDate',
        },
        {
            title: 'สถานะ',
            dataIndex: 'status',
            key: 'status',
        },
    ];

    // Sample data
    const data = [
        {
            key: '1',
            id: 1,
            roomType: 'ห้องเดี่ยวเตียง',
            dailyPrice: '100.- บาท',
            monthlyPrice: '1,000.-บาท',
            deposit: '900.-บาท',
            joinDate: '15.พ.ค.68',
            status: 'กำลังทำงาน',
        },
        {
            key: '2',
            id: 2,
            roomType: 'ห้องเดี่ยวเตียง',
            dailyPrice: '100.- บาท',
            monthlyPrice: '1,000.-บาท',
            deposit: '900.-บาท',
            joinDate: '15.พ.ค.68',
            status: 'กำลังทำงาน',
        },
        {
            key: '3',
            id: 3,
            roomType: 'ห้องเดี่ยวเตียง',
            dailyPrice: '100.- บาท',
            monthlyPrice: '1,000.-บาท',
            deposit: '900.-บาท',
            joinDate: '15.พ.ค.68',
            status: 'กำลังทำงาน',
        },
        {
            key: '4',
            id: 4,
            roomType: 'ห้องเดี่ยวเตียง',
            dailyPrice: '100.- บาท',
            monthlyPrice: '1,000.-บาท',
            deposit: '900.-บาท',
            joinDate: '15.พ.ค.68',
            status: 'กำลังทำงาน',
        },
        {
            key: '5',
            id: 5,
            roomType: 'ห้องเดี่ยวเตียง',
            dailyPrice: '100.- บาท',
            monthlyPrice: '1,000.-บาท',
            deposit: '900.-บาท',
            joinDate: '15.พ.ค.68',
            status: 'กำลังทำงาน',
        },
    ];

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
                            <h1 className="text-2xl font-semibold text-gray-800">จัดการโปรโมชันของคุณ</h1>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white relative">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-medium opacity-90">โปรโมชันส่วนลด</h3>
                                    <p className="text-3xl font-bold mt-2">5 รายการ</p>
                                    <p className="text-sm opacity-75">รายการที่คุณเข้าร่วม</p>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <EyeOutlined className="text-2xl" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white relative">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-medium opacity-90">โปรโมชันพิเศษ</h3>
                                    <p className="text-3xl font-bold mt-2">0 รายการ</p>
                                    <p className="text-sm opacity-75">ยังไม่มีโปรโมชันพิเศษ</p>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <EyeOutlined className="text-2xl" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">
                                รายการโปรโมชันที่เข้าร่วมรายการ
                            </h2>
                        </div>

                        <div className="overflow-x-auto">
                            <Table
                                columns={columns}
                                dataSource={data}
                                pagination={false}
                                className="w-full"
                                scroll={{ x: 1000 }}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
