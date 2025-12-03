'use client';

import { useState, useEffect } from 'react';
import { Input, Select } from 'antd';
import { API_BASE_URL } from '@/config/api';

interface HotelLocationSectionProps {
    formData: {
        accommodationName: string;
        accommodationNameEn: string;
        accommodationNameConfirm?: string;
        accommodationNameEnConfirm?: string;
        tradeRegistrationNumber: string;
        address: string;
        businessEmail: string;
        officePhone: string;
        googleMapsLink: string;
        mobilePhone: string;
        provinceId?: string;
        districtId?: string;
        subdistrictId?: string;
        postCode?: string;
    };
    onInputChange: (field: string, value: string) => void;
    disabled?: boolean;
    showConfirmationFields?: boolean;
}

interface Province {
    id: string;
    name: string;
    nameEn?: string;
}

interface District {
    id: string;
    name: string;
    nameEn?: string;
}

interface Subdistrict {
    id: string;
    name: string;
    nameEn?: string;
    postalCode?: string;
}

export default function HotelLocationSection({
    formData,
    onInputChange,
    disabled = false,
    showConfirmationFields = false
}: HotelLocationSectionProps) {
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [subdistricts, setSubdistricts] = useState<Subdistrict[]>([]);
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingSubdistricts, setLoadingSubdistricts] = useState(false);

    // Fetch provinces on mount
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                setLoadingProvinces(true);
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    setLoadingProvinces(false);
                    return;
                }
                const response = await fetch(`${API_BASE_URL}/api/partner/location/provinces`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (data.success && data.data) {
                    setProvinces(data.data || []);
                }
            } catch (error) {
                console.error('Error fetching provinces:', error);
            } finally {
                setLoadingProvinces(false);
            }
        };
        fetchProvinces();
    }, []);

    // Load location data when formData has IDs (for initial data loading)
    useEffect(() => {
        const loadLocationData = async () => {
            // Wait for provinces to be loaded first
            if (provinces.length === 0) {
                return;
            }

            // If provinceId exists, fetch districts (preserve selection for initial load)
            if (formData.provinceId && formData.provinceId.trim() !== '') {
                console.log('Loading districts for province:', formData.provinceId);
                await fetchDistricts(formData.provinceId, true);
            }
        };
        
        // Only run if we have provinces loaded and formData has provinceId
        if (provinces.length > 0 && formData.provinceId && formData.provinceId.trim() !== '') {
            loadLocationData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.provinceId, provinces.length]);

    // Load subdistricts when districts are loaded and districtId exists
    useEffect(() => {
        const loadSubdistricts = async () => {
            // Wait for districts to be loaded and districtId to exist
            if (districts.length > 0 && formData.districtId && formData.districtId.trim() !== '') {
                console.log('Loading subdistricts for district:', formData.districtId);
                await fetchSubdistricts(formData.districtId, true);
            }
        };
        
        // Only run if we have districts loaded and formData has districtId
        if (districts.length > 0 && formData.districtId && formData.districtId.trim() !== '') {
            loadSubdistricts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.districtId, districts.length]);

    // Function to fetch districts for a given province
    const fetchDistricts = async (provinceId: string, preserveSelection: boolean = false) => {
        if (!provinceId || provinceId.trim() === '') {
            setDistricts([]);
            setSubdistricts([]);
            return;
        }

        try {
            setLoadingDistricts(true);
            // Clear districts and subdistricts immediately
            setDistricts([]);
            setSubdistricts([]);
            
            // Clear dependent fields only if not preserving selection (user-initiated change)
            if (!preserveSelection) {
                onInputChange('districtId', '');
                onInputChange('subdistrictId', '');
                onInputChange('postCode', '');
            }
            
            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.error('No access token found');
                setLoadingDistricts(false);
                return;
            }

            const url = `${API_BASE_URL}/api/partner/location/districts?provinceId=${encodeURIComponent(provinceId)}`;
            console.log('Fetching districts for province:', provinceId);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('HTTP error response:', response.status, errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Districts API response:', data);
            
            if (data.success && data.data && Array.isArray(data.data)) {
                setDistricts(data.data);
                console.log('Districts loaded successfully:', data.data.length, 'districts');
            } else {
                console.error('Failed to fetch districts - invalid response:', data);
                setDistricts([]);
            }
        } catch (error) {
            console.error('Error fetching districts:', error);
            setDistricts([]);
        } finally {
            setLoadingDistricts(false);
        }
    };

    // Function to fetch subdistricts for a given district
    const fetchSubdistricts = async (districtId: string, preserveSelection: boolean = false) => {
        if (!districtId || districtId.trim() === '') {
            setSubdistricts([]);
            return;
        }

        try {
            setLoadingSubdistricts(true);
            setSubdistricts([]);
            // Clear dependent fields only if not preserving selection (user-initiated change)
            if (!preserveSelection) {
                onInputChange('subdistrictId', '');
                onInputChange('postCode', '');
            }
            
            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.error('No access token found');
                setLoadingSubdistricts(false);
                return;
            }

            const url = `${API_BASE_URL}/api/partner/location/subdistricts?districtId=${encodeURIComponent(districtId)}`;
            console.log('Fetching subdistricts for district:', districtId);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('HTTP error response:', response.status, errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Subdistricts API response:', data);
            
            if (data.success && data.data && Array.isArray(data.data)) {
                setSubdistricts(data.data);
                console.log('Subdistricts loaded successfully:', data.data.length, 'subdistricts');
            } else {
                console.error('Failed to fetch subdistricts - invalid response:', data);
                setSubdistricts([]);
            }
        } catch (error) {
            console.error('Error fetching subdistricts:', error);
            setSubdistricts([]);
        } finally {
            setLoadingSubdistricts(false);
        }
    };

    // Auto-fill postal code when subdistrict is selected
    useEffect(() => {
        if (formData.subdistrictId && formData.subdistrictId.trim() !== '' && subdistricts.length > 0) {
            const selectedSubdistrict = subdistricts.find(s => s.id === formData.subdistrictId);
            if (selectedSubdistrict?.postalCode) {
                onInputChange('postCode', selectedSubdistrict.postalCode);
                console.log('Postal code auto-filled:', selectedSubdistrict.postalCode);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.subdistrictId, subdistricts]);

    const handleProvinceChange = async (value: string) => {
        // Update province first
        onInputChange('provinceId', value);
        console.log('Province changed to:', value);
        // Clear dependent fields immediately
        onInputChange('districtId', '');
        onInputChange('subdistrictId', '');
        onInputChange('postCode', '');

        // Fetch districts for the selected province
        await fetchDistricts(value);
    };

    const handleDistrictChange = async (value: string) => {
        onInputChange('districtId', value);
        console.log('District changed to:', value);
        // Clear subdistrict when district changes
        onInputChange('subdistrictId', '');
        onInputChange('postCode', '');

        // Fetch subdistricts for the selected district
        await fetchSubdistricts(value);
    };

    const handleSubdistrictChange = (value: string) => {
        onInputChange('subdistrictId', value);
        // Auto-fill postal code immediately if subdistrict is found
        const selectedSubdistrict = subdistricts.find(s => s.id === value);
        if (selectedSubdistrict?.postalCode) {
            onInputChange('postCode', selectedSubdistrict.postalCode);
            console.log('Postal code auto-filled from selection:', selectedSubdistrict.postalCode);
        }
    };

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

                        {showConfirmationFields && (
                            <div>
                                <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                    ชื่อ โรงแรม หรือ สถานที่พัก (ยืนยัน) *
                                </label>
                                <Input
                                    value={formData.accommodationNameConfirm}
                                    onChange={(e) => onInputChange('accommodationNameConfirm', e.target.value)}
                                    placeholder="กรุณากรอกชื่อจริงอีกครั้งเพื่อยืนยัน"
                                    className="w-full h-12 text-base"
                                    style={{ height: '48px', fontSize: '16px' }}
                                    disabled={disabled}
                                />
                                <p className="text-sm text-gray-500 mt-1" style={{ marginBottom: 0, marginTop: '0.4rem' }}>
                                    *กรุณากรอกชื่อให้ตรงกับด้านบนเพื่อยืนยันความถูกต้อง
                                </p>
                            </div>
                        )}

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

                        {showConfirmationFields && (
                            <div>
                                <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                    ชื่อ โรงแรม หรือ สถานที่พัก (ยืนยัน) *(ภาษาอังกฤษ)
                                </label>
                                <Input
                                    value={formData.accommodationNameEnConfirm}
                                    onChange={(e) => onInputChange('accommodationNameEnConfirm', e.target.value)}
                                    placeholder="กรุณากรอกชื่อภาษาอังกฤษอีกครั้งเพื่อยืนยัน"
                                    className="w-full h-12 text-base"
                                    style={{ height: '48px', fontSize: '16px' }}
                                    disabled={disabled}
                                />
                                <p className="text-sm mt-1" style={{ marginBottom: 0, marginTop: '0.4rem', color: '#FFFFFF' }}>
                                    ...
                                </p>
                            </div>
                        )}

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
                                จังหวัด *
                            </label>
                            <Select
                                value={formData.provinceId || undefined}
                                onChange={handleProvinceChange}
                                placeholder="เลือกจังหวัด"
                                className="w-full"
                                style={{ height: '48px' }}
                                disabled={disabled || loadingProvinces}
                                loading={loadingProvinces}
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={provinces.map(p => ({
                                    value: p.id,
                                    label: p.name,
                                }))}
                            />
                        </div>

                        <div>
                            <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                อำเภอ/เขต *
                            </label>
                            <Select
                                value={formData.districtId || undefined}
                                onChange={handleDistrictChange}
                                placeholder="เลือกอำเภอ/เขต"
                                className="w-full"
                                style={{ height: '48px' }}
                                disabled={disabled}
                                loading={loadingDistricts}
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={districts.map(d => ({
                                    value: d.id,
                                    label: d.name,
                                }))}
                            />
                        </div>

                        <div>
                            <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                ตำบล/แขวง *
                            </label>
                            <Select
                                value={formData.subdistrictId || undefined}
                                onChange={handleSubdistrictChange}
                                placeholder="เลือกตำบล/แขวง"
                                className="w-full"
                                style={{ height: '48px' }}
                                disabled={disabled}
                                loading={loadingSubdistricts}
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={subdistricts.map(s => ({
                                    value: s.id,
                                    label: s.name,
                                }))}
                            />
                        </div>

                        <div>
                            <label className="block text-base font-medium mb-3" style={{ color: '#1F2937' }}>
                                รหัสไปรษณีย์ *
                            </label>
                            <Input
                                value={formData.postCode || ''}
                                onChange={(e) => onInputChange('postCode', e.target.value)}
                                className="w-full h-12 text-base"
                                style={{ height: '48px', fontSize: '16px' }}
                                disabled={disabled}
                                placeholder="รหัสไปรษณีย์จะถูกกรอกอัตโนมัติเมื่อเลือกตำบล/แขวง"
                            />
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

