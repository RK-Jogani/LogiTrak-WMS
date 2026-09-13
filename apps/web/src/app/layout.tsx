import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "LogiTrack WMS",
  description: "Enterprise Warehouse Management System — Real-time inventory, order management, and warehouse operations.",
  keywords: ["WMS", "warehouse management", "inventory", "logistics", "3PL"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#f5f5f5] text-on-surface antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
