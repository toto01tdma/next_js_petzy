'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LogoFirstPage from "@/components/first_page/logo";
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, ArrowLeftOutlined } from "@ant-design/icons";
import Swal from 'sweetalert2';
import { API_BASE_URL, USE_API_MODE } from '@/config/api';

type RegisterErrorDetail = { message: string };
type RegisterResponse =
    | { success: true }
    | { success: false; error?: string; details?: RegisterErrorDetail[] };

export default function Register() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Form data state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        tel: '',
        password: '',
        confirmPassword: ''
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validateForm = () => {
        const { firstName, lastName, email, tel, password, confirmPassword } = formData;
        
        if (!firstName.trim()) {
            return { isValid: false, message: 'กรุณากรอกชื่อ' };
        }
        
        if (!lastName.trim()) {
            return { isValid: false, message: 'กรุณากรอกนามสกุล' };
        }
        
        if (!email.trim()) {
            return { isValid: false, message: 'กรุณากรอกอีเมล' };
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { isValid: false, message: 'รูปแบบอีเมลไม่ถูกต้อง' };
        }
        
        if (!tel.trim()) {
            return { isValid: false, message: 'กรุณากรอกเบอร์โทรศัพท์' };
        }
        
        // Phone validation (basic)
        const phoneRegex = /^[0-9]{9,10}$/;
        if (!phoneRegex.test(tel.replace(/[-\s]/g, ''))) {
            return { isValid: false, message: 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง' };
        }
        
        if (!password.trim()) {
            return { isValid: false, message: 'กรุณากรอกรหัสผ่าน' };
        }
        
        if (password.length < 6) {
            return { isValid: false, message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' };
        }
        
        if (password !== confirmPassword) {
            return { isValid: false, message: 'รหัสผ่านไม่ตรงกัน' };
        }
        
        return { isValid: true, message: '' };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate form
        const validation = validateForm();
        if (!validation.isValid) {
            await Swal.fire({
                icon: 'error',
                title: 'ข้อมูลไม่ถูกต้อง',
                text: validation.message,
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#28A7CB'
            });
            return;
        }

        setIsLoading(true);

        try {
            // Preview mode: Skip API call and simulate success
            if (!USE_API_MODE) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
                
                await Swal.fire({
                    icon: 'success',
                    title: 'ลงทะเบียนสำเร็จ (Preview Mode)',
                    text: 'กรุณาเข้าสู่ระบบด้วยบัญชีที่สร้างใหม่',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true
                });

                router.push('/login');
                return;
            }

            // API mode: Make actual API call
            const response = await fetch(`${API_BASE_URL}/api/partner/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    tel: formData.tel,
                    password: formData.password
                }),
            });

            const data: RegisterResponse = await response.json();

            if (data.success) {
                // Show success message
                await Swal.fire({
                    icon: 'success',
                    title: 'ลงทะเบียนสำเร็จ',
                    text: 'กรุณาเข้าสู่ระบบด้วยบัญชีที่สร้างใหม่',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true
                });

                // Redirect to login page
                router.push('/login');
            } else {
                // Handle validation errors
                if (data.details && data.details.length > 0) {
                    const errorMessages = data.details.map((detail: RegisterErrorDetail) => detail.message).join('\n');
                    await Swal.fire({
                        icon: 'error',
                        title: 'ข้อมูลไม่ถูกต้อง',
                        text: errorMessages,
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#28A7CB'
                    });
                } else {
                    await Swal.fire({
                        icon: 'error',
                        title: 'ลงทะเบียนไม่สำเร็จ',
                        text: data.error || 'เกิดข้อผิดพลาดในการลงทะเบียน',
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#28A7CB'
                    });
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
            await Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#28A7CB'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };
    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
            style={{
                backgroundImage: "url('/assets/images/background/bg1.png')"
            }}
        >
            {/* Content Container */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center max-w-4xl">
                {/* Back Button */}
                <div className="w-full flex justify-start mb-4">
                    <Link href="/login" className="flex items-center" style={{ color: '#4B5563' }}>
                        <ArrowLeftOutlined className="text-xl" />
                    </Link>
                </div>

                {/* Logo */}
                <div className="mb-8">
                    <LogoFirstPage subtext='Find Your Perfect Stay, Anytime, Anywhere' />
                </div>

                <div className="w-full flex gap-8">
                    {/* Left Side - Registration Form */}
                    <div className="flex-1 max-w-md">
                        <h1 className="text-5xl font-bold mb-2 text-center" style={{ color: '#1F2937' }}>
                            สมาชิกผู้ให้บริการ
                        </h1>

                        <p className="text-2xl font-bold text-center mb-8" style={{ color: '#1F2937' }}>
                            Create Account
                        </p>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {/* First Name Input */}
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    placeholder="ชื่อจริง"
                                    className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    required
                                />
                                <UserOutlined className="absolute left-3 top-4" style={{ color: '#9CA3AF'}} />
                            </div>

                            {/* Last Name Input */}
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    placeholder="นามสกุล"
                                    className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    required
                                />
                                <UserOutlined className="absolute left-3 top-4" style={{ color: '#9CA3AF'}} />
                            </div>

                            {/* Email Input */}
                            <div className="relative">
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="กรุณากรอกอีเมล"
                                    className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    required
                                />
                                <MailOutlined className="absolute left-3 top-4" style={{ color: '#9CA3AF'}} />
                            </div>

                            {/* Phone Input */}
                            <div className="relative">
                                <input
                                    type="tel"
                                    value={formData.tel}
                                    onChange={(e) => handleInputChange('tel', e.target.value)}
                                    placeholder="กรุณาใส่ เบอร์โทรศัพท์"
                                    className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    required
                                />
                                <PhoneOutlined className="absolute left-3 top-4" style={{ color: '#9CA3AF'}} />
                            </div>

                            {/* Password Input */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    placeholder="สร้างรหัสผ่าน"
                                    className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    required
                                />
                                <LockOutlined className="absolute left-3 top-4" style={{ color: '#9CA3AF'}} />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-4"
                                    style={{ color: '#9CA3AF'}}
                                >
                                    {showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                                </button>
                            </div>

                            {/* Confirm Password Input */}
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    placeholder="ยืนยันรหัสผ่าน"
                                    className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    required
                                />
                                <LockOutlined className="absolute left-3 top-4" style={{ color: '#9CA3AF' }} />
                                <button
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="absolute right-3 top-4"
                                    style={{ color: '#9CA3AF' }}
                                >
                                    {showConfirmPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                                </button>
                            </div>

                            {/* Register Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-5 rounded-2xl transition-colors font-medium flex items-center px-3 mt-6 ${
                                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                style={{ backgroundColor: '#28A7CB', color: '#FFFFFF' }}
                            >
                                <span className="flex-grow text-center font-bold" style={{ color: '#FFFFFF' }}>
                                    {isLoading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียน'}
                                </span>
                            </button>
                        </form>

                        {/* Terms Text */}
                        <div className="mt-4 text-center">
                            <p className="text-sm" style={{ marginBottom: 0.5, color: '#4B5563' }}>
                                เมื่อคุณลงทะเบียนแล้วจึงว่าคุณยอมรับ
                            </p>
                            <Link href="#" className="text-sm">
                                <span className="text-[#28A7CB]">ข้อกำหนด</span>และ<span className="text-[#28A7CB]">เงื่อนไขการใช้งาน</span>ของเรา
                            </Link>
                        </div>
                    </div>

                    {/* Right Side - Social Login */}
                    <div className="flex-1 max-w-md flex flex-col justify-center">
                        <div className="border-l border-gray-300 pl-8">
                            {/* Social Login Buttons */}
                            <div>
                                <div className="mb-3">
                                    <button className="w-full flex items-center justify-center gap-3 py-3 rounded-lg hover:bg-gray-50 transition-colors shadow">
                                        <Image src="/assets/images/svg/google.png" alt="Google" width={20} height={20} />
                                        <span style={{ color: '#374151' }}>เข้าสู่ระบบด้วย Google</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                {/* <div className="fixed bottom-4 left-4 z-20">
                    <div className="w-32 h-32">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            <path d="M50 150 Q50 100 100 100 Q150 100 150 150 Q150 180 100 180 Q50 180 50 150 Z" fill="#FF8C42" stroke="#FF6B1A" strokeWidth="2"/>
                            <circle cx="80" cy="130" r="3" fill="#000"/>
                            <circle cx="120" cy="130" r="3" fill="#000"/>
                            <path d="M90 140 Q100 150 110 140" stroke="#000" strokeWidth="2" fill="none"/>
                        </svg>
                    </div>
                </div> */}

                {/* <div className="fixed bottom-4 right-4 z-20">
                    <div className="w-32 h-32">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            <path d="M50 150 Q50 100 100 100 Q150 100 150 150 Q150 180 100 180 Q50 180 50 150 Z" fill="#4A90E2" stroke="#357ABD" strokeWidth="2"/>
                            <circle cx="80" cy="130" r="3" fill="#000"/>
                            <circle cx="120" cy="130" r="3" fill="#000"/>
                            <path d="M90 140 Q100 150 110 140" stroke="#000" strokeWidth="2" fill="none"/>
                        </svg>
                    </div>
                </div> */}
            </div>
        </div>
    );
}
