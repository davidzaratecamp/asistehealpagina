"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  FileText, 
  Mail,
  LogOut,
  Menu,
  X
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // No verificar autenticación en la página de login
    if (pathname === '/admin/login') {
      setIsLoading(false);
      return;
    }
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/auth");
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setAdminInfo(data.admin);
      } else {
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      router.push("/admin/login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Blog",
      href: "/admin/blog",
      icon: FileText,
    },
    {
      name: "Formularios",
      href: "/admin/forms",
      icon: Mail,
    },
  ];

  // Para la página de login, solo renderizar children sin autenticación
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // El useEffect se encarga del redirect
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar móvil */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg">
            <AdminSidebar
              navigation={navigation}
              adminInfo={adminInfo}
              onLogout={handleLogout}
              onCloseSidebar={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Sidebar desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <AdminSidebar
          navigation={navigation}
          adminInfo={adminInfo}
          onLogout={handleLogout}
        />
      </div>

      {/* Contenido principal */}
      <div className="lg:pl-64">
        {/* Header móvil */}
        <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
          <div className="w-6" /> {/* Spacer */}
        </div>

        {/* Contenido */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// Componente del sidebar
function AdminSidebar({ 
  navigation, 
  adminInfo, 
  onLogout, 
  onCloseSidebar 
}: { 
  navigation: any[];
  adminInfo: any;
  onLogout: () => void;
  onCloseSidebar?: () => void;
}) {
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 border-r border-gray-200">
      <div className="flex h-16 shrink-0 items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
        {onCloseSidebar && (
          <button
            onClick={onCloseSidebar}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                    onClick={onCloseSidebar}
                  >
                    <item.icon className="h-6 w-6 shrink-0" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          
          {/* Información del admin */}
          <li className="mt-auto">
            <div className="flex items-center gap-x-3 rounded-md bg-gray-50 p-3 text-sm leading-6">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-medium">
                {adminInfo?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {adminInfo?.name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {adminInfo?.email || ''}
                </p>
              </div>
            </div>
            
            <button
              onClick={onLogout}
              className="mt-2 w-full text-left text-gray-700 hover:text-red-600 hover:bg-red-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}