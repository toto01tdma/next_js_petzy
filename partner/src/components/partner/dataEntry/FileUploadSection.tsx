'use client';

import SingleFileAttachment from '@/components/partner/shared/SingleFileAttachment';
import LogoFirstPage from '@/components/first_page/logo';
import type { UploadFile } from 'antd';

interface FileUploadSectionProps {
    uploadedImages: { [key: number]: UploadFile };
    onImageUpload: (index: number, file: File) => void;
    onImageRemove: (index: number) => void;
    onPolicyModalOpen: () => void;
}

export default function FileUploadSection({
    uploadedImages,
    onImageUpload,
    onImageRemove,
    onPolicyModalOpen
}: FileUploadSectionProps) {
    return (
        <div className="p-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">กรุณาแนบรูปถ่ายเอกสาร</h3>

            {/* 8 Upload Slots in 4x2 Grid */}
            <div className="grid md:grid-cols-4 gap-4 grid-cols-1">
                {/* Slot 1: ID Card */}
                <SingleFileAttachment
                    uploadedImage={uploadedImages[0]}
                    onImageUpload={(file) => onImageUpload(0, file)}
                    onImageRemove={() => onImageRemove(0)}
                    label="อัพโหลดรูปบัตรประชาชน"
                    description="กรุณาถ่ายรูปบัตรประชาแบบหน้าตรง"
                />

                {/* Slot 2: Business License */}
                <SingleFileAttachment
                    uploadedImage={uploadedImages[1]}
                    onImageUpload={(file) => onImageUpload(1, file)}
                    onImageRemove={() => onImageRemove(1)}
                    label="อัพโหลดรูปทะเบียนการค้า"
                    description="กรุณาถ่ายรูปทะเบียนการค้าแบบหน้าตรง"
                />

                {/* Slot 3: Tax Document */}
                <SingleFileAttachment
                    uploadedImage={uploadedImages[2]}
                    onImageUpload={(file) => onImageUpload(2, file)}
                    onImageRemove={() => onImageRemove(2)}
                    label="อัพโหลดรูปเอกสารภาษีอากร"
                    description="กรุณาถ่ายรูปเอกสารใบกำกับภาษีแบบหน้าตรง"
                />

                {/* Slot 4: House Registration */}
                <SingleFileAttachment
                    uploadedImage={uploadedImages[3]}
                    onImageUpload={(file) => onImageUpload(3, file)}
                    onImageRemove={() => onImageRemove(3)}
                    label="อัพโหลดรูปสำเนาทะเบียนบ้านของสถานที่ตั้งกิจการ"
                    description="กรุณาถ่ายรูปเอกสารเพิ่มเติม แบบหน้าตรง"
                />

                {/* Slot 5: Additional Document */}
                <SingleFileAttachment
                    uploadedImage={uploadedImages[4]}
                    onImageUpload={(file) => onImageUpload(4, file)}
                    onImageRemove={() => onImageRemove(4)}
                    label="อัพโหลดรูปเอกสารเพิ่มเติม"
                    description="กรุณาถ่ายรูปเอกสารเพิ่มเติม อาทิ บิลชำระค่าไฟแบบหน้าตรง"
                />

                {/* Slot 6: Bank Account */}
                <SingleFileAttachment
                    uploadedImage={uploadedImages[5]}
                    onImageUpload={(file) => onImageUpload(5, file)}
                    onImageRemove={() => onImageRemove(5)}
                    label="อัพโหลดรูปบัญชีธนาคาร"
                    description="กรุณาถ่ายรูปเอกสารเพิ่มเติม แบบหน้าตรง *ที่ต้องการให้ระบบโอนค่าที่พัก"
                />

                {/* Slot 7: Building Photo */}
                <SingleFileAttachment
                    uploadedImage={uploadedImages[6]}
                    onImageUpload={(file) => onImageUpload(6, file)}
                    onImageRemove={() => onImageRemove(6)}
                    label="อัพโหลดรูปถ่ายหน้าสถานที่ให้บริการ"
                    description="กรุณาถ่ายรูปด้านหน้าอาคาร สถานที่ตั้งของบริการ"
                />

                {/* Slot 8: Policy Modal */}
                <div
                    className="block w-full h-[300px] cursor-pointer"
                    onClick={onPolicyModalOpen}
                >
                    <div
                        className={`w-full h-[300px] rounded-md px-3 py-3 transition-colors cursor-pointer`}
                        style={{ backgroundColor: '#E0E2E6' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D0D2D6')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#E0E2E6')}
                    >
                        <div className="h-[190px] flex flex-col justify-center items-center">
                            <div className="text-center mb-4">
                                <LogoFirstPage subtext='' />
                                <div className="text-sm" style={{ color: '#4B5563' }}>Pet-Friendly Hotel</div>
                            </div>
                        </div>
                        <div className="text-md text-center mt-1" style={{ fontWeight: '500', color: '#484848' }}>
                            กรุณาคลิก อ่านเอกสาร
                            ข้อตกลงในสัญญาและนโยบายคู่ค้า
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 text-sm" style={{ color: '#6B7280' }}>
                <p>• รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB</p>
                <p>• กรุณาแนบรูปภาพประจำตัวประชาชน และเอกสารที่เกี่ยวข้อง</p>
            </div>
        </div>
    );
}

