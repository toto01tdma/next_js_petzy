'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/shared/Sidebar';
import { Input, Button, Table, Space, Modal } from 'antd';
import { SearchOutlined, DownloadOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { API_BASE_URL, USE_API_MODE } from '@/config/api';
import type { ColumnsType } from 'antd/es/table';

interface User {
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
}

interface Accommodation {
    name: string | null;
    nameEn: string | null;
    address: string | null;
}

interface Review {
    reviewedBy: string | null;
    reviewedAt: string | null;
    reviewNotes: string | null;
    rejectionReason: string | null;
    reviewer: Record<string, unknown> | null;
}

interface PartnerApproval {
    id: string;
    userId: string;
    accommodationId: string | null;
    status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
    user: User;
    accommodation: Accommodation;
    review: Review;
    submittedAt: string | null;
    approvedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: PartnerApproval[];
    pagination: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
    meta: {
        userRole: string;
        filterApplied: string | null;
    };
}

export default function AdminPartners() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'all' | 'new'>('all');
    const [isLoading, setIsLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [data, setData] = useState<PartnerApproval[]>([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState<PartnerApproval | null>(null);
    const [reviewNotes, setReviewNotes] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }
        
        fetchPartners();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router, activeTab, pagination.current, pagination.pageSize]);

    const fetchPartners = async () => {
        setIsLoading(true);
        try {
            if (!USE_API_MODE) {
                // Mock data for preview mode
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const mockData: PartnerApproval[] = [
                    {
                        id: '1',
                        userId: '1',
                        accommodationId: 'Pz25258',
                        status: activeTab === 'new' ? 'PENDING' : 'APPROVED',
                        user: {
                            email: 'georgia@example.com',
                            firstName: 'Leslie',
                            lastName: 'Alexander',
                            fullName: 'Leslie Alexander'
                        },
                        accommodation: {
                            name: 'โรงแรมสับชายดี',
                            nameEn: 'Hotel Sabchaydee',
                            address: '2972 Westheimer Rd. Santa Ana, Illinois 85486'
                        },
                        review: {
                            reviewedBy: null,
                            reviewedAt: null,
                            reviewNotes: null,
                            rejectionReason: null,
                            reviewer: null
                        },
                        submittedAt: '2025-10-01T10:00:00.000Z',
                        approvedAt: activeTab === 'all' ? '2025-10-02T10:00:00.000Z' : null,
                        createdAt: '2025-10-01T10:00:00.000Z',
                        updatedAt: '2025-10-01T10:00:00.000Z'
                    },
                    {
                        id: '2',
                        userId: '2',
                        accommodationId: 'Pz25258',
                        status: activeTab === 'new' ? 'PENDING' : 'APPROVED',
                        user: {
                            email: 'georgia@example.com',
                            firstName: 'Leslie',
                            lastName: 'Alexander',
                            fullName: 'Leslie Alexander'
                        },
                        accommodation: {
                            name: 'โรงแรมสับชายดี',
                            nameEn: 'Hotel Sabchaydee',
                            address: '2972 Westheimer Rd. Santa Ana, Illinois 85486'
                        },
                        review: {
                            reviewedBy: null,
                            reviewedAt: null,
                            reviewNotes: null,
                            rejectionReason: null,
                            reviewer: null
                        },
                        submittedAt: '2025-10-01T11:00:00.000Z',
                        approvedAt: activeTab === 'all' ? '2025-10-02T11:00:00.000Z' : null,
                        createdAt: '2025-10-01T11:00:00.000Z',
                        updatedAt: '2025-10-01T11:00:00.000Z'
                    },
                ];
                
                setData(mockData);
                setPagination(prev => ({
                    ...prev,
                    total: mockData.length
                }));
            } else {
                // API mode
                const token = localStorage.getItem('accessToken');
                const status = activeTab === 'new' ? 'PENDING' : null;
                
                const params = new URLSearchParams({
                    page: pagination.current.toString(),
                    limit: pagination.pageSize.toString(),
                    ...(status && { status })
                });

                const response = await fetch(`${API_BASE_URL}/api/admin/partner_approvals?${params}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const result: ApiResponse = await response.json();

                if (result.success) {
                    setData(result.data);
                    setPagination(prev => ({
                        ...prev,
                        total: result.pagination.totalItems
                    }));
                }
            }
        } catch (error) {
            console.error('Error fetching partners:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewPartner = (record: PartnerApproval) => {
        setSelectedPartner(record);
        setReviewNotes('');
        setRejectionReason('');
        setModalVisible(true);
    };

    const handleApprove = async () => {
        if (!selectedPartner) return;
        
        setIsSubmitting(true);
        try {
            if (!USE_API_MODE) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                await Swal.fire({
                    icon: 'success',
                    title: 'อนุมัติสำเร็จ',
                    text: 'อนุมัติพาร์ทเนอร์สำเร็จ',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true
                });
                setModalVisible(false);
                fetchPartners();
            } else {
                const token = localStorage.getItem('accessToken');
                const response = await fetch(
                    `${API_BASE_URL}/api/admin/partner_approvals/${selectedPartner.id}/review`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            status: 'APPROVED',
                            reviewNotes: reviewNotes || 'Application approved'
                        })
                    }
                );

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.error || 'Failed to approve partner');
                }

                await Swal.fire({
                    icon: 'success',
                    title: 'อนุมัติสำเร็จ',
                    text: 'อนุมัติพาร์ทเนอร์สำเร็จ',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true
                });

                setModalVisible(false);
                fetchPartners();
            }
        } catch (error) {
            console.error('Error approving partner:', error);
            await Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: error instanceof Error ? error.message : 'ไม่สามารถอนุมัติพาร์ทเนอร์ได้',
                confirmButtonColor: '#0D263B'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!selectedPartner) return;
        
        if (!rejectionReason.trim()) {
            await Swal.fire({
                icon: 'warning',
                title: 'กรุณากรอกเหตุผล',
                text: 'กรุณากรอกเหตุผลในการปฏิเสธ',
                confirmButtonColor: '#0D263B'
            });
            return;
        }

        setIsSubmitting(true);
        try {
            if (!USE_API_MODE) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                await Swal.fire({
                    icon: 'success',
                    title: 'ปฏิเสธสำเร็จ',
                    text: 'ปฏิเสธพาร์ทเนอร์สำเร็จ',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true
                });
                setModalVisible(false);
                fetchPartners();
            } else {
                const token = localStorage.getItem('accessToken');
                const response = await fetch(
                    `${API_BASE_URL}/api/admin/partner_approvals/${selectedPartner.id}/review`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            status: 'REJECTED',
                            reviewNotes: reviewNotes || 'Application rejected',
                            rejectionReason: rejectionReason
                        })
                    }
                );

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.error || 'Failed to reject partner');
                }

                await Swal.fire({
                    icon: 'success',
                    title: 'ปฏิเสธสำเร็จ',
                    text: 'ปฏิเสธพาร์ทเนอร์สำเร็จ',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true
                });

                setModalVisible(false);
                fetchPartners();
            }
        } catch (error) {
            console.error('Error rejecting partner:', error);
            await Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: error instanceof Error ? error.message : 'ไม่สามารถปฏิเสธพาร์ทเนอร์ได้',
                confirmButtonColor: '#0D263B'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns: ColumnsType<PartnerApproval> = [
        {
            title: '',
            key: 'checkbox',
            width: 50,
            render: () => <input type="checkbox" style={{ width: '18px', height: '18px' }} />,
        },
        {
            title: 'รายชื่อ พาร์ทเนอร์',
            key: 'partner',
            render: (_, record) => (
                <div>
                    <div style={{ color: '#0066FF', fontWeight: '500' }}>
                        {record.accommodation?.name || 'โรงแรมสับชายดี'}
                    </div>
                    <div style={{ color: '#666666', fontSize: '14px' }}>
                        {record.user.fullName}
                    </div>
                </div>
            ),
        },
        {
            title: 'ข้อมูลติดต่อ',
            key: 'contact',
            render: (_, record) => (
                <div>
                    <div style={{ color: '#333333' }}>{record.user.email}</div>
                    <div style={{ color: '#666666', fontSize: '14px' }}>064-2525852</div>
                </div>
            ),
        },
        {
            title: 'ประเภทบริการ',
            key: 'service',
            render: () => (
                <div>
                    <div style={{ color: '#333333' }}>โรงแรมสัตว์เลี้ยง</div>
                    <div style={{ color: '#666666', fontSize: '14px' }}>รับฝากสัตว์เลี้ยง</div>
                    <div style={{ color: '#666666', fontSize: '14px' }}>สนามสัตว์เลี้ยง</div>
                </div>
            ),
        },
        ...(activeTab === 'all' ? [{
            title: 'รหัสระบบ',
            dataIndex: 'accommodationId',
            key: 'accommodationId',
            render: (text: string | null) => (
                <div style={{ color: '#333333' }}>{text || 'Pz25258'}</div>
            ),
        }] : []),
        ...(activeTab === 'new' ? [{
            title: 'วันที่สมัคร',
            key: 'submittedAt',
            render: (record: PartnerApproval) => (
                <div style={{ color: '#333333' }}>
                    {record.submittedAt ? new Date(record.submittedAt).toLocaleDateString('th-TH') : '12/05/68'}
                </div>
            ),
        }] : []),
        {
            title: 'สถานที่ให้บริการ',
            key: 'address',
            render: (_, record) => (
                <div style={{ color: '#333333' }}>
                    {record.accommodation?.address || '2972 Westheimer Rd. Santa Ana, Illinois 85486'}
                </div>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            width: 120,
            render: (record: PartnerApproval) => (
                <Space size="middle">
                    <button 
                        className="p-2 hover:bg-gray-100 rounded"
                        onClick={() => handleViewPartner(record)}
                    >
                        <EyeOutlined style={{ fontSize: '18px', color: '#666666' }} />
                    </button>
                    {activeTab === 'all' && (
                        <button className="p-2 hover:bg-gray-100 rounded">
                            <EditOutlined style={{ fontSize: '18px', color: '#666666' }} />
                        </button>
                    )}
                    <button className="p-2 hover:bg-gray-100 rounded">
                        <DeleteOutlined style={{ fontSize: '18px', color: '#FF4D4F' }} />
                    </button>
                </Space>
            ),
        },
    ];

    const handleTableChange = (page: number, pageSize: number) => {
        setPagination(prev => ({
            ...prev,
            current: page,
            pageSize: pageSize
        }));
    };

    return (
        <div className="flex min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
            <Sidebar />

            <div className="flex-1" style={{ marginLeft: '250px' }}>
                {/* Header */}
                <div className="p-6" style={{ 
                    background: 'linear-gradient(to right, #C6CEDE, #FFFFFF)'
                }}>
                    <h1 className="text-3xl font-bold" style={{ color: '#333333' }}>
                        จัดการ Partner
                    </h1>
                </div>

                {/* Content */}
                <div className="p-6" style={{backgroundColor: "#FFFFFF"}}>
                    {/* Tabs */}
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => setActiveTab('all')}
                            className="px-6 py-3 rounded-lg font-medium"
                            style={{
                                backgroundColor: activeTab === 'all' ? '#1E1548' : '#D1D5DB',
                                color: activeTab === 'all' ? '#FFFFFF' : '#666666'
                            }}
                        >
                            จัดการ Partner ทั้งหมด
                        </button>
                        <button
                            onClick={() => setActiveTab('new')}
                            className="px-6 py-3 rounded-lg font-medium"
                            style={{
                                backgroundColor: activeTab === 'new' ? '#1E1548' : '#D1D5DB',
                                color: activeTab === 'new' ? '#FFFFFF' : '#666666'
                            }}
                        >
                            จัดการ Partner ใหม่
                        </button>
                    </div>

                    {/* Search and Actions */}
                    <div className="flex justify-between items-center mb-6">
                        <Input
                            placeholder="Search for id, name Partner"
                            prefix={<SearchOutlined style={{ color: '#999999' }} />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: '400px', height: '42px' }}
                        />
                        <div className="flex gap-3">
                            <Button
                                icon={<DownloadOutlined />}
                                style={{ height: '42px', borderColor: '#D1D5DB' }}
                            >
                                Export
                            </Button>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                style={{ height: '42px', backgroundColor: '#0066FF' }}
                            >
                                เพิ่ม พาร์ทเนอร์
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="rounded-lg" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <Table
                            columns={columns}
                            dataSource={data}
                            loading={isLoading}
                            rowKey="id"
                            pagination={{
                                current: pagination.current,
                                pageSize: pagination.pageSize,
                                total: pagination.total,
                                showSizeChanger: true,
                                showTotal: (total, range) => `${range[0]} - ${range[1]} of ${total} Pages`,
                                onChange: handleTableChange,
                                position: ['bottomCenter'],
                                style: { marginTop: '16px', marginBottom: '16px' }
                            }}
                            style={{ borderRadius: '8px', overflow: 'hidden' }}
                        />
                    </div>

                    {/* Approval Modal */}
                    <Modal
                        title={<div className="text-xl font-bold" style={{ color: '#333333' }}>รายละเอียดพาร์ทเนอร์</div>}
                        open={modalVisible}
                        onCancel={() => setModalVisible(false)}
                        footer={null}
                        width={700}
                    >
                        {selectedPartner && (
                            <div className="space-y-4">
                                {/* Partner Information */}
                                <div className="p-4 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
                                    <h3 className="font-semibold mb-3" style={{ color: '#333333' }}>ข้อมูลพาร์ทเนอร์</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <div className="text-sm" style={{ color: '#666666' }}>ชื่อผู้ใช้</div>
                                            <div className="font-medium" style={{ color: '#333333' }}>{selectedPartner.user.fullName}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm" style={{ color: '#666666' }}>อีเมล</div>
                                            <div className="font-medium" style={{ color: '#333333' }}>{selectedPartner.user.email}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm" style={{ color: '#666666' }}>ชื่อที่พัก</div>
                                            <div className="font-medium" style={{ color: '#333333' }}>{selectedPartner.accommodation?.name || '-'}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm" style={{ color: '#666666' }}>ที่อยู่</div>
                                            <div className="font-medium" style={{ color: '#333333' }}>{selectedPartner.accommodation?.address || '-'}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm" style={{ color: '#666666' }}>วันที่สมัคร</div>
                                            <div className="font-medium" style={{ color: '#333333' }}>
                                                {selectedPartner.submittedAt ? new Date(selectedPartner.submittedAt).toLocaleDateString('th-TH') : '-'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm" style={{ color: '#666666' }}>สถานะ</div>
                                            <div className="font-medium" style={{ 
                                                color: selectedPartner.status === 'APPROVED' ? '#10B981' : 
                                                       selectedPartner.status === 'PENDING' ? '#F59E0B' : '#EF4444'
                                            }}>
                                                {selectedPartner.status === 'APPROVED' ? 'อนุมัติแล้ว' :
                                                 selectedPartner.status === 'PENDING' ? 'รอการอนุมัติ' :
                                                 selectedPartner.status === 'REJECTED' ? 'ปฏิเสธ' : 'แบบร่าง'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Review Notes */}
                                {activeTab === 'new' && selectedPartner.status === 'PENDING' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>
                                                หมายเหตุการตรวจสอบ
                                            </label>
                                            <Input.TextArea
                                                rows={3}
                                                placeholder="กรอกหมายเหตุ (ถ้ามี)"
                                                value={reviewNotes}
                                                onChange={(e) => setReviewNotes(e.target.value)}
                                                style={{ borderColor: '#D9D9D9' }}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>
                                                เหตุผลในการปฏิเสธ <span style={{ color: '#EF4444' }}>*</span>
                                            </label>
                                            <Input.TextArea
                                                rows={3}
                                                placeholder="กรอกเหตุผลในการปฏิเสธ (ถ้าปฏิเสธ)"
                                                value={rejectionReason}
                                                onChange={(e) => setRejectionReason(e.target.value)}
                                                style={{ borderColor: '#D9D9D9' }}
                                            />
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 justify-end pt-4 border-t">
                                            <Button
                                                size="large"
                                                onClick={() => setModalVisible(false)}
                                                style={{
                                                    borderColor: '#D9D9D9',
                                                    color: '#666666'
                                                }}
                                            >
                                                ยกเลิก
                                            </Button>
                                            <Button
                                                size="large"
                                                loading={isSubmitting}
                                                onClick={handleReject}
                                                style={{
                                                    backgroundColor: '#EF4444',
                                                    borderColor: '#EF4444',
                                                    color: '#FFFFFF'
                                                }}
                                            >
                                                ปฏิเสธ
                                            </Button>
                                            <Button
                                                size="large"
                                                loading={isSubmitting}
                                                onClick={handleApprove}
                                                style={{
                                                    backgroundColor: '#10B981',
                                                    borderColor: '#10B981',
                                                    color: '#FFFFFF'
                                                }}
                                            >
                                                อนุมัติ
                                            </Button>
                                        </div>
                                    </>
                                )}

                                {/* If already reviewed */}
                                {selectedPartner.status !== 'PENDING' && (
                                    <div className="p-4 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
                                        <h3 className="font-semibold mb-2" style={{ color: '#333333' }}>ผลการตรวจสอบ</h3>
                                        {selectedPartner.review?.reviewNotes && (
                                            <div className="mb-2">
                                                <div className="text-sm" style={{ color: '#666666' }}>หมายเหตุ:</div>
                                                <div style={{ color: '#333333' }}>{selectedPartner.review.reviewNotes}</div>
                                            </div>
                                        )}
                                        {selectedPartner.review?.rejectionReason && (
                                            <div>
                                                <div className="text-sm" style={{ color: '#666666' }}>เหตุผลในการปฏิเสธ:</div>
                                                <div style={{ color: '#EF4444' }}>{selectedPartner.review.rejectionReason}</div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </Modal>
                </div>
            </div>
        </div>
    );
}
