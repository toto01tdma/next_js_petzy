'use client';

import { Input } from 'antd';
import SingleFileAttachment from '@/components/partner/shared/SingleFileAttachment';
import type { UploadFile } from 'antd';

const { TextArea } = Input;

interface AccommodationPhotosSectionProps {
    uploadedImages: { [key: number]: UploadFile };
    description: string;
    onImageUpload: (index: number, file: File) => void;
    onImageRemove: (index: number) => void;
    onDescriptionChange: (value: string) => void;
}

export default function AccommodationPhotosSection({
    uploadedImages,
    description,
    onImageUpload,
    onImageRemove,
    onDescriptionChange
}: AccommodationPhotosSectionProps) {
    return (
        <div className="mb-8">
            {/* Image Upload Section */}
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                เพิ่มรูปภาพหน้าปก
            </h3>
            <div className="flex col-span-6 gap-4">
                {/* Left Column - Main Cover Image */}
                <div className="flex-[2] p-0">
                    <SingleFileAttachment
                        uploadedImage={uploadedImages[0]}
                        onImageUpload={(file) => onImageUpload(0, file)}
                        onImageRemove={() => onImageRemove(0)}
                        label="อัพโหลดรูปหน้าที่พักของคุณ"
                        description="ขนาดรูปไม่เกิน 500x500 pixel* png."
                        labelClass="text-center"
                        descriptionClass="text-center"
                        slotHeight="h-[348px]"
                        childHeight="h-[250px]"
                    />
                </div>

                {/* Right Column Grid - Additional Images */}
                <div className="flex-[2] grid grid-cols-3 gap-2 w-full">
                    {[1, 2, 3, 4, 5, 6].map((index) => (
                        <div key={index} className="p-0">
                            <SingleFileAttachment
                                uploadedImage={uploadedImages[index]}
                                onImageUpload={(file) => onImageUpload(index, file)}
                                onImageRemove={() => onImageRemove(index)}
                                label="อัพโหลดรูปภายในห้องพักของคุณ"
                                labelClass="text-center text-[10px]"
                                descriptionClass="text-center"
                                slotHeight="h-[170px]"
                                childHeight="h-[100px]"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Description Text Area */}
            <div className="mt-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    ใส่รายละเอียดของที่พัก
                </h3>
                <TextArea
                    value={description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    placeholder="กรุณากรอกรายละเอียดของที่พักของคุณ..."
                    className="w-full text-base"
                    style={{ fontSize: '16px', minHeight: '120px' }}
                    rows={5}
                />
                <p className="text-sm text-gray-500 mt-2">
                    *โปรดระบุรายละเอียดเกี่ยวกับที่พัก สิ่งอำนวยความสะดวก และข้อมูลที่สำคัญอื่นๆ
                </p>
            </div>
        </div>
    );
}
