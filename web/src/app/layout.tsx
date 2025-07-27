import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import AuthenticateMiddleware from "@/components/authenticate.middleware";


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
