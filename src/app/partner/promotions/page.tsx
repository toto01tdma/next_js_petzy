'use client';

import { useState } from 'react';
import Sidebar from '@/components/partner/shared/Sidebar';
import { MenuOutlined, HomeOutlined, CheckCircleOutlined } from '@ant-design/icons';
import DataTable from '@/components/partner/shared/DataTable';

export default function ManagePromotions() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Promotions table columns configuration
    const promotionsColumns = [
        {
            title: 'ลำดับรายการ',
            dataIndex: 'id',
            key: 'itemOrder',
            render: (text: number) => `${text}.`,
        },
        {
            title: 'ประเภทห้องพัก',
            dataIndex: 'roomType',
            key: 'roomType',
        },
        {
            title: 'ราคาส่วนลด',
            dataIndex: 'dailyPrice',
            key: 'discountPrice',
        },
        {
            title: 'ราคาที่คุณเสนอ',
            dataIndex: 'monthlyPrice',
            key: 'yourOfferedPrice',
        },
        {
            title: 'ยอดรับเงินจริง',
            dataIndex: 'deposit',
            key: 'actualReceived',
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
                <header className="bg-gradient-to-r from-[#C6CEDE] to-[#FFFFFF] shadow-sm border-b border-gray-200 px-6 py-4">
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
                <main className="flex-1 overflow-auto p-6 bg-white">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gradient-to-r from-[#0097EC] to-[#003AD2] rounded-2xl p-6 text-white">
                            <div className="">
                                <div>
                                    <div className="flex items-center justify-between w-full">
                                        <h3 className="text-lg font-medium opacity-90">โปรโมชันส่วนลด</h3>
                                        <HomeOutlined className='text-3xl' />
                                    </div>
                                    <div className="flex">
                                        <p className="text-5xl mx-2" style={{ marginBottom: '0.5rem' }}>5</p>
                                        <p className="text-5xl mx-2" style={{ marginBottom: '0rem' }}>รายการ</p>
                                    </div>
                                    <p className="text-sm" style={{ marginBottom: '0rem' }}>รายการที่คุณเข้าร่วม</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-[#1FD071] to-[#00A843] rounded-2xl p-6 text-white">
                            <div className="">
                                <div>
                                    <div className="flex items-center justify-between w-full">
                                        <h3 className="text-lg font-medium opacity-90">โปรโมชันพิเศษ</h3>
                                        <CheckCircleOutlined className='text-3xl' />
                                    </div>
                                    <div className="flex">
                                        <p className="text-5xl mx-2" style={{ marginBottom: '0.5rem' }}>0</p>
                                        <p className="text-5xl mx-2" style={{ marginBottom: '0rem' }}>รายการ</p>
                                    </div>
                                    <p className="text-sm" style={{ marginBottom: '0rem' }}>ยังไม่มีโปรโมชันพิเศษ</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="">
                        <div className="py-3 px-2 border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                รายการโปรโมชันที่เข้าร่วมรายการ
                            </h2>
                        </div>

                        <div className="">
                            <DataTable
                                columns={promotionsColumns}
                                data={data}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
