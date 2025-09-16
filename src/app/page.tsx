'use client';

import Image from "next/image";
import Link from "next/link";
import LogoFirstPage from "@/component/first_page/logo";

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

        <div className="mb-8">
          <LogoFirstPage />
        </div>

        {/* Main Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-12 text-center">
          Pet-Friendly Hotel
        </h1>

        {/* Three Images Grid */}
        <div className="flex gap-6 mb-12 flex-wrap justify-center">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/assets/images/pet1.svg"
              alt="Pet in Hotel Room"
              width={200}
              height={150}
              className="object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/assets/images/pet2.svg"
              alt="Pet in Lobby"
              width={200}
              height={150}
              className="object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/assets/images/pet3.svg"
              alt="Pet Grooming"
              width={200}
              height={150}
              className="object-cover"
            />
          </div>
        </div>

        {/* Welcome Button */}
        <Link
          href="/login"
          className="bg-[#28A7CB] text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-600 transition-colors shadow-lg w-full text-center"
        >
          ยินดีต้อนรับสู่บริการของเรา
        </Link>

      </div>
    </div>
  );
}
