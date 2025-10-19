'use client';

import { Upload } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import Image from 'next/image';
import type { UploadFile } from 'antd';
import { useState } from 'react';

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
    const [imageError, setImageError] = useState(false);

    // Reset error state when image changes
    const currentImageUrl = uploadedImage?.url;
    const [lastUrl, setLastUrl] = useState(currentImageUrl);
    if (currentImageUrl !== lastUrl) {
        setImageError(false);
        setLastUrl(currentImageUrl);
    }

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
            <div
                className={`w-full ${slotHeight} rounded-md px-3 py-3 transition-colors cursor-pointer`}
                style={{ backgroundColor: '#E0E2E6' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D0D2D6')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#E0E2E6')}
            >
                <div className={`${childHeight} flex justify-center items-center relative`} style={{ width: '100%' }}>
                    {uploadedImage ? (
                        <>
                            {!imageError ? (
                                <div className="w-full h-full relative">
                                    <Image
                                        src={uploadedImage.url || ''}
                                        alt={label}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        className="rounded"
                                        onError={() => {
                                            console.error(`Failed to load image: ${uploadedImage.url}`);
                                            setImageError(true);
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                    <p className="text-sm">Failed to load image</p>
                                    <p className="text-xs mt-1 text-gray-500 px-2 text-center break-all">{uploadedImage.url}</p>
                                </div>
                            )}
                            <div
                                className="absolute top-1 right-1 bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-sm cursor-pointer hover:bg-red-600"
                                style={{ color: '#FFFFFF', zIndex: 10 }}
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
                <div className={`text-md mt-1 ${labelClass}`} style={{ fontWeight: '500', color: '#484848' }}>
                    {label}
                </div>
                <div className={`text-xs mt-1 ${descriptionClass}`} style={{ color: '#9A9A9A' }}>
                    {description}
                </div>
            </div>
        </Upload>
    );
}
