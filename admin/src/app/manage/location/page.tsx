'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/admin/shared/Sidebar';
import { Button, Table, Space, Modal, Form, Input, Select, message, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
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
    country?: Country;
}

interface District {
    id: string;
    provinceId: string;
    code: string;
    name: string;
    nameEn?: string;
    province?: Province;
}

interface Subdistrict {
    id: string;
    districtId: string;
    code: string;
    name: string;
    nameEn?: string;
    postalCode?: string;
    district?: District;
}

export default function LocationManagement() {
    const [activeTab, setActiveTab] = useState('countries');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [form] = Form.useForm();
    
    // Data states
    const [countries, setCountries] = useState<Country[]>([]);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [subdistricts, setSubdistricts] = useState<Subdistrict[]>([]);
    
    // Loading states
    const [loading, setLoading] = useState(false);
    
    // Filter states for dependent dropdowns
    const [selectedCountryId, setSelectedCountryId] = useState<string | undefined>();
    const [selectedProvinceId, setSelectedProvinceId] = useState<string | undefined>();
    const [selectedDistrictId, setSelectedDistrictId] = useState<string | undefined>();

    useEffect(() => {
        fetchCountries();
        fetchProvinces();
        fetchDistricts();
        fetchSubdistricts();
    }, []);

    useEffect(() => {
        if (activeTab === 'provinces') {
            fetchProvinces(selectedCountryId);
        } else if (activeTab === 'districts') {
            fetchDistricts(selectedProvinceId);
        } else if (activeTab === 'subdistricts') {
            fetchSubdistricts(selectedDistrictId);
        }
    }, [activeTab, selectedCountryId, selectedProvinceId, selectedDistrictId]);

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

    const fetchSubdistricts = async (districtId?: string) => {
        if (!USE_API_MODE) return;
        
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const url = districtId 
                ? `${API_BASE_URL}/api/admin/location/subdistricts?districtId=${districtId}`
                : `${API_BASE_URL}/api/admin/location/subdistricts`;
            
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

    const handleAdd = () => {
        setEditingItem(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record: any) => {
        setEditingItem(record);
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
                    }
                } catch (error) {
                    console.error('Error deleting:', error);
                    message.error('เกิดข้อผิดพลาดในการลบข้อมูล');
                }
            },
        });
    };

    const handleSubmit = async (values: any) => {
        if (!USE_API_MODE) {
            message.info('API mode is disabled');
            return;
        }

        try {
            const token = localStorage.getItem('accessToken');
            const url = editingItem
                ? `${API_BASE_URL}/api/admin/location/${activeTab}/${editingItem.id}`
                : `${API_BASE_URL}/api/admin/location/${activeTab}`;
            
            const method = editingItem ? 'PUT' : 'POST';

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
                else if (activeTab === 'subdistricts') fetchSubdistricts(selectedDistrictId);
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

    const getCurrentColumns = () => {
        switch (activeTab) {
            case 'countries':
                return countryColumns;
            case 'provinces':
                return provinceColumns;
            case 'districts':
                return districtColumns;
            case 'subdistricts':
                return subdistrictColumns;
            default:
                return countryColumns;
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
                            <div className="mb-4">
                                <Select
                                    placeholder="เลือกอำเภอ"
                                    style={{ width: 300 }}
                                    allowClear
                                    value={selectedDistrictId}
                                    onChange={(value) => {
                                        setSelectedDistrictId(value);
                                        fetchSubdistricts(value);
                                    }}
                                >
                                    {districts.map((district) => (
                                        <Select.Option key={district.id} value={district.id}>
                                            {district.name}
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
                            </>
                        )}
                    </Form>
                </Modal>
            </div>
        </div>
    );
}

