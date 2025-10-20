import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import "antd/dist/reset.css";
import WarningSupressor from "./WarningSupressor";

const kanit = Kanit({
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  subsets: ["latin", "thai"],
  variable: "--font-kanit",
});

export const metadata: Metadata = {
  title: "PetZy Admin - Administration Panel",
  description: "PetZy Admin Panel - Manage Hotels, Customers, and Platform Operations",
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
        style={{ backgroundColor: '#ffffff', color: '#000000' }}
      >
        <WarningSupressor />
        {children}
      </body>
    </html>
  );
}

