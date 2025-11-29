'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/shared/Sidebar';
import Image from 'next/image';
import { Button, Switch, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { checkAuthError } from '@/utils/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
const USE_API_MODE = process.env.NEXT_PUBLIC_USE_API_MODE === 'true';

export default function AdminPetzyApp() {
    const router = useRouter();
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [currentBannerUrl, setCurrentBannerUrl] = useState<string | null>(null);
    const [isAppEnabled, setIsAppEnabled] = useState(false);
    const [toggleDisabled, setToggleDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }
        
        // Fetch banner data on mount
        fetchBanner();
    }, [router]);

    // Fetch banner data from API
    const fetchBanner = async () => {
        if (!USE_API_MODE) {
            setIsFetching(false);
            return;
        }

        const token = localStorage.getItem('accessToken');
        setIsFetching(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/banner`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            // Check for authentication error
            if (checkAuthError(response, result)) {
                return;
            }

            if (result.success && result.data) {
                // Banner exists - use API endpoint for banner image
                const { getBannerImageUrl } = await import('@/utils/fileImageUrl');
                const bannerUrl = getBannerImageUrl(result.data.banner_url);
                
                setCurrentBannerUrl(result.data.banner_url);
                if (bannerUrl) {
                    setBannerPreview(bannerUrl);
                }
                setIsAppEnabled(result.data.is_active);
                setToggleDisabled(false); // Enable toggle
            } else {
                // No banner yet
                setCurrentBannerUrl(null);
                setBannerPreview(null);
                setIsAppEnabled(false);
                setToggleDisabled(true); // Disable toggle
            }
        } catch (error) {
            console.error('Error fetching banner:', error);
            setToggleDisabled(true);
        } finally {
            setIsFetching(false);
        }
    };

    // Handle banner file selection
    const handleBannerFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                Swal.fire({
                    icon: 'error',
                    title: 'ไฟล์ไม่ถูกต้อง',
                    text: 'กรุณาเลือกไฟล์รูปภาพ (PNG)',
                    confirmButtonColor: '#FDB930'
                });
                return;
            }

            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                Swal.fire({
                    icon: 'error',
                    title: 'ไฟล์ใหญ่เกินไป',
                    text: 'กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 5 MB',
                    confirmButtonColor: '#FDB930'
                });
                return;
            }

            setBannerFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Upload banner to API
    const handleBannerUpload = async () => {
        if (!bannerFile) {
            await Swal.fire({
                icon: 'warning',
                title: 'ไม่พบไฟล์',
                text: 'กรุณาเลือกรูปภาพก่อนอัปโหลด',
                confirmButtonColor: '#FDB930'
            });
            return;
        }

        if (!USE_API_MODE) {
            await Swal.fire({
                icon: 'success',
                title: 'สำเร็จ (โหมดพรีวิว)',
                text: 'แบนเนอร์ถูกอัปโหลดแล้ว',
                confirmButtonColor: '#FDB930'
            });
            setToggleDisabled(false);
            return;
        }

        const token = localStorage.getItem('accessToken');
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('banner', bannerFile);

            const response = await fetch(`${API_BASE_URL}/api/admin/banner/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();

            // Check for authentication error
            if (checkAuthError(response, result)) {
                return;
            }

            if (result.success) {
                // Use API endpoint for banner image
                const { getBannerImageUrl } = await import('@/utils/fileImageUrl');
                const bannerUrl = getBannerImageUrl(result.data.banner_url);

                setCurrentBannerUrl(result.data.banner_url);
                if (bannerUrl) {
                    setBannerPreview(bannerUrl);
                }
                setIsAppEnabled(result.data.is_active);
                setToggleDisabled(false); // Enable toggle after upload
                setBannerFile(null); // Clear file input

                await Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ',
                    text: result.message || 'แบนเนอร์ถูกอัปโหลดแล้ว',
                    confirmButtonColor: '#FDB930'
                });
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'ไม่สามารถอัปโหลดได้',
                    text: result.message || result.error || 'เกิดข้อผิดพลาดในการอัปโหลด',
                    confirmButtonColor: '#FDB930'
                });
            }
        } catch (error) {
            console.error('Error uploading banner:', error);
            await Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถอัปโหลดรูปภาพได้',
                confirmButtonColor: '#FDB930'
            });
        } finally {
            setIsUploading(false);
        }
    };

    // Toggle banner status
    const handleToggleStatus = async (checked: boolean) => {
        if (!currentBannerUrl && USE_API_MODE) {
            await Swal.fire({
                icon: 'warning',
                title: 'ไม่พบแบนเนอร์',
                text: 'กรุณาอัปโหลดแบนเนอร์ก่อนเปิดใช้งาน',
                confirmButtonColor: '#FDB930'
            });
            return;
        }

        if (!USE_API_MODE) {
            setIsAppEnabled(checked);
            await Swal.fire({
                icon: 'success',
                title: 'สำเร็จ (โหมดพรีวิว)',
                text: `แบนเนอร์${checked ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}แล้ว`,
                confirmButtonColor: '#FDB930'
            });
            return;
        }

        const token = localStorage.getItem('accessToken');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/banner/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ is_active: checked })
            });

            const result = await response.json();

            // Check for authentication error
            if (checkAuthError(response, result)) {
                return;
            }

            if (result.success) {
                setIsAppEnabled(result.data.is_active);
                await Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ',
                    text: `แบนเนอร์${checked ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}แล้ว`,
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true
                });
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'ไม่สามารถอัปเดตได้',
                    text: result.message || result.error || 'เกิดข้อผิดพลาดในการอัปเดตสถานะ',
                    confirmButtonColor: '#FDB930'
                });
                // Revert toggle state
                setIsAppEnabled(!checked);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            await Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถอัปเดตสถานะได้',
                confirmButtonColor: '#FDB930'
            });
            // Revert toggle state
            setIsAppEnabled(!checked);
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
                <Sidebar />
                <div className="flex-1" style={{ marginLeft: '250px' }}>
                    <div className="flex items-center justify-center h-screen">
                        <Spin size="large" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
            <Sidebar />

            <div className="flex-1" style={{ marginLeft: '250px' }}>
                {/* Header */}
                <div className="p-6" style={{ 
                    background: 'linear-gradient(to right, #C6CEDE, #FFFFFF)'
                }}>
                    <h1 className="text-3xl font-bold" style={{ color: '#333333' }}>
                        จัดการ Petzy App
                    </h1>
                </div>

                {/* Content */}
                <div className="p-6" style={{backgroundColor: "#FFFFFF"}}>
                    {/* Banner Upload Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4" style={{ color: '#000000' }}>
                        จัดการป๊อบอัพ
                        </h2>
                        
                        <div 
                            className="border-2 border-dashed rounded-lg p-12 text-center mb-6"
                            style={{ 
                                backgroundColor: '#E8E8E8',
                                borderColor: '#CCCCCC',
                                maxWidth: '600px'
                            }}
                        >
                            {bannerPreview ? (
                                <div className="relative w-full h-auto">
                                    <Image 
                                        src={bannerPreview} 
                                        alt="Banner preview" 
                                        width={600}
                                        height={400}
                                        className="w-full h-auto rounded-lg"
                                        style={{ objectFit: 'contain', maxWidth: '600px', maxHeight: '400px' }}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <div className="mb-4">
                                        <UploadOutlined style={{ fontSize: '48px', color: '#666666' }} />
                                    </div>
                                    <p className="text-lg font-medium mb-2" style={{ color: '#000000' }}>
                                        อัพโหลดรูปป้อนอัพของคุณ
                                    </p>
                                    <p className="text-sm" style={{ color: '#666666' }}>
                                        ขนาดรูปไม่เกิน 500x500 pixel* png.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 items-center">
                        <input
                            type="file"
                            id="banner-upload"
                                accept="image/png,image/jpeg,image/jpg"
                                onChange={handleBannerFileSelect}
                            className="hidden"
                        />
                            <label 
                                htmlFor="banner-upload"
                                style={{
                                    display: 'inline-block',
                                    backgroundColor: '#E0E0E0',
                                    color: '#000000',
                                    border: 'none',
                                    fontWeight: 600,
                                    height: '50px',
                                    paddingLeft: '48px',
                                    paddingRight: '48px',
                                    borderRadius: '8px',
                                    cursor: isUploading ? 'not-allowed' : 'pointer',
                                    lineHeight: '50px',
                                    opacity: isUploading ? 0.5 : 1,
                                    pointerEvents: isUploading ? 'none' : 'auto',
                                    fontSize: '16px'
                                }}
                            >
                                เลือกรูปภาพ
                            </label>

                            <Button
                                size="large"
                                onClick={handleBannerUpload}
                                loading={isUploading}
                                disabled={!bannerFile || isUploading}
                                style={{
                                    backgroundColor: bannerFile && !isUploading ? '#FDB930' : '#CCCCCC',
                                    color: '#000000',
                                    border: 'none',
                                    fontWeight: 600,
                                    height: '50px',
                                    paddingLeft: '48px',
                                    paddingRight: '48px',
                                    borderRadius: '8px'
                                }}
                            >
                                ยืนยันข้อมูล
                            </Button>
                        </div>
                    </div>

                    {/* Enable/Disable Toggle */}
                    <div 
                        className="p-6 rounded-lg inline-block"
                        style={{ 
                            border: '2px solid #000000',
                            maxWidth: '400px'
                        }}
                    >
                        <h3 className="text-xl font-bold mb-4" style={{ color: '#000000' }}>
                            จัดการเปิด-ปิด แอปพลิเคชั่น
                        </h3>
                        <div className="flex items-center gap-4">
                        <Switch
                            checked={isAppEnabled}
                                onChange={handleToggleStatus}
                                disabled={toggleDisabled || isLoading}
                                loading={isLoading}
                            style={{
                                backgroundColor: isAppEnabled ? '#FDB930' : '#CCCCCC',
                                width: '60px',
                                height: '30px'
                            }}
                        />
                            <span style={{ color: '#666666', fontSize: '14px' }}>
                                {toggleDisabled ? '(กรุณาอัปโหลดแบนเนอร์ก่อน)' : ''}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
