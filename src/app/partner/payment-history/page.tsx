'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/partner/shared/Sidebar';
import { MenuOutlined, UploadOutlined, RightOutlined } from '@ant-design/icons';
import { Input, Button, Spin, Image } from 'antd';
import { useApprovalStatus } from '@/hooks/useApprovalStatus';
import ApprovalModal from '@/components/partner/shared/ApprovalModal';
import Swal from 'sweetalert2';
import { checkAuthError } from '@/utils/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
const USE_API_MODE = process.env.NEXT_PUBLIC_USE_API_MODE === 'true';

interface BankAccount {
    id: string;
    account_holder_name: string;
    bank_name: string;
    account_number: string;
    bank_book_image_url: string;
    status: string;
    created_at: string;
    updated_at: string;
}

// Note: Currently API returns single bank account, but UI supports multiple accounts in grid layout
// Modify state to handle array if backend adds support for multiple bank accounts in future

interface Transaction {
    id: string;
    transaction_number: string;
    booking_service: string;
    start_date: string;
    end_date: string;
    rate_per_night: number;
    accommodation_fee: number;
    platform_fee: number;
    status: string;
    status_color: string;
    payment_date: string;
    transaction_date: string;
}

export default function PaymentHistory() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [accountHolderName, setAccountHolderName] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [bankBookFile, setBankBookFile] = useState<File | null>(null);
    const [bankBookPreview, setBankBookPreview] = useState<string | null>(null);

    // Approval status check
    const { isApproved, isLoading: isLoadingApproval } = useApprovalStatus();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Fetch bank account and payment history on mount
    const fetchData = useCallback(async () => {
        if (!USE_API_MODE) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        try {
            // Step 1: Fetch bank account first
            const bankAccount = await fetchBankAccount();

            // Step 2: If bank account exists, fetch payment history
            if (bankAccount) {
                await fetchPaymentHistory(bankAccount.id);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []); // Empty dependency array since fetchBankAccount and fetchPaymentHistory are defined below

    // Fetch on mount
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const fetchBankAccount = async () => {
        const token = localStorage.getItem('accessToken');

        try {
            const response = await fetch(`${API_BASE_URL}/api/partner/bank-account`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            // Check for authentication error
            if (checkAuthError(response, result)) {
                return;
            }

            if (result.success && result.data) {
                // Get the first bank account (or the only one)
                const account = Array.isArray(result.data) ? result.data[0] : result.data;

                if (account) {
                    setBankAccount(account);
                    return account;
                }
            }

            setBankAccount(null);
            return null;
        } catch (error) {
            console.error('Error fetching bank account:', error);
            setBankAccount(null);
            return null;
        }
    };

    const fetchPaymentHistory = async (bankAccountId: string) => {
        const token = localStorage.getItem('accessToken');

        try {
            const response = await fetch(`${API_BASE_URL}/api/partner/payment-history?bank_account_id=${bankAccountId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            // Check for authentication error
            if (checkAuthError(response, result)) {
                return;
            }

            if (result.success && result.data) {
                setTransactions(result.data.transactions || []);
            } else {
                setTransactions([]);
            }
        } catch (error) {
            console.error('Error fetching payment history:', error);
            setTransactions([]);
        }
    };

    const handleBankBookUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                Swal.fire({
                    icon: 'error',
                    title: 'ไฟล์ไม่ถูกต้อง',
                    text: 'กรุณาเลือกไฟล์รูปภาพ (JPG หรือ PNG)',
                    confirmButtonColor: '#28A7CB'
                });
                return;
            }

            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                Swal.fire({
                    icon: 'error',
                    title: 'ไฟล์ใหญ่เกินไป',
                    text: 'กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 5 MB',
                    confirmButtonColor: '#28A7CB'
                });
                return;
            }

            setBankBookFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setBankBookPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        // Validate form
        if (!accountHolderName.trim()) {
            await Swal.fire({
                icon: 'warning',
                title: 'กรอกข้อมูลไม่ครบ',
                text: 'กรุณากรอกชื่อบัญชีธนาคาร',
                confirmButtonColor: '#28A7CB'
            });
            return;
        }

        if (!bankName.trim()) {
            await Swal.fire({
                icon: 'warning',
                title: 'กรอกข้อมูลไม่ครบ',
                text: 'กรุณาระบุธนาคาร',
                confirmButtonColor: '#28A7CB'
            });
            return;
        }

        if (!accountNumber.trim()) {
            await Swal.fire({
                icon: 'warning',
                title: 'กรอกข้อมูลไม่ครบ',
                text: 'กรุณาระบุเลขบัญชีธนาคาร',
                confirmButtonColor: '#28A7CB'
            });
            return;
        }

        if (!bankBookFile) {
            await Swal.fire({
                icon: 'warning',
                title: 'กรอกข้อมูลไม่ครบ',
                text: 'กรุณาอัปโหลดรูปหน้าสมุดบัญชีธนาคาร',
                confirmButtonColor: '#28A7CB'
            });
            return;
        }

        if (!USE_API_MODE) {
            await Swal.fire({
                icon: 'success',
                title: 'สำเร็จ (โหมดพรีวิว)',
                text: 'สร้างบัญชีธนาคารสำเร็จ',
                confirmButtonColor: '#28A7CB'
            });
            return;
        }

        const token = localStorage.getItem('accessToken');
        setIsSaving(true);

        try {
            const formData = new FormData();
            formData.append('account_holder_name', accountHolderName);
            formData.append('bank_name', bankName);
            formData.append('account_number', accountNumber);
            formData.append('bank_book_image', bankBookFile);

            const response = await fetch(`${API_BASE_URL}/api/partner/bank-account`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();

            // Check for authentication error
            if (checkAuthError(response, result)) {
                return;
            }

            if (result.success) {
                await Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ',
                    text: result.message || 'สร้างบัญชีธนาคารสำเร็จ',
                    confirmButtonColor: '#28A7CB'
                });

                // Refresh data
                fetchData();
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'ไม่สามารถสร้างบัญชีได้',
                    text: result.message || result.error || 'เกิดข้อผิดพลาดในการสร้างบัญชี',
                    confirmButtonColor: '#28A7CB'
                });
            }
        } catch (error) {
            console.error('Error creating bank account:', error);
            await Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถสร้างบัญชีธนาคารได้',
                confirmButtonColor: '#28A7CB'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const getStatusColor = (color: string) => {
        switch (color) {
            case 'YELLOW': return '#FDB930';
            case 'GREEN': return '#52C41A';
            case 'CYAN': return '#13C2C2';
            case 'RED': return '#FF4D4F';
            default: return '#FDB930';
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen bg-gray-100">
                <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
                <div className="flex-1 flex items-center justify-center">
                    <Spin size="large" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

            {/* Main Content */}
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
                            <h1 className="text-2xl font-semibold text-gray-800">
                                {bankAccount ? 'ดูประวัติการชำระเงิน' : 'สร้างบัญชีธนาคาร'}
                            </h1>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-6" style={{ backgroundColor: '#FFFFFF' }}>
                    {!bankAccount ? (
                        /* Empty State - Bank Account Form */
                        <>
                    <div className="flex mb-3">
                        <h2 className="text-xl font-semibold text-black me-3" style={{ marginBottom: '0px' }}>สร้างบัญชีการรับชำระเงิน</h2>
                                <div className="rounded-md flex items-center justify-center py-2 px-6 mx-1 cursor-pointer" style={{ backgroundColor: '#0D263B' }}>
                            <span style={{ color: '#FFFFFF' }}>ติดต่อฝ่ายสนับสนุน</span>
                        </div>
                                <div className="rounded-md flex items-center justify-center py-2 px-6 mx-1 cursor-pointer" style={{ backgroundColor: '#0D263B' }}>
                            <span style={{ color: '#FFFFFF' }}>อ่านนโยบายการชำระเงิน</span>
                        </div>
                    </div>
                    <div className="flex mb-6">
                        <p>การสร้างบัญชีธนาคารจะไม่สามารถเปลี่ยนแปลงได้ หากมีการเปลี่ยนแปลงจะต้องแจ้งคำร้องกลับมาทางเรา</p>
                    </div>
                    <div className="flex px-10 mb-16">
                        {/* ด้านซ้าย 1 ส่วน */}
                        <div className="w-2/5">
                                    <input
                                        type="file"
                                        id="bank-book-upload"
                                        accept="image/*"
                                        onChange={handleBankBookUpload}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="bank-book-upload"
                                        className="rounded-lg p-4 w-full flex flex-col items-center justify-center h-[300px] cursor-pointer hover:opacity-80 transition-opacity"
                                        style={{ backgroundColor: '#E0E2E6' }}
                                    >
                                        {bankBookPreview ? (
                                            <Image
                                                src={bankBookPreview}
                                                alt="Bank Book Preview"
                                                width={200}
                                                height={250}
                                                style={{ maxHeight: '280px', objectFit: 'contain' }}
                                            />
                                        ) : (
                                            <>
                                <UploadOutlined className="text-6xl mb-5" style={{ color: '#484848' }} />
                                <p className="mt-2 text-center" style={{ color: '#484848' }}>
                                    อัพโหลดรูปหน้าสมุดบัญชีธนาคารของคุณ
                                </p>
                                            </>
                                        )}
                                    </label>
                        </div>

                        {/* ด้านขวา 3 ส่วน */}
                        <div className="w-3/5 px-6">
                            {/* Right Side - Form Fields */}
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-lg font-medium text-gray-800 mb-2">
                                        ชื่อ บัญชีธนาคาร
                                    </label>
                                    <Input
                                                value={accountHolderName}
                                                onChange={(e) => setAccountHolderName(e.target.value)}
                                                placeholder="นายสมชาย ใจดี"
                                        className="w-full py-3 text-lg h-[40px]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-800 mb-2">
                                        ระบุธนาคาร
                                    </label>
                                    <Input
                                                value={bankName}
                                                onChange={(e) => setBankName(e.target.value)}
                                        placeholder="ธนาคารไทยพาณิชย์"
                                        className="w-full py-3 text-lg h-[40px]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-800 mb-2">
                                        ระบุเลขบัญชี ธนาคาร
                                    </label>
                                    <Input
                                                value={accountNumber}
                                                onChange={(e) => setAccountNumber(e.target.value)}
                                        placeholder="401-1414-258"
                                        className="w-full py-3 text-lg h-[40px]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center">
                                <Button
                                    onClick={handleSubmit}
                                    loading={isSaving}
                                    disabled={isSaving}
                                    className="rounded-md flex items-center justify-center py-2 px-6 mx-1 w-[80%] h-[50px]"
                                    style={{ backgroundColor: '#0D263B', border: 'none' }}
                                >
                            <span className="text-xl" style={{ color: '#FFFFFF' }}>กรุณากดยืนยัน</span>
                                </Button>
                            </div>
                        </>
                    ) : (
                        /* Table View - Transaction History */
                        <>
                            {/* Bank Account Section - 3 Column Grid */}
                            <div className="mb-8">
                                {/* Grid Layout - 3 columns */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* Bank Account Card */}
                                    <div
                                        className="p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                                        style={{
                                            background: 'linear-gradient(135deg, #5B3CE8 0%, #7F5CE8 50%, #9F7FE8 100%)'
                                        }}
                                    >
                                        <h2 className="text-xl font-bold mb-3" style={{ color: '#FFFFFF' }}>
                                            บัญชีธนาคารที่จะรับการชำระเงิน
                                        </h2>
                                        <h3 className="text-xl font-bold mb-3" style={{ color: '#FFFFFF' }}>
                                            ชื่อบัญชี {bankAccount.account_holder_name}
                                        </h3>
                                        <p className="text-lg" style={{ color: '#FFFFFF', marginBottom: '0px' }}>
                                            {bankAccount.bank_name} {bankAccount.account_number}
                                        </p>
                                        {/* <div className="flex items-center justify-between pt-3 border-t border-white border-opacity-30">
                                        <span className="text-sm" style={{ color: '#FFFFFF' }}>
                                            {bankAccount.status === 'ACTIVE' ? 'ใช้งานอยู่' : bankAccount.status}
                                        </span>
                                        <span className="text-xs" style={{ color: '#FFFFFF', opacity: 0.8 }}>
                                            {new Date(bankAccount.created_at).toLocaleDateString('th-TH', { 
                                                day: 'numeric', 
                                                month: 'short', 
                                                year: '2-digit' 
                                            })}
                                        </span>
                                    </div> */}
                                    </div>

                                    {/* Add more bank account cards here when API supports multiple accounts */}
                                    {/* Example: If bankAccounts was an array, map through it */}
                                </div>
                            </div>

                            {/* Month Selector */}
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">รายการเงินทั้งหมดของคุณ</h3>
                                <div className="flex items-center gap-2 cursor-pointer hover:opacity-70">
                                    <span className="text-lg font-medium">June 2025</span>
                                    <RightOutlined />
                                </div>
                            </div>

                            {/* Transaction Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse" style={{ minWidth: '1200px' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#F5F5F5' }}>
                                            <th className="p-3 text-left font-semibold">รายการ</th>
                                            <th className="p-3 text-left font-semibold">รหัสห้องพัก</th>
                                            <th className="p-3 text-left font-semibold">ประเภทห้องพัก</th>
                                            <th className="p-3 text-left font-semibold">ราคาต่อคืน</th>
                                            <th className="p-3 text-left font-semibold">ราคาที่พักเลเลย</th>
                                            <th className="p-3 text-left font-semibold">ยอดรับเงินจริง</th>
                                            <th className="p-3 text-left font-semibold">วันที่การจอง</th>
                                            <th className="p-3 text-left font-semibold">สถานะ</th>
                                            <th className="p-3 text-left font-semibold">วันที่เริ่มต้า</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.length > 0 ? (
                                            transactions.map((transaction, index) => (
                                                <tr key={transaction.id} style={{ borderBottom: '1px solid #E0E0E0' }}>
                                                    <td className="p-3">{index + 1}.</td>
                                                    <td className="p-3">{transaction.transaction_number}</td>
                                                    <td className="p-3">{transaction.booking_service}</td>
                                                    <td className="p-3">{transaction.rate_per_night}.- บาท</td>
                                                    <td className="p-3">{transaction.accommodation_fee}.-บาท</td>
                                                    <td className="p-3">{transaction.platform_fee}.-บกก.</td>
                                                    <td className="p-3">{new Date(transaction.payment_date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}</td>
                                                    <td className="p-3">
                                                        <span
                                                            className="px-3 py-1 rounded text-sm font-medium"
                                                            style={{
                                                                backgroundColor: getStatusColor(transaction.status_color),
                                                                color: '#FFFFFF'
                                                            }}
                                                        >
                                                            {transaction.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-3">{new Date(transaction.transaction_date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={9} className="p-6 text-center text-gray-500">
                                                    ยังไม่มีรายการชำระเงิน
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Bottom Buttons */}
                            <div className="flex gap-4 mt-6">
                                <div className="rounded-md flex items-center justify-center py-2 px-6 cursor-pointer" style={{ backgroundColor: '#0D263B' }}>
                                    <span style={{ color: '#FFFFFF' }}>ติดต่อฝ่ายสนับสนุน</span>
                        </div>
                    </div>
                        </>
                    )}
                </main>
            </div>

            {/* Approval Status Modal */}
            <ApprovalModal isOpen={!isLoadingApproval && !isApproved} />
        </div>
    );
}
