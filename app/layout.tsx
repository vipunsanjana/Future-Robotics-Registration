// @ts-ignore
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {

  metadataBase: new URL("https://www.futureroboticsacademy.com"),
  
  title: {
    template: "%s | Future Robotics Academy", 
    default: "Future Robotics Academy", 
  },
  description: "Future Robotics Academy Registration System. Learn robotics and build the future in Sri Lanka.",
  keywords: ["Robotics", "Academy", "Sri Lanka", "Registration"],

  icons: {
    icon: "/Logo.jpeg", 
    apple: "/Logo.jpeg", 
  },
  
  openGraph: {
    title: "Future Robotics Academy",
    description: "Future Robotics Academy Registration System.",
    url: "https://www.futureroboticsacademy.com",
    siteName: "Future Robotics Academy",
    images: [
      {
        url: "/Logo.jpeg", 
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}