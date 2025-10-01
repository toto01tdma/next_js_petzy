'use client';

import { useState } from 'react';
import Sidebar from '@/components/partner/shared/Sidebar';
import { MenuOutlined, CalendarOutlined, SearchOutlined, CheckCircleOutlined, HomeOutlined } from '@ant-design/icons';
import { Input, Select, Button } from 'antd';
import DataTable from '@/components/partner/shared/DataTable';

const { Option } = Select;

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Dashboard table columns configuration
    const dashboardColumns = [
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
            title: 'ยอดราคา',
            dataIndex: 'price',
            key: 'totalPrice',
            render: (text: string) => <span className="text-red-500">{text}</span>,
        },
        {
            title: 'เวลาในการจอง',
            dataIndex: 'budget',
            key: 'bookingTime',
        },
        {
            title: 'วันที่เข้าพัก',
            dataIndex: 'checkInDate',
            key: 'checkInDate',
        },
        {
            title: 'รายได้ของคุณ',
            dataIndex: 'dailyIncome',
            key: 'yourIncome',
        },
        {
            title: 'สถานะล่าสุด',
            dataIndex: 'paymentStatus',
            key: 'latestStatus',
            render: (status: string) => (
                <span className={`px-2 py-1 rounded text-xs ${status === 'รอดำเนินการ' ? 'bg-yellow-100 text-yellow-800' :
                    status === 'ชำระแล้ว' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                    {status}
                </span>
            ),
        },
        {
            title: 'อัพเดทสถานะ',
            dataIndex: 'updateStatus',
            key: 'updateStatus',
            render: (status: string) => (
                <span className={`px-2 py-1 rounded text-xs ${status === 'ชำระแล้ว' ? 'bg-green-100 text-green-800' :
                    status === 'รอชำระ' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {status}
                </span>
            ),
        },
        {
            title: 'รูปแบบที่ใช้บริการ',
            dataIndex: 'paymentMethod',
            key: 'serviceType',
            render: (method: string) => (
                <span className={`px-2 py-1 rounded text-xs ${method === 'โอนเงินออนไลน์' ? 'bg-blue-100 text-blue-800' :
                    method === 'สมาชิกสำคัญ' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {method}
                </span>
            ),
        },
        {
            title: 'ดูรายละเอียด',
            dataIndex: 'action',
            key: 'viewDetails',
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
                <header className="bg-gradient-to-r from-[#C6CEDE] to-[#FFFFFF] shadow-sm border-b border-gray-200 px-6 py-4">
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
                <main className="flex-1 overflow-auto p-6" style={{ backgroundColor: '#FFFFFF' }}>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gradient-to-r from-[#0097EC] to-[#003AD2] rounded-2xl p-6" style={{ color: '#FFFFFF' }}>
                            <div className="">
                                <div>
                                    <div className="flex items-center justify-between w-full">
                                        <h3 className="text-lg font-medium opacity-90">ลูกค้าที่พักของคุณ</h3>
                                        <HomeOutlined className='text-3xl' />
                                    </div>
                                    <p className="text-5xl" style={{ marginBottom: '0.5rem' }}>24</p>
                                    <p className="text-sm" style={{ marginBottom: '0rem' }}>คุณทำได้ดีมาก</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-[#1FD071] to-[#00A843] rounded-2xl p-6" style={{ color: '#FFFFFF' }}>
                            <div className="">
                                <div>
                                    <div className="flex items-center justify-between w-full">
                                        <h3 className="text-lg font-medium opacity-90">รายได้ทั้งหมดของคุณ</h3>
                                        <CheckCircleOutlined className='text-3xl' />
                                    </div>
                                    <p className="text-5xl" style={{ marginBottom: '0.5rem' }}>24</p>
                                    <p className="text-sm" style={{ marginBottom: '0rem' }}>คุณทำได้ดีมาก</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full border-1 border-black rounded-lg"></div>
                    {/* Table Section */}
                    <div className="">
                        <div className="py-3 px-2 border-gray-200">
                            <h2 className="text-3xl font-semibold text-gray-800 mb-4">รายงานสำคัญประจำวัน</h2>

                            {/* Filters */}
                            <div className="flex flex-wrap gap-4 items-center">
                                <div className="flex-1 min-w-64">
                                    <Input
                                        placeholder="ค้นหา..."
                                        prefix={<SearchOutlined />}
                                        className="w-full min-h-[40px]"
                                    />
                                </div>
                                <Select defaultValue="ค้นหาจากชื่อ" className="w-40 min-h-[40px]">
                                    <Option value="name">ค้นหาจากชื่อ</Option>
                                    <Option value="code">รหัสการจอง</Option>
                                </Select>
                                <Select defaultValue="ค้นหาสถานะ" className="w-40 min-h-[40px]">
                                    <Option value="all">ค้นหาสถานะ</Option>
                                    <Option value="pending">รอดำเนินการ</Option>
                                    <Option value="paid">ชำระแล้ว</Option>
                                </Select>
                            </div>
                        </div>

                        <div className="">
                            <DataTable
                                columns={dashboardColumns}
                                data={data}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
