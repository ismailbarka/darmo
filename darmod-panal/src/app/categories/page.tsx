"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { fetchCategories, createCategory, deleteCategory } from "@/lib/api";
import Modal from "@/components/Modal";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ nameFr: "", nameAr: "" });
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createCategory(newCategory);
      setIsModalOpen(false);
      setNewCategory({ nameFr: "", nameAr: "" });
      loadCategories();
    } catch (error) {
      alert("Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        loadCategories();
      } catch (error) {
        alert("Failed to delete category");
      }
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h2 className="page-title">Categories</h2>
          <p className="page-subtitle">Manage service categories for your providers.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          <span>Add Category</span>
        </button>
      </header>

      <div className="card table-card">
        {loading ? (
          <div className="loading-state">
            <Loader2 className="animate-spin" />
            <span>Loading categories...</span>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name (French)</th>
                <th>Name (Arabic)</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.id}</td>
                  <td>{cat.nameFr}</td>
                  <td>{cat.nameAr}</td>
                  <td style={{ textAlign: "right" }}>
                    <button 
                      className="btn-icon btn-danger-soft" 
                      onClick={() => handleDelete(cat.id)}
                      title="Delete Category"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="empty-row">No categories found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add New Category"
      >
        <form onSubmit={handleAddCategory} className="admin-form">
          <div className="form-group">
            <label>Name (French)</label>
            <input
              type="text"
              className="input"
              value={newCategory.nameFr}
              onChange={(e) => setNewCategory({ ...newCategory, nameFr: e.target.value })}
              placeholder="e.g. Ménage"
              required
            />
          </div>
          <div className="form-group">
            <label>Name (Arabic)</label>
            <input
              type="text"
              className="input"
              value={newCategory.nameAr}
              onChange={(e) => setNewCategory({ ...newCategory, nameAr: e.target.value })}
              placeholder="e.g. تنظيف"
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Creating..." : "Create Category"}
            </button>
          </div>
        </form>
      </Modal>

      <style jsx>{`
        .page-container { animation: fadeIn 0.4s ease; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; }
        .page-title { font-size: 1.875rem; font-weight: 700; margin-bottom: 0.25rem; }
        .page-subtitle { color: var(--muted-foreground); }
        
        .table-card { padding: 0; overflow: hidden; }
        .admin-table { width: 100%; border-collapse: collapse; text-align: left; }
        .admin-table th { padding: 1rem 1.5rem; background: var(--secondary); font-size: 0.875rem; font-weight: 600; color: var(--muted-foreground); }
        .admin-table td { padding: 1rem 1.5rem; border-top: 1px solid var(--border); font-size: 0.9375rem; }
        .admin-table tr:hover td { background: rgba(255, 255, 255, 0.02); }

        .btn-icon { width: 36px; height: 36px; border-radius: 0.5rem; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .btn-danger-soft { color: var(--destructive); background: rgba(239, 68, 68, 0.1); }
        .btn-danger-soft:hover { background: var(--destructive); color: white; }

        .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem; gap: 1rem; color: var(--muted-foreground); }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .empty-row { text-align: center; padding: 3rem; color: var(--muted-foreground); }

        .admin-form { display: flex; flex-direction: column; gap: 1.25rem; padding-top: 0.5rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label { font-size: 0.875rem; font-weight: 500; color: var(--muted-foreground); }
        .form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem; }
      `}</style>
    </div>
  );
}
