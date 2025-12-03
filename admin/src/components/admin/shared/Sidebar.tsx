'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

interface MenuItem {
    title: string;
    path: string;
    icon: string;
    submenu?: MenuItem[];
}

const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();

    const menuItems: MenuItem[] = [
        {
            title: 'หน้ารวมรายการ',
            path: '/dashboard',
            icon: '📊'
        },
        {
            title: 'จัดการ Partner',
            path: '/partners',
            icon: '🤝'
        },
        {
            title: 'จัดการ Customer',
            path: '/customers',
            icon: '👥'
        },
        {
            title: 'จัดการ Petzy App',
            path: '/petzy-app',
            icon: '📱'
        },
        {
            title: 'จัดการโปรโมชั่น',
            path: '/promotions',
            icon: '🎁'
        },
        {
            title: 'ดูประวัติการชำระเงิน',
            path: '/transactions',
            icon: '💳'
        },
        {
            title: 'การแชทของคุณ',
            path: '/chats',
            icon: '💬'
        },
        {
            title: 'นโยบายความเป็นส่วนตัว',
            path: '/policy',
            icon: '📋'
        },
        {
            title: 'ตั้งค่าโปรไฟล์ผู้ใช้',
            path: '/profile',
            icon: '👤'
        },
        {
            title: 'Manage',
            path: '/manage/location',
            icon: '⚙️',
        },
        {
            title: 'Manage',
            path: '/manage',
            icon: '⚙️',
            submenu: [
                {
                    title: 'Location',
                    path: '/manage/location',
                    icon: '📍'
                }
            ]
        }
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <div 
            className="fixed left-0 top-0 h-screen flex flex-col"
            style={{ 
                width: '250px',
                background: '#2C62D8',
                zIndex: 1000
            }}
        >
            {/* Logo Section */}
            <div className="px-5 py-4 rounded-md m-4 flex items-center justify-center" style={{ backgroundColor: '#000000' }}>
                <Image src="/assets/images/logo/logo.png" alt="logo" width={100} height={100} />
            </div>
            <p className="text-center text-md" style={{ color: '#FFFFFF', marginBottom: '0.25rem' }}>
                PETZY ADMIN
            </p>
            <p className="text-center text-sm" style={{ color: '#FFFFFF', marginBottom: '0.25rem' }}>
                Administrator
            </p>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-4">
                {menuItems.map((item, index) => {
                    const hasSubmenu = item.submenu && item.submenu.length > 0;
                    const isManageActive = item.path === '/manage' && (pathname.startsWith('/manage'));
                    const isItemActive = isActive(item.path) || isManageActive;
                    
                    return (
                        <div key={index}>
                            {hasSubmenu ? (
                                <div
                                    onClick={() => {
                                        // Toggle submenu visibility by navigating to parent path
                                        if (!isManageActive) {
                                            router.push(item.path);
                                        }
                                    }}
                                    className="block px-6 py-3 transition-all cursor-pointer"
                                    style={{
                                        backgroundColor: isItemActive ? '#3D50DF' : 'transparent',
                                        color: '#FFFFFF',
                                        borderLeft: isItemActive ? '4px solid #FFFFFF' : '4px solid transparent',
                                        fontWeight: isItemActive ? '600' : '400'
                                    }}
                                >
                                    <div className="flex items-center">
                                        <span className="mr-3 text-xl">{item.icon}</span>
                                        <span className="text-sm">{item.title}</span>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    href={item.path}
                                    className="block px-6 py-3 transition-all cursor-pointer"
                                    style={{
                                        backgroundColor: isItemActive ? '#3D50DF' : 'transparent',
                                        color: '#FFFFFF',
                                        borderLeft: isItemActive ? '4px solid #FFFFFF' : '4px solid transparent',
                                        fontWeight: isItemActive ? '600' : '400'
                                    }}
                                >
                                    <div className="flex items-center">
                                        <span className="mr-3 text-xl">{item.icon}</span>
                                        <span className="text-sm">{item.title}</span>
                                    </div>
                                </Link>
                            )}
                            {hasSubmenu && isManageActive && (
                                <div className="pl-8">
                                    {item.submenu!.map((subItem, subIndex) => (
                                        <Link
                                            key={subIndex}
                                            href={subItem.path}
                                            className="block px-6 py-2 transition-all cursor-pointer"
                                            style={{
                                                backgroundColor: isActive(subItem.path) ? '#3D50DF' : 'transparent',
                                                color: '#FFFFFF',
                                                borderLeft: isActive(subItem.path) ? '4px solid #FFFFFF' : '4px solid transparent',
                                                fontWeight: isActive(subItem.path) ? '600' : '400'
                                            }}
                                        >
                                            <div className="flex items-center">
                                                <span className="mr-3 text-lg">{subItem.icon}</span>
                                                <span className="text-sm">{subItem.title}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Logout Button */}
            <div className="p-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <button
                    onClick={() => {
                        localStorage.clear();
                        router.push('/login');
                    }}
                    className="w-full py-2 px-4 rounded transition-all"
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}
                >
                    ออกจากระบบ
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
