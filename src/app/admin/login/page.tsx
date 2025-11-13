"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { LogIn, Loader2, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const loginSchema = z.object({
  username: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Verificar si ya está autenticado
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/auth");
        if (response.ok) {
          router.push("/admin");
          return;
        }
      } catch (error) {
        console.log("No autenticado - mostrar login");
      }
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, [router]);

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage("¡Login exitoso! Redirigiendo...");
        setTimeout(() => {
          router.push("/admin");
        }, 1000);
      } else {
        setSubmitMessage(result.message || "Credenciales inválidas");
      }
    } catch (error) {
      setSubmitMessage("Error de conexión. Verifica tu internet e inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mostrar loading mientras verifica autenticación
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-soft p-8">
          {/* Logo y título */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-8"
          >
            <div className="relative w-20 h-20 mx-auto mb-4">
              <Image
                src="/images/logobama.png"
                alt="Asiste Health Care Logo"
                fill
                className="object-contain drop-shadow-lg"
                sizes="80px"
                priority
              />
            </div>
            <h1 className="text-2xl font-bold text-accent-800 mb-2">
              Panel de Administración
            </h1>
            <p className="text-accent-600">
              Asiste Health Care
            </p>
          </motion.div>

          {/* Formulario de login */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Campo de usuario */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-accent-700 mb-2">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-400" size={20} />
                <input
                  {...register("username")}
                  type="text"
                  id="username"
                  placeholder="Ingresa tu usuario"
                  className="w-full pl-11 pr-4 py-3 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-gray-900"
                />
              </div>
              {errors.username && (
                <p className="text-secondary-600 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            {/* Campo de contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-accent-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-400" size={20} />
                <input
                  {...register("password")}
                  type="password"
                  id="password"
                  placeholder="Ingresa tu contraseña"
                  className="w-full pl-11 pr-4 py-3 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-gray-900"
                />
              </div>
              {errors.password && (
                <p className="text-secondary-600 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Botón de envío */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Iniciar Sesión</span>
                </>
              )}
            </motion.button>

            {/* Mensaje de estado */}
            {submitMessage && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-sm text-center ${
                  submitMessage.includes("exitoso") 
                    ? "text-green-600" 
                    : "text-secondary-600"
                }`}
              >
                {submitMessage}
              </motion.p>
            )}
          </motion.form>

          {/* Información de seguridad */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 pt-6 border-t border-accent-100"
          >
            <p className="text-xs text-accent-500 text-center">
              🔒 Acceso restringido solo para administradores autorizados
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}