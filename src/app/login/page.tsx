'use client';

import Link from "next/link";
import LogoFirstPage from "@/component/first_page/logo";
import { MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useState } from "react";

export default function Login() {
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
                <div className="mb-8">
                    <LogoFirstPage />
                </div>

                {/* Login Form */}
                <div className="w-full max-w-md">

                    <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                        เข้าสู่ระบบผู้ให้บริการ
                    </h1>

                    <p className="text-2xl text-left text-gray-800 mb-4">
                        Sign in
                    </p>

                    <form className="space-y-4">
                        {/* Email Input */}
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="กรุณา กรอกอีเมลของคุณ"
                                className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                            <MailOutlined className="absolute left-3 top-4 text-gray-400" />
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="กรุณา ใส่รหัสผ่าน ของคุณ"
                                className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                            <LockOutlined className="absolute left-3 top-4 text-gray-400" />
                            <EyeTwoTone
                                className="absolute right-3 top-4 text-gray-400 hover:text-gray-600"
                            >
                                <EyeInvisibleOutlined />
                            </EyeTwoTone>
                        </div>

                        {/* Remember Me and Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">จำฉันไว้</span>
                            </label>
                            <Link href="#" className="text-sm text-blue-600 hover:underline">
                                ลืมรหัสผ่าน?
                            </Link>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                        >
                            เข้าสู่ระบบ →
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 text-center">
                        <span className="text-gray-400">OR</span>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="space-y-3">
                        <button className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <span className="text-xl">🔍</span>
                            <span className="text-gray-700">เข้าสู่ระบบด้วย Google</span>
                        </button>

                        <button className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <span className="text-xl text-blue-600">f</span>
                            <span className="text-gray-700">เข้าสู่ระบบด้วย Facebook</span>
                        </button>
                    </div>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center">
                        <span className="text-gray-600">ยังไม่มีบัญชีผู้ใช้งาน? </span>
                        <Link href="#" className="text-blue-600 hover:underline">
                            ลงทะเบียน
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
