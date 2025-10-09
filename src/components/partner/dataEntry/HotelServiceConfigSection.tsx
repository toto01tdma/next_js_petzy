'use client';

import { Input, Select, Checkbox } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

const { Option } = Select;

// Custom Service Checkbox Component
interface ServiceCheckboxProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

function ServiceCheckbox({ label, checked, onChange }: ServiceCheckboxProps) {
    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`w-full py-8 px-4 border-2 rounded-lg transition-all flex flex-col items-center justify-center space-y-2 ${
                    checked
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
                style={{
                    height: '120px'
                }}
            >
                <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                        checked
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300 bg-white'
                    }`}
                >
                    {checked && <CheckOutlined className="text-white text-lg" />}
                </div>
                <span className={`text-sm font-medium ${checked ? 'text-blue-600' : 'text-gray-700'}`}>
                    {label}
                </span>
            </button>
        </div>
    );
}

interface HotelServiceConfigSectionProps {
    formData: {
        roomService: boolean;
        specialService: boolean;
        petCareService: boolean;
        hotelName: string;
        hotelNameConfirm: string;
        hotelNameEng: string;
        hotelNameEngConfirm: string;
        rooms: string;
        customRoomCount: string;
        province: string;
        customRoomType: string;
        district: string;
        subdistrict: string;
        specialServiceType: string;
        services: string[];
    };
    showCustomRoomInput: boolean;
    showCustomRoomTypeInput: boolean;
    showSpecialServiceTypeInput: boolean;
    onInputChange: (field: string, value: string | boolean | string[]) => void;
    onRoomCountChange: (value: string) => void;
    onRoomTypeChange: (value: string) => void;
    onServiceTypeChange: (value: string) => void;
    onSpecialServiceTypeChange: (value: string) => void;
    onServiceChange: (service: string, checked: boolean) => void;
    disabled?: boolean;
    approvalStatus?: string;
}

