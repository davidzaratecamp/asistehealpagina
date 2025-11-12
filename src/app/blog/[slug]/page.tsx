"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, ArrowLeft, Eye, Tag } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  category: string;
  tags?: string;
  metaTitle?: string;
  metaDescription?: string;
  readTime: number;
  views: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
    username: string;
  };
}

interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image?: string;
  category: string;
  readTime: number;
  createdAt: string;
  author: {
    name: string;
  };
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data.post);
        setRelatedPosts(data.relatedPosts || []);
      } else {
        setError("Post no encontrado");
      }
    } catch (error) {
      console.error("Error loading post:", error);
      setError("Error cargando el artículo");
    } finally {
      setLoading(false);
    }
  };

  const formatContent = (content: string) => {
    // Convertir markdown básico a HTML
    return content
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-accent-800 mb-6 mt-8">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-accent-800 mb-4 mt-6">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-accent-800 mb-3 mt-4">$1</h3>')
      .replace(/^\* (.*$)/gm, '<li class="mb-2">$1</li>')
      .replace(/^- (.*$)/gm, '<li class="mb-2">$1</li>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-accent-800">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed text-accent-700">')
      .replace(/(<li.*<\/li>)/g, '<ul class="list-disc list-inside mb-4 space-y-2 text-accent-700">$1</ul>');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-accent-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-accent-600">Cargando artículo...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-accent-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-accent-800 mb-4">404</h1>
          <p className="text-xl text-accent-600 mb-6">{error || "Artículo no encontrado"}</p>
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-300"
          >
            <ArrowLeft size={18} />
            <span>Volver al Blog</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-accent-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-accent-600 mb-6">
              <Link href="/" className="hover:text-primary-600 transition-colors">
                Inicio
              </Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-primary-600 transition-colors">
                Blog
              </Link>
              <span>/</span>
              <span className="text-accent-800">{post.title}</span>
            </div>

            {/* Category and Featured Badge */}
            <div className="flex items-center space-x-3 mb-4">
              <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {post.category}
              </span>
              {post.featured && (
                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                  <span>⭐</span>
                  <span>Destacado</span>
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-accent-800 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-accent-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center space-x-6 text-accent-600">
              <div className="flex items-center space-x-2">
                <User size={16} />
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>{new Date(post.createdAt).toLocaleDateString('es-ES')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={16} />
                <span>{post.readTime} min de lectura</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye size={16} />
                <span>{post.views} vistas</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-soft p-8 lg:p-12"
            >
              {/* Featured Image */}
              {post.image && (
                <div className="relative w-full h-64 md:h-96 mb-8 rounded-xl overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1000px"
                  />
                </div>
              )}

              {/* Content */}
              <div 
                className="prose prose-lg max-w-none text-accent-700"
                dangerouslySetInnerHTML={{ 
                  __html: `<p class="mb-4 leading-relaxed text-accent-700">${formatContent(post.content)}</p>`
                }}
              />

              {/* Tags */}
              {post.tags && (
                <div className="mt-8 pt-8 border-t border-accent-200">
                  <h3 className="text-lg font-semibold text-accent-800 mb-4 flex items-center">
                    <Tag size={20} className="mr-2" />
                    Etiquetas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.split(',').map((tag, index) => (
                      <span
                        key={index}
                        className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-16"
              >
                <h2 className="text-3xl font-bold text-accent-800 mb-8">
                  Artículos Relacionados
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedPosts.map((relatedPost, index) => (
                    <motion.article
                      key={relatedPost.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                      className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-xl transition-all duration-300 group"
                    >
                      {relatedPost.image && (
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                              {relatedPost.category}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="p-6">
                        <div className="flex items-center text-sm text-accent-500 mb-3 space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar size={14} />
                            <span>{new Date(relatedPost.createdAt).toLocaleDateString('es-ES')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock size={14} />
                            <span>{relatedPost.readTime} min</span>
                          </div>
                        </div>

                        <h3 className="font-bold text-lg text-accent-800 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">
                          {relatedPost.title}
                        </h3>

                        <p className="text-accent-600 leading-relaxed mb-4 line-clamp-3">
                          {relatedPost.excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm text-accent-500">
                            <User size={14} />
                            <span>{relatedPost.author.name}</span>
                          </div>

                          <Link
                            href={`/blog/${relatedPost.slug}`}
                            className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-300"
                          >
                            Leer más
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Back to Blog */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 text-center"
            >
              <Link
                href="/blog"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-300"
              >
                <ArrowLeft size={18} />
                <span>Volver al Blog</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}