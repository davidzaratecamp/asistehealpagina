"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MessageCircle, MapPin, Clock } from "lucide-react";
import ContactForm from "@/components/ui/ContactForm";

const ContactoPage = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: "Ventas",
      details: "(346) 463-3745",
      description: "Lunes a Viernes: 9:00 AM - 7:00 PM",
      action: "tel:+13464633745"
    },
    {
      icon: MessageCircle,
      title: "Atención al Cliente",
      details: "(786) 533-0345",
      description: "WhatsApp - Respuesta inmediata",
      action: "https://wa.me/17865330345"
    },
    {
      icon: Mail,
      title: "Correo Electrónico",
      details: "info@asistehealthcare.com",
      description: "Respuesta en 24 horas",
      action: "mailto:info@asistehealthcare.com"
    },
    {
      icon: MapPin,
      title: "Ubicación",
      details: "Estados Unidos",
      description: "Servicio nacional",
      action: null
    }
  ];

  const scheduleInfo = [
    { day: "Lunes - Viernes", hours: "9:00 AM - 7:00 PM" },
    { day: "Sábados", hours: "10:00 AM - 4:00 PM" },
    { day: "Domingos", hours: "Cerrado" },
  ];

  return (
    <div className="min-h-screen bg-accent-50">
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-accent-800 mb-6">
              <span className="text-gradient">Contáctanos</span>
            </h1>
            <p className="text-xl text-accent-600 max-w-3xl mx-auto leading-relaxed">
              Estamos aquí para ayudarte a encontrar el seguro médico perfecto. 
              Obtén asesoría gratuita de nuestros expertos.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-accent-800 mb-6">
                  Información de Contacto
                </h2>
                <p className="text-accent-600 mb-8 leading-relaxed">
                  Nuestro equipo de expertos está disponible para responder todas tus preguntas 
                  sobre seguros médicos. Contáctanos por el medio que prefieras.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  const content = (
                    <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-soft hover:shadow-xl transition-all duration-300">
                      <div className="bg-primary-100 rounded-full p-3 flex-shrink-0">
                        <Icon className="text-primary-600" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-accent-800 mb-1">
                          {info.title}
                        </h3>
                        <p className="text-primary-600 font-medium mb-1">
                          {info.details}
                        </p>
                        <p className="text-accent-500 text-sm">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  );

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    >
                      {info.action ? (
                        <a
                          href={info.action}
                          target={info.action.startsWith('http') ? '_blank' : undefined}
                          rel={info.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="block hover:scale-105 transition-transform duration-300"
                        >
                          {content}
                        </a>
                      ) : (
                        content
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="bg-primary-50 rounded-2xl p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="text-primary-600" size={24} />
                  <h3 className="font-semibold text-lg text-accent-800">
                    Horarios de Atención
                  </h3>
                </div>
                <div className="space-y-2">
                  {scheduleInfo.map((schedule, index) => (
                    <div key={index} className="flex justify-between text-accent-600">
                      <span className="font-medium">{schedule.day}</span>
                      <span>{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <ContactForm className="h-full" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-16"
          >
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 md:p-12 text-white text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                ¿Necesitas ayuda inmediata?
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Si tienes una emergencia médica o necesitas información urgente sobre tu seguro, 
                estos recursos pueden ayudarte:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="bg-white bg-opacity-20 rounded-xl p-6">
                  <h3 className="font-semibold text-lg mb-2">Emergencias Médicas</h3>
                  <p className="text-sm opacity-90 mb-3">Para emergencias llama al</p>
                  <a
                    href="tel:911"
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors duration-300"
                  >
                    911
                  </a>
                </div>
                <div className="bg-white bg-opacity-20 rounded-xl p-6">
                  <h3 className="font-semibold text-lg mb-2">Atención Inmediata</h3>
                  <p className="text-sm opacity-90 mb-3">WhatsApp 24/7</p>
                  <a
                    href="https://wa.me/17865330345"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-300"
                  >
                    (786) 533-0345
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactoPage;