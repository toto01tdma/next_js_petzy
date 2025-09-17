'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { MenuOutlined, CalendarOutlined, SearchOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Input, Select, Button, Table } from 'antd';

const { Option } = Select;

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Sample data for the table
    const columns = [
        {
            title: 'รหัสการจอง',
            dataIndex: 'bookingCode',
            key: 'bookingCode',
        },
        {
            title: 'ชื่อลูกค้า',
            dataIndex: 'customerName',
            key: 'customerName',
        },
        {
            title: 'ของราคา',
            dataIndex: 'price',
            key: 'price',
            render: (text: string) => <span className="text-red-500">{text}</span>,
        },
        {
            title: 'วงเงินใช้จ่าย',
            dataIndex: 'budget',
            key: 'budget',
        },
        {
            title: 'วันที่เข้าพัก',
            dataIndex: 'checkInDate',
            key: 'checkInDate',
        },
        {
            title: 'รายได้ต่อคืน',
            dataIndex: 'dailyIncome',
            key: 'dailyIncome',
        },
        {
            title: 'สถานะเงิน',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            render: (status: string) => (
                <span className={`px-2 py-1 rounded text-xs ${
                    status === 'รอดำเนินการ' ? 'bg-yellow-100 text-yellow-800' :
                    status === 'ชำระแล้ว' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                }`}>
                    {status}
                </span>
            ),
        },
        {
            title: 'อพเดทสถานะ',
            dataIndex: 'updateStatus',
            key: 'updateStatus',
            render: (status: string) => (
                <span className={`px-2 py-1 rounded text-xs ${
                    status === 'ชำระแล้ว' ? 'bg-green-100 text-green-800' :
                    status === 'รอชำระ' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                }`}>
                    {status}
                </span>
            ),
        },
        {
            title: 'รูปแบบการชำระ',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            render: (method: string) => (
                <span className={`px-2 py-1 rounded text-xs ${
                    method === 'โอนเงินออนไลน์' ? 'bg-blue-100 text-blue-800' :
                    method === 'สมาชิกสำคัญ' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                }`}>
                    {method}
                </span>
            ),
        },
        {
            title: 'ดูรายละเอียด',
            key: 'action',
            render: () => (
                <Button type="link" size="small">
                    👁️
                </Button>
            ),
        },
    ];

    const data = [
        {
            key: '1',
            bookingCode: 'S00053',
            customerName: 'สมชาย นิตยา',
            price: '500.-(promo)',
            budget: '11.30 น',
            checkInDate: '1/06/25-2/06/25',
            dailyIncome: '400บาท',
            paymentStatus: 'รอดำเนินการ',
            updateStatus: 'ชำระแล้ว',
            paymentMethod: 'โอนเงินออนไลน์',
        },
        {
            key: '2',
            bookingCode: 'S00053',
            customerName: 'สมชาย นิตยา',
            price: '500.-(promo)',
            budget: '11.30 น',
            checkInDate: '1/06/25-2/06/25',
            dailyIncome: '400บาท',
            paymentStatus: 'ชำระแล้ว',
            updateStatus: 'รอชำระ',
            paymentMethod: 'โอนเงินออนไลน์',
        },
        {
            key: '3',
            bookingCode: 'S00053',
            customerName: 'สมชาย นิตยา',
            price: '500.-(promo)',
            budget: '11.30 น',
            checkInDate: '1/06/25-2/06/25',
            dailyIncome: '400บาท',
            paymentStatus: 'ชำระแล้ว',
            updateStatus: 'สมาชิกสำคัญ',
            paymentMethod: 'สมาชิกสำคัญ',
        },
        {
            key: '4',
            bookingCode: 'S00053',
            customerName: 'สมชาย นิตยา',
            price: '500.-(promo)',
            budget: '11.30 น',
            checkInDate: '1/06/25-2/06/25',
            dailyIncome: '400บาท',
            paymentStatus: 'ชำระแล้ว',
            updateStatus: 'สมาชิกสำคัญ',
            paymentMethod: 'โอนเงินออนไลน์',
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
                            <h1 className="text-2xl font-semibold text-gray-800">Home</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <CalendarOutlined className="text-xl text-gray-600" />
                            <span className="text-gray-600">June 2025</span>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-auto p-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-medium opacity-90">ลูกค้าที่พักของคุณ</h3>
                                    <p className="text-3xl font-bold mt-2">24</p>
                                    <p className="text-sm opacity-75">คนที่ได้เข้าพัก</p>
                                </div>
                                <div className="text-4xl opacity-75">📋</div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-medium opacity-90">รายได้ที่พักของคุณ</h3>
                                    <p className="text-3xl font-bold mt-2">12,000.-</p>
                                    <p className="text-sm opacity-75">รายได้ต่อคืน</p>
                                    <div className="flex items-center mt-2">
                                        <span className="text-sm">33.1% ↗</span>
                                        <span className="text-xs ml-2 opacity-75">Since Last month</span>
                                    </div>
                                </div>
                                <div className="text-4xl opacity-75">✅</div>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">รายงานสำคัญประจำวัน</h2>
                            
                            {/* Filters */}
                            <div className="flex flex-wrap gap-4 items-center">
                                <div className="flex-1 min-w-64">
                                    <Input
                                        placeholder="ค้นหา..."
                                        prefix={<SearchOutlined />}
                                        className="w-full"
                                    />
                                </div>
                                <Select defaultValue="ค้นหาจากชื่อ" className="w-40">
                                    <Option value="name">ค้นหาจากชื่อ</Option>
                                    <Option value="code">รหัสการจอง</Option>
                                </Select>
                                <Select defaultValue="ค้นหาสถานะ" className="w-40">
                                    <Option value="all">ค้นหาสถานะ</Option>
                                    <Option value="pending">รอดำเนินการ</Option>
                                    <Option value="paid">ชำระแล้ว</Option>
                                </Select>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <Table
                                columns={columns}
                                dataSource={data}
                                pagination={false}
                                className="w-full"
                                scroll={{ x: 1200 }}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
