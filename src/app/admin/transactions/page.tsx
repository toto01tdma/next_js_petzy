'use client';

import { useState } from 'react';
import { Tabs, Table, Input, Button, Select } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import Sidebar from '@/components/admin/shared/Sidebar';

const { TabPane } = Tabs;
const { Option } = Select;

// Mock data for customer payments
const customerPaymentsData = [
    {
        key: '1',
        orderId: '500053',
        customerName: 'สมชาย มีดี',
        amount: '500.-(promo)',
        duration: '11.30 น.',
        bookingDate: '1/06/25-2/06/25',
        roomCount: '100นาท',
        paymentStatus: 'กำลังตรวจสอบ',
        accommodation: 'รออนุมัติจำหน่วง',
        orderStatus: 'รอสั่งจอง'
    },
    {
        key: '2',
        orderId: '500053',
        customerName: 'สมชาย มีดี',
        amount: '500.-(promo)',
        duration: '11.30 น.',
        bookingDate: '1/06/25-2/06/25',
        roomCount: '200นาท',
        paymentStatus: 'รอตรวจสอบบัญชีข',
        accommodation: 'ชำระเงิน',
        orderStatus: 'ชำระแล้ว'
    },
    {
        key: '3',
        orderId: '500053',
        customerName: 'สมชาย มีดี',
        amount: '500.-(promo)',
        duration: '11.30 น.',
        bookingDate: '1/06/25-2/06/25',
        roomCount: '100นาท',
        paymentStatus: 'รอตรวจสอบคำร้องขอไม่',
        accommodation: 'ชำระเงิน',
        orderStatus: 'คำสั่งจอง'
    },
    {
        key: '4',
        orderId: '500053',
        customerName: 'สมชาย มีดี',
        amount: '500.-(promo)',
        duration: '11.30 น.',
        bookingDate: '1/06/25-2/06/25',
        roomCount: '200นาท',
        paymentStatus: 'รอตรวจสอบคำร้องขอไม่',
        accommodation: 'ชำระเงิน',
        orderStatus: 'คำสั่งจอง'
    }
];

// Mock data for partner payouts
const partnerPayoutsData = [
    {
        key: '1',
        bookingId: '021231',
        partnerName: 'โรงแรมยูนิค',
        orderId: '021231',
        roomType: 'โรงแรมยูนิคกร',
        customerName: 'Leslie Alexander',
        amount: '1000.-บาท',
        bookingDate: '04/17/25',
        paymentStatus: 'ชำระเงินแล้ว',
        transferStatus: 'ชำสั่งเงิน'
    },
    {
        key: '2',
        bookingId: '021231',
        partnerName: 'โรงแรมยูนิค',
        orderId: '021231',
        roomType: 'โรงแรมรับคิมาร์ชี',
        customerName: 'Leslie Alexander',
        amount: '1000.-บาท',
        bookingDate: '06/17/25',
        paymentStatus: 'ชำระเงินแล้ว',
        transferStatus: 'รอตรวจสอบ'
    }
];

