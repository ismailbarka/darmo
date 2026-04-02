"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2, Loader2, Phone, Star } from "lucide-react";
import { fetchProviders, fetchCategories, deleteProvider } from "@/lib/api";
import Modal from "@/components/Modal";
import ProviderForm from "@/components/ProviderForm";

export default function ProvidersPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const loadData = async () => {
    setLoading(true);
    try {
      const [pData, cData] = await Promise.all([
        fetchProviders(),
        fetchCategories(),
      ]);
      setProviders(pData);
      setCategories(cData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this provider?")) {
      try {
        await deleteProvider(id);
        loadData();
      } catch (error) {
        alert("Failed to delete provider");
      }
    }
  };

  const handleEdit = (provider: any) => {
    setEditingProvider(provider);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProvider(null);
    setIsModalOpen(true);
  };

  const filteredProviders = providers.filter((p) => {
    const matchesSearch = 
      p.firstnameFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.lastnameFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm);
    const matchesCategory = selectedCategory === "all" || p.categoryId === Number(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h2 className="page-title">Providers</h2>
          <p className="page-subtitle">Manage your service providers and their profiles.</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <Plus size={20} />
          <span>Add Provider</span>
        </button>
      </header>

      <div className="filters-bar card">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name or phone..." 
            className="input-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="select-input" 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nameFr}</option>
          ))}
        </select>
      </div>

      <div className="providers-grid">
        {loading ? (
          <div className="loading-state">
            <Loader2 className="animate-spin" />
            <span>Loading providers...</span>
          </div>
        ) : (
          filteredProviders.map((p) => (
            <div key={p.id} className="card provider-card">
              <div className="provider-header">
                {p.photo ? (
                  <img src={p.photo} alt={p.firstnameFr} className="provider-photo" />
                ) : (
                  <img src="/profile.png" alt="Default Profile" className="provider-photo" />
                )}
                <div className="provider-status">
                  <span className={`status-badge ${p.isActive ? "active" : "inactive"}`}>
                    {p.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              
              <div className="provider-body">
                <h4 className="provider-name">{p.firstnameFr} {p.lastnameFr}</h4>
                <p className="provider-category">{p.category?.nameFr || "No Category"}</p>
                
                <div className="provider-meta">
                  <div className="meta-item">
                    <Phone size={14} />
                    <span>{p.phone}</span>
                  </div>
                  <div className="meta-item">
                    <Star size={14} className="star-icon" />
                    <span>{p.rating} / 5</span>
                  </div>
                </div>

                <div className="provider-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(p)}>
                    <Edit2 size={16} />
                    <span>Edit</span>
                  </button>
                  <button className="btn btn-danger-soft btn-sm" onClick={() => handleDelete(p.id)}>
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        {!loading && filteredProviders.length === 0 && (
          <div className="empty-state">No providers found matching your criteria.</div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingProvider ? "Edit Provider" : "Add New Provider"}
      >
        <ProviderForm 
          provider={editingProvider} 
          categories={categories} 
          onSuccess={() => {
            setIsModalOpen(false);
            loadData();
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <style jsx>{`
        .page-container { animation: fadeIn 0.4s ease; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; }
        .page-title { font-size: 1.875rem; font-weight: 700; margin-bottom: 0.25rem; }
        .page-subtitle { color: var(--muted-foreground); }

        .filters-bar { display: flex; gap: 1rem; padding: 1rem; margin-bottom: 2rem; align-items: center; }
        .search-box { flex: 1; display: flex; align-items: center; gap: 0.75rem; background: var(--input); padding: 0.5rem 1rem; border-radius: var(--radius); border: 1px solid var(--border); }
        .search-icon { color: var(--muted-foreground); }
        .input-transparent { background: transparent; border: none; color: var(--foreground); width: 100%; outline: none; }
        .select-input { padding: 0.625rem 1rem; background: var(--input); border: 1px solid var(--border); border-radius: var(--radius); color: var(--foreground); outline: none; }

        .providers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
        
        .provider-card { padding: 0; overflow: hidden; display: flex; flex-direction: column; }
        .provider-header { position: relative; height: 160px; }
        .provider-photo { width: 100%; height: 100%; object-fit: cover; }
        .provider-photo-placeholder { width: 100%; height: 100%; background: var(--secondary); display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 700; color: var(--muted-foreground); }
        
        .provider-status { position: absolute; top: 1rem; right: 1rem; }
        .status-badge { padding: 0.25rem 0.75rem; border-radius: 2rem; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
        .status-badge.active { background: rgba(16, 185, 129, 0.2); color: #10b981; }
        .status-badge.inactive { background: rgba(239, 68, 68, 0.2); color: #ef4444; }

        .provider-body { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; }
        .provider-name { font-size: 1.125rem; font-weight: 700; margin-bottom: 0.25rem; }
        .provider-category { font-size: 0.875rem; color: var(--primary); font-weight: 600; margin-bottom: 1rem; }
        
        .provider-meta { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem; }
        .meta-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--muted-foreground); }
        .star-icon { color: #f59e0b; fill: #f59e0b; }

        .provider-actions { margin-top: auto; display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .btn-sm { padding: 0.4rem; font-size: 0.875rem; }
        .btn-danger-soft { background: rgba(239, 68, 68, 0.1); color: var(--destructive); }
        .btn-danger-soft:hover { background: var(--destructive); color: white; }

        .loading-state, .empty-state { grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 5rem; color: var(--muted-foreground); font-weight: 500; }
        .animate-spin { animation: spin 1s linear infinite; margin-bottom: 1rem; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
