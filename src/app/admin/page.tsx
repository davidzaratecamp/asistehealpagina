"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Check, X, Eye, Trash2, Users, MessageSquare, BookOpen, Plus, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Review {
  id: number;
  name: string;
  email: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
}

interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string;
  postalCode: string;
  createdAt: string;
}

const AdminPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "reviews" | "contacts">("dashboard");
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (admin) {
      fetchData();
    }
  }, [admin]);

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

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch reviews
      const reviewsResponse = await fetch("/api/admin/reviews");
      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.reviews || []);
      }

      // Fetch contacts
      const contactsResponse = await fetch("/api/admin/contacts");
      if (contactsResponse.ok) {
        const contactsData = await contactsResponse.json();
        setContacts(contactsData.contacts || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveReview = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/reviews/${id}/approve`, {
        method: "PATCH",
      });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error approving review:", error);
    }
  };

  const deleteReview = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta reseña?")) {
      try {
        const response = await fetch(`/api/admin/reviews/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          fetchData();
        }
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  if (loading && !admin) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
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
                  <p className="text-sm text-accent-600">Asiste Health Care</p>
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

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Tabs */}
          <div className="mb-8">
            <div className="flex space-x-4 border-b border-accent-200 bg-white rounded-t-2xl p-4">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 py-2 font-medium rounded-lg transition-colors duration-200 ${
                  activeTab === "dashboard"
                    ? "bg-primary-600 text-white"
                    : "text-accent-600 hover:bg-primary-100 hover:text-primary-700"
                }`}
              >
                <BookOpen className="inline-block mr-2" size={20} />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-4 py-2 font-medium rounded-lg transition-colors duration-200 ${
                  activeTab === "reviews"
                    ? "bg-primary-600 text-white"
                    : "text-accent-600 hover:bg-primary-100 hover:text-primary-700"
                }`}
              >
                <MessageSquare className="inline-block mr-2" size={20} />
                Reseñas ({reviews.length})
              </button>
              <button
                onClick={() => setActiveTab("contacts")}
                className={`px-4 py-2 font-medium rounded-lg transition-colors duration-200 ${
                  activeTab === "contacts"
                    ? "bg-primary-600 text-white"
                    : "text-accent-600 hover:bg-primary-100 hover:text-primary-700"
                }`}
              >
                <Users className="inline-block mr-2" size={20} />
                Contactos ({contacts.length})
              </button>
            </div>
          </div>

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-soft p-8">
                <h2 className="text-2xl font-bold text-accent-800 mb-6">
                  Bienvenido, {admin?.name}
                </h2>
                <p className="text-accent-600 mb-8">
                  Gestiona el contenido del blog y las interacciones con los usuarios desde este panel.
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-primary-50 rounded-xl p-6 border border-primary-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-primary-600 font-semibold">Total Reseñas</p>
                        <p className="text-2xl font-bold text-accent-800">{reviews.length}</p>
                      </div>
                      <MessageSquare className="text-primary-600" size={32} />
                    </div>
                  </div>
                  
                  <div className="bg-secondary-50 rounded-xl p-6 border border-secondary-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-secondary-600 font-semibold">Total Contactos</p>
                        <p className="text-2xl font-bold text-accent-800">{contacts.length}</p>
                      </div>
                      <Users className="text-secondary-600" size={32} />
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-600 font-semibold">Reseñas Pendientes</p>
                        <p className="text-2xl font-bold text-accent-800">
                          {reviews.filter(r => !r.approved).length}
                        </p>
                      </div>
                      <Eye className="text-yellow-600" size={32} />
                    </div>
                  </div>
                </div>

                {/* Blog Management */}
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Gestión del Blog</h3>
                      <p className="text-primary-100 mb-4">
                        Crea y administra artículos para mantener informados a tus clientes
                      </p>
                    </div>
                    <BookOpen size={48} className="text-white opacity-50" />
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/admin/blog"
                      className="inline-flex items-center space-x-2 bg-white text-primary-600 font-semibold py-3 px-6 rounded-lg hover:bg-primary-50 transition-colors duration-200"
                    >
                      <BookOpen size={18} />
                      <span>Ver Blog</span>
                    </Link>
                    
                    <Link
                      href="/admin/blog/new"
                      className="inline-flex items-center space-x-2 bg-primary-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-400 transition-colors duration-200"
                    >
                      <Plus size={18} />
                      <span>Crear Post</span>
                    </Link>

                    <Link
                      href="/blog"
                      target="_blank"
                      className="inline-flex items-center space-x-2 bg-transparent border-2 border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-primary-600 transition-colors duration-200"
                    >
                      <Eye size={18} />
                      <span>Ver Blog Público</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="bg-white rounded-2xl shadow-soft p-6 space-y-6">
              <h2 className="text-2xl font-bold text-accent-800 mb-4">
                Gestión de Reseñas
              </h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-accent-600">Cargando reseñas...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare size={48} className="text-accent-300 mx-auto mb-4" />
                  <p className="text-accent-600 text-lg">No hay reseñas disponibles.</p>
                  <p className="text-accent-500">¡Pronto aparecerán las primeras reseñas de clientes!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-accent-50 rounded-2xl p-6 border-l-4 ${
                        !review.approved ? "border-yellow-400" : "border-green-400"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-accent-800">{review.name}</h3>
                          <p className="text-accent-600 text-sm">{review.email}</p>
                          <p className="text-accent-500 text-xs">
                            {new Date(review.createdAt).toLocaleString("es-ES")}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {renderStars(review.rating)}
                          <span className="text-sm text-accent-600">({review.rating}/5)</span>
                        </div>
                      </div>

                      <p className="text-accent-700 mb-4 italic">"{review.comment}"</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              review.approved
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {review.approved ? "Aprobada" : "Pendiente"}
                          </span>
                        </div>

                        <div className="flex space-x-2">
                          {!review.approved && (
                            <button
                              onClick={() => approveReview(review.id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors duration-200"
                            >
                              <Check size={16} />
                              <span>Aprobar</span>
                            </button>
                          )}
                          <button
                            onClick={() => deleteReview(review.id)}
                            className="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors duration-200"
                          >
                            <Trash2 size={16} />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Contacts Tab */}
          {activeTab === "contacts" && (
            <div className="bg-white rounded-2xl shadow-soft p-6 space-y-6">
              <h2 className="text-2xl font-bold text-accent-800 mb-4">
                Contactos Recibidos
              </h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-accent-600">Cargando contactos...</p>
                </div>
              ) : contacts.length === 0 ? (
                <div className="text-center py-12">
                  <Users size={48} className="text-accent-300 mx-auto mb-4" />
                  <p className="text-accent-600 text-lg">No hay contactos disponibles.</p>
                  <p className="text-accent-500">¡Pronto recibirás las primeras consultas de clientes!</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {contacts.map((contact) => (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-primary-50 rounded-2xl p-6 border border-primary-100"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-bold text-xl text-accent-800 mb-2">{contact.name}</h3>
                          <div className="space-y-1">
                            <p className="text-accent-600 flex items-center">
                              <span className="font-medium mr-2">Email:</span> 
                              <a href={`mailto:${contact.email}`} className="text-primary-600 hover:text-primary-700">
                                {contact.email}
                              </a>
                            </p>
                            <p className="text-accent-600 flex items-center">
                              <span className="font-medium mr-2">Teléfono:</span> 
                              <a href={`tel:${contact.phone}`} className="text-primary-600 hover:text-primary-700">
                                {contact.phone}
                              </a>
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-accent-600 mb-2">
                            <span className="font-medium">Código postal:</span> {contact.postalCode}
                          </p>
                          <p className="text-accent-500 text-sm">
                            <span className="font-medium">Fecha:</span> {new Date(contact.createdAt).toLocaleString("es-ES")}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPage;