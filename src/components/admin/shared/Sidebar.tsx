'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();

    const menuItems = [
        {
            title: 'หน้ารวมรายการ',
            path: '/admin/dashboard',
            icon: '📊'
        },
        {
            title: 'จัดการ Partner',
            path: '/admin/partners',
            icon: '🤝'
        },
        {
            title: 'จัดการ Costumer',
            path: '/admin/customers',
            icon: '👥'
        },
        {
            title: 'จัดการ Petzy App',
            path: '/admin/petzy-app',
            icon: '📱'
        },
        {
            title: 'จัดการโปรโมชั่น',
            path: '/admin/promotions',
            icon: '🎁'
        },
        {
            title: 'ดูประวัติการทำระเบิน',
            path: '/admin/transactions',
            icon: '💳'
        },
        {
            title: 'การแชทของลูกคุณ',
            path: '/admin/chats',
            icon: '💬'
        },
        {
            title: 'เปิดขายความเป็นเพื่อนของซัน',
            path: '/admin/partnerships',
            icon: '🤝'
        },
        {
            title: 'ตั้งค่าโปรไฟล์ผู้ใช้',
            path: '/admin/profile',
            icon: '👤'
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
                {menuItems.map((item, index) => (
                    <Link
                        key={index}
                        href={item.path}
                        className="block px-6 py-3 transition-all cursor-pointer"
                        style={{
                            backgroundColor: isActive(item.path) ? '#3D50DF' : 'transparent',
                            color: '#FFFFFF',
                            borderLeft: isActive(item.path) ? '4px solid #FFFFFF' : '4px solid transparent',
                            fontWeight: isActive(item.path) ? '600' : '400'
                        }}
                    >
                        <div className="flex items-center">
                            <span className="mr-3 text-xl">{item.icon}</span>
                            <span className="text-sm">{item.title}</span>
                        </div>
                    </Link>
                ))}
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
