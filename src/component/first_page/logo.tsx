import Image from "next/image";

type LogoFirstPageProps = {
  subtext?: string;
};

const LogoFirstPage = ({ subtext }: LogoFirstPageProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-0">
        <Image
          src="/assets/images/logo/logo.png"
          alt="PetZy Logo"
          width={200}
          height={80}
          priority
        />
      </div>
      {subtext && ( // render ต่อเมื่อส่งค่าเข้ามา
        <div className="mb-3">
          <p className="text-sm text-gray-500 text-center">{subtext}</p>
        </div>
      )}
    </div>
  );
};

export default LogoFirstPage;