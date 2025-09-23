'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LogoFirstPage from "@/component/first_page/logo";
import { Button, Input, Select, Checkbox } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

const { Option } = Select;

// Custom Service Checkbox Component
interface ServiceCheckboxProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const ServiceCheckbox: React.FC<ServiceCheckboxProps> = ({ label, checked, onChange }) => {
    return (
        <div className="space-y-2">
            <div
                className="bg-[#00B6AA] w-full py-2 px-4 rounded-lg flex items-center text-white font-medium cursor-pointer transition-colors"
                onClick={() => onChange(!checked)}
            >
                <span className="flex-1 text-center">{label}</span>
                <div className="ml-auto">
                    {checked ? (
                        <div className="border px-0.5 py-0.2 rounded-sm border-white bg-transparent text-white">
                            <CheckOutlined className="text-sm" />
                        </div>
                    ) : (
                        <div className="border px-0.5 py-0.2 rounded-sm border-white bg-transparent text-[#00B6AA]">
                            <CheckOutlined className="text-sm" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function DataEntry2() {
    const router = useRouter();

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
        hotelName: '',
        hotelNameEng: '',
        rooms: '',
        customRoomCount: '',
        province: '',
        customRoomType: '',
        district: '',
        customServiceType: '',
        subdistrict: '',
        specialServiceType: '',
        postalCode: '',
        latitude: '',
        longitude: '',
        services: [] as string[],
        description: '',
        // Service selections
        roomService: false,
        specialService: false,
        petCareService: false
    });
    const [showCustomRoomInput, setShowCustomRoomInput] = useState(false);
    const [showCustomRoomTypeInput, setShowCustomRoomTypeInput] = useState(false);
    const [showSpecialServiceTypeInput, setShowSpecialServiceTypeInput] = useState(false);

    const handleInputChange = (field: string, value: string | string[] | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleRoomCountChange = (value: string) => {
        if (value === 'custom') {
            setShowCustomRoomInput(true);
            handleInputChange('rooms', '');
        } else {
            setShowCustomRoomInput(false);
            handleInputChange('rooms', value);
            handleInputChange('customRoomCount', '');
        }
    };

    const handleRoomTypeChange = (value: string) => {
        if (value === 'custom') {
            setShowCustomRoomTypeInput(true);
            handleInputChange('province', '');
        } else {
            setShowCustomRoomTypeInput(false);
            handleInputChange('province', value);
            handleInputChange('customRoomType', '');
        }
    };

    const handleServiceTypeChange = (value: string) => {
        if (value === 'custom') {
            setShowSpecialServiceTypeInput(true);
            handleInputChange('district', '');
        } else {
            handleInputChange('district', value);
            handleInputChange('customServiceType', '');
            setShowSpecialServiceTypeInput(false);
        }
    };

    const handleSpecialServiceTypeChange = (value: string) => {
        if (value === 'custom') {
            setShowSpecialServiceTypeInput(true);
            handleInputChange('subdistrict', '');
        } else {
            setShowSpecialServiceTypeInput(false);
            handleInputChange('subdistrict', value);
            handleInputChange('specialServiceType', '');
        }
    };

    const handleServiceChange = (service: string, checked: boolean) => {
        const newServices = checked
            ? [...formData.services, service]
            : formData.services.filter(s => s !== service);
        handleInputChange('services', newServices);
    };

    const handleSubmit = () => {
        // Navigate to data-entry-3 after submission
        router.push('/data-entry-3');
    };

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
                    <div className="text-center mb-3">
                        <LogoFirstPage subtext='Find Your Perfect Stay, Anytime, Anywhere' />
                        <h1 className="text-5xl font-bold text-[#0D263B] mt-4">Pet-Friendly Hotel</h1>
                    </div>

                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold text-[#484848] mt-4">เริ่มสร้างบริการของคุณ เพื่อเริ่มต้นทำงานกับเรา</h1>
                    </div>
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold text-[#484848] mt-4">สร้างหมวดหมู่หลักบริการของคุณ</h1>
                    </div>

                    {/* Form Container */}
                    <div className="py-6 px-12 border border-black rounded-lg">
                        <div className="space-y-4">
                            <p className="text-[#484848]" style={{ marginBottom: '0.75rem' }}><span className="text-xl font-bold me-4">กรุณาเลือกบริการที่คุณมี</span> <span className="text-md">สามารถเลือกได้หลายบริการตามความจริงที่คุณให้บริการ</span></p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <ServiceCheckbox
                                    label="รูปแบบบริการห้องพัก"
                                    checked={formData.roomService}
                                    onChange={(checked) => handleInputChange('roomService', checked)}
                                />
                                <ServiceCheckbox
                                    label="รูปแบบบริการพิเศษ"
                                    checked={formData.specialService}
                                    onChange={(checked) => handleInputChange('specialService', checked)}
                                />
                                <ServiceCheckbox
                                    label="รูปแบบบริการรับฝากสัตว์เลี้ยง"
                                    checked={formData.petCareService}
                                    onChange={(checked) => handleInputChange('petCareService', checked)}
                                />
                            </div>
                            {/* Two-column grid for regular fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-2">
                                    <div>
                                        <label className="block text-base font-medium text-gray-800 mb-2">
                                            ชื่อ โรงแรม หรือ สถานที่พัก
                                        </label>
                                        <Input
                                            value={formData.hotelName}
                                            onChange={(e) => handleInputChange('hotelName', e.target.value)}
                                            placeholder="สุขสม โรงแรมสวัสดี"
                                            className="w-full h-12 text-base"
                                            style={{ height: '48px', fontSize: '16px' }}
                                        />
                                        <p className="text-sm text-white mt-1" style={{ marginBottom: 0, marginTop: '0.2rem' }}>...</p>
                                    </div>

                                    <div>
                                        <label className="block text-base font-medium text-gray-800 mb-2">
                                            ชื่อ โรงแรม หรือ สถานที่พัก
                                        </label>
                                        <Input
                                            value={formData.hotelNameEng}
                                            onChange={(e) => handleInputChange('hotelNameEng', e.target.value)}
                                            placeholder="Adedecsws"
                                            className="w-full h-12 text-base"
                                            style={{ height: '48px', fontSize: '16px' }}
                                        />
                                        <p className="text-sm text-gray-500 mt-1" style={{ marginBottom: 0, marginTop: '0.2rem' }}>*กรุณากรอกชื่อจริงครั้งเพื่อยืนยันความถูกต้อง</p>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-2">
                                    <div>
                                        <label className="block text-base font-medium text-gray-800 mb-2">
                                            ชื่อ โรงแรม หรือ สถานที่พัก (ภาษาอังกฤษ)
                                        </label>
                                        <Input
                                            value={formData.hotelNameEng}
                                            onChange={(e) => handleInputChange('hotelNameEng', e.target.value)}
                                            placeholder="สุขสม โรงแรมสวัสดี"
                                            className="w-full h-12 text-base"
                                            style={{ height: '48px', fontSize: '16px' }}
                                        />
                                        <p className="text-sm text-gray-500 mt-1 text-white" style={{ marginBottom: 0, marginTop: '0.2rem' }}>...</p>
                                    </div>

                                    <div>
                                        <label className="block text-base font-medium text-gray-800 mb-2">
                                            ชื่อ โรงแรม หรือ สถานที่พัก (ภาษาอังกฤษ)
                                        </label>
                                        <Input
                                            value={formData.hotelNameEng}
                                            onChange={(e) => handleInputChange('hotelNameEng', e.target.value)}
                                            placeholder="สุขสม โรงแรมสวัสดี"
                                            className="w-full h-12 text-base"
                                            style={{ height: '48px', fontSize: '16px' }}
                                        />
                                        <p className="text-sm text-gray-500 mt-1 text-white" style={{ marginBottom: 0, marginTop: '0.2rem' }}>...</p>
                                    </div>
                                </div>
                            </div>

                            {/* Full-width field: Total number of rooms */}
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-base font-medium text-gray-800 mb-2">
                                        ระบุจำนวนห้องพักทั้งหมดของคุณ
                                    </label>
                                    <Select
                                        value={showCustomRoomInput ? 'custom' : formData.rooms}
                                        onChange={handleRoomCountChange}
                                        placeholder="5 ห้องพัก"
                                        className="w-full"
                                        style={{ height: '48px' }}
                                        size="large"
                                    >
                                        <Option value="2">2 ห้องพัก</Option>
                                        <Option value="4">4 ห้องพัก</Option>
                                        <Option value="6">6 ห้องพัก</Option>
                                        <Option value="custom">ระบุ</Option>
                                    </Select>
                                    {showCustomRoomInput && (
                                        <Input
                                            value={formData.customRoomCount}
                                            onChange={(e) => handleInputChange('customRoomCount', e.target.value)}
                                            placeholder="กรุณาระบุจำนวนห้องพัก"
                                            className="w-full h-12 text-base mt-2"
                                            style={{ height: '48px', fontSize: '16px' }}
                                            type="number"
                                        />
                                    )}
                                    <p className="text-sm text-gray-500 mt-1 text-white" style={{ marginBottom: 0, marginTop: '0.2rem' }}>...</p>
                                </div>
                            </div>

                            {/* Full-width field: All room types */}
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-base font-medium text-gray-800 mb-2">
                                        ประเภทห้องพักทั้งหมดของคุณ
                                    </label>
                                    <Select
                                        value={showCustomRoomTypeInput ? 'custom' : formData.province}
                                        onChange={handleRoomTypeChange}
                                        placeholder="ห้องขนาด 2เตียง"
                                        className="w-full"
                                        style={{ height: '48px' }}
                                        size="large"
                                    >
                                        <Option value="เตียงเดี่ยว">เตียงเดี่ยว</Option>
                                        <Option value="เตียงคู่">เตียงคู่</Option>
                                        <Option value="ห้องขนาด 2เตียง">ห้องขนาด 2เตียง</Option>
                                        <Option value="มีเตียงเสริม">มีเตียงเสริม</Option>
                                        <Option value="ห้องสวีท">ห้องสวีท</Option>
                                        <Option value="custom">ระบุ</Option>
                                    </Select>
                                    {showCustomRoomTypeInput && (
                                        <Input
                                            value={formData.customRoomType}
                                            onChange={(e) => handleInputChange('customRoomType', e.target.value)}
                                            placeholder="กรุณาระบุประเภทห้องพัก"
                                            className="w-full h-12 text-base mt-2"
                                            style={{ height: '48px', fontSize: '16px' }}
                                        />
                                    )}
                                    <p className="text-sm text-gray-500 mt-1 text-white" style={{ marginBottom: 0, marginTop: '0.2rem' }}>...</p>
                                </div>
                            </div>

                            {/* Two-column grid for remaining fields */}
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-base font-medium text-gray-800 mb-2">
                                        ประเภทห้องพักทั้งหมดของคุณ
                                    </label>
                                    <Select
                                        value={showSpecialServiceTypeInput ? 'custom' : formData.district}
                                        onChange={handleServiceTypeChange}
                                        placeholder="โรงแรมรับสัตว์เลี้ยง"
                                        className="w-full"
                                        style={{ height: '48px' }}
                                        size="large"
                                    >
                                        <Option value="pet-hotel">โรงแรมสัตว์เลี้ยง</Option>
                                        <Option value="pet-spa">สปา สัตว์เลี้ยง</Option>
                                        <Option value="pet-boarding">สถานที่รับฝากสัตว์เลี้ยง</Option>
                                    </Select>
                                    <p className="text-sm text-gray-500 mt-1 text-white" style={{ marginBottom: 0, marginTop: '0.2rem' }}>...</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div>
                                    <label className="block text-base font-medium text-gray-800 mb-2">
                                        ประเภทรับบริการพิเศษของคุณ
                                    </label>
                                    <Select
                                        value={showSpecialServiceTypeInput ? 'custom' : formData.subdistrict}
                                        onChange={handleSpecialServiceTypeChange}
                                        placeholder="สุนัข, แมว"
                                        className="w-full"
                                        style={{ height: '48px' }}
                                        size="large"
                                    >
                                        <Option value="สุนัข">สุนัข</Option>
                                        <Option value="แมว">แมว</Option>
                                        <Option value="สุนัขและแมว">สุนัข, แมว</Option>
                                        <Option value="นก">นก</Option>
                                        <Option value="เต่า">เต่า</Option>
                                        <Option value="สัตว์เลี้ยงทุกประเภท">สัตว์เลี้ยงทุกประเภท</Option>
                                        <Option value="custom">ระบุ</Option>
                                    </Select>
                                    {showSpecialServiceTypeInput && (
                                        <Input
                                            value={formData.specialServiceType}
                                            onChange={(e) => handleInputChange('specialServiceType', e.target.value)}
                                            placeholder="กรุณาระบุประเภทการให้บริการ"
                                            className="w-full h-12 text-base mt-2"
                                            style={{ height: '48px', fontSize: '16px' }}
                                        />
                                    )}
                                    <p className="text-sm text-gray-500 mt-1 text-white" style={{ marginBottom: 0, marginTop: '0.2rem' }}>...</p>
                                </div>
                            </div>
                        </div>

                        {/* Map Section */}
                        <div className="mt-8">
                            <p style={{ marginBottom: '0.5rem' }}>
                                <span className="text-lg font-semibold text-gray-800 mb-4 me-4">ปักหมุดพิกัด สถานที่ให้บริการ</span> <span>กรุณาเลื่อนหาตำแหน่งที่ให้บริการของคุณเพื่อปักหมุด</span>
                            </p>

                            {/* Latitude and Longitude Inputs */}
                            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-base font-medium text-gray-800 mb-2">
                                        Latitude (ละติจูด)
                                    </label>
                                    <Input
                                        value={formData.latitude}
                                        onChange={(e) => handleInputChange('latitude', e.target.value)}
                                        placeholder="13.7563"
                                        className="w-full h-12 text-base"
                                        style={{ height: '48px', fontSize: '16px' }}
                                        type="number"
                                        step="any"
                                    />
                                </div>
                                <div>
                                    <label className="block text-base font-medium text-gray-800 mb-2">
                                        Longitude (ลองจิจูด)
                                    </label>
                                    <Input
                                        value={formData.longitude}
                                        onChange={(e) => handleInputChange('longitude', e.target.value)}
                                        placeholder="100.5018"
                                        className="w-full h-12 text-base"
                                        style={{ height: '48px', fontSize: '16px' }}
                                        type="number"
                                        step="any"
                                    />
                                </div>
                            </div> */}

                            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-4xl mb-2">🗺️</div>
                                    <p className="text-gray-600">Google Maps Integration</p>
                                    <p className="text-sm text-gray-500">Map will be displayed here</p>
                                    {formData.latitude && formData.longitude && (
                                        <p className="text-sm text-blue-600 mt-2">
                                            Location: {formData.latitude}, {formData.longitude}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Services Section */}
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-800 text-center border-b border-t border-black pt-3 pb-3" style={{ marginBottom: '2.5rem' }}>
                                เลือกระบุข้างบนความสะดวกและสิ่งอำนวยความสะดวกของคุณ
                            </h3>
                            <div className="grid grid-cols-5 divide-x border-b border-black pb-3">
                                {/* คอลัมน์ 1 */}
                                <div className="flex flex-col space-y-2 p-4">
                                    <label className="flex items-center justify-between">
                                        <span>เครื่องปรับอากาศ</span>
                                        <Checkbox
                                            checked={formData.services.includes("aircon")}
                                            onChange={(e) => handleServiceChange("aircon", e.target.checked)}
                                        />
                                    </label>
                                    <label className="flex items-center justify-between">
                                        <span>เครื่องทำน้ำอุ่น</span>
                                        <Checkbox
                                            checked={formData.services.includes("heater")}
                                            onChange={(e) => handleServiceChange("heater", e.target.checked)}
                                        />
                                    </label>
                                </div>

                                {/* คอลัมน์ 2 */}
                                <div className="flex flex-col space-y-2 p-4">
                                    <label className="flex items-center justify-between">
                                        <span>โทรทัศน์</span>
                                        <Checkbox
                                            checked={formData.services.includes("tv")}
                                            onChange={(e) => handleServiceChange("tv", e.target.checked)}
                                        />
                                    </label>
                                    <label className="flex items-center justify-between">
                                        <span>อ่างอาบน้ำ</span>
                                        <Checkbox
                                            checked={formData.services.includes("bathtub")}
                                            onChange={(e) => handleServiceChange("bathtub", e.target.checked)}
                                        />
                                    </label>
                                </div>

                                {/* คอลัมน์ 3 */}
                                <div className="flex flex-col space-y-2 p-4">
                                    <label className="flex items-center justify-between">
                                        <span>สระว่ายน้ำ</span>
                                        <Checkbox
                                            checked={formData.services.includes("pool")}
                                            onChange={(e) => handleServiceChange("pool", e.target.checked)}
                                        />
                                    </label>
                                    <label className="flex items-center justify-between">
                                        <span>ร้านอาหาร</span>
                                        <Checkbox
                                            checked={formData.services.includes("restaurant")}
                                            onChange={(e) => handleServiceChange("restaurant", e.target.checked)}
                                        />
                                    </label>
                                </div>

                                {/* คอลัมน์ 4 */}
                                <div className="flex flex-col space-y-2 p-4">
                                    <label className="flex items-center justify-between">
                                        <span>สปา</span>
                                        <Checkbox
                                            checked={formData.services.includes("spa")}
                                            onChange={(e) => handleServiceChange("spa", e.target.checked)}
                                        />
                                    </label>
                                    <label className="flex items-center justify-between">
                                        <span>บริการซักรีด</span>
                                        <Checkbox
                                            checked={formData.services.includes("laundry")}
                                            onChange={(e) => handleServiceChange("laundry", e.target.checked)}
                                        />
                                    </label>
                                </div>

                                {/* คอลัมน์ 5 */}
                                <div className="flex flex-col space-y-2 p-4">
                                    <label className="flex items-center justify-between">
                                        <span>สนามหญ้า</span>
                                        <Checkbox
                                            checked={formData.services.includes("garden")}
                                            onChange={(e) => handleServiceChange("garden", e.target.checked)}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="w-full flex justify-center mt-20">
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
            </div>
        </div>
    );
}
