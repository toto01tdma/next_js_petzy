'use client';

import Sidebar from '@/components/admin/shared/Sidebar';

export default function AdminCustomers() {
    return (
        <div className="flex min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
            <Sidebar />
            <div className="flex-1" style={{ marginLeft: '250px' }}>
                <div className="p-6" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E0E0E0' }}>
                    <h1 className="text-3xl font-bold" style={{ color: '#333333' }}>จัดการ Costumer</h1>
                </div>
                <div className="p-6">
                    <div className="p-8 rounded-lg text-center" style={{ backgroundColor: '#FFFFFF' }}>
                        <p style={{ color: '#666666' }}>Customer management page coming soon...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
