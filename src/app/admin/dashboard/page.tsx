'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/shared/Sidebar';

export default function AdminDashboard() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }
        setIsLoading(false);
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1" style={{ marginLeft: '250px' }}>
                {/* Header */}
                <div className="p-6" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E0E0E0' }}>
                    <h1 className="text-3xl font-bold" style={{ color: '#333333' }}>
                        หน้ารวมรายการ
                    </h1>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Progress Cards */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-4" style={{ color: '#333333' }}>
                            ภาพรวมการทำงาน
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Partner Progress */}
                            <div className="p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-base font-medium" style={{ color: '#666666' }}>Partner</h3>
                                    <span className="text-sm" style={{ color: '#999999' }}>...</span>
                                </div>
                                <div className="mb-2">
                                    <div className="text-sm mb-1" style={{ color: '#666666' }}>Progress</div>
                                    <div className="text-2xl font-bold" style={{ color: '#0066FF' }}>55%</div>
                                </div>
                                <div className="w-full rounded-full" style={{ backgroundColor: '#E0E0E0', height: '8px' }}>
                                    <div className="rounded-full" style={{ backgroundColor: '#0066FF', height: '8px', width: '55%' }}></div>
                                </div>
                                <div className="mt-2 text-sm" style={{ color: '#666666' }}>8/100</div>
                            </div>

                            {/* Customer Progress */}
                            <div className="p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-base font-medium" style={{ color: '#666666' }}>COSTUMER</h3>
                                    <span className="text-sm" style={{ color: '#999999' }}>...</span>
                                </div>
                                <div className="mb-2">
                                    <div className="text-sm mb-1" style={{ color: '#666666' }}>Progress</div>
                                    <div className="text-2xl font-bold" style={{ color: '#FF69B4' }}>30%</div>
                                </div>
                                <div className="w-full rounded-full" style={{ backgroundColor: '#E0E0E0', height: '8px' }}>
                                    <div className="rounded-full" style={{ backgroundColor: '#FF69B4', height: '8px', width: '30%' }}></div>
                                </div>
                                <div className="mt-2 text-sm" style={{ color: '#666666' }}>8/40</div>
                            </div>

                            {/* Petzy App Progress */}
                            <div className="p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-base font-medium" style={{ color: '#666666' }}>Petzy App</h3>
                                    <span className="text-sm" style={{ color: '#999999' }}>...</span>
                                </div>
                                <div className="mb-2">
                                    <div className="text-sm mb-1" style={{ color: '#666666' }}>Progress</div>
                                    <div className="text-2xl font-bold" style={{ color: '#FFA500' }}>89%</div>
                                </div>
                                <div className="w-full rounded-full" style={{ backgroundColor: '#E0E0E0', height: '8px' }}>
                                    <div className="rounded-full" style={{ backgroundColor: '#FFA500', height: '8px', width: '89%' }}></div>
                                </div>
                                <div className="mt-2 text-sm" style={{ color: '#666666' }}>-</div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Reports */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold" style={{ color: '#333333' }}>
                                รายการจอง วันนี้ <span style={{ color: '#999999' }}>(10)</span>
                            </h2>
                            <button className="text-sm" style={{ color: '#0066FF' }}>
                                ดูทั้งหมด →
                            </button>
                        </div>

                        {/* Report Items */}
                        <div className="space-y-3">
                            <div 
                                className="p-4 rounded-lg flex items-center justify-between"
                                style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                            >
                                <div className="flex items-center">
                                    <input type="checkbox" className="mr-4" style={{ width: '18px', height: '18px' }} defaultChecked />
                                    <div>
                                        <div className="font-medium" style={{ color: '#333333' }}>
                                            ลูกค้าใหม่จองห้องพัก Tex25258 /18:00 น /โรงแรมสับชายดี
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="px-3 py-1 rounded text-sm" style={{ backgroundColor: '#FFF3CD', color: '#856404' }}>
                                        กำลังจองห้องพัก
                                    </span>
                                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#E0E0E0' }}></div>
                                    <button className="text-sm" style={{ color: '#999999' }}>...</button>
                                </div>
                            </div>

                            <div 
                                className="p-4 rounded-lg flex items-center justify-between"
                                style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                            >
                                <div className="flex items-center">
                                    <input type="checkbox" className="mr-4" style={{ width: '18px', height: '18px' }} />
                                    <div>
                                        <div className="font-medium" style={{ color: '#333333' }}>
                                            ลูกค้าใหม่จองห้องพัก Tex25258 /14:00 น /โรงแรมสับชายดี
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="px-3 py-1 rounded text-sm" style={{ backgroundColor: '#FFF3CD', color: '#856404' }}>
                                        กำลังจองห้องพัก
                                    </span>
                                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#E0E0E0' }}></div>
                                    <button className="text-sm" style={{ color: '#999999' }}>...</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-4" style={{ color: '#333333' }}>
                            ภาพรวมบริการที่ได้รับความนิยม
                        </h2>
                        <div className="flex space-x-4">
                            <button 
                                className="px-6 py-2 rounded-lg font-medium"
                                style={{ backgroundColor: '#00CED1', color: '#FFFFFF' }}
                            >
                                บริการห้องพัก
                            </button>
                            <button 
                                className="px-6 py-2 rounded-lg font-medium"
                                style={{ backgroundColor: '#00CED1', color: '#FFFFFF' }}
                            >
                                บริการพิเศษ
                            </button>
                            <button 
                                className="px-6 py-2 rounded-lg font-medium"
                                style={{ backgroundColor: '#00CED1', color: '#FFFFFF' }}
                            >
                                บริการรับฝากสัตว์เลี้ยง
                            </button>
                        </div>
                    </div>

                    {/* Activity Chart Placeholder */}
                    <div className="p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold" style={{ color: '#333333' }}>Activity</h2>
                            <select className="px-4 py-2 rounded border" style={{ borderColor: '#E0E0E0' }}>
                                <option>Weekly</option>
                                <option>Monthly</option>
                                <option>Yearly</option>
                            </select>
                        </div>
                        <div className="h-64 flex items-center justify-center" style={{ backgroundColor: '#F9F9F9', borderRadius: '8px' }}>
                            <div style={{ color: '#999999' }}>Chart will be displayed here</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
