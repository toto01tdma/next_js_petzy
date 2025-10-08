'use client';

import { Input } from 'antd';

interface HotelLocationSectionProps {
    formData: {
        accommodationName: string;
        accommodationNameEn: string;
        tradeRegistrationNumber: string;
        address: string;
        businessEmail: string;
        officePhone: string;
        googleMapsLink: string;
        mobilePhone: string;
    };
    onInputChange: (field: string, value: string) => void;
    disabled?: boolean;
}

export default function HotelLocationSection({
    formData,
    onInputChange,
    disabled = false
}: HotelLocationSectionProps) {
    return (
        <>
            {/* Section Header */}
            <div className="text-center mb-4 w-full py-2.5" style={{ backgroundColor: '#28A7CB' }}>
                <span className="text-2xl" style={{ color: '#FFFFFF' }}>
                    กรุณากรอกข้อมูลเกี่ยวกับสถานที่ตั้งของโรงแรมหรือที่พักของคุณ
                </span>
            </div>

            {/* Form Fields */}
            <div className="py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-3">
                        <div>
                            <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                ชื่อ โรงแรม หรือ สถานที่พัก *
                            </label>
                            <Input
                                value={formData.accommodationName}
                                onChange={(e) => onInputChange('accommodationName', e.target.value)}
                                placeholder="กรุณากรอกชื่อจริงครั้งเพื่อยืนยันความถูกต้อง"
                                className="w-full h-12 text-base"
                                style={{ height: '48px', fontSize: '16px' }}
                                disabled={disabled}
                            />
                            <p className="text-sm text-gray-500 mt-1" style={{ marginBottom: 0, marginTop: '0.4rem' }}>
                                *กรุณากรอกชื่อจริงครั้งเพื่อยืนยันความถูกต้อง
                            </p>
                        </div>

                        <div>
                            <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                เลขที่ทะเบียนการค้า *
                            </label>
                            <Input
                                value={formData.tradeRegistrationNumber}
                                onChange={(e) => onInputChange('tradeRegistrationNumber', e.target.value)}
                                className="w-full h-12 text-base"
                                style={{ height: '48px', fontSize: '16px' }}
                                disabled={disabled}
                            />
                            <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.4rem', color: '#FFFFFF' }}>
                                ...
                            </p>
                        </div>

                        <div>
                            <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                สถานที่อยู่ของสถานที่ให้บริการ *
                            </label>
                            <Input
                                value={formData.address}
                                onChange={(e) => onInputChange('address', e.target.value)}
                                className="w-full h-12 text-base"
                                style={{ height: '48px', fontSize: '16px' }}
                                disabled={disabled}
                            />
                            <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.4rem', color: '#FFFFFF' }}>
                                ...
                            </p>
                        </div>

                        <div>
                            <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                อีเมล์ธุรกิจ *
                            </label>
                            <Input
                                value={formData.businessEmail}
                                onChange={(e) => onInputChange('businessEmail', e.target.value)}
                                className="w-full h-12 text-base"
                                style={{ height: '48px', fontSize: '16px' }}
                                disabled={disabled}
                            />
                            <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.4rem', color: '#FFFFFF' }}>
                                ...
                            </p>
                        </div>

                        <div>
                            <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                ใส่ลิงก์ Google map ของสถานที่ให้บริการ *
                            </label>
                            <Input
                                value={formData.googleMapsLink}
                                onChange={(e) => onInputChange('googleMapsLink', e.target.value)}
                                className="w-full h-12 text-base"
                                style={{ height: '48px', fontSize: '16px' }}
                                disabled={disabled}
                            />
                            <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.4rem', color: '#FFFFFF' }}>
                                ...
                            </p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-3">
                        <div>
                            <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                ชื่อ โรงแรม หรือ สถานที่พัก *(ภาษาอังกฤษ)
                            </label>
                            <Input
                                value={formData.accommodationNameEn}
                                onChange={(e) => onInputChange('accommodationNameEn', e.target.value)}
                                className="w-full h-12 text-base"
                                style={{ height: '48px', fontSize: '16px' }}
                                disabled={disabled}
                            />
                            <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.4rem', color: '#FFFFFF' }}>
                                ...
                            </p>
                        </div>

                        <div>
                            <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                เบอร์โทรศัพท์สำนักงาน *
                            </label>
                            <Input
                                value={formData.officePhone}
                                onChange={(e) => onInputChange('officePhone', e.target.value)}
                                className="w-full h-12 text-base"
                                style={{ height: '48px', fontSize: '16px' }}
                                disabled={disabled}
                            />
                            <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.4rem', color: '#FFFFFF' }}>
                                ...
                            </p>
                        </div>

                        <div>
                            <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                เบอร์โทรศัพท์มือถือ *
                            </label>
                            <Input
                                value={formData.mobilePhone}
                                onChange={(e) => onInputChange('mobilePhone', e.target.value)}
                                className="w-full h-12 text-base"
                                style={{ height: '48px', fontSize: '16px' }}
                                disabled={disabled}
                            />
                            <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.4rem', color: '#FFFFFF' }}>
                                ...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

