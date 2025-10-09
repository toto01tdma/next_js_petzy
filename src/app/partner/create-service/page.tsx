'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/partner/shared/Sidebar';
import { Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import LogoFirstPage from "@/components/first_page/logo";
import type { UploadFile } from 'antd';

// Import all the separated components
import PersonalInformationSection from '@/components/partner/dataEntry/PersonalInformationSection';
import HotelLocationSection from '@/components/partner/dataEntry/HotelLocationSection';
import BusinessDetailsSection from '@/components/partner/dataEntry/BusinessDetailsSection';
import FileUploadSection from '@/components/partner/dataEntry/FileUploadSection';
import HotelServiceConfigSection from '@/components/partner/dataEntry/HotelServiceConfigSection';
import AccommodationPhotosSection from '@/components/partner/dataEntry/AccommodationPhotosSection';
import RoomServiceConfigSection from '@/components/partner/dataEntry/RoomServiceConfigSection';
import type { RoomServiceRow } from '@/components/partner/dataEntry/RoomServiceConfigSection';

export default function CreateService() {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    // Personal Information State
    const [personalInfo, setPersonalInfo] = useState({
        firstName: '',
        lastName: '',
        nationalIdNumber: '',
        email: '',
        phoneNumber: '',
        firstNameEng: '',
        lastNameEng: '',
        corporateTaxId: '',
        additionalDetails: '',
        backupPhone: '',
    });

    // Hotel Location State
    const [hotelLocation, setHotelLocation] = useState({
        accommodationName: '',
        accommodationNameEn: '',
        tradeRegistrationNumber: '',
        address: '',
        businessEmail: '',
        officePhone: '',
        googleMapsLink: '',
        mobilePhone: '',
    });

    // Business Details State
    const [businessDetails, setBusinessDetails] = useState('');

    // Document Upload State
    const [uploadedDocs, setUploadedDocs] = useState<{ [key: number]: UploadFile }>({});

    // Hotel Service Config State
    const [hotelServiceConfig, setHotelServiceConfig] = useState({
        roomService: false,
        specialService: false,
        petCareService: false,
        hotelName: '',
        hotelNameConfirm: '',
        hotelNameEng: '',
        hotelNameEngConfirm: '',
        rooms: '',
        customRoomCount: '',
        province: '',
        customRoomType: '',
        district: '',
        subdistrict: '',
        specialServiceType: '',
        services: [] as string[],
    });

    const [showCustomRoomInput, setShowCustomRoomInput] = useState(false);
    const [showCustomRoomTypeInput, setShowCustomRoomTypeInput] = useState(false);
    const [showSpecialServiceTypeInput, setShowSpecialServiceTypeInput] = useState(false);

    // Accommodation Photos State
    const [uploadedPhotos, setUploadedPhotos] = useState<{ [key: number]: UploadFile }>({});
    const [roomServiceData, setRoomServiceData] = useState<RoomServiceRow[]>([
        { id: 1, roomType: '', quantity: '', openTime: '', closeTime: '', price: '' },
        { id: 2, roomType: '', quantity: '', openTime: '', closeTime: '', price: '' },
        { id: 3, roomType: '', quantity: '', openTime: '', closeTime: '', price: '' },
    ]);
    const [specialServicesData, setSpecialServicesData] = useState<RoomServiceRow[]>([
        { id: 1, roomType: '', quantity: '', openTime: '', closeTime: '', price: '' },
    ]);
    const [petCareServicesData, setPetCareServicesData] = useState<RoomServiceRow[]>([
        { id: 1, roomType: '', quantity: '', openTime: '', closeTime: '', price: '' },
    ]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handlePersonalInfoChange = (field: string, value: string) => {
        setPersonalInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleHotelLocationChange = (field: string, value: string) => {
        setHotelLocation(prev => ({ ...prev, [field]: value }));
    };

    const handleBusinessDetailsChange = (field: string, value: string) => {
        setBusinessDetails(value);
    };

    const handleDocUpload = (index: number, file: File) => {
        const newDocs = { ...uploadedDocs };
        newDocs[index] = {
            uid: `${index}-${Date.now()}`,
            name: file.name,
            status: 'done',
            url: URL.createObjectURL(file),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            originFileObj: file as any,
        };
        setUploadedDocs(newDocs);
    };

    const handleDocRemove = (index: number) => {
        const newDocs = { ...uploadedDocs };
        delete newDocs[index];
        setUploadedDocs(newDocs);
    };

    const handleServiceConfigChange = (field: string, value: string | boolean | string[]) => {
        setHotelServiceConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleRoomCountChange = (value: string) => {
        if (value === 'custom') {
            setShowCustomRoomInput(true);
            handleServiceConfigChange('rooms', '');
        } else {
            setShowCustomRoomInput(false);
            handleServiceConfigChange('rooms', value);
        }
    };

    const handleRoomTypeChange = (value: string) => {
        if (value === 'custom') {
            setShowCustomRoomTypeInput(true);
            handleServiceConfigChange('province', '');
        } else {
            setShowCustomRoomTypeInput(false);
            handleServiceConfigChange('province', value);
        }
    };

    const handleServiceTypeChange = (value: string) => {
        handleServiceConfigChange('district', value);
    };

    const handleSpecialServiceTypeChange = (value: string) => {
        if (value === 'custom') {
            setShowSpecialServiceTypeInput(true);
            handleServiceConfigChange('subdistrict', '');
        } else {
            setShowSpecialServiceTypeInput(false);
            handleServiceConfigChange('subdistrict', value);
        }
    };

    const handleServiceChange = (service: string, checked: boolean) => {
        const currentServices = [...hotelServiceConfig.services];
        if (checked) {
            if (!currentServices.includes(service)) {
                currentServices.push(service);
            }
        } else {
            const index = currentServices.indexOf(service);
            if (index > -1) {
                currentServices.splice(index, 1);
            }
        }
        handleServiceConfigChange('services', currentServices);
    };

    const handlePhotoUpload = (index: number, file: File) => {
        const newPhotos = { ...uploadedPhotos };
        newPhotos[index] = {
            uid: `${index}-${Date.now()}`,
            name: file.name,
            status: 'done',
            url: URL.createObjectURL(file),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            originFileObj: file as any,
        };
        setUploadedPhotos(newPhotos);
    };

    const handlePhotoRemove = (index: number) => {
        const newPhotos = { ...uploadedPhotos };
        delete newPhotos[index];
        setUploadedPhotos(newPhotos);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        <PersonalInformationSection
                            formData={personalInfo}
                            onInputChange={handlePersonalInfoChange}
                        />
                        <HotelLocationSection
                            formData={hotelLocation}
                            onInputChange={handleHotelLocationChange}
                        />
                        <BusinessDetailsSection
                            businessAdditionalDetails={businessDetails}
                            onInputChange={handleBusinessDetailsChange}
                        />
                        <FileUploadSection
                            uploadedImages={uploadedDocs}
                            onImageUpload={handleDocUpload}
                            onImageRemove={handleDocRemove}
                            onPolicyModalOpen={() => setIsPolicyModalOpen(true)}
                        />
                    </>
                );
            case 2:
                return (
                    <HotelServiceConfigSection
                        formData={hotelServiceConfig}
                        showCustomRoomInput={showCustomRoomInput}
                        showCustomRoomTypeInput={showCustomRoomTypeInput}
                        showSpecialServiceTypeInput={showSpecialServiceTypeInput}
                        onInputChange={handleServiceConfigChange}
                        onRoomCountChange={handleRoomCountChange}
                        onRoomTypeChange={handleRoomTypeChange}
                        onServiceTypeChange={handleServiceTypeChange}
                        onSpecialServiceTypeChange={handleSpecialServiceTypeChange}
                        onServiceChange={handleServiceChange}
                    />
                );
            case 3:
                return (
                    <>
                        <AccommodationPhotosSection
                            uploadedImages={uploadedPhotos}
                            onImageUpload={handlePhotoUpload}
                            onImageRemove={handlePhotoRemove}
                        />
                        <div className="mt-8">
                            <RoomServiceConfigSection
                                roomServiceData={roomServiceData}
                                specialServicesData={specialServicesData}
                                petCareServicesData={petCareServicesData}
                                onRoomServiceChange={setRoomServiceData}
                                onSpecialServiceChange={setSpecialServicesData}
                                onPetCareServiceChange={setPetCareServicesData}
                            />
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    const stepTitles = [
        'ข้อมูลส่วนตัวและธุรกิจ',
        'การกำหนดค่าบริการโรงแรม',
        'รูปภาพและรายละเอียดบริการ'
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-gradient-to-r from-[#C6CEDE] to-[#FFFFFF] shadow-sm border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleSidebar}
                                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                            >
                                <MenuOutlined className="text-xl" />
                            </button>
                            <h1 className="text-2xl font-semibold text-gray-800">สร้างบริการใหม่</h1>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-6" style={{ backgroundColor: '#FFFFFF' }}>
                    {/* Logo */}
                    <div className="text-center mb-6">
                        <LogoFirstPage />
                        <h1 className="text-4xl font-bold mt-4" style={{ color: '#0D263B' }}>Pet-Friendly Hotel</h1>
                        <p className="text-lg text-gray-600 mt-2">กรอกข้อมูลบริการของคุณเพื่อเริ่มต้น</p>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center space-x-4">
                            {[1, 2, 3].map((step) => (
                                <div key={step} className="flex items-center">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                            currentStep === step
                                                ? 'bg-blue-600 text-white'
                                                : currentStep > step
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-300 text-gray-600'
                                        }`}
                                    >
                                        {step}
                                    </div>
                                    {step < 3 && (
                                        <div
                                            className={`w-20 h-1 ${
                                                currentStep > step ? 'bg-green-500' : 'bg-gray-300'
                                            }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step Title */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            {stepTitles[currentStep - 1]}
                        </h2>
                    </div>

                    {/* Form Content */}
                    <div className="max-w-6xl mx-auto">
                        {renderStepContent()}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center mt-8 max-w-6xl mx-auto">
                        <Button
                            size="large"
                            onClick={() => {
                                if (currentStep > 1) {
                                    setCurrentStep(currentStep - 1);
                                } else {
                                    router.back();
                                }
                            }}
                            className="px-8"
                        >
                            {currentStep === 1 ? 'ย้อนกลับ' : 'ก่อนหน้า'}
                        </Button>

                        <div className="text-sm text-gray-600">
                            ขั้นตอน {currentStep} จาก 3
                        </div>

                        <Button
                            size="large"
                            type="primary"
                            onClick={() => {
                                if (currentStep < 3) {
                                    setCurrentStep(currentStep + 1);
                                } else {
                                    // TODO: Submit form data
                                    alert('บันทึกข้อมูลสำเร็จ! (ยังไม่เชื่อมต่อ API)');
                                    router.push('/partner/manage-rooms');
                                }
                            }}
                            className="px-8"
                            style={{ backgroundColor: '#0D263B' }}
                        >
                            {currentStep === 3 ? 'บันทึกข้อมูล' : 'ถัดไป'}
                        </Button>
                    </div>
                </main>
            </div>

            {/* Policy Modal - Placeholder */}
            {isPolicyModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setIsPolicyModalOpen(false)}
                >
                    <div className="bg-white rounded-lg p-8 max-w-2xl">
                        <h2 className="text-2xl font-bold mb-4">นโยบายและข้อตกลง</h2>
                        <p className="text-gray-600 mb-4">
                            เนื้อหานโยบายและข้อตกลงจะแสดงที่นี่...
                        </p>
                        <Button
                            type="primary"
                            onClick={() => setIsPolicyModalOpen(false)}
                        >
                            ปิด
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

