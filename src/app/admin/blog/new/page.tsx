"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Save, ArrowLeft, Loader2, Eye, EyeOff, Star, StarOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const blogPostSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  slug: z.string().min(3, "El slug debe tener al menos 3 caracteres").regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minúsculas, números y guiones"),
  excerpt: z.string().min(20, "El extracto debe tener al menos 20 caracteres"),
  content: z.string().min(100, "El contenido debe tener al menos 100 caracteres"),
  image: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
  category: z.string().min(2, "La categoría es obligatoria"),
  tags: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  readTime: z.number().min(1).max(60),
  published: z.boolean(),
  featured: z.boolean(),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

const categories = [
  "Seguros Médicos",
  "Obamacare",
  "Guías",
  "Noticias",
  "Consejos",
  "FAQ",
  "Testimonios",
  "Actualizaciones",
];

export default function NewBlogPostPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [admin, setAdmin] = useState(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      published: false,
      featured: false,
      readTime: 5,
    },
  });

  const watchTitle = watch("title");
  const watchPublished = watch("published");
  const watchFeatured = watch("featured");

  // Verificar autenticación
  useEffect(() => {
    checkAuth();
  }, []);

  // Generar slug automáticamente basado en el título
  useEffect(() => {
    if (watchTitle) {
      const slug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
        .substring(0, 50);
      setValue("slug", slug);
    }
  }, [watchTitle, setValue]);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/auth");
      if (response.ok) {
        const data = await response.json();
        setAdmin(data.admin);
      } else {
        router.push("/admin/login");
      }
    } catch (error) {
      router.push("/admin/login");
    }
  };

  const onSubmit = async (data: BlogPostFormData) => {
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("/api/admin/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          image: data.image || undefined,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage("¡Post creado exitosamente!");
        setTimeout(() => {
          router.push("/admin/blog");
        }, 1500);
      } else {
        setSubmitMessage(result.message || "Error al crear el post");
      }
    } catch (error) {
      setSubmitMessage("Error de conexión. Verifica tu internet e inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!admin) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-accent-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <header className="bg-white shadow-soft border-b border-accent-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin/blog"
                className="p-2 text-accent-600 hover:bg-accent-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft size={20} />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10">
                  <Image
                    src="/images/logobama.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                    sizes="40px"
                  />
                </div>
                <div>
                  <h1 className="font-bold text-xl text-accent-800">Crear Nuevo Post</h1>
                  <p className="text-sm text-accent-600">Panel de Administración</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contenido Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Título */}
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h2 className="text-lg font-semibold text-accent-800 mb-4">Información Principal</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-semibold text-accent-700 mb-2">
                      Título del Post *
                    </label>
                    <input
                      {...register("title")}
                      type="text"
                      id="title"
                      placeholder="Ej: Todo lo que necesitas saber sobre Obamacare"
                      className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-gray-900"
                    />
                    {errors.title && (
                      <p className="text-secondary-600 text-sm mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="slug" className="block text-sm font-semibold text-accent-700 mb-2">
                      Slug (URL) *
                    </label>
                    <input
                      {...register("slug")}
                      type="text"
                      id="slug"
                      placeholder="todo-lo-que-necesitas-saber-sobre-obamacare"
                      className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 font-mono text-sm text-gray-900"
                    />
                    {errors.slug && (
                      <p className="text-secondary-600 text-sm mt-1">{errors.slug.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="excerpt" className="block text-sm font-semibold text-accent-700 mb-2">
                      Extracto *
                    </label>
                    <textarea
                      {...register("excerpt")}
                      id="excerpt"
                      rows={3}
                      placeholder="Breve descripción del contenido del post (aparecerá en las listas)"
                      className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 resize-none text-gray-900"
                    />
                    {errors.excerpt && (
                      <p className="text-secondary-600 text-sm mt-1">{errors.excerpt.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h2 className="text-lg font-semibold text-accent-800 mb-4">Contenido</h2>
                
                <div>
                  <label htmlFor="content" className="block text-sm font-semibold text-accent-700 mb-2">
                    Contenido del Post *
                  </label>
                  <textarea
                    {...register("content")}
                    id="content"
                    rows={15}
                    placeholder="Escribe aquí el contenido completo del post... Puedes usar Markdown para formato."
                    className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 resize-none font-mono text-sm text-gray-900"
                  />
                  {errors.content && (
                    <p className="text-secondary-600 text-sm mt-1">{errors.content.message}</p>
                  )}
                  <p className="text-xs text-accent-500 mt-1">
                    Tip: Puedes usar Markdown para dar formato al texto (negrita, cursiva, listas, etc.)
                  </p>
                </div>
              </div>

              {/* SEO */}
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h2 className="text-lg font-semibold text-accent-800 mb-4">SEO (Opcional)</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="metaTitle" className="block text-sm font-semibold text-accent-700 mb-2">
                      Meta Título
                    </label>
                    <input
                      {...register("metaTitle")}
                      type="text"
                      id="metaTitle"
                      placeholder="Título optimizado para SEO (si es diferente al título principal)"
                      className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-gray-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="metaDescription" className="block text-sm font-semibold text-accent-700 mb-2">
                      Meta Descripción
                    </label>
                    <textarea
                      {...register("metaDescription")}
                      id="metaDescription"
                      rows={2}
                      placeholder="Descripción que aparecerá en los resultados de búsqueda"
                      className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 resize-none text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Estado y Acciones */}
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h3 className="text-lg font-semibold text-accent-800 mb-4">Publicar</h3>
                
                <div className="space-y-4">
                  {/* Toggle Publicado */}
                  <div className="flex items-center justify-between">
                    <label htmlFor="published" className="text-sm font-semibold text-accent-700">
                      Estado
                    </label>
                    <button
                      type="button"
                      onClick={() => setValue("published", !watchPublished)}
                      className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        watchPublished
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      }`}
                    >
                      {watchPublished ? <Eye size={16} /> : <EyeOff size={16} />}
                      <span>{watchPublished ? "Publicado" : "Borrador"}</span>
                    </button>
                  </div>

                  {/* Toggle Destacado */}
                  <div className="flex items-center justify-between">
                    <label htmlFor="featured" className="text-sm font-semibold text-accent-700">
                      Destacado
                    </label>
                    <button
                      type="button"
                      onClick={() => setValue("featured", !watchFeatured)}
                      className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        watchFeatured
                          ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                          : "bg-accent-100 text-accent-600 hover:bg-accent-200"
                      }`}
                    >
                      {watchFeatured ? <Star size={16} /> : <StarOff size={16} />}
                      <span>{watchFeatured ? "Destacado" : "Normal"}</span>
                    </button>
                  </div>

                  {/* Botón Guardar */}
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
                        <Save size={18} />
                        <span>Crear Post</span>
                      </>
                    )}
                  </motion.button>

                  {/* Mensaje de estado */}
                  {submitMessage && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-sm text-center ${
                        submitMessage.includes("exitosamente") 
                          ? "text-green-600" 
                          : "text-secondary-600"
                      }`}
                    >
                      {submitMessage}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Metadatos */}
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h3 className="text-lg font-semibold text-accent-800 mb-4">Metadatos</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-semibold text-accent-700 mb-2">
                      Categoría *
                    </label>
                    <select
                      {...register("category")}
                      id="category"
                      className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-gray-900"
                    >
                      <option value="">Selecciona una categoría</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-secondary-600 text-sm mt-1">{errors.category.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="tags" className="block text-sm font-semibold text-accent-700 mb-2">
                      Etiquetas
                    </label>
                    <input
                      {...register("tags")}
                      type="text"
                      id="tags"
                      placeholder="seguro, salud, obamacare (separadas por comas)"
                      className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-gray-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="readTime" className="block text-sm font-semibold text-accent-700 mb-2">
                      Tiempo de lectura (minutos) *
                    </label>
                    <input
                      {...register("readTime", { valueAsNumber: true })}
                      type="number"
                      id="readTime"
                      min="1"
                      max="60"
                      className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-gray-900"
                    />
                    {errors.readTime && (
                      <p className="text-secondary-600 text-sm mt-1">{errors.readTime.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="image" className="block text-sm font-semibold text-accent-700 mb-2">
                      Imagen destacada (URL)
                    </label>
                    <input
                      {...register("image")}
                      type="url"
                      id="image"
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-gray-900"
                    />
                    {errors.image && (
                      <p className="text-secondary-600 text-sm mt-1">{errors.image.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}