export default function AdminTransactions() {
    const [activeTab, setActiveTab] = useState('customer');
    const [pageSize, setPageSize] = useState(1);

    const customerColumns = [
        {
            title: 'รหัสการจอง',
            dataIndex: 'orderId',
            key: 'orderId',
            width: 120,
            render: (text: string) => <span className="font-medium">{text}</span>
        },
        {
            title: 'ชื่อลูกค้า',
            dataIndex: 'customerName',
            key: 'customerName',
            width: 150
        },
        {
            title: 'ยอดราคา',
            dataIndex: 'amount',
            key: 'amount',
            width: 120,
            render: (text: string) => (
                <span style={{ color: text.includes('promo') ? '#FF6B6B' : '#000' }}>
                    {text}
                </span>
            )
        },
        {
            title: 'เวลาใน\u200Bการจอง',
            dataIndex: 'duration',
            key: 'duration',
            width: 120
        },
        {
            title: 'วันที่เช้าพัก',
            dataIndex: 'bookingDate',
            key: 'bookingDate',
            width: 140
        },
        {
            title: 'รายได้ของคุณ',
            dataIndex: 'roomCount',
            key: 'roomCount',
            width: 120
        },
        {
            title: 'สถานะการชำระเงิน',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            width: 170,
            render: (text: string) => {
                let bgColor = '#FDB930';
                const textColor = '#FFFFFF';
                
                if (text.includes('รอตรวจสอบคำร้องขอไม่')) {
                    bgColor = '#DC2626';
                } else if (text.includes('รอตรวจสอบบัญชีข')) {
                    bgColor = '#10B981';
                }
                
                return (
                    <div
                        className="px-3 py-1 rounded-md text-center text-sm"
                        style={{ backgroundColor: bgColor, color: textColor }}
                    >
                        {text}
                    </div>
                );
            }
        },
        {
            title: 'อีเมลผลการขอให้',
            dataIndex: 'accommodation',
            key: 'accommodation',
            width: 150,
            render: (text: string) => {
                let bgColor = '#10B981';
                const textColor = '#FFFFFF';
                
                if (text === 'รออนุมัติจำหน่วง') {
                    bgColor = '#FDB930';
                }
                
                return (
                    <div
                        className="px-3 py-1 rounded-md text-center text-sm"
                        style={{ backgroundColor: bgColor, color: textColor }}
                    >
                        {text}
                    </div>
                );
            }
        },
        {
            title: 'จัดการคอลัม',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            width: 130,
            render: (text: string) => {
                let bgColor = '#3B82F6';
                const textColor = '#FFFFFF';
                
                if (text === 'ชำระแล้ว') {
                    bgColor = '#3B82F6';
                } else if (text === 'คำสั่งจอง') {
                    bgColor = '#3B82F6';
                }
                
                return (
                    <div
                        className="px-3 py-1 rounded-md text-center text-sm"
                        style={{ backgroundColor: bgColor, color: textColor }}
                    >
                        {text}
                    </div>
                );
            }
        },
        {
            title: '',
            key: 'action',
            width: 80,
            render: () => (
                <div className="flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="5" r="1.5" fill="#666" />
                            <circle cx="10" cy="10" r="1.5" fill="#666" />
                            <circle cx="10" cy="15" r="1.5" fill="#666" />
                        </svg>
                    </div>
                </div>
            )
        }
    ];

    const partnerColumns = [
        {
            title: 'Orders',
            dataIndex: 'bookingId',
            key: 'bookingId',
            width: 150,
            render: (text: string, record: typeof partnerPayoutsData[0]) => (
                <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-gray-200 rounded"></div>
                    <div>
                        <div className="font-medium">{text}</div>
                        <div className="text-sm text-gray-500">{record.roomType}</div>
                    </div>
                </div>
            )
        },
        {
            title: 'Customer',
            dataIndex: 'customerName',
            key: 'customerName',
            width: 150
        },
        {
            title: 'Price',
            dataIndex: 'amount',
            key: 'amount',
            width: 120
        },
        {
            title: 'Date',
            dataIndex: 'bookingDate',
            key: 'bookingDate',
            width: 120
        },
        {
            title: 'Payment',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            width: 150,
            render: (text: string) => (
                <div
                    className="px-3 py-1 rounded-full text-center text-sm inline-block"
                    style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}
                >
                    {text}
                </div>
            )
        },
        {
            title: 'Status',
            dataIndex: 'transferStatus',
            key: 'transferStatus',
            width: 130,
            render: (text: string) => {
                let bgColor = '#DBEAFE';
                let textColor = '#1E40AF';
                
                if (text === 'รอตรวจสอบ') {
                    bgColor = '#FEF3C7';
                    textColor = '#92400E';
                }
                
                return (
                    <div
                        className="px-3 py-1 rounded-full text-center text-sm inline-block"
                        style={{ backgroundColor: bgColor, color: textColor }}
                    >
                        {text}
                    </div>
                );
            }
        },
        {
            title: 'Action',
            key: 'action',
            width: 80,
            render: () => (
                <div className="flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 5C10.5523 5 11 4.55228 11 4C11 3.44772 10.5523 3 10 3C9.44772 3 9 3.44772 9 4C9 4.55228 9.44772 5 10 5Z" fill="#666" />
                            <path d="M10 11C10.5523 11 11 10.5523 11 10C11 9.44772 10.5523 9 10 9C9.44772 9 9 9.44772 9 10C9 10.5523 9.44772 11 10 11Z" fill="#666" />
                            <path d="M10 17C10.5523 17 11 16.5523 11 16C11 15.4477 10.5523 15 10 15C9.44772 15 9 15.4477 9 16C9 16.5523 9.44772 17 10 17Z" fill="#666" />
                        </svg>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="flex min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
            <Sidebar />

            <div className="flex-1" style={{ marginLeft: '250px' }}>
                {/* Header */}
                <div className="p-6" style={{ 
                    background: 'linear-gradient(to right, #C6CEDE, #FFFFFF)'
                }}>
                    <h1 className="text-3xl font-bold" style={{ color: '#333333' }}>
                        จัดการ ชำระเงินของคุณ
                    </h1>
                </div>

                {/* Content */}
                <div className="p-6">
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        className="custom-tabs"
                        tabBarExtraContent={
                            activeTab === 'customer' ? (
                                <div className="flex gap-4">
                                    <Button
                                        icon={<DownloadOutlined />}
                                        style={{
                                            backgroundColor: '#FDB930',
                                            color: '#000',
                                            border: 'none',
                                            fontWeight: 600
                                        }}
                                    >
                                        Export
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex gap-4">
                                    <Button
                                        icon={<DownloadOutlined />}
                                        style={{
                                            backgroundColor: '#FFFFFF',
                                            color: '#000',
                                            border: '1px solid #E5E7EB'
                                        }}
                                    >
                                        Export
                                    </Button>
                                </div>
                            )
                        }
                    >
                        <TabPane tab="รายการลูกค้าทั้งหมด ทำงานได้" key="customer">
                            {/* Customer Payments Tab */}
                            <div className="bg-white rounded-lg">
                                {/* Search and Filters */}
                                <div className="mb-6 flex gap-4">
                                    <Input
                                        placeholder="ค้นหา...."
                                        prefix={<SearchOutlined />}
                                        style={{ width: 300 }}
                                    />
                                    <Button 
                                        icon={
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z"/>
                                            </svg>
                                        }
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        ค้นหาลูกค้า
                                    </Button>
                                    <Button 
                                        icon={
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                <circle cx="8" cy="8" r="2"/>
                                            </svg>
                                        }
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    />
                                </div>

                                {/* Table */}
                                <Table
                                    columns={customerColumns}
                                    dataSource={customerPaymentsData}
                                    pagination={false}
                                    scroll={{ x: 1400 }}
                                    className="custom-table"
                                />

                                {/* Pagination */}
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        1 - 10 of 13 Pages
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">The page on</span>
                                        <Select value={pageSize} onChange={setPageSize} style={{ width: 70 }}>
                                            <Option value={1}>1</Option>
                                            <Option value={2}>2</Option>
                                            <Option value={3}>3</Option>
                                        </Select>
                                        <Button size="small">&lt;</Button>
                                        <Button size="small">&gt;</Button>
                                    </div>
                                </div>
                            </div>
                        </TabPane>

                        <TabPane tab="รายการลูกค้าที่ให้พาร์ทเนอร์ ทั้งหมด" key="partner">
                            {/* Partner Payouts Tab */}
                            <div className="bg-white rounded-lg">
                                {/* Orders Header */}
                                <div className="mb-4">
                                    <div className="text-2xl font-bold mb-2">Orders</div>
                                    <div className="text-sm text-gray-500">
                                        Dashboard &gt; Orders &gt; All Orders
                                    </div>
                                </div>

                                {/* Search */}
                                <div className="mb-6">
                                    <Input
                                        placeholder="Search for iid, name product"
                                        prefix={<SearchOutlined />}
                                        style={{ width: 400 }}
                                    />
                                </div>

                                {/* Filter Tabs */}
                                <div className="mb-4 flex gap-2">
                                    <Button type="primary" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', border: 'none' }}>
                                        All Orders (441)
                                    </Button>
                                    <Button>ระหว่างชำ\u200Bพัก (100)</Button>
                                    <Button>ชำระเงินเล้ว (300)</Button>
                                    <Button>ยกเลิก(41)</Button>
                                </div>

                                {/* Table */}
                                <Table
                                    columns={partnerColumns}
                                    dataSource={partnerPayoutsData}
                                    pagination={false}
                                    rowSelection={{
                                        type: 'checkbox',
                                    }}
                                    className="custom-table-partner"
                                />

                                {/* Pagination */}
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        1 - 10 of 13 Pages
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">The page on</span>
                                        <Select value={pageSize} onChange={setPageSize} style={{ width: 70 }}>
                                            <Option value={1}>1</Option>
                                            <Option value={2}>2</Option>
                                            <Option value={3}>3</Option>
                                        </Select>
                                        <Button size="small">&lt;</Button>
                                        <Button size="small">&gt;</Button>
                                    </div>
                                </div>
                    </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>

            <style jsx global>{`
                .custom-tabs .ant-tabs-nav {
                    margin-bottom: 24px;
                }
                
                .custom-tabs .ant-tabs-tab {
                    font-size: 16px;
                    font-weight: 500;
                    padding: 12px 24px;
                }
                
                .custom-tabs .ant-tabs-tab-active {
                    color: #1890ff;
                }
                
                .custom-table .ant-table-thead > tr > th {
                    background-color: #F3F4F6;
                    font-weight: 600;
                    color: #374151;
                    border-bottom: 2px solid #E5E7EB;
                }
                
                .custom-table .ant-table-tbody > tr:hover > td {
                    background-color: #F9FAFB;
                }
                
                .custom-table-partner .ant-table-thead > tr > th {
                    background-color: #F9FAFB;
                    font-weight: 600;
                    color: #374151;
                    border-bottom: 1px solid #E5E7EB;
                }
            `}</style>
        </div>
    );
}
