"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar, 
  User, 
  Clock,
  Search,
  Filter,
  LogOut,
  Star,
  StarOff
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  published: boolean;
  featured: boolean;
  views: number;
  readTime: number;
  createdAt: string;
  author: {
    name: string;
    username: string;
  };
}

interface Admin {
  id: number;
  name: string;
  username: string;
  email: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  // Verificar autenticación y cargar datos
  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (admin) {
      loadPosts();
    }
  }, [admin, currentPage, filterStatus]);

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

  const loadPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });

      if (filterStatus !== "all") {
        params.append("published", filterStatus === "published" ? "true" : "false");
      }

      const response = await fetch(`/api/admin/blog?${params}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const togglePublished = async (postId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ published: !currentStatus }),
      });

      if (response.ok) {
        loadPosts(); // Recargar la lista
      }
    } catch (error) {
      console.error("Error updating post status:", error);
    }
  };

  const toggleFeatured = async (postId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ featured: !currentStatus }),
      });

      if (response.ok) {
        loadPosts(); // Recargar la lista
      }
    } catch (error) {
      console.error("Error updating featured status:", error);
    }
  };

  const deletePost = async (postId: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este post?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadPosts(); // Recargar la lista
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && !admin) {
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
              <Link href="/" className="flex items-center space-x-3">
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
                  <h1 className="font-bold text-xl text-accent-800">Panel de Administración</h1>
                  <p className="text-sm text-accent-600">Gestión del Blog</p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-semibold text-accent-800">{admin?.name}</p>
                <p className="text-sm text-accent-600">@{admin?.username}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors duration-200"
              >
                <LogOut size={16} />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              {/* Buscador */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 pr-4 py-2 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-64 text-gray-900"
                />
              </div>

              {/* Filtro */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-400" size={20} />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-11 pr-8 py-2 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white text-gray-900"
                >
                  <option value="all">Todos los posts</option>
                  <option value="published">Publicados</option>
                  <option value="draft">Borradores</option>
                </select>
              </div>
            </div>

            {/* Botón crear post */}
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-300"
            >
              <Plus size={18} />
              <span>Crear Post</span>
            </Link>
          </div>
        </div>

        {/* Posts List */}
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-accent-600">Cargando posts...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-accent-600">No hay posts que coincidan con los filtros.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-accent-50 border-b border-accent-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-accent-700 uppercase tracking-wider">
                      Post
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-accent-700 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-accent-700 uppercase tracking-wider">
                      Estadísticas
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-accent-700 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-accent-700 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-accent-100">
                  {filteredPosts.map((post, index) => (
                    <motion.tr
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-accent-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-1">
                          <h3 className="font-semibold text-accent-800 line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-sm text-accent-600 line-clamp-2">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-accent-500">
                            <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded">
                              {post.category}
                            </span>
                            <span>•</span>
                            <span>{post.readTime} min</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => togglePublished(post.id, post.published)}
                            className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                              post.published
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            }`}
                          >
                            {post.published ? <Eye size={12} /> : <EyeOff size={12} />}
                            <span>{post.published ? "Publicado" : "Borrador"}</span>
                          </button>
                          <button
                            onClick={() => toggleFeatured(post.id, post.featured)}
                            className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                              post.featured
                                ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                                : "bg-accent-100 text-accent-600 hover:bg-accent-200"
                            }`}
                          >
                            {post.featured ? <Star size={12} /> : <StarOff size={12} />}
                            <span>{post.featured ? "Destacado" : "Normal"}</span>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-accent-600">
                          <p>{post.views} vistas</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <User size={12} />
                            <span>{post.author.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1 text-sm text-accent-600">
                          <Calendar size={12} />
                          <span>
                            {new Date(post.createdAt).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Link
                            href={`/admin/blog/edit/${post.id}`}
                            className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors duration-200"
                            title="Editar"
                          >
                            <Edit3 size={16} />
                          </Link>
                          <button
                            onClick={() => deletePost(post.id)}
                            className="p-2 text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors duration-200"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-accent-50 border-t border-accent-100">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-accent-600 bg-white border border-accent-200 rounded-lg hover:bg-accent-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Anterior
                </button>
                <span className="text-sm text-accent-600">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-accent-600 bg-white border border-accent-200 rounded-lg hover:bg-accent-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}