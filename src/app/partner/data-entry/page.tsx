'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LogoFirstPage from "@/components/first_page/logo";
import { Button, Input, Modal } from 'antd';
import type { UploadFile } from 'antd';
import SingleFileAttachment from '@/components/partner/shared/SingleFileAttachment';

const { TextArea } = Input;

export default function DataEntry() {
    const router = useRouter();
    const [,] = useState<UploadFile[]>([]);
    const [uploadedImages, setUploadedImages] = useState<{ [key: number]: UploadFile }>({});
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

    // Suppress Ant Design React 19 compatibility warning for this page
    useEffect(() => {
        const originalWarn = console.warn;
        console.warn = (...args) => {
            const message = String(args[0] || '');
            if (
                message.includes('antd: compatible') ||
                message.includes('React is 16 ~ 18') ||
                message.includes('v5-for-19') ||
                message.includes('antd v5 support React is 16')
            ) {
                return;
            }
            originalWarn(...args);
        };

        return () => {
            console.warn = originalWarn;
        };
    }, []);
    const [formData, setFormData] = useState({
        // Basic Information
        hotelName: '',
        hotelNameEng: '',
        ownerName: '',
        ownerNameEng: '',
        businessLicense: '',
        businessType: '',
        address: '',
        phoneNumber: '',
        emergencyPhone: '',

        // Location Information
        province: '',
        provinceEng: '',
        district: '',
        districtEng: '',
        subdistrict: '',
        postalCode: '',
        googleMapLink: '',
        website: '',
        description: ''
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // const handleUpload: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    //     setFileList(newFileList);
    // };

    const handleSubmit = () => {
        // Show success dialog
        setIsSuccessDialogOpen(true);

        // After 2 seconds, close dialog and navigate to policy page
        setTimeout(() => {
            setIsSuccessDialogOpen(false);
            router.push('/partner/policy');
        }, 2000);
    };

    // const uploadButton = (
    //     <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 transition-colors">
    //         <UploadOutlined className="text-4xl text-gray-400 mb-2" />
    //         <p className="text-gray-600">อัพโหลดรูปภาพ</p>
    //     </div>
    // );

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat relative"
            style={{
                backgroundImage: "url('/assets/images/background/bg1.png')"
            }}
        >
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-white/90"></div>

            {/* Content Container */}
            <div className="relative z-10 min-h-screen py-8 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Logo */}
                    <div className="text-center mb-4">
                        <LogoFirstPage />
                        <h1 className="text-5xl font-bold text-[#0D263B] mt-4">Pet-Friendly Hotel</h1>
                    </div>

                    <div className="text-center mb-4 bg-[#28A7CB] w-full py-2.5">
                        <span className="text-white text-2xl">กรุณากรอกรายละเอียดข้อมูลส่วนตัวเพื่อเริ่มต้นทำงานกับเรา</span>
                    </div>

                    {/* Form Container */}
                    <div className="py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-base font-medium text-gray-800 mb-3">
                                        ชื่อ-นามสกุล *
                                    </label>
                                    <Input
                                        value={formData.ownerName}
                                        onChange={(e) => handleInputChange('ownerName', e.target.value)}
                                        className="w-full h-12 text-base"
                                        style={{ height: '48px', fontSize: '16px' }}
                                    />
                                    <p className="text-sm text-gray-500 mt-1" style={{ marginBottom: 0, marginTop: '0.4rem' }}>*กรุณากรอกชื่อจริงครั้งเพื่อยืนยันความถูกต้อง</p>
                                </div>

                                <div>
                                    <label className="block text-base font-medium text-gray-800 mb-3">
                                        ชื่อ-นามสกุล *
                                    </label>
                                    <Input
                                        value={formData.ownerNameEng}
                                        onChange={(e) => handleInputChange('ownerNameEng', e.target.value)}
                                        className="w-full h-12 text-base"
                                        style={{ height: '48px', fontSize: '16px' }}
                                    />
                                    <p className="text-sm text-gray-500 mt-1 text-white" style={{ marginBottom: 0, marginTop: '0.4rem' }}>...</p>
                                </div>

                                <div>
                                    <label className="block text-base font-medium text-gray-800 mb-3">
                                        รหัสประจำตัวประชาชน *
                                    </label>
                                    <Input
                                        value={formData.businessLicense}
                                        onChange={(e) => handleInputChange('businessLicense', e.target.value)}
                                        className="w-full h-12 text-base"
                                        style={{ height: '48px', fontSize: '16px' }}
                                    />
                                    <p className="text-sm text-gray-500 mt-1 text-white" style={{ marginBottom: 0, marginTop: '0.4rem' }}>...</p>
                                </div>

                                <div>
                                    <label className="block text-base font-medium text-gray-800 mb-3">
                                        อีเมล์ *
                                    </label>
                                    <Input
                                        value={formData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        className="w-full h-12 text-base"
                                        style={{ height: '48px', fontSize: '16px' }}
                                    />
                                    <p className="text-sm text-gray-500 mt-1 text-white" style={{ marginBottom: 0, marginTop: '0.4rem' }}>...</p>
                                </div>

                                <div>
                                    <label className="block text-base font-medium text-gray-800 mb-3">
                                        เบอร์โทรศัพท์ติดต่อ *
                                    </label>
                                    <Input
                                        value={formData.phoneNumber}
                                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                        className="w-full h-12 text-base"
                                        style={{ height: '48px', fontSize: '16px' }}
                                    />
                                    <p className="text-sm text-gray-500 mt-1 text-white" style={{ marginBottom: 0, marginTop: '0.4rem' }}>...</p>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-base font-medium text-gray-800 mb-3">
                                        ชื่อ-นามสกุล *(ภาษาอังกฤษ)
                                    </label>
                                    <Input
                                        value={formData.hotelNameEng}
                                        onChange={(e) => handleInputChange('hotelNameEng', e.target.value)}
                                        className="w-full h-12 text-base"
                                        style={{ height: '48px', fontSize: '16px' }}
                                    />
                                    <p className="text-sm text-gray-500 mt-1 text-white" style={{ marginBottom: 0, marginTop: '0.4rem' }}>...</p>
                                </div>

                                <div>
                                    <label className="block text-base font-medium text-gray-800 mb-3">
                                        ชื่อ-นามสกุล *(ภาษาอังกฤษ)
                                    </label>
                                    <Input
                                        value={formData.ownerNameEng}
                                        onChange={(e) => handleInputChange('ownerNameEng', e.target.value)}
                                        className="w-full h-12 text-base"
                                        style={{ height: '48px', fontSize: '16px' }}
                                    />
                                    <p className="text-sm text-gray-500 mt-1 text-white" style={{ marginBottom: 0, marginTop: '0.4rem' }}>...</p>
                                </div>

                                <div>
                                    <label className="block text-base font-medium text-gray-800 mb-3">
                                        รหัสผู้เสียภาษีองค์กร *
                                    </label>
                                    <Input
                                        value={formData.businessType}
                                        onChange={(e) => handleInputChange('businessType', e.target.value)}
                                        className="w-full h-12 text-base"
                                        style={{ height: '48px', fontSize: '16px' }}
                                    />
                                    <p className="text-sm text-gray-500 mt-1 text-white" style={{ marginBottom: 0, marginTop: '0.4rem' }}>...</p>
                                </div>

                                <div>
                                    <label className="block text-base font-medium text-gray-800 mb-3">
                                        กรอกรายละเอียดเพิ่มเติม เพื่อประกอบการพิจารณา
                                    </label>
                                    <Input
                                        value={formData.emergencyPhone}
                                        onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                                        className="w-full h-12 text-base"
                                        style={{ height: '48px', fontSize: '16px' }}
                                    />
                                    <p className="text-sm text-gray-500 mt-1 text-white" style={{ marginBottom: 0, marginTop: '0.4rem' }}>...</p>
                                </div>

                                <div>
                                    <label className="block text-base font-medium text-gray-800 mb-3">
                                        เบอร์โทรศัพท์ติดต่อ(สำรอง) *
                                    </label>
                                    <Input
                                        value={formData.emergencyPhone}
                                        onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                                        className="w-full h-12 text-base"
                                        style={{ height: '48px', fontSize: '16px' }}
                                    />
                                    <p className="text-sm text-gray-500 mt-1 text-white" style={{ marginBottom: 0, marginTop: '0.4rem' }}>...</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Location Information */}
                    <div className="text-center mb-4 bg-[#28A7CB] w-full py-2.5">
                        <span className="text-white text-2xl">กรุณากรอกข้อมูลเกี่ยวกับสถานที่ตั้งของโรงแรมหรือที่พักของคุณ</span>
                    </div>

                    <div className="py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-base font-medium text-gray-800 mb-3">
                                        ชื่อ โรงแรม หรือ สถานที่พัก
                                    </label>
                                    <Input
                                        value={formData.province}
                                        onChange={(e) => handleInputChange('province', e.target.value)}
                                        placeholder="กรุณากรอกชื่อจริงครั้งเพื่อยืนยันความถูกต้อง"
                                        className="w-full h-12 text-base"
                                        style={{ height: '48px', fontSize: '16px' }}
                                    />
                                    <p className="text-sm text-gray-500 mt-1" style={{ marginBottom: 0, marginTop: '0.4rem' }}>*กรุณากรอกชื่อจริงครั้งเพื่อยืนยันความถูกต้อง</p>
                                </div>

                                <div>
                                    <label className="block text-base font-medium text-gray-800 mb-3">
                                        ชื่อ โรงแรม หรือ สถานที่พัก
                                    </label>
                                    <Input
                                        value={formData.district}
                                        onChange={(e) => handleInputChange('district', e.target.value)}
                                        className="w-full h-12 text-base"
                                        style={{ height: '48px', fontSize: '16px' }}
                                    />
                                    <p className="text-sm text-gray-500 mt-1 text-white" style={{ marginBottom: 0, marginTop: '0.4rem' }}>...</p>
                                </div>

                                <div>
                                    <label className="block text-base font-medium text-gray-800 mb-3">
                                        เลขที่เขียนการค้า *
                                    </label>
                                    <Input
                                        value={formData.subdistrict}
                                        onChange={(e) => handleInputChange('subdistrict', e.target.value)}
                                        className="w-full h-12 text-base"
                                        style={{ height: '48px', fontSize: '16px' }}
                                    />
                                    <p className="text-sm text-gray-500 mt-1 text-white" style={{ marginBottom: 0, marginTop: '0.4rem' }}>...</p>
                                </div>

                                <div>
                                    <label className="block text-base font-medium text-gray-800 mb-3">
                                        อีเมล์ *
                                    </label>
                                    <Input
                                        value={formData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        className="w-full h-12 text-base"
                                        style={{ height: '48px', fontSize: '16px' }}
                                    />
                                    <p className="text-sm text-gray-500 mt-1 text-white" style={{ marginBottom: 0, marginTop: '0.4rem' }}>...</p>
                                </div>

                                <div>
                                    <label className="block text-base font-medium text-gray-800 mb-3">
                                        ใส่ลิงก์ Google map ของสถานที่ให้บริการ *
                                    </label>
                                    <Input
                                        value={formData.googleMapLink}
                                        onChange={(e) => handleInputChange('googleMapLink', e.target.value)}
                                        className="w-full h-12 text-base"
                                        style={{ height: '48px', fontSize: '16px' }}
                                    />
                                    <p className="text-sm text-gray-500 mt-1 text-white" style={{ marginBottom: 0, marginTop: '0.4rem' }}>...</p>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-base font-medium text-gray-800 mb-3">
                                        ชื่อ โรงแรม หรือ สถานที่พัก *(ภาษาอังกฤษ)
                                    </label>
                                    <Input
                                        value={formData.provinceEng}
                                        onChange={(e) => handleInputChange('provinceEng', e.target.value)}
                                        className="w-full h-12 text-base"
                                        style={{ height: '48px', fontSize: '16px' }}
                                    />
                                    <p className="text-sm text-gray-500 mt-1 text-white" style={{ marginBottom: 0, marginTop: '0.4rem' }}>...</p>
                                </div>

                                <div>
                                    <label className="block text-base font-medium text-gray-800 mb-3">
                                        ชื่อ โรงแรม หรือ สถานที่พัก *(ภาษาอังกฤษ)
                                    </label>
                                    <Input
                                        value={formData.districtEng}
                                        onChange={(e) => handleInputChange('districtEng', e.target.value)}
                                        className="w-full h-12 text-base"
                                        style={{ height: '48px', fontSize: '16px' }}
                                    />
                                    <p className="text-sm text-gray-500 mt-1 text-white" style={{ marginBottom: 0, marginTop: '0.4rem' }}>...</p>
                                </div>

                                <div>
                                    <label className="block text-base font-medium text-gray-800 mb-3">
                                        สถานที่อยู่ ของสถานที่ให้บริการ
                                    </label>
                                    <Input
                                        value={formData.postalCode}
                                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                        className="w-full h-12 text-base"
                                        style={{ height: '48px', fontSize: '16px' }}
                                    />
                                    <p className="text-sm text-gray-500 mt-1 text-white" style={{ marginBottom: 0, marginTop: '0.4rem' }}>...</p>
                                </div>

                                <div>
                                    <label className="block text-base font-medium text-gray-800 mb-3">
                                        เบอร์โทรศัพท์สำนักงาน *
                                    </label>
                                    <Input
                                        value={formData.phoneNumber}
                                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                        className="w-full h-12 text-base"
                                        style={{ height: '48px', fontSize: '16px' }}
                                    />
                                    <p className="text-sm text-gray-500 mt-1 text-white" style={{ marginBottom: 0, marginTop: '0.4rem' }}>...</p>
                                </div>

                                <div>
                                    <label className="block text-base font-medium text-gray-800 mb-3">
                                        เบอร์โทรศัพท์มือถือ *
                                    </label>
                                    <Input
                                        value={formData.website}
                                        onChange={(e) => handleInputChange('website', e.target.value)}
                                        className="w-full h-12 text-base"
                                        style={{ height: '48px', fontSize: '16px' }}
                                    />
                                    <p className="text-sm text-gray-500 mt-1 text-white" style={{ marginBottom: 0, marginTop: '0.4rem' }}>...</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mt-8">
                            <label className="block text-base font-medium text-gray-800 mb-3">
                                กรอกรายละเอียดเพิ่มเติม เพื่อประกอบการพิจารณา
                            </label>
                            <TextArea
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                rows={6}
                                className="w-full text-base"
                                style={{ fontSize: '16px' }}
                            />
                        </div>
                    </div>

                    {/* Section 3: Image Upload */}
                    <div className="p-6">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">กรุณาแนบรูปถ่ายเอกสาร</h3>

                        {/* 8 Upload Slots in 4x2 Grid */}
                        <div className="grid md:grid-cols-4 gap-4 grid-cols-1">
                            {/* Slot 1: ID Card */}
                            <SingleFileAttachment
                                uploadedImage={uploadedImages[0]}
                                onImageUpload={(file) => {
                                    const newUploadedImages = { ...uploadedImages };
                                    newUploadedImages[0] = {
                                        uid: `0-${Date.now()}`,
                                        name: file.name,
                                        status: 'done',
                                        url: URL.createObjectURL(file),
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        originFileObj: file as any,
                                    };
                                    setUploadedImages(newUploadedImages);
                                }}
                                onImageRemove={() => {
                                    const newUploadedImages = { ...uploadedImages };
                                    delete newUploadedImages[0];
                                    setUploadedImages(newUploadedImages);
                                }}
                                label="อัพโหลดรูปบัตรประชาชน"
                                description="กรุณาถ่ายรูปบัตรประชาแบบหน้าตรง"
                            />
                            
                            {/* Slot 2: Business License */}
                            <SingleFileAttachment
                                uploadedImage={uploadedImages[1]}
                                onImageUpload={(file) => {
                                    const newUploadedImages = { ...uploadedImages };
                                    newUploadedImages[1] = {
                                        uid: `1-${Date.now()}`,
                                        name: file.name,
                                        status: 'done',
                                        url: URL.createObjectURL(file),
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        originFileObj: file as any,
                                    };
                                    setUploadedImages(newUploadedImages);
                                }}
                                onImageRemove={() => {
                                    const newUploadedImages = { ...uploadedImages };
                                    delete newUploadedImages[1];
                                    setUploadedImages(newUploadedImages);
                                }}
                                label="อัพโหลดรูปทะเบียนการค้า"
                                description="กรุณาถ่ายรูปทะเบียนการค้าแบบหน้าตรง"
                            />
                            
                            {/* Slot 3: Tax Document */}
                            <SingleFileAttachment
                                uploadedImage={uploadedImages[2]}
                                onImageUpload={(file) => {
                                    const newUploadedImages = { ...uploadedImages };
                                    newUploadedImages[2] = {
                                        uid: `2-${Date.now()}`,
                                        name: file.name,
                                        status: 'done',
                                        url: URL.createObjectURL(file),
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        originFileObj: file as any,
                                    };
                                    setUploadedImages(newUploadedImages);
                                }}
                                onImageRemove={() => {
                                    const newUploadedImages = { ...uploadedImages };
                                    delete newUploadedImages[2];
                                    setUploadedImages(newUploadedImages);
                                }}
                                label="อัพโหลดรูปเอกสารภาษีอากร"
                                description="กรุณาถ่ายรูปเอกสารใบกำกับภาษีแบบหน้าตรง"
                            />
                            
                            {/* Slot 4: House Registration */}
                            <SingleFileAttachment
                                uploadedImage={uploadedImages[3]}
                                onImageUpload={(file) => {
                                    const newUploadedImages = { ...uploadedImages };
                                    newUploadedImages[3] = {
                                        uid: `3-${Date.now()}`,
                                        name: file.name,
                                        status: 'done',
                                        url: URL.createObjectURL(file),
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        originFileObj: file as any,
                                    };
                                    setUploadedImages(newUploadedImages);
                                }}
                                onImageRemove={() => {
                                    const newUploadedImages = { ...uploadedImages };
                                    delete newUploadedImages[3];
                                    setUploadedImages(newUploadedImages);
                                }}
                                label="อัพโหลดรูปสำเนาทะเบียนบ้านของสถานที่ตั้งกิจการ"
                                description="กรุณาถ่ายรูปเอกสารเพิ่มเติม แบบหน้าตรง"
                            />
                            
                            {/* Slot 5: Additional Document */}
                            <SingleFileAttachment
                                uploadedImage={uploadedImages[4]}
                                onImageUpload={(file) => {
                                    const newUploadedImages = { ...uploadedImages };
                                    newUploadedImages[4] = {
                                        uid: `4-${Date.now()}`,
                                        name: file.name,
                                        status: 'done',
                                        url: URL.createObjectURL(file),
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        originFileObj: file as any,
                                    };
                                    setUploadedImages(newUploadedImages);
                                }}
                                onImageRemove={() => {
                                    const newUploadedImages = { ...uploadedImages };
                                    delete newUploadedImages[4];
                                    setUploadedImages(newUploadedImages);
                                }}
                                label="อัพโหลดรูปเอกสารเพิ่มเติม"
                                description="กรุณาถ่ายรูปเอกสารเพิ่มเติม อาทิ บิลชำระค่าไฟแบบหน้าตรง"
                            />
                            
                            {/* Slot 6: Bank Account */}
                            <SingleFileAttachment
                                uploadedImage={uploadedImages[5]}
                                onImageUpload={(file) => {
                                    const newUploadedImages = { ...uploadedImages };
                                    newUploadedImages[5] = {
                                        uid: `5-${Date.now()}`,
                                        name: file.name,
                                        status: 'done',
                                        url: URL.createObjectURL(file),
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        originFileObj: file as any,
                                    };
                                    setUploadedImages(newUploadedImages);
                                }}
                                onImageRemove={() => {
                                    const newUploadedImages = { ...uploadedImages };
                                    delete newUploadedImages[5];
                                    setUploadedImages(newUploadedImages);
                                }}
                                label="อัพโหลดรูปบัญชีธนาคาร"
                                description="กรุณาถ่ายรูปเอกสารเพิ่มเติม แบบหน้าตรง *ที่ต้องการให้ระบบโอนค่าที่พัก"
                            />
                            
                            {/* Slot 7: Building Photo */}
                            <SingleFileAttachment
                                uploadedImage={uploadedImages[6]}
                                onImageUpload={(file) => {
                                    const newUploadedImages = { ...uploadedImages };
                                    newUploadedImages[6] = {
                                        uid: `6-${Date.now()}`,
                                        name: file.name,
                                        status: 'done',
                                        url: URL.createObjectURL(file),
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        originFileObj: file as any,
                                    };
                                    setUploadedImages(newUploadedImages);
                                }}
                                onImageRemove={() => {
                                    const newUploadedImages = { ...uploadedImages };
                                    delete newUploadedImages[6];
                                    setUploadedImages(newUploadedImages);
                                }}
                                label="อัพโหลดรูปถ่ายหน้าสถานที่ให้บริการ"
                                description="กรุณาถ่ายรูปด้านหน้าอาคาร สถานที่ตั้งของบริการ"
                            />
                            
                            {/* Slot 8: Policy Modal */}
                            <div
                                className="block w-full h-[300px] cursor-pointer"
                                onClick={() => setIsPolicyModalOpen(true)}
                            >
                                <div className="w-full h-[300px] bg-[#E0E2E6] rounded-md p-4 hover:bg-[#D0D2D6] transition-colors">
                                    <div className="h-[190px] flex flex-col justify-center items-center">
                                        <div className="text-center mb-4">
                                            <LogoFirstPage subtext='' />
                                            <div className="text-sm text-gray-600">Pet-Friendly Hotel</div>
                                        </div>
                                    </div>
                                    <div className="text-md text-center text-[#484848] mt-1" style={{ fontWeight: '500' }}>
                                        กรุณาคลิก อ่านเอกสาร
                                        ข้อตกลงในสัญญาและนโยบายคู่ค้า
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 text-sm text-gray-500">
                            <p>• รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB</p>
                            <p>• กรุณาแนบรูปภาพประจำตัวประชาชน และเอกสารที่เกี่ยวข้อง</p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="w-full flex justify-center">
                        <Button
                            size="large"
                            onClick={handleSubmit}
                            className="px-12 py-3 h-auto font-medium w-[90%] rounded-md text-center"
                            style={{ backgroundColor: '#0D263B' }}
                        >
                            <span className="text-white text-xl">กรุณากดยืนยัน</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Success Dialog */}
            <Modal
                open={isSuccessDialogOpen}
                footer={null}
                closable={false}
                centered
                width={400}
                className="success-modal"
            >
                <div className="text-center py-8">
                    <div className="mb-6">
                        <div className="mx-auto w-40 h-40 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <div className="w-30 h-30 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        ข้อมูลที่คุณลงทะเบียนผ่านการอนุมัติแล้ว
                    </h3>
                    <div
                        className="bg-[#0D263B] hover:bg-[#1a3a52] border-[#0D263B] px-8 py-2 h-auto mt-10 rounded-md"
                        onClick={() => {
                            setIsSuccessDialogOpen(false);
                            router.push('/partner/policy');
                        }}
                    >
                        <span className="text-white">เข้าสู่การเพิ่มข้อมูลของคุณ</span>
                    </div>
                </div>
            </Modal>

            {/* Policy Modal */}
            <Modal
                title={
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-500 mb-1">PetZy</div>
                        <div className="text-sm text-gray-600">Pet-Friendly Hotel</div>
                        <div className="text-xl font-semibold text-gray-800 mt-2">นโยบายและข้อตกลงคู่ค้า</div>
                    </div>
                }
                open={isPolicyModalOpen}
                onCancel={() => setIsPolicyModalOpen(false)}
                width="90%"
                style={{ maxWidth: '1200px' }}
                footer={[
                    <Button key="cancel" onClick={() => setIsPolicyModalOpen(false)}>
                        ปิด
                    </Button>,
                ]}
            >
                <div className="max-h-96 overflow-y-auto">
                    <div className="space-y-6 p-4">
                        <section>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">1. การยอมรับข้อตกลง</h3>
                            <p className="text-gray-700 leading-relaxed">
                                การใช้บริการของ PetZy ถือว่าท่านได้อ่าน เข้าใจ และยอมรับข้อตกลงและเงื่อนไขทั้งหมดแล้ว
                                หากท่านไม่ยอมรับข้อตกลงใดข้อหนึ่ง กรุณาหยุดการใช้บริการทันที
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">2. การใช้บริการ</h3>
                            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
                                <li>ท่านต้องมีอายุไม่ต่ำกว่า 18 ปี หรือได้รับความยินยอมจากผู้ปกครอง</li>
                                <li>ข้อมูลที่ให้ไว้ต้องเป็นความจริงและถูกต้องครบถ้วน</li>
                                <li>ท่านรับผิดชอบในการรักษาความปลอดภัยของบัญชีผู้ใช้</li>
                                <li>ห้ามใช้บริการเพื่อกิจกรรมที่ผิดกฎหมายหรือไม่เหมาะสม</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">3. นโยบายสัตว์เลี้ยง</h3>
                            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
                                <li>สัตว์เลี้ยงต้องมีใบรับรองสุขภาพและการฉีดวัคซีนครบถ้วน</li>
                                <li>เจ้าของสัตว์เลี้ยงต้องรับผิดชอบความเสียหายที่เกิดขึ้น</li>
                                <li>สัตว์เลี้ยงต้องอยู่ในความดูแลของเจ้าของตลอดเวลา</li>
                                <li>ห้ามทิ้งสัตว์เลี้ยงไว้ในห้องพักโดยลำพัง</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">4. การจองและการชำระเงิน</h3>
                            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
                                <li>การจองจะสมบูรณ์เมื่อได้รับการยืนยันและชำระเงินแล้ว</li>
                                <li>ราคาที่แสดงรวมภาษีและค่าบริการแล้ว</li>
                                <li>การยกเลิกการจองต้องแจ้งล่วงหน้าตามเงื่อนไขของแต่ละที่พัก</li>
                                <li>การคืนเงินจะดำเนินการตามนโยบายการยกเลิก</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">5. ความรับผิดชอบ</h3>
                            <p className="text-gray-700 leading-relaxed">
                                PetZy ทำหน้าที่เป็นตัวกลางในการเชื่อมต่อระหว่างผู้ใช้บริการและผู้ให้บริการที่พัก
                                เราไม่รับผิดชอบต่อคุณภาพการบริการ ความเสียหาย หรือข้อพิพาทที่เกิดขึ้นระหว่างคู่สัญญา
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">6. ความเป็นส่วนตัว</h3>
                            <p className="text-gray-700 leading-relaxed">
                                เราเคารพความเป็นส่วนตัวของท่านและจะปกป้องข้อมูลส่วนบุคคลตามนโยบายความเป็นส่วนตัวของเรา
                                ข้อมูลของท่านจะถูกใช้เพื่อการให้บริการและปรับปรุงประสบการณ์การใช้งานเท่านั้น
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">7. การแก้ไขข้อตกลง</h3>
                            <p className="text-gray-700 leading-relaxed">
                                PetZy ขอสงวนสิทธิ์ในการแก้ไขข้อตกลงและเงื่อนไขได้ตลอดเวลา
                                การแก้ไขจะมีผลทันทีเมื่อประกาศบนเว็บไซต์ การใช้บริการต่อไปถือว่ายอมรับการแก้ไข
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">8. การติดต่อ</h3>
                            <p className="text-gray-700 leading-relaxed">
                                หากมีข้อสงสัยหรือต้องการความช่วยเหลือ กรุณาติดต่อเราผ่านช่องทางที่กำหนดไว้ในเว็บไซต์
                                ทีมงานของเราพร้อมให้บริการและแก้ไขปัญหาอย่างรวดเร็ว
                            </p>
                        </section>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800 text-center">
                                ข้อตกลงและเงื่อนไขนี้มีผลบังคับใช้ตั้งแต่วันที่ 1 มกราคม 2024 เป็นต้นไป
                            </p>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
