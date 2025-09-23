import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import "antd/dist/reset.css";
import WarningSupressor from "./components/WarningSupressor";

const kanit = Kanit({
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  subsets: ["latin", "thai"],
  variable: "--font-kanit",
});

export const metadata: Metadata = {
  title: "PetZy - Pet-Friendly Hotel",
  description: "Find Your Perfect Stay, Anytime, Anywhere - Pet-Friendly Hotel Booking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="/suppress-warnings.js" async />
      </head>
      <body
        className={`${kanit.variable} font-kanit antialiased`}
      >
        <WarningSupressor />
        {children}
      </body>
    </html>
  );
}
