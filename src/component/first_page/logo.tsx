import Image from "next/image";

const LogoFirstPage = () => {
    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <div className="mb-8">
                    <Image
                        src="/assets/images/logo/logo.png"
                        alt="PetZy Logo"
                        width={200}
                        height={80}
                        priority
                    />
                </div>
                <div className="mb-8">
                    <p className="text-sm text-gray-500 text-center">Find Your Perfect Stay, Anytime, Anywhere</p>
                </div>
            </div>
        </>
    );
};

export default LogoFirstPage;