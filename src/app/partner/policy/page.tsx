'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import LogoFirstPage from '@/components/first_page/logo';

export default function PolicyPage() {
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

    return (
        <div 
            className="min-h-screen bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: "url('/assets/images/background/bg1.png')",
            }}
        >
            {/* Background Overlay */}
            <div className="min-h-screen" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <button 
                            onClick={() => router.back()}
                            className="flex items-center text-gray-600 hover:text-gray-800"
                        >
                            <ArrowLeftOutlined className="mr-2" />
                            <span>กลับ</span>
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-4xl mx-auto rounded-lg overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
                        {/* Logo Section */}
                        <div className="pb-8 pt-3 text-center">
                            <LogoFirstPage subtext='Find Your Perfect Stay, Anytime, Anywhere' />
                            <h1 className="text-4xl font-bold text-gray-800 mt-4">Pet-Friendly Hotel</h1>
                        </div>

                        {/* Policy Content */}
                        <div className="p-8">
                            <div className="text-center mb-8">
                                <h1 className="text-4xl font-bold text-gray-800 mb-4">policy</h1>
                            </div>

                            <div className="prose max-w-none">
                                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">ข้อตกลงและเงื่อนไขการใช้บริการ</h2>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        ยินดีต้อนรับสู่ PetZy Pet-Friendly Hotel แพลตฟอร์มการจองที่พักสำหรับสัตว์เลี้ยง 
                                        กรุณาอ่านข้อตกลงและเงื่อนไขการใช้บริการอย่างละเอียดก่อนใช้บริการของเรา
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <section>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-3">1. การยอมรับข้อตกลง</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            การใช้บริการของ PetZy ถือว่าท่านได้อ่าน เข้าใจ และยอมรับข้อตกลงและเงื่อนไขทั้งหมดแล้ว 
                                            หากท่านไม่ยอมรับข้อตกลงใดข้อหนึ่ง กรุณาหยุดการใช้บริการทันที
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-3">2. การใช้บริการ</h3>
                                        <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
                                            <li>ท่านต้องมีอายุไม่ต่ำกว่า 18 ปี หรือได้รับความยินยอมจากผู้ปกครอง</li>
                                            <li>ข้อมูลที่ให้ไว้ต้องเป็นความจริงและถูกต้องครบถ้วน</li>
                                            <li>ท่านรับผิดชอบในการรักษาความปลอดภัยของบัญชีผู้ใช้</li>
                                            <li>ห้ามใช้บริการเพื่อกิจกรรมที่ผิดกฎหมายหรือไม่เหมาะสม</li>
                                        </ul>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-3">3. นโยบายสัตว์เลี้ยง</h3>
                                        <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
                                            <li>สัตว์เลี้ยงต้องมีใบรับรองสุขภาพและการฉีดวัคซีนครบถ้วน</li>
                                            <li>เจ้าของสัตว์เลี้ยงต้องรับผิดชอบความเสียหายที่เกิดขึ้น</li>
                                            <li>สัตว์เลี้ยงต้องอยู่ในความดูแลของเจ้าของตลอดเวลา</li>
                                            <li>ห้ามทิ้งสัตว์เลี้ยงไว้ในห้องพักโดยลำพัง</li>
                                        </ul>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-3">4. การจองและการชำระเงิน</h3>
                                        <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
                                            <li>การจองจะสมบูรณ์เมื่อได้รับการยืนยันและชำระเงินแล้ว</li>
                                            <li>ราคาที่แสดงรวมภาษีและค่าบริการแล้ว</li>
                                            <li>การยกเลิกการจองต้องแจ้งล่วงหน้าตามเงื่อนไขของแต่ละที่พัก</li>
                                            <li>การคืนเงินจะดำเนินการตามนโยบายการยกเลิก</li>
                                        </ul>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-3">5. ความรับผิดชอบ</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            PetZy ทำหน้าที่เป็นตัวกลางในการเชื่อมต่อระหว่างผู้ใช้บริการและผู้ให้บริการที่พัก 
                                            เราไม่รับผิดชอบต่อคุณภาพการบริการ ความเสียหาย หรือข้อพิพาทที่เกิดขึ้นระหว่างคู่สัญญา
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-3">6. ความเป็นส่วนตัว</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            เราเคารพความเป็นส่วนตัวของท่านและจะปกป้องข้อมูลส่วนบุคคลตามนโยบายความเป็นส่วนตัวของเรา 
                                            ข้อมูลของท่านจะถูกใช้เพื่อการให้บริการและปรับปรุงประสบการณ์การใช้งานเท่านั้น
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-3">7. การแก้ไขข้อตกลง</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            PetZy ขอสงวนสิทธิ์ในการแก้ไขข้อตกลงและเงื่อนไขได้ตลอดเวลา 
                                            การแก้ไขจะมีผลทันทีเมื่อประกาศบนเว็บไซต์ การใช้บริการต่อไปถือว่ายอมรับการแก้ไข
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-3">8. การติดต่อ</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            หากมีข้อสงสัยหรือต้องการความช่วยเหลือ กรุณาติดต่อเราผ่านช่องทางที่กำหนดไว้ในเว็บไซต์ 
                                            ทีมงานของเราพร้อมให้บริการและแก้ไขปัญหาอย่างรวดเร็ว
                                        </p>
                                    </section>
                                </div>

                                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-800 text-center">
                                        ข้อตกลงและเงื่อนไขนี้มีผลบังคับใช้ตั้งแต่วันที่ 1 มกราคม 2024 เป็นต้นไป
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="bg-gray-50 px-8 py-6">
                            <div className="flex justify-center space-x-5 gap-5">
                                <Button 
                                    size="large"
                                    onClick={() => router.back()}
                                    className="px-8"
                                >
                                    กลับ
                                </Button>
                                <Button 
                                    type="primary"
                                    size="large"
                                    onClick={() => router.push('/partner/data-entry-2')}
                                    className="bg-blue-500 hover:bg-blue-600 border-blue-500 px-8"
                                >
                                    ยอมรับ
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
