import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import AuthenticateMiddleware from "@/components/authenticate.middleware";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TipLogs",
  description: "Create the best logs for attendance",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body  className={` antialiased dark`} >
        <link rel="shortcut icon" href="logo.png" type="image/x-icon" />
        <Providers>
          <AuthenticateMiddleware>
        {children}
          </AuthenticateMiddleware>
        </Providers>
      </body>
    </html>
  );
}
