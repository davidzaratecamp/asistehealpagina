"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FloatingButtons = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-4">
      <motion.a
        href="https://wa.me/13464633745"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 group"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={24} />
        <span className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          WhatsApp
        </span>
      </motion.a>

      <AnimatePresence>
        {isMobile && (
          <motion.a
            href="tel:+13464633745"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 group"
            aria-label="Llamar ahora"
          >
            <Phone size={24} />
            <span className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Llamar
            </span>
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingButtons;