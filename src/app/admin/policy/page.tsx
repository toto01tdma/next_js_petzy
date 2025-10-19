'use client';

import { useState, useEffect } from 'react';
import { Upload, Button, Spin, message } from 'antd';
import { UploadOutlined, FileImageOutlined, FilePdfOutlined, DeleteOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Sidebar from '@/components/admin/shared/Sidebar';
import { showError, showSuccess, showConfirmation } from '@/utils/apiErrorHandler';
import { checkAuthError } from '@/utils/api';
import { API_BASE_URL } from '@/config/api';

interface PolicyData {
    id: string;
    file_url: string;
    file_type: string;
    uploaded_at: string;
    uploaded_by: string;
}

export default function AdminPolicy() {
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [policyData, setPolicyData] = useState<PolicyData | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Fetch current policy
    useEffect(() => {
        fetchPolicyData();
    }, []);

    const fetchPolicyData = async () => {
        try {
            setFetchLoading(true);
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/api/admin/policy`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            const result = await response.json();
            
            if (!response.ok) {
                if (checkAuthError(response, result)) return;
                throw new Error('Failed to fetch policy data');
            }
            if (result.success && result.data) {
                setPolicyData(result.data);
            }
        } catch (error) {
            console.error('Error fetching policy:', error);
            // Don't show error if no policy exists yet
        } finally {
            setFetchLoading(false);
        }
    };

    const handleFileSelect = (file: File) => {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            message.error('กรุณาอัปโหลดไฟล์ภาพ (JPG, PNG) หรือ PDF เท่านั้น');
            return false;
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            message.error('ขนาดไฟล์ต้องไม่เกิน 10MB');
            return false;
        }

        setSelectedFile(file);
        return false; // Prevent auto upload
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            message.warning('กรุณาเลือกไฟล์ก่อน');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const formData = new FormData();
            formData.append('policy', selectedFile);

            const response = await fetch(`${API_BASE_URL}/api/admin/policy/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await response.json();
            
            if (!response.ok) {
                if (checkAuthError(response, result)) return;
                throw new Error(result.error || 'Upload failed');
            }
            if (result.success) {
                showSuccess('สำเร็จ', 'อัปโหลดนโยบายความเป็นส่วนตัวเรียบร้อยแล้ว');
                setSelectedFile(null);
                fetchPolicyData();
            }
        } catch (error) {
            console.error('Error uploading policy:', error);
            showError(
                'ไม่สามารถอัปโหลดนโยบายได้',
                error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการอัปโหลด'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!policyData) return;

        const confirmed = await showConfirmation(
            'ยืนยันการลบ',
            'คุณต้องการลบนโยบายความเป็นส่วนตัวนี้ใช่หรือไม่?'
        );

        if (!confirmed) return;

        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/api/admin/policy/${policyData.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const result = await response.json();
            
            if (!response.ok) {
                if (checkAuthError(response, result)) return;
                throw new Error('Delete failed');
            }
            if (result.success) {
                showSuccess('สำเร็จ', 'ลบนโยบายความเป็นส่วนตัวเรียบร้อยแล้ว');
                setPolicyData(null);
                setSelectedFile(null);
            }
        } catch (error) {
            console.error('Error deleting policy:', error);
            showError('ไม่สามารถลบนโยบายได้', 'เกิดข้อผิดพลาดในการลบ');
        } finally {
            setLoading(false);
        }
    };

    const renderPolicyPreview = () => {
        if (!policyData) return null;

        const fullUrl = policyData.file_url.startsWith('http') 
            ? policyData.file_url 
            : `${API_BASE_URL}${policyData.file_url}`;

        if (policyData.file_type === 'application/pdf') {
            return (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FilePdfOutlined style={{ fontSize: '64px', color: '#FF6B6B' }} />
                    <p className="mt-4 text-gray-600">นโยบายความเป็นส่วนตัว (PDF)</p>
                    <a 
                        href={fullUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 underline"
                    >
                        คลิกเพื่อดูไฟล์
                    </a>
                </div>
            );
        }

        return (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
                <Image
                    src={fullUrl}
                    alt="Privacy Policy"
                    width={800}
                    height={500}
                    style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }}
                />
            </div>
        );
    };

    if (fetchLoading) {
        return (
            <div className="flex min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
                <Sidebar />
                <div className="flex-1" style={{ marginLeft: '250px' }}>
                    <div className="p-6" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E0E0E0' }}>
                        <h1 className="text-3xl font-bold" style={{ color: '#333333' }}>นโยบายความเป็นส่วนตัว</h1>
                    </div>
                    <div className="p-6 flex items-center justify-center" style={{ minHeight: '400px' }}>
                        <Spin size="large" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
            <Sidebar />
            <div className="flex-1" style={{ marginLeft: '250px' }}>
                <div className="p-6" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E0E0E0' }}>
                    <h1 className="text-3xl font-bold" style={{ color: '#333333' }}>นโยบายความเป็นส่วนตัว</h1>
                </div>
                <div className="p-6">
                    <div className="p-8 rounded-lg" style={{ backgroundColor: '#FFFFFF' }}>
                        {/* Current Policy Display */}
                        {policyData && (
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold" style={{ color: '#333333' }}>
                                        นโยบายปัจจุบัน
                                    </h2>
                                    <Button 
                                        danger 
                                        icon={<DeleteOutlined />}
                                        onClick={handleDelete}
                                        loading={loading}
                                    >
                                        ลบนโยบาย
                                    </Button>
                                </div>
                                {renderPolicyPreview()}
                                <div className="mt-4 text-sm text-gray-500">
                                    <p>อัปโหลดเมื่อ: {new Date(policyData.uploaded_at).toLocaleString('th-TH')}</p>
                                </div>
                            </div>
                        )}

                        {/* Upload Section */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4" style={{ color: '#333333' }}>
                                {policyData ? 'อัปเดตนโยบายความเป็นส่วนตัว' : 'อัปโหลดนโยบายความเป็นส่วนตัว'}
                            </h2>
                            
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                                <div className="text-center">
                                    <FileImageOutlined style={{ fontSize: '48px', color: '#999999' }} />
                                    <p className="mt-4 text-gray-600 mb-4">
                                        อัปโหลดไฟล์ภาพ (JPG, PNG) หรือ PDF
                                    </p>
                                    <Upload
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        beforeUpload={handleFileSelect}
                                        showUploadList={false}
                                        maxCount={1}
                                    >
                                        <Button icon={<UploadOutlined />} size="large">
                                            เลือกไฟล์
                                        </Button>
                                    </Upload>
                                </div>

                                {selectedFile && (
                                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {selectedFile.type === 'application/pdf' ? (
                                                    <FilePdfOutlined style={{ fontSize: '24px', color: '#FF6B6B' }} />
                                                ) : (
                                                    <FileImageOutlined style={{ fontSize: '24px', color: '#4096FF' }} />
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-800">{selectedFile.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button 
                                                    type="primary" 
                                                    onClick={handleUpload}
                                                    loading={loading}
                                                >
                                                    อัปโหลด
                                                </Button>
                                                <Button onClick={() => setSelectedFile(null)}>
                                                    ยกเลิก
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 text-sm text-gray-500">
                                <p>• รองรับไฟล์: JPG, PNG, PDF</p>
                                <p>• ขนาดไฟล์สูงสุด: 10 MB</p>
                                <p>• นโยบายนี้จะแสดงบนหน้า &quot;สัญญาและนโยบายคู่ค้า&quot; ของระบบพาร์ทเนอร์</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

