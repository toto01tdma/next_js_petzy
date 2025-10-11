'use client';

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LogoFirstPage from "@/components/first_page/logo";
import { MailOutlined, PhoneOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, ArrowRightOutlined } from "@ant-design/icons";
import { Switch } from "antd";
import Swal from 'sweetalert2';
import { API_BASE_URL, USE_API_MODE } from '@/config/api';

export default function Login() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [inputType, setInputType] = useState<'email' | 'phone'>('email');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic validation
        if (!inputValue.trim()) {
            await Swal.fire({
                icon: 'error',
                title: 'ข้อมูลไม่ครบถ้วน',
                text: 'กรุณากรอกอีเมลหรือเบอร์โทรศัพท์',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#28A7CB'
            });
            return;
        }

        if (!password.trim()) {
            await Swal.fire({
                icon: 'error',
                title: 'ข้อมูลไม่ครบถ้วน',
                text: 'กรุณากรอกรหัสผ่าน',
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
                
                // Check for admin bypass account
                if (inputValue === 'admin_to@gmail.com' && password === '1234567890') {
                    // Admin login
                    localStorage.setItem('accessToken', 'admin-preview-token-' + Date.now());
                    localStorage.setItem('refreshToken', 'admin-preview-refresh-token-' + Date.now());
                    localStorage.setItem('user', JSON.stringify({
                        profile: {
                            fullName: 'PETZY ADMIN',
                            firstName: 'PETZY',
                            lastName: 'ADMIN',
                            email: inputValue,
                            role: 'Administrator'
                        }
                    }));
                    
                    if (rememberMe) {
                        localStorage.setItem('rememberMe', 'true');
                        localStorage.setItem('savedEmail', inputValue);
                    }

                    await Swal.fire({
                        icon: 'success',
                        title: 'เข้าสู่ระบบสำเร็จ (Admin Preview Mode)',
                        text: `ยินดีต้อนรับ PETZY ADMIN`,
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true
                    });

                    router.push('/admin/dashboard');
                    return;
                }
                
                // Regular partner login
                localStorage.setItem('accessToken', 'preview-token-' + Date.now());
                localStorage.setItem('refreshToken', 'preview-refresh-token-' + Date.now());
                localStorage.setItem('user', JSON.stringify({
                    profile: {
                        fullName: 'Preview User',
                        firstName: 'Preview',
                        lastName: 'User',
                        email: inputValue
                    }
                }));
                
                // Store preview approval status and accommodation name
                localStorage.setItem('approvalStatus', 'DRAFT');
                localStorage.setItem('accommodationName', 'โรงแรมพรีวิว');
                
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                    localStorage.setItem('savedEmail', inputValue);
                }

                await Swal.fire({
                    icon: 'success',
                    title: 'เข้าสู่ระบบสำเร็จ (Preview Mode)',
                    text: `ยินดีต้อนรับ Preview User`,
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true
                });

                router.push('/partner/data-entry');
                return;
            }

            // API mode: Make actual API call
            // Generate device info
            const deviceInfo = {
                deviceId: `web-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                deviceType: "web",
                deviceName: navigator.userAgent.includes('Mobile') ? 'Mobile Browser' : 'Desktop Browser',
                appVersion: "1.0.0"
            };

            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: inputValue,
                    password: password,
                    deviceInfo: deviceInfo
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Store tokens and user data
                localStorage.setItem('accessToken', data.data.tokens.accessToken);
                localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
                localStorage.setItem('user', JSON.stringify(data.data.user));
                
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                    localStorage.setItem('savedEmail', inputValue);
                }

                // Redirect based on user role
                if (data.data.user.role === 'ADMIN') {
                    await Swal.fire({
                        icon: 'success',
                        title: 'เข้าสู่ระบบสำเร็จ',
                        text: `ยินดีต้อนรับ ${data.data.user.profile.fullName}`,
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true
                    });
                    router.push('/admin/dashboard');
                } else {
                    // Partner/Owner - Fetch approval status and store in localStorage
                    try {
                        const statusResponse = await fetch(`${API_BASE_URL}/api/partner/approval-status`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${data.data.tokens.accessToken}`
                            }
                        });

                        const statusData = await statusResponse.json();

                        if (statusData.success && statusData.data) {
                            // Store approval status and accommodation name
                            localStorage.setItem('approvalStatus', statusData.data.status || 'DRAFT');
                            localStorage.setItem('accommodationName', statusData.data.accommodation_name || 'โรงแรมของคุณ');
                        } else {
                            // Fallback values if API fails
                            localStorage.setItem('approvalStatus', 'DRAFT');
                            localStorage.setItem('accommodationName', 'โรงแรมของคุณ');
                        }
                    } catch (error) {
                        console.error('Failed to fetch approval status:', error);
                        // Set fallback values on error
                        localStorage.setItem('approvalStatus', 'DRAFT');
                        localStorage.setItem('accommodationName', 'โรงแรมของคุณ');
                    }

                    // Show success message
                    await Swal.fire({
                        icon: 'success',
                        title: 'เข้าสู่ระบบสำเร็จ',
                        text: `ยินดีต้อนรับ ${data.data.user.profile.fullName}`,
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true
                    });

                    // Check approval status for redirect
                    const approvalStatus = localStorage.getItem('approvalStatus');
                    
                    if (approvalStatus === 'APPROVED') {
                        router.push('/partner/dashboard');
                    } else {
                        router.push('/partner/data-entry');
                    }
                }
            } else {
                // Handle error
                await Swal.fire({
                    icon: 'error',
                    title: 'เข้าสู่ระบบไม่สำเร็จ',
                    text: data.error || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#28A7CB'
                });
            }
        } catch (error) {
            console.error('Login error:', error);
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

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
            style={{
                backgroundImage: "url('/assets/images/background/bg1.png')"
            }}
        >
            {/* Content Container */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center">
                {/* Logo */}
                <div className="mb-3">
                    <LogoFirstPage subtext='Find Your Perfect Stay, Anytime, Anywhere' />
                </div>

                {/* Login Form */}
                <div className="w-full max-w-md">

                    <h1 className="text-4xl mb-8 text-center" style={{ fontWeight: 'bold', color: '#1F2937' }}>
                        เข้าสู่ระบบผู้ให้บริการ
                    </h1>

                    <p className="text-2xl text-left mb-4" style={{ color: '#1F2937' }}>
                        Sign in
                    </p>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Email/Phone Input */}
                        <div className="relative">
                            <input
                                type={inputType === 'email' ? 'email' : 'tel'}
                                value={inputValue}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setInputValue(value);
                                    // Auto-detect input type based on content
                                    if (value.includes('@')) {
                                        setInputType('email');
                                    } else if (/^[0-9+\-\s()]*$/.test(value)) {
                                        setInputType('phone');
                                    }
                                }}
                                placeholder={inputType === 'email' ? 'กรุณา กรอกอีเมลของคุณ' : 'กรุณา กรอกเบอร์โทรศัพท์ของคุณ'}
                                className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                            {inputType === 'email' ? (
                                <MailOutlined className="absolute left-3 top-4" style={{ color: '#9CA3AF' }} />
                            ) : (
                                <PhoneOutlined className="absolute left-3 top-4" style={{ color: '#9CA3AF' }} />
                            )}
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="กรุณา ใส่รหัสผ่าน ของคุณ"
                                className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                required
                            />
                            <LockOutlined className="absolute left-3 top-4" style={{ color: '#9CA3AF' }} />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-4"
                                style={{ color: '#9CA3AF' }}
                            >
                                {showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                            </button>
                        </div>

                        {/* Remember Me and Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Switch 
                                    size="small" 
                                    checked={rememberMe}
                                    onChange={setRememberMe}
                                />
                                <span className="text-sm" style={{ color: '#4B5563' }}>จำบัญชีฉัน</span>
                            </div>
                            <Link href="#" className="text-sm text-blue-600 hover:underline">
                                ลืมรหัสผ่าน?
                            </Link>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 rounded-2xl transition-colors font-medium flex items-center px-3 ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            style={{ backgroundColor: '#28A7CB', color: '#FFFFFF' }}
                        >
                            <span className="flex-grow text-center" style={{color: '#FFFFFF'}}>
                                {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                            </span>
                            {!isLoading && (
                                <div className="px-2 py-1.5 rounded-full" style={{ backgroundColor: '#3D56F0' }}>
                                    <ArrowRightOutlined style={{ color: '#ffffff', fontWeight: 'bold' }} />
                                </div>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 text-center">
                        <span style={{ color: '#9CA3AF' }}>OR</span>
                    </div>

                    {/* Social Login Buttons */}
                    <div>
                        <div className="mb-3">
                            <button className="w-full flex items-center justify-center gap-3 py-3 border rounded-lg transition-colors" style={{ borderColor: '#D1D5DB' }}>
                                <Image src="/assets/images/svg/google.png" alt="Google" width={20} height={20} />
                                <span style={{ color: '#374151' }}>เข้าสู่ระบบด้วย Google</span>
                            </button>
                        </div>
                    </div>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center">
                        <span style={{ color: '#4B5563' }}>ยังไม่มีบัญชีผู้ใช้งาน? </span>
                        <Link href="/partner/register" className="text-blue-600 hover:underline">
                            ลงทะเบียน
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
