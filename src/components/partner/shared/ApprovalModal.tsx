'use client';

import { Modal, Button } from 'antd';
import { ClockCircleOutlined, LogoutOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

interface ApprovalModalProps {
    isOpen: boolean;
}

export default function ApprovalModal({ isOpen }: ApprovalModalProps) {
    const router = useRouter();

    const handleLogout = () => {
        // Clear authentication data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('approvalStatus');
        localStorage.removeItem('accommodationName');

        // Redirect to login page
        router.push('/login');
    };

    return (
        <Modal
            open={isOpen}
            closable={false}
            footer={null}
            maskClosable={false}
            keyboard={false}
            centered
            width={500}
            styles={{
                mask: { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
            }}
        >
            <div className="text-center py-12 px-6">
                <div className="mb-6">
                    <div
                        className="mx-auto w-32 h-32 rounded-full flex items-center justify-center mb-6"
                        style={{ backgroundColor: '#FEF3C7' }}
                    >
                        <ClockCircleOutlined
                            style={{
                                fontSize: '64px',
                                color: '#F59E0B'
                            }}
                        />
                    </div>
                </div>
                <h2
                    className="text-3xl font-bold mb-4"
                    style={{ color: '#1F2937' }}
                >
                    กรุณารอแอดมินตรวจสอบ
                </h2>
                <p
                    className="text-lg mb-2"
                    style={{ color: '#6B7280' }}
                >
                    กรุณารอการอนุมัติจากทีมงาน
                </p>

                {/* Logout Button */}
                <Button
                    type="default"
                    size="large"
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                    style={{
                        marginTop: '0.5rem',
                        width: '200px',      // 👈 กำหนดความกว้างตามต้องการ เช่น '100%', '300px'
                        height: '60px',      // 👈 กำหนดความสูงตามต้องการ
                        backgroundColor: '#DC2626',
                        borderColor: '#DC2626',
                        color: '#FFFFFF',
                        fontSize: '50px',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#B91C1C';
                        e.currentTarget.style.borderColor = '#B91C1C';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#DC2626';
                        e.currentTarget.style.borderColor = '#DC2626';
                    }}
                >
                </Button>
            </div>
        </Modal>
    );
}
