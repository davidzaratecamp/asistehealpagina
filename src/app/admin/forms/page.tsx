"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Eye,
  Trash2,
  Download,
  Filter,
  Search,
  RefreshCw
} from "lucide-react";

interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string;
  postalCode: string;
  createdAt: string;
}

export default function AdminFormsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [showDetails, setShowDetails] = useState<number | null>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/contacts");
      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts || []);
      }
    } catch (error) {
      console.error("Error loading contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este contacto?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setContacts(contacts.filter(contact => contact.id !== id));
        setShowDetails(null);
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const deleteSelected = async () => {
    if (selectedContacts.length === 0) return;
    
    if (!confirm(`¿Estás seguro de que quieres eliminar ${selectedContacts.length} contactos?`)) {
      return;
    }

    try {
      const deletePromises = selectedContacts.map(id => 
        fetch(`/api/admin/contacts/${id}`, { method: "DELETE" })
      );
      
      await Promise.all(deletePromises);
      setContacts(contacts.filter(contact => !selectedContacts.includes(contact.id)));
      setSelectedContacts([]);
    } catch (error) {
      console.error("Error deleting contacts:", error);
    }
  };

  const exportContacts = () => {
    const csvContent = [
      ["Nombre", "Teléfono", "Email", "Código Postal", "Fecha"],
      ...filteredContacts.map(contact => [
        contact.name,
        contact.phone,
        contact.email,
        contact.postalCode,
        new Date(contact.createdAt).toLocaleDateString("es-ES")
      ])
    ]
    .map(row => row.join(","))
    .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contactos_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  const toggleContactSelection = (id: number) => {
    setSelectedContacts(prev =>
      prev.includes(id) 
        ? prev.filter(contactId => contactId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedContacts(
      selectedContacts.length === filteredContacts.length 
        ? [] 
        : filteredContacts.map(contact => contact.id)
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Formularios de Contacto</h1>
          <p className="text-gray-600">Gestiona las consultas recibidas desde la página web</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={loadContacts}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw size={16} className="mr-2" />
            Actualizar
          </button>
          <button
            onClick={exportContacts}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download size={16} className="mr-2" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <Mail className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Contactos</p>
              <p className="text-2xl font-semibold text-gray-900">{contacts.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Este Mes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {contacts.filter(contact => 
                  new Date(contact.createdAt).getMonth() === new Date().getMonth()
                ).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Seleccionados</p>
              <p className="text-2xl font-semibold text-gray-900">{selectedContacts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <Filter className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Filtrados</p>
              <p className="text-2xl font-semibold text-gray-900">{filteredContacts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar contactos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>
          
          {selectedContacts.length > 0 && (
            <button
              onClick={deleteSelected}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash2 size={16} className="mr-2" />
              Eliminar Seleccionados ({selectedContacts.length})
            </button>
          )}
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
              onChange={toggleSelectAll}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-3 text-sm font-medium text-gray-900">
              Seleccionar todos
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-6 py-3"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código Postal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(contact.id)}
                      onChange={() => toggleContactSelection(contact.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                      <div className="text-sm text-gray-500">{contact.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Phone size={14} className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{contact.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin size={14} className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{contact.postalCode}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(contact.createdAt).toLocaleDateString("es-ES")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => setShowDetails(contact.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => deleteContact(contact.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <Mail className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay contactos</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "No se encontraron contactos que coincidan con tu búsqueda." : "Aún no has recibido ningún formulario de contacto."}
            </p>
          </div>
        )}
      </div>

      {/* Contact Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Detalles del Contacto</h3>
              <button
                onClick={() => setShowDetails(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            {(() => {
              const contact = contacts.find(c => c.id === showDetails);
              if (!contact) return null;
              
              return (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nombre</label>
                    <p className="text-gray-900">{contact.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{contact.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Teléfono</label>
                    <p className="text-gray-900">{contact.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Código Postal</label>
                    <p className="text-gray-900">{contact.postalCode}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Fecha de Contacto</label>
                    <p className="text-gray-900">
                      {new Date(contact.createdAt).toLocaleString("es-ES")}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}