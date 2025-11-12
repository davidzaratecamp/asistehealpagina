"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Send, Loader2, Star } from "lucide-react";

const reviewSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  rating: z.number().min(1, "Debes calificar con al menos 1 estrella").max(5, "Máximo 5 estrellas"),
  comment: z.string().min(10, "El comentario debe tener al menos 10 caracteres").max(500, "Máximo 500 caracteres"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  onSubmit: (review: ReviewFormData) => void;
  isSubmitting?: boolean;
}

const ReviewForm = ({ onSubmit, isSubmitting = false }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
  });

  const handleRatingClick = (value: number) => {
    setRating(value);
    setValue("rating", value);
  };

  const handleFormSubmit = (data: ReviewFormData) => {
    onSubmit(data);
    reset();
    setRating(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-soft p-6"
    >
      <h3 className="font-semibold text-xl text-accent-800 mb-6">
        Comparte tu experiencia
      </h3>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              {...register("name")}
              type="text"
              placeholder="Tu nombre *"
              className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-gray-900"
            />
            {errors.name && (
              <p className="text-secondary-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Tu correo electrónico *"
              className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-gray-900"
            />
            {errors.email && (
              <p className="text-secondary-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-accent-700 font-medium mb-2">
            Calificación *
          </label>
          <div className="flex space-x-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none transition-colors duration-200"
              >
                <Star
                  size={32}
                  className={`${
                    star <= (hoverRating || rating)
                      ? "text-yellow-400 fill-current"
                      : "text-accent-300"
                  } hover:text-yellow-400 transition-colors duration-200`}
                />
              </button>
            ))}
          </div>
          {errors.rating && (
            <p className="text-secondary-600 text-sm">{errors.rating.message}</p>
          )}
        </div>

        <div>
          <textarea
            {...register("comment")}
            placeholder="Cuéntanos sobre tu experiencia con Asiste Health Care... *"
            rows={4}
            className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 resize-none text-gray-900"
          />
          {errors.comment && (
            <p className="text-secondary-600 text-sm mt-1">{errors.comment.message}</p>
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
              <span>Enviar reseña</span>
            </>
          )}
        </motion.button>
      </form>

      <p className="text-xs text-accent-500 mt-4 text-center">
        * Campos obligatorios. Tu reseña será revisada antes de publicarse.
      </p>
    </motion.div>
  );
};

export default ReviewForm;