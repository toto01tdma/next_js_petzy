'use client';

import { useState } from 'react';
import Sidebar from '@/components/partner/shared/Sidebar';
import { MenuOutlined, UserOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Input, Avatar } from 'antd';

export default function UserProfile() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="shadow-sm border-b border-gray-200 px-6 py-4" style={{ backgroundColor: '#FFFFFF' }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleSidebar}
                                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                            >
                                <MenuOutlined className="text-xl" />
                            </button>
                            <h1 className="text-2xl font-semibold text-gray-800">ตั้งค่าโปรไฟล์</h1>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column - Profile Picture */}
                            <div className="lg:col-span-1">
                                <div className="rounded-lg shadow-sm p-6" style={{ backgroundColor: '#FFFFFF' }}>
                                    <div className="text-center">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">รูปโปรไฟล์</h3>
                                        <div className="mb-4">
                                            <Avatar size={120} icon={<UserOutlined />} className="mx-auto" />
                                        </div>
                                        <p className="text-sm text-gray-600 mb-4">อัพโหลดรูปหน้าโปรไฟล์ของคุณ</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Profile Information */}
                            <div className="lg:col-span-2">
                                <div className="rounded-lg shadow-sm p-6" style={{ backgroundColor: '#FFFFFF' }}>
                                    <div className="flex gap-4 mb-6">
                                        <Button className="bg-teal-500 border-teal-500 hover:bg-teal-600" style={{ color: '#FFFFFF' }}>
                                            โรงแรม สุขสม โรงแรมสัตว์เลี้ยง
                                        </Button>
                                        <Button className="bg-green-500 border-green-500 hover:bg-green-600" style={{ color: '#FFFFFF' }}>
                                            บริการของคุณได้รับการยืนยันแล้ว
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Left Side */}
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    ชื่อ นาม ธรรมดา สกุลรีก
                                                </label>
                                                <p className="text-gray-900">Name Mr.Tammanut sunteeruk</p>
                                                <p className="text-sm text-gray-500">*ชื่อจริงบนบัตรประจำตัวประชาชนเท่านั้น</p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    รหัสโรงแรมธนาคาร : 25258-2585258
                                                </label>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    เบอร์โทรศัพท์ดิจิต : 064-252585-585
                                                </label>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    เบอร์โทรศัพท์ดิจิตสำรอง : 064-252585-585
                                                </label>
                                            </div>
                                        </div>

                                        {/* Right Side */}
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    รหัสผ่านของคุณ
                                                </label>
                                                <Input.Password 
                                                    placeholder="**********251" 
                                                    className="w-full"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    เปลี่ยนรหัสผ่าน
                                                </label>
                                                <Input.Password 
                                                    placeholder="**********" 
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Photos Section */}
                        <div className="mt-8">
                            <div className="rounded-lg shadow-sm p-6" style={{ backgroundColor: '#FFFFFF' }}>
                                <h3 className="text-lg font-semibold text-gray-800 mb-6">อัพรูปภาพหน้าปก</h3>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {/* Main Upload Area */}
                                    <div className="col-span-2 row-span-2">
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center h-full flex flex-col justify-center">
                                            <UploadOutlined className="text-4xl text-gray-400 mb-2" />
                                            <p className="text-gray-600">อัพโหลดรูปหน้าที่พักของคุณ</p>
                                            <p className="text-sm text-gray-500">ขนาดรูปภาพ 3000x600 pixel png</p>
                                            <p className="text-lg font-bold">1</p>
                                        </div>
                                    </div>

                                    {/* Small Upload Areas */}
                                    {[2, 3, 4, 5, 6, 7].map((num) => (
                                        <div key={num} className="aspect-square">
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center h-full flex flex-col justify-center">
                                                <UploadOutlined className="text-2xl text-gray-400 mb-1" />
                                                <p className="text-xs text-gray-600">อัพโหลดรูปหน้าที่พักของคุณ</p>
                                                <p className="text-xs text-gray-500">ขนาดรูปภาพ 300x300 pixel png</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Button 
                                    type="primary" 
                                    size="large"
                                    className="bg-yellow-500 hover:bg-yellow-600 border-yellow-500 text-black font-medium"
                                >
                                    ยืนยันข้อมูล
                                </Button>
                            </div>
                        </div>

                        {/* Terms and Conditions Section */}
                        <div className="mt-8">
                            <div className="rounded-lg shadow-sm p-6" style={{ backgroundColor: '#FFFFFF' }}>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">กรอกรายละเอียดข้อมูลสิทธิ์</h3>
                                
                                <div className="bg-gray-100 rounded-lg p-8 mb-6 min-h-48">
                                    {/* Terms content area */}
                                </div>

                                <div className="flex gap-4">
                                    <Button className="bg-gray-800 border-gray-800 hover:bg-gray-900" style={{ color: '#FFFFFF' }}>
                                        ติดต่อฝ่ายลูกค้าสัมพันธ์
                                    </Button>
                                    <Button className="bg-gray-600 border-gray-600 hover:bg-gray-700" style={{ color: '#FFFFFF' }}>
                                        ออกจากระบบ
                                    </Button>
                                </div>

                                <p className="text-sm text-gray-600 mt-4">
                                    *กรณีต้องการเปลี่ยนข้อมูลส่วนตัว หรือยกเลิกสิทธิ์กรุณาติดต่อฝ่ายสนับสนุน
                                </p>

                                <div className="mt-6 text-center">
                                    <Button 
                                        type="primary" 
                                        size="large"
                                        className="bg-gray-800 hover:bg-gray-900 border-gray-800 px-12"
                                    >
                                        กรุณากดยืนยัน
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
