'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Avatar } from 'antd';
import { useState, useEffect } from 'react';
import { 
    HomeOutlined, 
    UserOutlined, 
    SettingOutlined, 
    FileTextOutlined, 
    TeamOutlined, 
    DollarOutlined,
    QuestionCircleOutlined,
    CloseOutlined,
    LogoutOutlined
} from '@ant-design/icons';

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [accommodationName, setAccommodationName] = useState('โรงแรมของคุณ');
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

    // Helper function to get full image URL
    const getFullImageUrl = (path: string | null | undefined) => {
        if (!path) return null;
        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
        return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    };

    // Function to load profile image from localStorage
    const loadProfileImage = () => {
        const userDataStr = localStorage.getItem('user');
        if (userDataStr) {
            try {
                const userData = JSON.parse(userDataStr);
                const avatarUrl = userData?.profile?.avatarUrl || null;
                setProfileImageUrl(getFullImageUrl(avatarUrl));
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    };

    // Load accommodation name and profile image from localStorage
    useEffect(() => {
        const storedName = localStorage.getItem('accommodationName');
        if (storedName) {
            setAccommodationName(storedName);
        }
        
        // Load profile image
        loadProfileImage();

        // Listen for storage changes to update profile image in real-time
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'user') {
                loadProfileImage();
            }
            if (e.key === 'accommodationName') {
                setAccommodationName(e.newValue || 'โรงแรมของคุณ');
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Also listen for custom event for same-window updates
        const handleCustomStorageChange = () => {
            loadProfileImage();
            const storedName = localStorage.getItem('accommodationName');
            if (storedName) {
                setAccommodationName(storedName);
            }
        };

        window.addEventListener('profileImageUpdated', handleCustomStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('profileImageUpdated', handleCustomStorageChange);
        };
    }, []);

    const menuItems = [
        { icon: <HomeOutlined />, label: 'Home', path: '/partner/dashboard', active: pathname === '/partner/dashboard' },
        { icon: <UserOutlined />, label: 'หน้าจองเข้าพัก', path: '/partner/promotions', active: pathname === '/partner/promotions' },
        { icon: <SettingOutlined />, label: 'จัดการห้องพัก', path: '/partner/manage-rooms', active: pathname === '/partner/manage-rooms' },
        { icon: <FileTextOutlined />, label: 'จัดการโปรโมชั่น', path: '/partner/promotions', active: pathname === '/partner/promotions' },
        { icon: <TeamOutlined />, label: 'ดูประวัติการจ่ายเงิน', path: '/partner/payment-history', active: pathname === '/partner/payment-history' },
        { icon: <DollarOutlined />, label: 'การแชทของคุณ', path: '/partner/chat', active: pathname === '/partner/chat' },
        { icon: <FileTextOutlined />, label: 'สัญญาและเงื่อนไขคู่ค้า', path: '/partner/terms', active: pathname === '/partner/terms' },
        { icon: <SettingOutlined />, label: 'ตั้งค่าโปรไฟล์ผู้ใช้', path: '/partner/profile', active: pathname === '/partner/profile' },
    ];

    const handleMenuClick = (path: string) => {
        router.push(path);
        // Close sidebar on mobile after navigation
        if (window.innerWidth < 1024) {
            onToggle();
        }
    };

    const handleLogout = () => {
        // Clear authentication data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('savedEmail');
        localStorage.removeItem('approvalStatus');
        localStorage.removeItem('accommodationName');
        
        // Redirect to login page
        router.push('/login');
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
                fixed left-0 top-0 h-full z-50 transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:relative lg:z-auto
                ${isOpen ? 'w-64' : 'w-0 lg:w-64'}
            `}
            style={{ backgroundColor: '#100D40', color: '#FFFFFF' }}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar 
                                    size={40} 
                                    src={profileImageUrl || undefined}
                                    icon={!profileImageUrl ? <UserOutlined /> : undefined}
                                    style={{
                                        backgroundColor: profileImageUrl ? 'transparent' : '#1890ff'
                                    }}
                                />
                                <div>
                                    <p className="font-medium">Partner</p>
                                    <p className="text-sm text-gray-400">{accommodationName}</p>
                                </div>
                            </div>
                            <button 
                                onClick={onToggle}
                                className="lg:hidden hover:text-gray-300"
                                style={{ color: '#FFFFFF' }}
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
                                        ? 'bg-red-600' 
                                        : 'text-gray-300 hover:bg-gray-700'
                                    }
                                `}
                                style={item.active ? { color: '#FFFFFF' } : {}}
                            >
                                <span className="text-sm">{item.label}</span>
                            </div>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-700 space-y-2">
                        <div 
                            className="flex items-center gap-3 text-gray-300 cursor-pointer hover:text-white transition-colors"
                            onClick={handleLogout}
                        >
                            <LogoutOutlined className="text-lg" />
                            <span className="text-sm">ออกจากระบบ</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300 cursor-pointer hover:text-white transition-colors">
                            <QuestionCircleOutlined className="text-lg" />
                            <span className="text-sm">Get Help</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
