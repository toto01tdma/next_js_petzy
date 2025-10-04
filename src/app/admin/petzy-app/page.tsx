'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/shared/Sidebar';
import { Button, Switch } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export default function AdminPetzyApp() {
    const router = useRouter();
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [isAppEnabled, setIsAppEnabled] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }
    }, [router]);

    const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setBannerFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        console.log('Submitting banner:', bannerFile);
        // API call would go here
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
                                <div className="relative">
                                    <img 
                                        src={bannerPreview} 
                                        alt="Banner preview" 
                                        className="w-full h-auto rounded-lg"
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

                        <input
                            type="file"
                            id="banner-upload"
                            accept="image/png"
                            onChange={handleBannerUpload}
                            className="hidden"
                        />
                        <label htmlFor="banner-upload">
                            <Button
                                size="large"
                                style={{
                                    backgroundColor: '#FDB930',
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
                        </label>
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
                        <Switch
                            checked={isAppEnabled}
                            onChange={setIsAppEnabled}
                            style={{
                                backgroundColor: isAppEnabled ? '#FDB930' : '#CCCCCC',
                                width: '60px',
                                height: '30px'
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
