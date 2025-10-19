'use client';

import { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Sidebar from '@/components/partner/shared/Sidebar';
import { useApprovalStatus } from '@/hooks/useApprovalStatus';
import ApprovalModal from '@/components/partner/shared/ApprovalModal';
import { API_BASE_URL } from '@/config/api';

interface PolicyData {
    id: string;
    file_url: string;
    file_type: string;
    uploaded_at: string;
}

export default function PartnerContracts() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [policyData, setPolicyData] = useState<PolicyData | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Approval status check
    const { isApproved, isLoading: isLoadingApproval } = useApprovalStatus();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Fetch policy data
    useEffect(() => {
        fetchPolicyData();
    }, []);

    const fetchPolicyData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/partner/policy`);

            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    setPolicyData(result.data);
                }
            }
        } catch (error) {
            console.error('Error fetching policy:', error);
            // Don't show error - policy might not exist yet
        } finally {
            setLoading(false);
        }
    };

    const renderPolicyContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center py-20">
                    <Spin size="large" />
                </div>
            );
        }

        if (!policyData) {
            return (
                <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                        สัญญาและนโยบายคู่ค้า xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                    </p>
                    
                    <p>
                        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                    </p>
                    
                    <p>
                        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                    </p>
                    
                    <p>
                        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                    </p>
                </div>
            );
        }

        const fullUrl = policyData.file_url.startsWith('http') 
            ? policyData.file_url 
            : `${API_BASE_URL}${policyData.file_url}`;
        console.log(fullUrl);
        if (policyData.file_type === 'application/pdf') {
            return (
                <div className="text-center py-8">
                    {/* <FilePdfOutlined style={{ fontSize: '64px', color: '#FF6B6B' }} className="mb-4" />
                    <p className="text-gray-600 mb-4">นโยบายความเป็นส่วนตัว (PDF)</p> */}
                    <a 
                        href={fullUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        เปิดดูเอกสาร PDF
                    </a>
                    <div className="mt-4">
                        <iframe
                            src={fullUrl}
                            className="w-full border border-gray-300 rounded-lg"
                            style={{ height: '600px' }}
                            title="Privacy Policy PDF"
                        />
                    </div>
                </div>
            );
        }

        return (
            <div className="text-center">
                {/* <FileImageOutlined style={{ fontSize: '48px', color: '#4096FF' }} className="mb-4" />
                <p className="text-gray-600 mb-4">นโยบายความเป็นส่วนตัว</p> */}
                <Image
                    src={fullUrl}
                    alt="Privacy Policy"
                    width={800}
                    height={600}
                    style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }}
                    className="rounded-lg"
                />
            </div>
        );
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
                            <h1 className="text-2xl font-semibold text-gray-800">สัญญาและนโยบายคู่ค้า</h1>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Contract Content */}
                        <div className="rounded-lg shadow-sm p-8" style={{ backgroundColor: '#FFFFFF' }}>
                            <div className="border border-gray-300 rounded-lg p-8 min-h-96">
                                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                                    สัญญาและนโยบายคู่ค้า
                                </h2>
                                
                                {renderPolicyContent()}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            
            {/* Approval Status Modal */}
            <ApprovalModal isOpen={!isLoadingApproval && !isApproved} />
        </div>
    );
}
