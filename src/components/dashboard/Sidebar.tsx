'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Avatar } from 'antd';
import { 
    HomeOutlined, 
    UserOutlined, 
    SettingOutlined, 
    FileTextOutlined, 
    TeamOutlined, 
    DollarOutlined,
    QuestionCircleOutlined,
    CloseOutlined
} from '@ant-design/icons';

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();

    const menuItems = [
        { icon: <HomeOutlined />, label: 'Home', path: '/dashboard', active: pathname === '/dashboard' },
        { icon: <UserOutlined />, label: 'หน้าจองเข้าพัก', path: '/promotions', active: pathname === '/promotions' },
        { icon: <SettingOutlined />, label: 'จัดการห้องพัก', path: '/manage-rooms', active: pathname === '/manage-rooms' },
        { icon: <FileTextOutlined />, label: 'จัดการโปรโมชั่น', path: '/promotions', active: pathname === '/promotions' },
        { icon: <TeamOutlined />, label: 'ดูประวัติการจ่ายเงิน', path: '/payment-history', active: pathname === '/payment-history' },
        { icon: <DollarOutlined />, label: 'การแชทของคุณ', path: '/chat', active: pathname === '/chat' },
        { icon: <FileTextOutlined />, label: 'สัญญาและเงื่อนไขคู่ค้า', path: '/terms', active: pathname === '/terms' },
        { icon: <SettingOutlined />, label: 'ตั้งค่าโปรไฟล์ผู้ใช้', path: '/profile', active: pathname === '/profile' },
    ];

    const handleMenuClick = (path: string) => {
        router.push(path);
        // Close sidebar on mobile after navigation
        if (window.innerWidth < 1024) {
            onToggle();
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed left-0 top-0 h-full bg-[#100D40] text-white z-50 transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:relative lg:z-auto
                ${isOpen ? 'w-64' : 'w-0 lg:w-64'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar size={40} src="/api/placeholder/40/40" />
                                <div>
                                    <p className="font-medium">Administrator</p>
                                    <p className="text-sm text-gray-400">โรงแรมยูนิค</p>
                                </div>
                            </div>
                            <button 
                                onClick={onToggle}
                                className="lg:hidden text-white hover:text-gray-300"
                            >
                                <CloseOutlined />
                            </button>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 py-4">
                        {menuItems.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => handleMenuClick(item.path)}
                                className={`
                                    flex items-center gap-3 px-4 py-3 mx-2 rounded-lg cursor-pointer transition-colors
                                    ${item.active 
                                        ? 'bg-red-600 text-white' 
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }
                                `}
                            >
                                <span className="text-sm">{item.label}</span>
                            </div>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-700">
                        <div className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer">
                            <QuestionCircleOutlined className="text-lg" />
                            <span className="text-sm">Get Help</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
