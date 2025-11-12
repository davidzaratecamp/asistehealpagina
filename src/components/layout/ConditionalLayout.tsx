"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import FloatingButtons from "../ui/FloatingButtons";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Verificar si estamos en rutas de administración
  const isAdminRoute = pathname?.startsWith('/admin');

  // Si es ruta de admin, renderizar solo el contenido sin header/footer
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // Si es ruta pública, renderizar con header, footer y botones flotantes
  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20">
        {children}
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}