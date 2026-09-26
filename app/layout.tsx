import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Multitrato",
  description: "Productos, servicios y alquileres en Ecuador.",
  icons: {
    icon: "/multitrato-isotipo.jpg",
    shortcut: "/multitrato-isotipo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
