'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { MenuOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';

export default function PaymentHistory() {
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
                <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleSidebar}
                                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                            >
                                <MenuOutlined className="text-xl" />
                            </button>
                            <h1 className="text-2xl font-semibold text-gray-800">สร้างบัญชีธนาคาร</h1>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Instructions Section */}
                        <div className="mb-8">
                            <div className="flex gap-4 mb-6">
                                <Button className="bg-gray-800 text-white border-gray-800 hover:bg-gray-900">
                                    สร้างบัญชีการรับชำระเงิน
                                </Button>
                                <Button className="bg-gray-600 text-white border-gray-600 hover:bg-gray-700">
                                    ติดต่อฝ่ายสนับสนุน
                                </Button>
                                <Button className="bg-gray-800 text-white border-gray-800 hover:bg-gray-900">
                                    อ่านนโยบายการชำระเงิน
                                </Button>
                            </div>

                            <p className="text-gray-700 text-lg leading-relaxed">
                                การสร้างบัญชีธนาคารจะไปสามารถเปลี่ยนแปลงได้ หากมีการเปลี่ยนแปลงจะต้องแจ้งกำรองกลับมาทางเรา
                            </p>
                        </div>

                        {/* Form Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Side - Upload Section */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                                    <div className="mb-4">
                                        <UploadOutlined className="text-6xl text-gray-400" />
                                    </div>
                                    <p className="text-gray-600 mb-2">อัพโหลดรูปหน้าสมุดบัญชีธนาคารของคุณ</p>
                                </div>
                            </div>

                            {/* Right Side - Form Fields */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-lg font-medium text-gray-800 mb-3">
                                        ชื่อ บัญชีธนาคาร
                                    </label>
                                    <Input 
                                        placeholder="นาย" 
                                        className="w-full py-3 text-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-800 mb-3">
                                        ระบุธนาคาร
                                    </label>
                                    <Input 
                                        placeholder="ธนาคารไทยพาณิชย์" 
                                        className="w-full py-3 text-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-800 mb-3">
                                        ระบุเลขบัญชี ธนาคาร
                                    </label>
                                    <Input 
                                        placeholder="401-1414-258" 
                                        className="w-full py-3 text-lg"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-12 text-center">
                            <Button 
                                type="primary" 
                                size="large"
                                className="bg-gray-800 hover:bg-gray-900 border-gray-800 px-12 py-3 text-lg h-auto"
                            >
                                กรุณากดยืนยัน
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
