'use client';

import Image from "next/image";
import Link from "next/link";
import LogoFirstPage from "@/components/first_page/logo";

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('/assets/images/background/bg1.png')"
      }}
    >
      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center">

        <div className="mb-0">
          <LogoFirstPage subtext='Find Your Perfect Stay, Anytime, Anywhere'/>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl text-gray-800 mb-5 text-center" style={{ fontWeight: 'bold' }}>
          Pet-Friendly Hotel
        </h1>

        {/* Three Images Grid */}
        <div className="flex gap-6 mb-12 flex-wrap justify-center">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/assets/images/first_page/1.png"
              alt="Pet in Hotel Room"
              width={150}
              height={100}
              className="object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/assets/images/first_page/2.png"
              alt="Pet in Lobby"
              width={150}
              height={100}
              className="object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/assets/images/first_page/3.png"
              alt="Pet Grooming"
              width={150}
              height={100}
              className="object-cover"
            />
          </div>
        </div>

        {/* Welcome Button */}
        <Link
          href="/login"
          className="text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-600 transition-colors shadow-lg w-full text-center" style={{backgroundColor: '#28A7CB'}}
        >
          <span style={{color: "#FFFFFF"}}>  ยินดีต้อนรับสู่บริการของเรา</span>
        </Link>

      </div>
    </div>
  );
}
