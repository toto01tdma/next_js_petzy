'use client';

import { Modal } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

interface ApprovalModalProps {
    isOpen: boolean;
}

export default function ApprovalModal({ isOpen }: ApprovalModalProps) {
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
                    ระบบกำลังตรวจสอบข้อมูลของคุณ
                </p>
                <p 
                    className="text-base" 
                    style={{ color: '#9CA3AF' }}
                >
                    กรุณารอการอนุมัติจากทีมงาน
                </p>
            </div>
        </Modal>
    );
}
