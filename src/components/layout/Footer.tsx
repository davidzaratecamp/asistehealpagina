"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, MessageCircle, Mail, Phone, MapPin, Video } from "lucide-react";
import { motion } from "framer-motion";
import ContactForm from "../ui/ContactForm";

const Footer = () => {
  const menuItems = [
    { href: "/", label: "Inicio" },
    { href: "/quienes-somos", label: "Quiénes somos" },
    { href: "/faq", label: "FAQ" },
    { href: "/blog", label: "Blog" },
    { href: "/contacto", label: "Contáctanos" },
  ];

  const socialLinks = [
    { href: "https://www.facebook.com/p/Asiste-Health-Care-61558740472835/?locale=es_LA", icon: Facebook, label: "Facebook" },
    { href: "https://www.instagram.com/asistehealthcare/", icon: Instagram, label: "Instagram" },
    { href: "https://www.tiktok.com/@asiste.health.care", icon: "tiktok", label: "TikTok" },
    { href: "https://wa.me/13464633745", icon: MessageCircle, label: "WhatsApp" },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative w-10 h-10 bg-white/10 rounded-lg p-1">
                  <Image
                    src="/images/logobama.png"
                    alt="Asiste Health Care Logo"
                    width={32}
                    height={32}
                    className="object-contain w-full h-full"
                  />
                </div>
                <h3 className="font-bold text-2xl bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  Asiste Health Care
                </h3>
              </div>
              <p className="text-primary-200 leading-relaxed">
                Tu socio confiable para encontrar el seguro médico perfecto. 
                Ofrecemos asesoría gratuita y acompañamiento personalizado en 
                todo el proceso.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-primary-200">
                <Phone size={18} />
                <div>
                  <div>Ventas: (346) 463-3745</div>
                  <div>Atención: (786) 533-0345</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-primary-200">
                <Mail size={18} />
                <span>info@asistehealthcare.com</span>
              </div>
            </div>

            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="p-3 bg-primary-800 hover:bg-secondary-600 rounded-lg transition-colors duration-300"
                    aria-label={social.label}
                  >
                    {social.icon === "tiktok" ? (
                      <div className="w-5 h-5 flex items-center justify-center">
                        <Image
                          src="/images/tiktok.webp"
                          alt="TikTok"
                          width={20}
                          height={20}
                          className="object-contain brightness-0 invert w-full h-full"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <Icon size={20} />
                    )}
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h4 className="font-semibold text-xl text-white">Enlaces rápidos</h4>
            <nav className="space-y-3">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-primary-200 hover:text-white transition-colors duration-300"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="pt-6 border-t border-primary-700">
              <h5 className="font-medium text-white mb-3">Horarios de atención</h5>
              <div className="space-y-2 text-primary-200 text-sm">
                <div>Lunes - Viernes: 9:00 AM - 7:00 PM</div>
                <div>Sábados: 10:00 AM - 4:00 PM</div>
                <div>Domingos: Cerrado</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <h4 className="font-semibold text-xl text-white">Contáctanos</h4>
            <ContactForm />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 pt-8 border-t border-primary-700 text-center"
        >
          <p className="text-primary-200 text-sm">
            © {currentYear} Asiste Health Care. Todos los derechos reservados.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;