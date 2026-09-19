import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AQ Distribuciones",
  description: "Sistema de gestión de AQ Distribuciones",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}