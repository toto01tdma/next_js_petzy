'use client';

import { Upload, Image } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';

interface SingleFileAttachmentProps {
    uploadedImage?: UploadFile;
    onImageUpload: (file: File) => void;
    onImageRemove: () => void;
    label: string;
    description?: string;
    slotHeight?: string;
    childHeight?: string;
    labelClass?: string;
    descriptionClass?: string;
}

export default function SingleFileAttachment({
    uploadedImage,
    onImageUpload,
    onImageRemove,
    label,
    description,
    slotHeight = "h-[300px]",
    childHeight = "h-[190px]",
    labelClass = "",
    descriptionClass = ""
}: SingleFileAttachmentProps) {

    return (
        <Upload
            listType="picture"
            showUploadList={false}
            beforeUpload={(file) => {
                onImageUpload(file);
                return false;
            }}
            className="h-full"
            style={{ width: '100%' }}
        >
            <div className={`w-full ${slotHeight} bg-[#E0E2E6] rounded-md px-3 py-3 hover:bg-[#D0D2D6] transition-colors cursor-pointer`}>
                <div className={`${childHeight} flex justify-center items-center relative`} style={{ width: '100%' }}>
                    {uploadedImage ? (
                        <>
                            <Image
                                src={uploadedImage.url}
                                alt={label}
                                className="w-full h-full object-cover rounded"
                                width={300}
                                height={190}
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                            />
                            <div 
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm cursor-pointer hover:bg-red-600"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onImageRemove();
                                }}
                            >
                                ×
                            </div>
                        </>
                    ) : (
                        <DownloadOutlined className="text-6xl text-gray-400 mb-2" />
                    )}
                </div>
                <div className={`text-md text-[#484848] mt-1 ${labelClass}`} style={{ fontWeight: '500' }}>
                    {label}
                </div>
                <div className={`text-xs text-[#9A9A9A] mt-1 ${descriptionClass}`}>
                    {description}
                </div>
            </div>
        </Upload>
    );
}
