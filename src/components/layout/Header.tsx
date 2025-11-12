"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Facebook, Instagram, MessageCircle, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-soft border-b border-primary-100"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-10 h-10 lg:w-12 lg:h-12"
            >
              <Image
                src="/images/logobama.png"
                alt="Asiste Health Care Logo"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 40px, 48px"
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="font-bold text-xl lg:text-2xl text-gradient"
            >
              Asiste Health Care
            </motion.div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-accent-700 hover:text-primary-600 transition-colors duration-300 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="p-2 text-accent-600 hover:text-primary-600 transition-colors duration-300"
                  aria-label={social.label}
                >
                  {social.icon === "tiktok" ? (
                    <div className="w-5 h-5 flex items-center justify-center">
                      <Image
                        src="/images/tiktok.webp"
                        alt="TikTok"
                        width={20}
                        height={20}
                        className="object-contain w-full h-full"
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

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-accent-700 hover:text-primary-600 transition-colors duration-300"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-primary-100"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="space-y-4">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-accent-700 hover:text-primary-600 transition-colors duration-300 font-medium py-2"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="flex items-center space-x-4 mt-6 pt-4 border-t border-primary-100">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="p-2 text-accent-600 hover:text-primary-600 transition-colors duration-300"
                      aria-label={social.label}
                    >
                      {social.icon === "tiktok" ? (
                        <div className="w-5 h-5 flex items-center justify-center">
                          <Image
                            src="/images/tiktok.webp"
                            alt="TikTok"
                            width={20}
                            height={20}
                            className="object-contain w-full h-full"
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;