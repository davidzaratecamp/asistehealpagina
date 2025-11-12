"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  phone: z.string().min(10, "El teléfono debe tener al menos 10 dígitos"),
  email: z.string().email("Correo electrónico inválido"),
  postalCode: z.string().regex(/^\d{5}$/, "Código postal debe tener 5 dígitos"),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  className?: string;
}

const ContactForm = ({ className = "" }: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitMessage("¡Gracias! Un asesor te contactará pronto.");
        reset();
      } else {
        setSubmitMessage("Error al enviar el mensaje. Inténtalo de nuevo.");
      }
    } catch (error) {
      setSubmitMessage("Error de conexión. Verifica tu internet e inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-white rounded-2xl shadow-soft p-6 ${className}`}
    >
      <h3 className="font-semibold text-xl text-accent-800 mb-6">
        Solicita información gratuita
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register("name")}
            type="text"
            placeholder="Nombre completo *"
            className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-gray-900"
          />
          {errors.name && (
            <p className="text-secondary-600 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("phone")}
            type="tel"
            placeholder="Teléfono *"
            className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-gray-900"
          />
          {errors.phone && (
            <p className="text-secondary-600 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("email")}
            type="email"
            placeholder="Correo electrónico *"
            className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-gray-900"
          />
          {errors.email && (
            <p className="text-secondary-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("postalCode")}
            type="text"
            placeholder="Código postal *"
            className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-gray-900"
          />
          {errors.postalCode && (
            <p className="text-secondary-600 text-sm mt-1">{errors.postalCode.message}</p>
          )}
        </div>

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
              <Send size={18} />
              <span>Enviar información</span>
            </>
          )}
        </motion.button>

        {submitMessage && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-sm text-center ${
              submitMessage.includes("Gracias") 
                ? "text-green-600" 
                : "text-secondary-600"
            }`}
          >
            {submitMessage}
          </motion.p>
        )}
      </form>

      <p className="text-xs text-accent-500 mt-4 text-center">
        * Campos obligatorios. Tu información está protegida y no será compartida.
      </p>
    </motion.div>
  );
};

export default ContactForm;