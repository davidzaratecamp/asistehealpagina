"use client";

import { motion } from "framer-motion";
import Accordion from "@/components/ui/Accordion";

const FAQPage = () => {
  const faqItems = [
    {
      question: "¿Qué es el programa Obamacare?",
      answer: "Obamacare es el nombre popular de la Ley de Cuidado de Salud Asequible (Affordable Care Act – ACA), una ley federal que busca que todas las personas que viven legalmente en Estados Unidos puedan acceder a seguros médicos de bajo costo, con cobertura completa de servicios médicos esenciales."
    },
    {
      question: "¿Quién puede aplicar al seguro Obamacare?",
      answer: "Pueden aplicar: • Ciudadanos estadounidenses • Residentes legales (con Green Card o estatus migratorio aprobado) • Algunas categorías de inmigrantes con permisos válidos (TPS, asilo, refugiados, etc.)"
    },
    {
      question: "¿Cuándo puedo inscribirme?",
      answer: "El período de inscripción abierta (Open Enrollment) para la cobertura de 2026 es del 1 de noviembre de 2025 al 15 de enero de 2026. • Si te inscribes antes del 15 de diciembre, tu cobertura empieza el 1 de enero de 2026. • Si lo haces entre el 16 de diciembre y el 15 de enero, empieza el 1 de febrero de 2026."
    },
    {
      question: "¿Qué cubre un plan de Obamacare?",
      answer: "Todos los planes incluyen los 10 beneficios esenciales de salud: 1. Consultas médicas y atención primaria. 2. Emergencias y ambulancias. 3. Hospitalización y cirugías. 4. Embarazo, parto y cuidado del recién nacido. 5. Salud mental y tratamiento de adicciones. 6. Medicamentos recetados. 7. Terapias de rehabilitación (física, ocupacional, etc.). 8. Pruebas de laboratorio. 9. Atención preventiva y control de enfermedades crónicas. 10. Servicios pediátricos (incluye odontología y visión para niños)."
    },
    {
      question: "¿Cuánto cuesta el seguro médico Obamacare?",
      answer: "Depende de tus ingresos, tu familia y el estado donde vivas. Gracias a los subsidios federales, los precios son muy cómodos."
    },
    {
      question: "¿El plan cubre embarazo y parto?",
      answer: "Sí. Todos los planes Obamacare cubren: • Citas prenatales • Ecografías • Parto (natural o cesárea) • Atención hospitalaria • Cuidados postparto. Además, cuando nace tu bebé, tienes 60 días para añadirlo al seguro, y su cobertura comienza desde el día del nacimiento."
    },
    {
      question: "¿Incluye medicamentos?",
      answer: "Sí. Todos los planes cubren medicamentos recetados, tanto genéricos como de marca (según el nivel de plan). Algunos incluso incluyen descuentos o copagos muy bajos."
    },
    {
      question: "¿Puedo tener cobertura si ya tengo una condición médica?",
      answer: "Sí. Obamacare prohíbe negar cobertura o subir el precio por condiciones preexistentes (como diabetes, asma, cáncer, embarazo, etc.)."
    },
    {
      question: "¿Qué tipos de planes de salud están disponibles bajo la ACA?",
      answer: "Los planes suelen estar divididos en cuatro categorías: Bronce, plata, oro y platino, varían en cuanto a costos y coberturas."
    },
    {
      question: "¿Hay subsidios para ayudar con los costos?",
      answer: "Sí, muchas personas son elegibles para subsidios en función de sus ingresos y el tamaño de su familia. Estos pueden ayudar a reducir las primas y otros costos de atención médica."
    }
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
              Preguntas <span className="text-gradient">Frecuentes</span>
            </h1>
            <p className="text-xl text-accent-600 max-w-3xl mx-auto leading-relaxed">
              Encuentra respuestas a las preguntas más comunes sobre seguros médicos y Obamacare
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <Accordion items={faqItems} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                ¿No encontraste tu respuesta?
              </h2>
              <p className="text-lg mb-6 opacity-90">
                Nuestros expertos están listos para ayudarte con cualquier pregunta específica
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+13464633745"
                  className="bg-white text-primary-600 font-semibold py-3 px-6 rounded-lg hover:bg-accent-50 transition-colors duration-300"
                >
                  Ventas: (346) 463-3745
                </a>
                <a
                  href="https://wa.me/17865330345"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors duration-300"
                >
                  Atención: (786) 533-0345
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;