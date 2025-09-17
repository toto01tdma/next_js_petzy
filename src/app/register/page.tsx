'use client';

import Link from "next/link";
import { useState } from "react";
import LogoFirstPage from "@/component/first_page/logo";
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, ArrowLeftOutlined } from "@ant-design/icons";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
                    <Link href="/login" className="flex items-center text-gray-600 hover:text-gray-800">
                        <ArrowLeftOutlined className="text-xl" />
                    </Link>
                </div>

                {/* Logo */}
                <div className="mb-8">
                    <LogoFirstPage />
                </div>

                <div className="w-full flex gap-8">
                    {/* Left Side - Registration Form */}
                    <div className="flex-1 max-w-md">
                        <h1 className="text-5xl font-bold text-gray-800 mb-2 text-center">
                            สมาชิกผู้ให้บริการ
                        </h1>

                        <p className="text-2xl font-bold text-center text-gray-800 mb-8">
                            Create Account
                        </p>

                        <form className="space-y-4">
                            {/* Name Input */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="ชื่อจริง นามสกุล"
                                    className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                                <UserOutlined className="absolute left-3 top-4 text-gray-400" />
                            </div>

                            {/* Email Input */}
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="กรุณากรอกอีเมล"
                                    className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                                <MailOutlined className="absolute left-3 top-4 text-gray-400" />
                            </div>

                            {/* Phone Input */}
                            <div className="relative">
                                <input
                                    type="tel"
                                    placeholder="กรุณาใส่ เบอร์โทรศัพท์"
                                    className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                                <PhoneOutlined className="absolute left-3 top-4 text-gray-400" />
                            </div>

                            {/* Password Input */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="สร้างรหัสผ่าน"
                                    className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                                <LockOutlined className="absolute left-3 top-4 text-gray-400" />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-4 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                                </button>
                            </div>

                            {/* Confirm Password Input */}
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="ยืนยันรหัสผ่าน"
                                    className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                                <LockOutlined className="absolute left-3 top-4 text-gray-400" />
                                <button
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="absolute right-3 top-4 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                                </button>
                            </div>

                            {/* Register Button */}
                            <button
                                type="submit"
                                className="w-full text-white py-5 rounded-2xl transition-colors font-medium flex items-center px-3 mt-6"
                                style={{ backgroundColor: '#28A7CB' }}
                            >
                                <span className="flex-grow text-center text-white font-bold">ลงทะเบียน</span>
                            </button>
                        </form>

                        {/* Terms Text */}
                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-600" style={{ marginBottom: 0.5 }}>
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
                            <div className="mb-6 text-center">
                                <span className="text-gray-400">OR</span>
                            </div>

                            {/* Social Login Buttons */}
                            <div>
                                <div className="mb-3">
                                    <button className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl hover:bg-gray-50 transition-colors shadow">
                                        <span className="text-xl">🔍</span>
                                        <span className="text-gray-700">เข้าสู่ระบบด้วย Google</span>
                                    </button>
                                </div>
                                <div>
                                    <button className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl hover:bg-gray-50 transition-colors shadow">
                                        <span className="text-xl text-blue-600">f</span>
                                        <span className="text-gray-700">เข้าสู่ระบบด้วย Facebook</span>
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
