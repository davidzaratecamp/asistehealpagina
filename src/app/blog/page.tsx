"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image?: string;
  category: string;
  tags?: string;
  readTime: number;
  views: number;
  featured: boolean;
  createdAt: string;
  author: {
    name: string;
    username: string;
  };
}

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [categories, setCategories] = useState<string[]>(["Todos"]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/blog?limit=50");
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
        
        // Extraer categorías únicas
        const uniqueCategories = ["Todos", ...Array.from(new Set(data.posts.map((post: BlogPost) => post.category))) as string[]];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar posts por categoría
  const filteredPosts = selectedCategory === "Todos" 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  // Separar posts destacados
  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

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
              Nuestro <span className="text-gradient">Blog</span>
            </h1>
            <p className="text-xl text-accent-600 max-w-3xl mx-auto leading-relaxed">
              Mantente informado con artículos, guías y consejos sobre seguros médicos y salud
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-primary-600 text-white"
                    : "bg-white text-accent-600 hover:bg-primary-100 hover:text-primary-700"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-accent-600">Cargando artículos...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-accent-600 text-lg">
                {selectedCategory === "Todos" 
                  ? "No hay artículos publicados aún." 
                  : `No hay artículos en la categoría "${selectedCategory}".`
                }
              </p>
              <p className="text-accent-500 mt-2">¡Pronto tendremos contenido nuevo!</p>
            </div>
          ) : (
            <>
              {/* Posts destacados */}
              {featuredPosts.length > 0 && (
                <div className="mb-12">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold text-accent-800 mb-6 flex items-center"
                  >
                    <Star className="text-yellow-500 mr-2" size={24} />
                    Artículos Destacados
                  </motion.h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredPosts.map((post, index) => (
                      <BlogPostCard key={`featured-${post.id}`} post={post} index={index} featured />
                    ))}
                  </div>
                </div>
              )}

              {/* Posts regulares */}
              {regularPosts.length > 0 && (
                <div>
                  {featuredPosts.length > 0 && (
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl font-bold text-accent-800 mb-6"
                    >
                      Más Artículos
                    </motion.h2>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regularPosts.map((post, index) => (
                      <BlogPostCard key={post.id} post={post} index={index + featuredPosts.length} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                ¿Quieres más información personalizada?
              </h2>
              <p className="text-lg mb-6 opacity-90">
                Nuestros expertos están listos para responder tus preguntas específicas
              </p>
              <Link
                href="/contacto"
                className="inline-block bg-white text-primary-600 font-bold py-3 px-8 rounded-xl hover:bg-accent-50 transform hover:scale-105 transition-all duration-300"
              >
                Contactar un experto
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Componente para las tarjetas de blog posts
const BlogPostCard = ({ post, index, featured = false }: { post: BlogPost; index: number; featured?: boolean }) => {
  const defaultImage = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-xl transition-all duration-300 group ${
        featured ? 'ring-2 ring-yellow-200' : ''
      }`}
    >
      <div className="relative overflow-hidden">
        <div
          className="h-48 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
          style={{ backgroundImage: `url(${post.image || defaultImage})` }}
        />
        <div className="absolute top-4 left-4 flex space-x-2">
          <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {post.category}
          </span>
          {featured && (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <Star size={12} className="mr-1" />
              Destacado
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center text-sm text-accent-500 mb-3 space-x-4">
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>{new Date(post.createdAt).toLocaleDateString('es-ES')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock size={14} />
            <span>{post.readTime} min</span>
          </div>
          {post.views > 0 && (
            <div className="flex items-center space-x-1">
              <span>👁️</span>
              <span>{post.views} vistas</span>
            </div>
          )}
        </div>

        <h2 className="font-bold text-xl text-accent-800 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">
          {post.title}
        </h2>

        <p className="text-accent-600 leading-relaxed mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-accent-500">
            <User size={14} />
            <span>{post.author.name}</span>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-300"
          >
            <span>Leer más</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogPage;