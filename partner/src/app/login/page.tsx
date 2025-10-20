'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginRedirect() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to partner login
        router.replace('/partner/login');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">กำลังเปลี่ยนเส้นทาง...</p>
            </div>
        </div>
    );
}

