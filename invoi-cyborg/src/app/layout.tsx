import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/lib/Providers/Providers";

export const metadata: Metadata = {
  title: "invoi-cyborg",
  description: "invoi-cyborg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <body>{children}</body>
      </html>
    </Providers>
  );
}
