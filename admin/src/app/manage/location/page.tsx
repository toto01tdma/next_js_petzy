'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/admin/shared/Sidebar';
import { Button, Table, Space, Modal, Form, Input, Select, message, Tabs, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { API_BASE_URL, USE_API_MODE } from '@/config/api';
import type { ColumnsType } from 'antd/es/table';
import { checkAuthError } from '@/utils/api';

const { TabPane } = Tabs;

interface Country {
    id: string;
    code: string;
    name: string;
    nameEn?: string;
}

interface Province {
    id: string;
    countryId: string;
    code: string;
    name: string;
    nameEn?: string;
    imageUrl?: string;
    country?: Country;
}

interface District {
    id: string;
    provinceId: string;
    code: string;
    name: string;
    nameEn?: string;
    imageUrl?: string;
    province?: Province;
}

interface Subdistrict {
    id: string;
    districtId: string;
    code: string;
    name: string;
    nameEn?: string;
    postalCode?: string;
    imageUrl?: string;
    district?: District;
}

interface LocationType {
    id: number;
    nameTh: string;
    nameEn?: string;
}

interface Location {
    id: string;
    name: string;
    provinceId: string;
    districtId: string;
    subdistrictId: string;
    locationTypeId: number;
    imageUrl?: string;
    province?: Province;
    district?: District;
    subdistrict?: Subdistrict;
    locationType?: LocationType;
}

type LocationItem = Country | Province | District | Subdistrict | LocationType | Location;

export default function LocationManagement() {
    const [activeTab, setActiveTab] = useState('countries');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<LocationItem | null>(null);
    const [form] = Form.useForm();
    
    // Data states
    const [countries, setCountries] = useState<Country[]>([]);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [subdistricts, setSubdistricts] = useState<Subdistrict[]>([]);
    const [locationTypes, setLocationTypes] = useState<LocationType[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    
    // Loading states
    const [loading, setLoading] = useState(false);
    
    // Filter states for dependent dropdowns
    const [selectedCountryId, setSelectedCountryId] = useState<string | undefined>();
    const [selectedProvinceId, setSelectedProvinceId] = useState<string | undefined>();
    const [selectedDistrictId, setSelectedDistrictId] = useState<string | undefined>();
    const [selectedSubdistrictProvinceId, setSelectedSubdistrictProvinceId] = useState<string | undefined>();
    const [selectedLocationTypeId, setSelectedLocationTypeId] = useState<string | undefined>();
    const [selectedLocationProvinceId, setSelectedLocationProvinceId] = useState<string | undefined>();
    
    // Image upload states
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        fetchCountries();
        fetchProvinces();
        fetchDistricts();
        fetchSubdistricts();
        fetchLocationTypes();
        fetchLocations();
    }, []);

    useEffect(() => {
        if (activeTab === 'provinces') {
            fetchProvinces(selectedCountryId);
        } else if (activeTab === 'districts') {
            fetchDistricts(selectedProvinceId);
        } else if (activeTab === 'subdistricts') {
            fetchSubdistricts(selectedDistrictId, selectedSubdistrictProvinceId);
        } else if (activeTab === 'locations') {
            fetchLocations(selectedLocationTypeId, selectedLocationProvinceId);
        } else if (activeTab === 'location-types') {
            fetchLocationTypes();
        }
    }, [activeTab, selectedCountryId, selectedProvinceId, selectedDistrictId, selectedSubdistrictProvinceId, selectedLocationTypeId, selectedLocationProvinceId]);

    const fetchCountries = async () => {
        if (!USE_API_MODE) return;
        
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/api/admin/location/countries`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();
            if (checkAuthError(response, result)) return;

            if (result.success) {
                setCountries(result.data || []);
            }
        } catch (error) {
            console.error('Error fetching countries:', error);
            message.error('เกิดข้อผิดพลาดในการโหลดข้อมูลประเทศ');
        } finally {
            setLoading(false);
        }
    };

    const fetchProvinces = async (countryId?: string) => {
        if (!USE_API_MODE) return;
        
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const url = countryId 
                ? `${API_BASE_URL}/api/admin/location/provinces?countryId=${countryId}`
                : `${API_BASE_URL}/api/admin/location/provinces`;
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();
            if (checkAuthError(response, result)) return;

            if (result.success) {
                setProvinces(result.data || []);
            }
        } catch (error) {
            console.error('Error fetching provinces:', error);
            message.error('เกิดข้อผิดพลาดในการโหลดข้อมูลจังหวัด');
        } finally {
            setLoading(false);
        }
    };

    const fetchDistricts = async (provinceId?: string) => {
        if (!USE_API_MODE) return;
        
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const url = provinceId 
                ? `${API_BASE_URL}/api/admin/location/districts?provinceId=${provinceId}`
                : `${API_BASE_URL}/api/admin/location/districts`;
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();
            if (checkAuthError(response, result)) return;

            if (result.success) {
                setDistricts(result.data || []);
            }
        } catch (error) {
            console.error('Error fetching districts:', error);
            message.error('เกิดข้อผิดพลาดในการโหลดข้อมูลอำเภอ');
        } finally {
            setLoading(false);
        }
    };

    const fetchSubdistricts = async (districtId?: string, provinceId?: string) => {
        if (!USE_API_MODE) return;
        
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            let url = `${API_BASE_URL}/api/admin/location/subdistricts?`;
            const params = new URLSearchParams();
            if (districtId) params.append('districtId', districtId);
            if (provinceId) params.append('provinceId', provinceId);
            url += params.toString();
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();
            if (checkAuthError(response, result)) return;

            if (result.success) {
                setSubdistricts(result.data || []);
            }
        } catch (error) {
            console.error('Error fetching subdistricts:', error);
            message.error('เกิดข้อผิดพลาดในการโหลดข้อมูลตำบล');
        } finally {
            setLoading(false);
        }
    };

    const fetchLocationTypes = async () => {
        if (!USE_API_MODE) return;
        
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/api/admin/location-types`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();
            if (checkAuthError(response, result)) return;

            if (result.success) {
                setLocationTypes(result.data || []);
            }
        } catch (error) {
            console.error('Error fetching location types:', error);
            message.error('เกิดข้อผิดพลาดในการโหลดข้อมูลประเภทสถานที่');
        } finally {
            setLoading(false);
        }
    };

    const fetchLocations = async (locationTypeId?: string, provinceId?: string) => {
        if (!USE_API_MODE) return;
        
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            let url = `${API_BASE_URL}/api/admin/locations?`;
            const params = new URLSearchParams();
            if (locationTypeId) params.append('locationTypeId', locationTypeId);
            if (provinceId) params.append('provinceId', provinceId);
            url += params.toString();
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();
            if (checkAuthError(response, result)) return;

            if (result.success) {
                setLocations(result.data || []);
            }
        } catch (error) {
            console.error('Error fetching locations:', error);
            message.error('เกิดข้อผิดพลาดในการโหลดข้อมูลสถานที่');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingItem(null);
        setImageFile(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record: LocationItem) => {
        setEditingItem(record);
        setImageFile(null);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (id: string, type: string) => {
        if (!USE_API_MODE) {
            message.info('API mode is disabled');
            return;
        }

        Modal.confirm({
            title: 'ยืนยันการลบ',
            content: 'คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?',
            okText: 'ลบ',
            okType: 'danger',
            cancelText: 'ยกเลิก',
            onOk: async () => {
                try {
                    const token = localStorage.getItem('accessToken');
                    const response = await fetch(`${API_BASE_URL}/api/admin/location/${type}/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    const result = await response.json();
                    if (checkAuthError(response, result)) return;

                    if (result.success) {
                        message.success('ลบข้อมูลสำเร็จ');
                        // Refresh data
                        if (type === 'countries') fetchCountries();
                        else if (type === 'provinces') fetchProvinces(selectedCountryId);
                        else if (type === 'districts') fetchDistricts(selectedProvinceId);
                        else if (type === 'subdistricts') fetchSubdistricts(selectedDistrictId);
                        else if (type === 'location-types') {
                            fetchLocationTypes();
                        } else if (type === 'locations') {
                            fetchLocations(selectedLocationTypeId, selectedLocationProvinceId);
                        }
                    }
                } catch (error) {
                    console.error('Error deleting:', error);
                    message.error('เกิดข้อผิดพลาดในการลบข้อมูล');
                }
            },
        });
    };

    const handleSubmit = async (values: Record<string, unknown>) => {
        if (!USE_API_MODE) {
            message.info('API mode is disabled');
            return;
        }

        try {
            const token = localStorage.getItem('accessToken');
            let url: string;
            let method: string;

            if (activeTab === 'location-types') {
                url = editingItem
                    ? `${API_BASE_URL}/api/admin/location-types/${editingItem.id}`
                    : `${API_BASE_URL}/api/admin/location-types`;
                method = editingItem ? 'PUT' : 'POST';
            } else if (activeTab === 'locations') {
                url = editingItem
                    ? `${API_BASE_URL}/api/admin/locations/${editingItem.id}`
                    : `${API_BASE_URL}/api/admin/locations`;
                method = editingItem ? 'PUT' : 'POST';
            } else {
                url = editingItem
                    ? `${API_BASE_URL}/api/admin/location/${activeTab}/${editingItem.id}`
                    : `${API_BASE_URL}/api/admin/location/${activeTab}`;
                method = editingItem ? 'PUT' : 'POST';
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const result = await response.json();
            if (checkAuthError(response, result)) return;

            if (result.success) {
                message.success(editingItem ? 'อัปเดตข้อมูลสำเร็จ' : 'เพิ่มข้อมูลสำเร็จ');
                setIsModalVisible(false);
                form.resetFields();
                
                // Refresh data
                if (activeTab === 'countries') fetchCountries();
                else if (activeTab === 'provinces') fetchProvinces(selectedCountryId);
                else if (activeTab === 'districts') fetchDistricts(selectedProvinceId);
                        else if (activeTab === 'subdistricts') fetchSubdistricts(selectedDistrictId, selectedSubdistrictProvinceId);
                else if (activeTab === 'location-types') fetchLocationTypes();
                else if (activeTab === 'locations') fetchLocations(selectedLocationTypeId, selectedLocationProvinceId);
            }
        } catch (error) {
            console.error('Error saving:', error);
            message.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    };

    const countryColumns: ColumnsType<Country> = [
        {
            title: 'รหัสประเทศ',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'ชื่อประเทศ (ไทย)',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'ชื่อประเทศ (อังกฤษ)',
            dataIndex: 'nameEn',
            key: 'nameEn',
        },
        {
            title: 'Action',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id, 'countries')} />
                </Space>
            ),
        },
    ];

    const provinceColumns: ColumnsType<Province> = [
        {
            title: 'ประเทศ',
            key: 'country',
            render: (_, record) => record.country?.name || '-',
        },
        {
            title: 'รหัสจังหวัด',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'ชื่อจังหวัด (ไทย)',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'ชื่อจังหวัด (อังกฤษ)',
            dataIndex: 'nameEn',
            key: 'nameEn',
        },
        {
            title: 'Action',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id, 'provinces')} />
                </Space>
            ),
        },
    ];

    const districtColumns: ColumnsType<District> = [
        {
            title: 'จังหวัด',
            key: 'province',
            render: (_, record) => record.province?.name || '-',
        },
        {
            title: 'รหัสอำเภอ',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'ชื่ออำเภอ (ไทย)',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'ชื่ออำเภอ (อังกฤษ)',
            dataIndex: 'nameEn',
            key: 'nameEn',
        },
        {
            title: 'Action',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id, 'districts')} />
                </Space>
            ),
        },
    ];

    const subdistrictColumns: ColumnsType<Subdistrict> = [
        {
            title: 'อำเภอ',
            key: 'district',
            render: (_, record) => record.district?.name || '-',
        },
        {
            title: 'รหัสตำบล',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'ชื่อตำบล (ไทย)',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'ชื่อตำบล (อังกฤษ)',
            dataIndex: 'nameEn',
            key: 'nameEn',
        },
        {
            title: 'รหัสไปรษณีย์',
            dataIndex: 'postalCode',
            key: 'postalCode',
        },
        {
            title: 'Action',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id, 'subdistricts')} />
                </Space>
            ),
        },
    ];

    const locationTypeColumns: ColumnsType<LocationType> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'ชื่อประเภท (ไทย)',
            dataIndex: 'nameTh',
            key: 'nameTh',
        },
        {
            title: 'ชื่อประเภท (อังกฤษ)',
            dataIndex: 'nameEn',
            key: 'nameEn',
        },
        {
            title: 'Action',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id.toString(), 'location-types')} />
                </Space>
            ),
        },
    ];

    const locationColumns: ColumnsType<Location> = [
        {
            title: 'ชื่อสถานที่',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'จังหวัด',
            key: 'province',
            render: (_, record) => record.province?.name || '-',
        },
        {
            title: 'อำเภอ',
            key: 'district',
            render: (_, record) => record.district?.name || '-',
        },
        {
            title: 'ตำบล',
            key: 'subdistrict',
            render: (_, record) => record.subdistrict?.name || '-',
        },
        {
            title: 'ประเภทสถานที่',
            key: 'locationType',
            render: (_, record) => record.locationType?.nameTh || '-',
        },
        {
            title: 'Action',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id, 'locations')} />
                </Space>
            ),
        },
    ];

    const getCurrentColumns = (): ColumnsType<LocationItem> => {
        switch (activeTab) {
            case 'countries':
                return countryColumns as ColumnsType<LocationItem>;
            case 'provinces':
                return provinceColumns as ColumnsType<LocationItem>;
            case 'districts':
                return districtColumns as ColumnsType<LocationItem>;
            case 'subdistricts':
                return subdistrictColumns as ColumnsType<LocationItem>;
            case 'location-types':
                return locationTypeColumns as ColumnsType<LocationItem>;
            case 'locations':
                return locationColumns as ColumnsType<LocationItem>;
            default:
                return countryColumns as ColumnsType<LocationItem>;
        }
    };

    const getCurrentData = () => {
        switch (activeTab) {
            case 'countries':
                return countries;
            case 'provinces':
                return provinces;
            case 'districts':
                return districts;
            case 'subdistricts':
                return subdistricts;
            case 'location-types':
                return locationTypes;
            case 'locations':
                return locations;
            default:
                return [];
        }
    };

    return (
        <div className="flex min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
            <Sidebar />

            <div className="flex-1" style={{ marginLeft: '250px' }}>
                {/* Header */}
                <div className="p-6" style={{ 
                    background: 'linear-gradient(to right, #C6CEDE, #FFFFFF)'
                }}>
                    <h1 className="text-3xl font-bold" style={{ color: '#333333' }}>
                        จัดการข้อมูลสถานที่
                    </h1>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <Tabs activeKey={activeTab} onChange={setActiveTab}>
                                <TabPane tab="ประเทศ" key="countries" />
                                <TabPane tab="จังหวัด" key="provinces" />
                                <TabPane tab="อำเภอ" key="districts" />
                                <TabPane tab="ตำบล" key="subdistricts" />
                                <TabPane tab="สถานที่" key="locations" />
                                <TabPane tab="ประเภทสถานที่" key="location-types" />
                            </Tabs>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAdd}
                            >
                                เพิ่มข้อมูล
                            </Button>
                        </div>

                        {/* Filter dropdowns for dependent tables */}
                        {activeTab === 'provinces' && (
                            <div className="mb-4">
                                <Select
                                    placeholder="เลือกประเทศ"
                                    style={{ width: 300 }}
                                    allowClear
                                    value={selectedCountryId}
                                    onChange={(value) => {
                                        setSelectedCountryId(value);
                                        fetchProvinces(value);
                                    }}
                                >
                                    {countries.map((country) => (
                                        <Select.Option key={country.id} value={country.id}>
                                            {country.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>
                        )}

                        {activeTab === 'districts' && (
                            <div className="mb-4">
                                <Select
                                    placeholder="เลือกจังหวัด"
                                    style={{ width: 300 }}
                                    allowClear
                                    value={selectedProvinceId}
                                    onChange={(value) => {
                                        setSelectedProvinceId(value);
                                        fetchDistricts(value);
                                    }}
                                >
                                    {provinces.map((province) => (
                                        <Select.Option key={province.id} value={province.id}>
                                            {province.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>
                        )}

                        {activeTab === 'subdistricts' && (
                            <div className="mb-4 flex gap-4">
                                <Select
                                    placeholder="เลือกจังหวัด"
                                    style={{ width: 300 }}
                                    allowClear
                                    value={selectedSubdistrictProvinceId}
                                    onChange={(value) => {
                                        setSelectedSubdistrictProvinceId(value);
                                        setSelectedDistrictId(undefined); // Reset district when province changes
                                        // Fetch districts for selected province
                                        if (value) {
                                            fetchDistricts(value);
                                        } else {
                                            fetchDistricts();
                                        }
                                        // Fetch subdistricts for selected province
                                        fetchSubdistricts(undefined, value);
                                    }}
                                >
                                    {provinces.map((province) => (
                                        <Select.Option key={province.id} value={province.id}>
                                            {province.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                                <Select
                                    placeholder="เลือกอำเภอ"
                                    style={{ width: 300 }}
                                    allowClear
                                    value={selectedDistrictId}
                                    disabled={!selectedSubdistrictProvinceId}
                                    onChange={(value) => {
                                        setSelectedDistrictId(value);
                                        fetchSubdistricts(value, selectedSubdistrictProvinceId);
                                    }}
                                >
                                    {districts
                                        .filter((district) => 
                                            !selectedSubdistrictProvinceId || 
                                            district.provinceId === selectedSubdistrictProvinceId
                                        )
                                        .map((district) => (
                                            <Select.Option key={district.id} value={district.id}>
                                                {district.name}
                                            </Select.Option>
                                        ))}
                                </Select>
                            </div>
                        )}

                        {activeTab === 'locations' && (
                            <div className="mb-4 flex gap-4">
                                <Select
                                    placeholder="เลือกประเภทสถานที่"
                                    style={{ width: 300 }}
                                    allowClear
                                    value={selectedLocationTypeId}
                                    onChange={(value) => {
                                        setSelectedLocationTypeId(value);
                                        fetchLocations(value, selectedLocationProvinceId);
                                    }}
                                >
                                    {locationTypes.map((type) => (
                                        <Select.Option key={type.id} value={type.id.toString()}>
                                            {type.nameTh}
                                        </Select.Option>
                                    ))}
                                </Select>
                                <Select
                                    placeholder="เลือกจังหวัด"
                                    style={{ width: 300 }}
                                    allowClear
                                    value={selectedLocationProvinceId}
                                    onChange={(value) => {
                                        setSelectedLocationProvinceId(value);
                                        fetchLocations(selectedLocationTypeId, value);
                                    }}
                                >
                                    {provinces.map((province) => (
                                        <Select.Option key={province.id} value={province.id}>
                                            {province.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>
                        )}

                        <Table
                            columns={getCurrentColumns()}
                            dataSource={getCurrentData()}
                            rowKey="id"
                            loading={loading}
                            pagination={{ pageSize: 10 }}
                        />
                    </div>
                </div>

                {/* Modal for Add/Edit */}
                <Modal
                    title={editingItem ? 'แก้ไขข้อมูล' : 'เพิ่มข้อมูล'}
                    open={isModalVisible}
                    onCancel={() => {
                        setIsModalVisible(false);
                        form.resetFields();
                    }}
                    onOk={() => form.submit()}
                    okText="บันทึก"
                    cancelText="ยกเลิก"
                    width={600}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        {activeTab === 'countries' && (
                            <>
                                <Form.Item
                                    name="code"
                                    label="รหัสประเทศ"
                                    rules={[{ required: true, message: 'กรุณากรอกรหัสประเทศ' }]}
                                >
                                    <Input placeholder="เช่น TH" />
                                </Form.Item>
                                <Form.Item
                                    name="name"
                                    label="ชื่อประเทศ (ไทย)"
                                    rules={[{ required: true, message: 'กรุณากรอกชื่อประเทศ' }]}
                                >
                                    <Input placeholder="เช่น ประเทศไทย" />
                                </Form.Item>
                                <Form.Item
                                    name="nameEn"
                                    label="ชื่อประเทศ (อังกฤษ)"
                                >
                                    <Input placeholder="เช่น Thailand" />
                                </Form.Item>
                            </>
                        )}

                        {activeTab === 'provinces' && (
                            <>
                                <Form.Item
                                    name="countryId"
                                    label="ประเทศ"
                                    rules={[{ required: true, message: 'กรุณาเลือกประเทศ' }]}
                                >
                                    <Select placeholder="เลือกประเทศ">
                                        {countries.map((country) => (
                                            <Select.Option key={country.id} value={country.id}>
                                                {country.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="code"
                                    label="รหัสจังหวัด"
                                    rules={[{ required: true, message: 'กรุณากรอกรหัสจังหวัด' }]}
                                >
                                    <Input placeholder="เช่น 10" />
                                </Form.Item>
                                <Form.Item
                                    name="name"
                                    label="ชื่อจังหวัด (ไทย)"
                                    rules={[{ required: true, message: 'กรุณากรอกชื่อจังหวัด' }]}
                                >
                                    <Input placeholder="เช่น กรุงเทพมหานคร" />
                                </Form.Item>
                                <Form.Item
                                    name="nameEn"
                                    label="ชื่อจังหวัด (อังกฤษ)"
                                >
                                    <Input placeholder="เช่น Bangkok" />
                                </Form.Item>
                                <Form.Item
                                    label="รูปภาพ"
                                >
                                    <Upload
                                        beforeUpload={(file) => {
                                            setImageFile(file);
                                            return false; // Prevent auto upload
                                        }}
                                        onRemove={() => {
                                            setImageFile(null);
                                            return true;
                                        }}
                                        maxCount={1}
                                        accept="image/*"
                                    >
                                        <Button icon={<UploadOutlined />}>เลือกไฟล์</Button>
                                    </Upload>
                                    {editingItem && (editingItem as Province).imageUrl && (
                                        <div style={{ marginTop: 8 }}>
                                            <img 
                                                src={`${API_BASE_URL}/uploads/provinces/${(editingItem as Province).imageUrl}`} 
                                                alt="Current" 
                                                style={{ maxWidth: 200, maxHeight: 200 }}
                                            />
                                        </div>
                                    )}
                                </Form.Item>
                            </>
                        )}

                        {activeTab === 'districts' && (
                            <>
                                <Form.Item
                                    name="provinceId"
                                    label="จังหวัด"
                                    rules={[{ required: true, message: 'กรุณาเลือกจังหวัด' }]}
                                >
                                    <Select placeholder="เลือกจังหวัด">
                                        {provinces.map((province) => (
                                            <Select.Option key={province.id} value={province.id}>
                                                {province.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="code"
                                    label="รหัสอำเภอ"
                                    rules={[{ required: true, message: 'กรุณากรอกรหัสอำเภอ' }]}
                                >
                                    <Input placeholder="เช่น 1001" />
                                </Form.Item>
                                <Form.Item
                                    name="name"
                                    label="ชื่ออำเภอ (ไทย)"
                                    rules={[{ required: true, message: 'กรุณากรอกชื่ออำเภอ' }]}
                                >
                                    <Input placeholder="เช่น เขตพระนคร" />
                                </Form.Item>
                                <Form.Item
                                    name="nameEn"
                                    label="ชื่ออำเภอ (อังกฤษ)"
                                >
                                    <Input placeholder="เช่น Phra Nakhon" />
                                </Form.Item>
                                <Form.Item
                                    label="รูปภาพ"
                                >
                                    <Upload
                                        beforeUpload={(file) => {
                                            setImageFile(file);
                                            return false; // Prevent auto upload
                                        }}
                                        onRemove={() => {
                                            setImageFile(null);
                                            return true;
                                        }}
                                        maxCount={1}
                                        accept="image/*"
                                    >
                                        <Button icon={<UploadOutlined />}>เลือกไฟล์</Button>
                                    </Upload>
                                    {editingItem && (editingItem as District).imageUrl && (
                                        <div style={{ marginTop: 8 }}>
                                            <img 
                                                src={`${API_BASE_URL}/uploads/districts/${(editingItem as District).imageUrl}`} 
                                                alt="Current" 
                                                style={{ maxWidth: 200, maxHeight: 200 }}
                                            />
                                        </div>
                                    )}
                                </Form.Item>
                            </>
                        )}

                        {activeTab === 'subdistricts' && (
                            <>
                                <Form.Item
                                    name="districtId"
                                    label="อำเภอ"
                                    rules={[{ required: true, message: 'กรุณาเลือกอำเภอ' }]}
                                >
                                    <Select placeholder="เลือกอำเภอ">
                                        {districts.map((district) => (
                                            <Select.Option key={district.id} value={district.id}>
                                                {district.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="code"
                                    label="รหัสตำบล"
                                    rules={[{ required: true, message: 'กรุณากรอกรหัสตำบล' }]}
                                >
                                    <Input placeholder="เช่น 100101" />
                                </Form.Item>
                                <Form.Item
                                    name="name"
                                    label="ชื่อตำบล (ไทย)"
                                    rules={[{ required: true, message: 'กรุณากรอกชื่อตำบล' }]}
                                >
                                    <Input placeholder="เช่น พระบรมมหาราชวัง" />
                                </Form.Item>
                                <Form.Item
                                    name="nameEn"
                                    label="ชื่อตำบล (อังกฤษ)"
                                >
                                    <Input placeholder="เช่น Phra Borom Maha Ratchawang" />
                                </Form.Item>
                                <Form.Item
                                    name="postalCode"
                                    label="รหัสไปรษณีย์"
                                >
                                    <Input placeholder="เช่น 10200" />
                                </Form.Item>
                                <Form.Item
                                    label="รูปภาพ"
                                >
                                    <Upload
                                        beforeUpload={(file) => {
                                            setImageFile(file);
                                            return false; // Prevent auto upload
                                        }}
                                        onRemove={() => {
                                            setImageFile(null);
                                            return true;
                                        }}
                                        maxCount={1}
                                        accept="image/*"
                                    >
                                        <Button icon={<UploadOutlined />}>เลือกไฟล์</Button>
                                    </Upload>
                                    {editingItem && (editingItem as Subdistrict).imageUrl && (
                                        <div style={{ marginTop: 8 }}>
                                            <img 
                                                src={`${API_BASE_URL}/uploads/subdistricts/${(editingItem as Subdistrict).imageUrl}`} 
                                                alt="Current" 
                                                style={{ maxWidth: 200, maxHeight: 200 }}
                                            />
                                        </div>
                                    )}
                                </Form.Item>
                            </>
                        )}

                        {activeTab === 'location-types' && (
                            <>
                                <Form.Item
                                    name="id"
                                    label="ID"
                                    rules={[{ required: true, message: 'กรุณากรอก ID' }]}
                                >
                                    <Input type="number" placeholder="เช่น 0" disabled={!!editingItem} />
                                </Form.Item>
                                <Form.Item
                                    name="nameTh"
                                    label="ชื่อประเภท (ไทย)"
                                    rules={[{ required: true, message: 'กรุณากรอกชื่อประเภท' }]}
                                >
                                    <Input placeholder="เช่น ไม่ระบุ" />
                                </Form.Item>
                                <Form.Item
                                    name="nameEn"
                                    label="ชื่อประเภท (อังกฤษ)"
                                >
                                    <Input placeholder="เช่น Not Specified" />
                                </Form.Item>
                            </>
                        )}

                        {activeTab === 'locations' && (
                            <>
                                <Form.Item
                                    name="name"
                                    label="ชื่อสถานที่"
                                    rules={[{ required: true, message: 'กรุณากรอกชื่อสถานที่' }]}
                                >
                                    <Input placeholder="เช่น Suvarnabhumi Airport" />
                                </Form.Item>
                                <Form.Item
                                    name="provinceId"
                                    label="จังหวัด"
                                    rules={[{ required: true, message: 'กรุณาเลือกจังหวัด' }]}
                                >
                                    <Select placeholder="เลือกจังหวัด">
                                        {provinces.map((province) => (
                                            <Select.Option key={province.id} value={province.id}>
                                                {province.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="districtId"
                                    label="อำเภอ"
                                    rules={[{ required: true, message: 'กรุณาเลือกอำเภอ' }]}
                                >
                                    <Select placeholder="เลือกอำเภอ">
                                        {districts.map((district) => (
                                            <Select.Option key={district.id} value={district.id}>
                                                {district.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="subdistrictId"
                                    label="ตำบล"
                                    rules={[{ required: true, message: 'กรุณาเลือกตำบล' }]}
                                >
                                    <Select placeholder="เลือกตำบล">
                                        {subdistricts.map((subdistrict) => (
                                            <Select.Option key={subdistrict.id} value={subdistrict.id}>
                                                {subdistrict.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="locationTypeId"
                                    label="ประเภทสถานที่"
                                    rules={[{ required: true, message: 'กรุณาเลือกประเภทสถานที่' }]}
                                >
                                    <Select placeholder="เลือกประเภทสถานที่">
                                        {locationTypes.map((type) => (
                                            <Select.Option key={type.id} value={type.id}>
                                                {type.nameTh}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="รูปภาพ"
                                >
                                    <Upload
                                        beforeUpload={(file) => {
                                            setImageFile(file);
                                            return false; // Prevent auto upload
                                        }}
                                        onRemove={() => {
                                            setImageFile(null);
                                            return true;
                                        }}
                                        maxCount={1}
                                        accept="image/*"
                                    >
                                        <Button icon={<UploadOutlined />}>เลือกไฟล์</Button>
                                    </Upload>
                                    {editingItem && (editingItem as Location).imageUrl && (
                                        <div style={{ marginTop: 8 }}>
                                            <img 
                                                src={`${API_BASE_URL}/uploads/locations/${(editingItem as Location).imageUrl}`} 
                                                alt="Current" 
                                                style={{ maxWidth: 200, maxHeight: 200 }}
                                            />
                                        </div>
                                    )}
                                </Form.Item>
                            </>
                        )}
                    </Form>
                </Modal>
            </div>
        </div>
    );
}

