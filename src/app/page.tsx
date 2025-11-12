"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Heart, Users, Shield, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ReviewForm from "@/components/ui/ReviewForm";

const HomePage = () => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [dbReviews, setDbReviews] = useState<any[]>([]);

  useEffect(() => {
    fetchApprovedReviews();
  }, []);

  const fetchApprovedReviews = async () => {
    try {
      const response = await fetch("/api/reviews");
      if (response.ok) {
        const data = await response.json();
        setDbReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleReviewSubmit = async (reviewData: any) => {
    setIsSubmittingReview(true);
    setSubmitMessage("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        setSubmitMessage("¡Gracias! Tu reseña ha sido enviada y será revisada pronto.");
        setShowReviewForm(false);
        fetchApprovedReviews(); // Refresh reviews
      } else {
        setSubmitMessage("Error al enviar la reseña. Inténtalo de nuevo.");
      }
    } catch (error) {
      setSubmitMessage("Error de conexión. Verifica tu internet e inténtalo de nuevo.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const features = [
    {
      icon: Users,
      title: "Hablamos tu idioma",
      description: "Atención personalizada en español con asesores expertos que entienden tus necesidades.",
    },
    {
      icon: Shield,
      title: "Expertos en Obamacare (ACA)",
      description: "Conocimiento profundo de todos los planes disponibles y requisitos del programa.",
    },
    {
      icon: Heart,
      title: "Acompañamiento personalizado",
      description: "Te guiamos paso a paso durante todo el proceso de selección e inscripción.",
    },
    {
      icon: Phone,
      title: "Asesoría gratuita todo el año",
      description: "Soporte continuo sin costo adicional, incluso después de la inscripción.",
    },
  ];

  const insurers = [
    { name: "Ambetter", logo: "/images/ammbetter.png", alt: "Ambetter Logo" },
    { name: "Cigna", logo: "/images/cigna.png", alt: "Cigna Logo" },
    { name: "Molina", logo: "/images/molina.jpg", alt: "Molina Healthcare Logo" },
    { name: "Oscar", logo: "/images/oscar.png", alt: "Oscar Health Logo" },
   
    { name: "United", logo: "/images/united.png", alt: "UnitedHealthcare Logo" },
    { name: "Anthem", logo: "/images/Anthem-Emblema.png", alt: "Anthem Logo" },
    { name: "Wellpoint", logo: "/images/wellpoint.png", alt: "Wellpoint Logo" }
  ];

  const testimonials = [
    {
      name: "María González",
      text: "Excelente atención y acompañamiento. Me ayudaron a entender todo el proceso.",
      rating: 5,
    },
    {
      name: "Carlos Rodríguez",
      text: "Muy profesionales, me explicaron mis opciones y encontré el plan ideal.",
      rating: 5,
    },
    {
      name: "Ana Martínez",
      text: "Servicio rápido y confiable. Recomendado 100%.",
      rating: 5,
    },
    {
      name: "Luis Hernández",
      text: "Estoy feliz con mi seguro gracias a Asiste Health Care.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: "url('/images/portadaje.webp')"
          }}
        />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28">
                <Image
                  src="/images/logobama.png"
                  alt="Asiste Health Care Logo"
                  fill
                  className="object-contain drop-shadow-lg"
                  sizes="(max-width: 768px) 80px, (max-width: 1024px) 96px, 112px"
                  priority
                />
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-accent-800 mb-6 leading-tight">
              Seguros Médicos{" "}
              <span className="text-gradient">Obamacare</span>
            </h1>
            <p className="text-xl md:text-2xl text-accent-600 mb-8 leading-relaxed">
              Te ayudamos a proteger tu salud y tu futuro con el seguro médico perfecto
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Link
                href="/contacto"
                className="inline-block bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold py-4 px-8 rounded-xl hover:from-primary-700 hover:to-secondary-700 transform hover:scale-105 transition-all duration-300 shadow-soft text-lg"
              >
                Contáctanos ahora
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <ChevronDown className="text-primary-600 animate-bounce-slow" size={32} />
          </motion.div>
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
              ¿Por qué elegir Asiste Health Care?
            </h2>
            <p className="text-xl text-accent-600 max-w-2xl mx-auto">
              Somos tu socio confiable para navegar el mundo de los seguros médicos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-xl transition-all duration-300 text-center group hover:scale-105"
                >
                  <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:bg-primary-200 transition-colors duration-300">
                    <Icon className="text-primary-600 group-hover:text-primary-700" size={32} />
                  </div>
                  <h3 className="font-semibold text-lg text-accent-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-accent-600 leading-relaxed">
                    {feature.description}
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
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-accent-800 mb-6">
              Aseguradoras de confianza
            </h2>
            <p className="text-xl text-accent-600">
              Trabajamos con las mejores compañías de seguros del país
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-soft"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {insurers.map((insurer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 border border-accent-100 hover:border-primary-200"
                >
                  <div className="h-16 w-full mb-3 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2">
                    <Image
                      src={insurer.logo}
                      alt={insurer.alt}
                      width={120}
                      height={48}
                      className="object-contain filter hover:brightness-110 transition-all duration-300 max-w-full max-h-full"
                    />
                  </div>
                  <div className="text-accent-700 font-medium text-sm">
                    {insurer.name}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
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
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-xl text-accent-600 mb-6">
              Miles de familias confían en nosotros
            </p>
            <motion.button
              onClick={() => setShowReviewForm(!showReviewForm)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-300"
            >
              {showReviewForm ? "Ocultar formulario" : "Deja tu reseña"}
            </motion.button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Static testimonials */}
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={`static-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-accent-50 rounded-2xl p-6 shadow-soft hover:shadow-xl transition-all duration-300"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-accent-700 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div className="text-accent-800 font-semibold">
                  {testimonial.name}
                </div>
              </motion.div>
            ))}
            
            {/* Database reviews */}
            {dbReviews.slice(0, 8).map((review, index) => (
              <motion.div
                key={`db-${review.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (testimonials.length + index) * 0.1 }}
                className="bg-primary-50 rounded-2xl p-6 shadow-soft hover:shadow-xl transition-all duration-300 border border-primary-100"
              >
                <div className="flex mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-accent-700 mb-4 italic">
                  "{review.comment}"
                </p>
                <div className="text-accent-800 font-semibold">
                  {review.name}
                </div>
                <div className="text-xs text-accent-500 mt-1">
                  {new Date(review.createdAt).toLocaleDateString('es-ES')}
                </div>
              </motion.div>
            ))}
          </div>

          {showReviewForm && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="mt-12 max-w-2xl mx-auto"
            >
              <ReviewForm onSubmit={handleReviewSubmit} isSubmitting={isSubmittingReview} />
            </motion.div>
          )}

          {submitMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-center"
            >
              <p className={`text-lg font-medium ${
                submitMessage.includes("Gracias") 
                  ? "text-green-600" 
                  : "text-secondary-600"
              }`}>
                {submitMessage}
              </p>
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Listo para proteger tu salud?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Obtén una consulta gratuita y encuentra el plan perfecto para ti
            </p>
            <Link
              href="/contacto"
              className="inline-block bg-white text-primary-600 font-bold py-4 px-8 rounded-xl hover:bg-accent-50 transform hover:scale-105 transition-all duration-300 shadow-soft text-lg"
            >
              Comenzar ahora
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;