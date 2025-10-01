'use client';

import { useState } from 'react';
import Sidebar from '@/components/partner/shared/Sidebar';
import { MenuOutlined, UploadOutlined } from '@ant-design/icons';
import { Input } from 'antd';

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
                <header className="bg-gradient-to-r from-[#C6CEDE] to-[#FFFFFF] shadow-sm border-b border-gray-200 px-6 py-4">
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
                <main className="flex-1 overflow-auto p-6" style={{ backgroundColor: '#FFFFFF' }}>
                    <div className="flex mb-3">
                        <h2 className="text-xl font-semibold text-black me-3" style={{ marginBottom: '0px' }}>สร้างบัญชีการรับชำระเงิน</h2>
                        <div className="rounded-md flex items-center justify-center py-2 px-6 mx-1" style={{ backgroundColor: '#0D263B' }}>
                            <span style={{ color: '#FFFFFF' }}>ติดต่อฝ่ายสนับสนุน</span>
                        </div>
                        <div className="rounded-md flex items-center justify-center py-2 px-6 mx-1" style={{ backgroundColor: '#0D263B' }}>
                            <span style={{ color: '#FFFFFF' }}>อ่านนโยบายการชำระเงิน</span>
                        </div>
                    </div>
                    <div className="flex mb-6">
                        <p>การสร้างบัญชีธนาคารจะไม่สามารถเปลี่ยนแปลงได้ หากมีการเปลี่ยนแปลงจะต้องแจ้งคำร้องกลับมาทางเรา</p>
                    </div>
                    <div className="flex px-10 mb-16">
                        {/* ด้านซ้าย 1 ส่วน */}
                        <div className="w-2/5">
                            <div className="rounded-lg p-4 w-full flex flex-col items-center justify-center h-[300px]" style={{ backgroundColor: '#E0E2E6' }}>
                                <UploadOutlined className="text-6xl mb-5" style={{ color: '#484848' }} />
                                <p className="mt-2 text-center" style={{ color: '#484848' }}>
                                    อัพโหลดรูปหน้าสมุดบัญชีธนาคารของคุณ
                                </p>
                            </div>
                        </div>

                        {/* ด้านขวา 3 ส่วน */}
                        <div className="w-3/5 px-6">
                            {/* Right Side - Form Fields */}
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-lg font-medium text-gray-800 mb-2">
                                        ชื่อ บัญชีธนาคาร
                                    </label>
                                    <Input
                                        placeholder="นาย"
                                        className="w-full py-3 text-lg h-[40px]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-800 mb-2">
                                        ระบุธนาคาร
                                    </label>
                                    <Input
                                        placeholder="ธนาคารไทยพาณิชย์"
                                        className="w-full py-3 text-lg h-[40px]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-800 mb-2">
                                        ระบุเลขบัญชี ธนาคาร
                                    </label>
                                    <Input
                                        placeholder="401-1414-258"
                                        className="w-full py-3 text-lg h-[40px]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <div className="rounded-md flex items-center justify-center py-2 px-6 mx-1 w-[80%] cursor-pointer" style={{ backgroundColor: '#0D263B' }}>
                            <span className="text-xl" style={{ color: '#FFFFFF' }}>กรุณากดยืนยัน</span>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
