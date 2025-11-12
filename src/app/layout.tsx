import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/ui/FloatingButtons";
import ConditionalLayout from "@/components/layout/ConditionalLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3005'),
  title: "Asiste Health Care - Seguros Médicos Obamacare",
  description: "Te ayudamos a encontrar el seguro médico perfecto bajo Obamacare. Asesoría gratuita y acompañamiento personalizado en todo el proceso.",
  keywords: "seguro médico, obamacare, aca, aseguradoras, salud, Estados Unidos",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Asiste Health Care - Seguros Médicos Obamacare",
    description: "Te ayudamos a proteger tu salud y tu futuro con el seguro médico ideal.",
    type: "website",
    images: [
      {
        url: "/images/logobama.png",
        width: 800,
        height: 600,
        alt: "Asiste Health Care Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
