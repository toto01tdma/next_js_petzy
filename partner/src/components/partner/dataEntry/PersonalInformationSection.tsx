'use client';

import { Input } from 'antd';

interface PersonalInformationSectionProps {
    formData: {
        firstName: string;
        lastName: string;
        nationalIdNumber: string;
        email: string;
        phoneNumber: string;
        firstNameEng: string;
        lastNameEng: string;
        corporateTaxId: string;
        additionalDetails: string;
        backupPhone: string;
    };
    onInputChange: (field: string, value: string) => void;
    disabled?: boolean;
}

export default function PersonalInformationSection({
    formData,
    onInputChange,
    disabled = false
}: PersonalInformationSectionProps) {
    return (
        <>
            {/* Section Header */}
            <div className="text-center mb-4 w-full py-2.5" style={{ backgroundColor: '#28A7CB' }}>
                <span className="text-2xl" style={{ color: '#FFFFFF' }}>
                    กรุณากรอกรายละเอียดข้อมูลส่วนตัวเพื่อเริ่มต้นทำงานกับเรา
                </span>
            </div>

            {/* Form Fields */}
            <div className="py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-3">
                        <div>
                            <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                ชื่อ *
                            </label>
                            <Input
                                value={formData.firstName}
                                onChange={(e) => onInputChange('firstName', e.target.value)}
                                className="w-full h-12 text-base"
                                style={{ height: '48px', fontSize: '16px' }}
                                disabled={disabled}
                            />
                            <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.4rem', color: '#6B7280' }}>
                                *กรุณากรอกชื่อจริงเพื่อยืนยันความถูกต้อง
                            </p>
                        </div>

                        <div>
                            <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                นามสกุล *
                            </label>
                            <Input
                                value={formData.lastName}
                                onChange={(e) => onInputChange('lastName', e.target.value)}
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
                                รหัสประจำตัวประชาชน *
                            </label>
                            <Input
                                value={formData.nationalIdNumber}
                                onChange={(e) => onInputChange('nationalIdNumber', e.target.value)}
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
                                อีเมล์ *
                            </label>
                            <Input
                                value={formData.email}
                                onChange={(e) => onInputChange('email', e.target.value)}
                                className="w-full h-12 text-base"
                                style={{ height: '48px', fontSize: '16px', backgroundColor: '#F3F4F6' }}
                                readOnly
                            />
                            <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.4rem', color: '#FFFFFF' }}>
                                ...
                            </p>
                        </div>

                        <div>
                            <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                เบอร์โทรศัพท์ติดต่อ *
                            </label>
                            <Input
                                value={formData.phoneNumber}
                                onChange={(e) => onInputChange('phoneNumber', e.target.value)}
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
                                ชื่อ *(ภาษาอังกฤษ)
                            </label>
                            <Input
                                value={formData.firstNameEng}
                                onChange={(e) => onInputChange('firstNameEng', e.target.value)}
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
                                นามสกุล *(ภาษาอังกฤษ)
                            </label>
                            <Input
                                value={formData.lastNameEng}
                                onChange={(e) => onInputChange('lastNameEng', e.target.value)}
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
                                รหัสผู้เสียภาษีองค์กร *
                            </label>
                            <Input
                                value={formData.corporateTaxId}
                                onChange={(e) => onInputChange('corporateTaxId', e.target.value)}
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
                                กรอกรายละเอียดเพิ่มเติม เพื่อประกอบการพิจารณา
                            </label>
                            <Input
                                value={formData.additionalDetails}
                                onChange={(e) => onInputChange('additionalDetails', e.target.value)}
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
                                เบอร์โทรศัพท์ติดต่อ(สำรอง) *
                            </label>
                            <Input
                                value={formData.backupPhone}
                                onChange={(e) => onInputChange('backupPhone', e.target.value)}
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

