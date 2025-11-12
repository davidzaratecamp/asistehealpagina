"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, Users, Shield, Award, Clock, Globe } from "lucide-react";

const QuienesSomosPage = () => {
  const values = [
    {
      icon: Heart,
      title: "Compromiso",
      description: "Estamos dedicados a ayudar a cada familia a encontrar la protección médica que necesita.",
    },
    {
      icon: Users,
      title: "Cercanía",
      description: "Entendemos tu cultura y hablamos tu idioma para brindarte un servicio personalizado.",
    },
    {
      icon: Shield,
      title: "Confianza",
      description: "Más de 10 años de experiencia respaldando a familias latinas en Estados Unidos.",
    },
    {
      icon: Award,
      title: "Excelencia",
      description: "Reconocidos por nuestra calidad de servicio y satisfacción del cliente.",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Familias atendidas" },
    { number: "8+", label: "Aseguradoras aliadas" },
    { number: "24/7", label: "Soporte disponible" },
    { number: "100%", label: "Satisfacción garantizada" },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <div className="relative w-16 h-16 md:w-20 md:h-20">
                <Image
                  src="/images/logobama.png"
                  alt="Asiste Health Care Logo"
                  fill
                  className="object-contain drop-shadow-lg"
                  sizes="(max-width: 768px) 64px, 80px"
                />
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-accent-800 mb-6">
              Conoce <span className="text-gradient">Asiste Health Care</span>
            </h1>
            <p className="text-xl text-accent-600 max-w-3xl mx-auto leading-relaxed">
              Somos más que una agencia de seguros, somos tu familia en el camino hacia la tranquilidad
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-accent-800">
                Nuestra Historia
              </h2>
              <div className="space-y-4 text-accent-600 leading-relaxed">
                <p>
                  En <strong>Asiste Health Care</strong> ayudamos a las personas a acceder a seguros médicos 
                  accesibles bajo la Ley de Cuidado de Salud a Bajo Precio (Obamacare). Nuestro compromiso 
                  es ofrecer asesoría gratuita, acompañamiento durante todo el proceso y atención en tu idioma.
                </p>
                <p>
                  Somos un equipo de profesionales expertos en seguros de salud que creen que todos merecen 
                  tranquilidad y protección. Entendemos las necesidades únicas de la comunidad latina y 
                  trabajamos incansablemente para hacer que el proceso de obtener un seguro médico sea 
                  simple y transparente.
                </p>
                <p>
                  Nuestro objetivo no es solo venderte un seguro, sino encontrar la solución perfecta que 
                  se adapte a tu presupuesto, necesidades de salud y preferencias familiares. Te acompañamos 
                  desde la primera consulta hasta que tengas tu tarjeta de seguro en la mano.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div 
                className="rounded-2xl overflow-hidden shadow-soft h-96 bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')"
                }}
              >
                <div className="absolute inset-0 bg-primary-600 bg-opacity-20"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-accent-800 mb-6">
              Nuestros Valores
            </h2>
            <p className="text-xl text-accent-600 max-w-2xl mx-auto">
              Los principios que guían cada acción y decisión en nuestra empresa
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className="bg-primary-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 group-hover:bg-primary-200 transition-colors duration-300">
                    <Icon className="text-primary-600 group-hover:text-primary-700" size={32} />
                  </div>
                  <h3 className="font-semibold text-xl text-accent-800 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-accent-600 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-accent-800 mb-6">
              Números que nos respaldan
            </h2>
            <p className="text-xl text-accent-600 max-w-2xl mx-auto">
              La confianza de miles de familias se refleja en estos números
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center bg-white rounded-2xl p-8 shadow-soft hover:shadow-xl transition-all duration-300"
              >
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                  {stat.number}
                </div>
                <div className="text-accent-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Por qué elegir Asiste Health Care?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="space-y-4">
                <Clock className="mx-auto text-white" size={48} />
                <h3 className="text-xl font-semibold">Atención Inmediata</h3>
                <p className="opacity-90">
                  Respuesta rápida a tus consultas durante el período de inscripción abierta
                </p>
              </div>
              <div className="space-y-4">
                <Globe className="mx-auto text-white" size={48} />
                <h3 className="text-xl font-semibold">Cobertura Nacional</h3>
                <p className="opacity-90">
                  Te ayudamos sin importar en qué estado de Estados Unidos te encuentres
                </p>
              </div>
              <div className="space-y-4">
                <Users className="mx-auto text-white" size={48} />
                <h3 className="text-xl font-semibold">Equipo Experto</h3>
                <p className="opacity-90">
                  Profesionales certificados con años de experiencia en seguros médicos
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default QuienesSomosPage;