export default function HotelServiceConfigSection({
    formData,
    showCustomRoomInput,
    showCustomRoomTypeInput,
    showSpecialServiceTypeInput,
    onInputChange,
    onRoomCountChange,
    onRoomTypeChange,
    onServiceTypeChange,
    onSpecialServiceTypeChange,
    onServiceChange,
    disabled = false,
    approvalStatus = 'DRAFT'
}: HotelServiceConfigSectionProps) {
    return (
        <div className="py-6 px-12 border border-black rounded-lg">
            <div className="space-y-4">
                <p style={{ marginBottom: '0.75rem', color: '#484848' }}>
                    <span className="text-xl font-bold me-4">กรุณาเลือกบริการที่คุณมี</span>{' '}
                    <span className="text-md">สามารถเลือกได้หลายบริการตามความจริงที่คุณให้บริการ</span>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ServiceCheckbox
                        label="รูปแบบบริการห้องพัก"
                        checked={formData.roomService}
                        onChange={(checked) => onInputChange('roomService', checked)}
                    />
                    <ServiceCheckbox
                        label="รูปแบบบริการพิเศษ"
                        checked={formData.specialService}
                        onChange={(checked) => onInputChange('specialService', checked)}
                    />
                    <ServiceCheckbox
                        label="รูปแบบบริการรับฝากสัตว์เลี้ยง"
                        checked={formData.petCareService}
                        onChange={(checked) => onInputChange('petCareService', checked)}
                    />
                </div>

                {/* Two-column grid for regular fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-2">
                        <div>
                            <label className="block text-base font-medium mb-2" style={{ color: '#1F2937' }}>
                                ชื่อ โรงแรม หรือ สถานที่พัก
                            </label>
                            <Input
                                value={formData.hotelName}
                                onChange={(e) => onInputChange('hotelName', e.target.value)}
                                placeholder="สุขสม โรงแรมสวัสดี"
                                className="w-full h-12 text-base"
                                style={{ height: '48px', fontSize: '16px' }}
                                disabled={disabled || approvalStatus !== 'DRAFT'}
                            />
                            <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.2rem', color: '#FFFFFF' }}>...</p>
                        </div>

                        <div>
                            <label className="block text-base font-medium mb-2" style={{ color: '#1F2937' }}>
                                ชื่อ โรงแรม หรือ สถานที่พัก (ยืนยัน)
                            </label>
                            <Input
                                value={formData.hotelNameConfirm || formData.hotelName}
                                onChange={(e) => onInputChange('hotelNameConfirm', e.target.value)}
                                placeholder="สุขสม โรงแรมสวัสดี"
                                className="w-full h-12 text-base"
                                style={{ height: '48px', fontSize: '16px' }}
                            />
                            <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.2rem', color: '#6B7280' }}>*กรุณากรอกชื่อจริงครั้งเพื่อยืนยันความถูกต้อง</p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-2">
                        <div>
                            <label className="block text-base font-medium mb-2" style={{ color: '#1F2937' }}>
                                ชื่อ โรงแรม หรือ สถานที่พัก (ภาษาอังกฤษ)
                            </label>
                            <Input
                                value={formData.hotelNameEng}
                                onChange={(e) => onInputChange('hotelNameEng', e.target.value)}
                                placeholder="Sooksom Hotel"
                                className="w-full h-12 text-base"
                                style={{ height: '48px', fontSize: '16px' }}
                            />
                            <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.2rem', color: '#FFFFFF' }}>...</p>
                        </div>

                        <div>
                            <label className="block text-base font-medium mb-2" style={{ color: '#1F2937' }}>
                                ชื่อ โรงแรม หรือ สถานที่พัก (ภาษาอังกฤษ) (ยืนยัน)
                            </label>
                            <Input
                                value={formData.hotelNameEngConfirm || formData.hotelNameEng}
                                onChange={(e) => onInputChange('hotelNameEngConfirm', e.target.value)}
                                placeholder="Sooksom Hotel"
                                className="w-full h-12 text-base"
                                style={{ height: '48px', fontSize: '16px' }}
                            />
                            <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.2rem', color: '#6B7280' }}>*กรุณากรอกชื่อจริงครั้งเพื่อยืนยันความถูกต้อง</p>
                        </div>
                    </div>
                </div>

                {/* Full-width field: Total number of rooms */}
                <div className="space-y-2">
                    <div>
                        <label className="block text-base font-medium mb-2" style={{ color: '#1F2937' }}>
                            ระบุจำนวนห้องพักทั้งหมดของคุณ
                        </label>
                        <Select
                            value={showCustomRoomInput ? 'custom' : formData.rooms}
                            onChange={onRoomCountChange}
                            placeholder="5 ห้องพัก"
                            className="w-full"
                            style={{ height: '48px' }}
                            size="large"
                        >
                            <Option value="5">5 ห้องพัก</Option>
                            <Option value="10">10 ห้องพัก</Option>
                            <Option value="15">15 ห้องพัก</Option>
                            <Option value="20">20 ห้องพัก</Option>
                            <Option value="25">25 ห้องพัก</Option>
                            <Option value="30">30 ห้องพัก</Option>
                            <Option value="custom">กำหนดเอง</Option>
                        </Select>
                        {showCustomRoomInput && (
                            <Input
                                value={formData.customRoomCount}
                                onChange={(e) => onInputChange('customRoomCount', e.target.value)}
                                placeholder="กรุณากรอกจำนวนห้องพัก"
                                className="w-full h-12 text-base mt-2"
                                style={{ height: '48px', fontSize: '16px' }}
                                type="number"
                            />
                        )}
                        <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.2rem', color: '#FFFFFF' }}>...</p>
                    </div>
                </div>

                {/* Room Type Selection */}
                <div className="space-y-2">
                    <div>
                        <label className="block text-base font-medium mb-2" style={{ color: '#1F2937' }}>
                            เลือกประเภทห้องพัก
                        </label>
                        <Select
                            value={showCustomRoomTypeInput ? 'custom' : formData.province}
                            onChange={onRoomTypeChange}
                            placeholder="ห้องเดี่ยว"
                            className="w-full"
                            style={{ height: '48px' }}
                            size="large"
                        >
                            <Option value="single">ห้องเดี่ยว</Option>
                            <Option value="double">ห้องคู่</Option>
                            <Option value="suite">ห้องสวีท</Option>
                            <Option value="custom">กำหนดเอง</Option>
                        </Select>
                        {showCustomRoomTypeInput && (
                            <Input
                                value={formData.customRoomType}
                                onChange={(e) => onInputChange('customRoomType', e.target.value)}
                                placeholder="กรุณาระบุประเภทห้องพัก"
                                className="w-full h-12 text-base mt-2"
                                style={{ height: '48px', fontSize: '16px' }}
                            />
                        )}
                        <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.2rem', color: '#FFFFFF' }}>...</p>
                    </div>
                </div>

                {/* Service Type Selection */}
                <div className="space-y-2">
                    <div>
                        <label className="block text-base font-medium mb-2" style={{ color: '#1F2937' }}>
                            เลือกประเภทบริการ
                        </label>
                        <Select
                            value={formData.district}
                            onChange={onServiceTypeChange}
                            placeholder="บริการห้องพัก"
                            className="w-full"
                            style={{ height: '48px' }}
                            size="large"
                        >
                            <Option value="room_service">บริการห้องพัก</Option>
                            <Option value="full_service">บริการเต็มรูปแบบ</Option>
                            <Option value="basic_service">บริการพื้นฐาน</Option>
                        </Select>
                        <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.2rem', color: '#FFFFFF' }}>...</p>
                    </div>
                </div>

                {/* Special Service Type Selection */}
                <div className="space-y-2">
                    <div>
                        <label className="block text-base font-medium mb-2" style={{ color: '#1F2937' }}>
                            เลือกประเภทบริการพิเศษ
                        </label>
                        <Select
                            value={showSpecialServiceTypeInput ? 'custom' : formData.subdistrict}
                            onChange={onSpecialServiceTypeChange}
                            placeholder="บริการพิเศษ"
                            className="w-full"
                            style={{ height: '48px' }}
                            size="large"
                        >
                            <Option value="massage">นวดแผนไทย</Option>
                            <Option value="tour">ทัวร์ท่องเที่ยว</Option>
                            <Option value="shuttle">รถรับส่ง</Option>
                            <Option value="custom">กำหนดเอง</Option>
                        </Select>
                        {showSpecialServiceTypeInput && (
                            <Input
                                value={formData.specialServiceType}
                                onChange={(e) => onInputChange('specialServiceType', e.target.value)}
                                placeholder="กรุณาระบุประเภทบริการพิเศษ"
                                className="w-full h-12 text-base mt-2"
                                style={{ height: '48px', fontSize: '16px' }}
                            />
                        )}
                        <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.2rem', color: '#FFFFFF' }}>...</p>
                    </div>
                </div>

                {/* Additional Services */}
                <div className="space-y-2">
                    <label className="block text-xl font-bold mb-4" style={{ color: '#484848' }}>
                        บริการเพิ่มเติม
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 border border-black rounded-lg p-4">
                        {/* คอลัมน์ 1 */}
                        <div className="flex flex-col space-y-2 p-4">
                            <label className="flex items-center justify-between">
                                <span style={{ color: '#1F2937' }}>ที่จอดรถ</span>
                                <Checkbox
                                    checked={formData.services.includes("parking")}
                                    onChange={(e) => onServiceChange("parking", e.target.checked)}
                                />
                            </label>
                            <label className="flex items-center justify-between">
                                <span style={{ color: '#1F2937' }}>WiFi ฟรี</span>
                                <Checkbox
                                    checked={formData.services.includes("wifi")}
                                    onChange={(e) => onServiceChange("wifi", e.target.checked)}
                                />
                            </label>
                        </div>

                        {/* คอลัมน์ 2 */}
                        <div className="flex flex-col space-y-2 p-4">
                            <label className="flex items-center justify-between">
                                <span style={{ color: '#1F2937' }}>ฟิตเนส</span>
                                <Checkbox
                                    checked={formData.services.includes("fitness")}
                                    onChange={(e) => onServiceChange("fitness", e.target.checked)}
                                />
                            </label>
                            <label className="flex items-center justify-between">
                                <span style={{ color: '#1F2937' }}>เครื่องปรับอากาศ</span>
                                <Checkbox
                                    checked={formData.services.includes("aircon")}
                                    onChange={(e) => onServiceChange("aircon", e.target.checked)}
                                />
                            </label>
                        </div>

                        {/* คอลัมน์ 3 */}
                        <div className="flex flex-col space-y-2 p-4">
                            <label className="flex items-center justify-between">
                                <span style={{ color: '#1F2937' }}>สระว่ายน้ำ</span>
                                <Checkbox
                                    checked={formData.services.includes("pool")}
                                    onChange={(e) => onServiceChange("pool", e.target.checked)}
                                />
                            </label>
                            <label className="flex items-center justify-between">
                                <span style={{ color: '#1F2937' }}>ร้านอาหาร</span>
                                <Checkbox
                                    checked={formData.services.includes("restaurant")}
                                    onChange={(e) => onServiceChange("restaurant", e.target.checked)}
                                />
                            </label>
                        </div>

                        {/* คอลัมน์ 4 */}
                        <div className="flex flex-col space-y-2 p-4">
                            <label className="flex items-center justify-between">
                                <span style={{ color: '#1F2937' }}>สปา</span>
                                <Checkbox
                                    checked={formData.services.includes("spa")}
                                    onChange={(e) => onServiceChange("spa", e.target.checked)}
                                />
                            </label>
                            <label className="flex items-center justify-between">
                                <span style={{ color: '#1F2937' }}>บริการซักรีด</span>
                                <Checkbox
                                    checked={formData.services.includes("laundry")}
                                    onChange={(e) => onServiceChange("laundry", e.target.checked)}
                                />
                            </label>
                        </div>

                        {/* คอลัมน์ 5 */}
                        <div className="flex flex-col space-y-2 p-4">
                            <label className="flex items-center justify-between">
                                <span style={{ color: '#1F2937' }}>สนามหญ้า</span>
                                <Checkbox
                                    checked={formData.services.includes("garden")}
                                    onChange={(e) => onServiceChange("garden", e.target.checked)}
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

