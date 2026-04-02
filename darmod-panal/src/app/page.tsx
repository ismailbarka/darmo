"use client";
import { useEffect, useState } from "react";
import { UserCog, Layers, ExternalLink, Loader2, Database, TrendingUp } from "lucide-react";
import { fetchCategories, fetchProviders, seedProviders } from "@/lib/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    providers: 0,
    categories: 0,
    activeProviders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [categories, providers] = await Promise.all([
        fetchCategories(),
        fetchProviders(),
      ]);
      setStats({
        providers: providers.length,
        categories: categories.length,
        activeProviders: providers.filter((p: any) => p.isActive).length,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleSeed = async () => {
    if (confirm("This will add 50 dummy providers to your database. Continue?")) {
      setSeeding(true);
      try {
        const result = await seedProviders();
        alert(result.message || "Successfully seeded providers!");
        loadStats();
      } catch (error: any) {
        alert(error.message || "Failed to seed providers");
      } finally {
        setSeeding(false);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h2 className="dashboard-title">Dashboard Overview</h2>
          <p className="dashboard-subtitle">Welcome back! Here&apos;s what&apos;s happening with Daro.</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-secondary" 
            onClick={handleSeed} 
            disabled={seeding}
            title="Add 50 dummy providers"
          >
            {seeding ? <Loader2 size={18} className="animate-spin" /> : <Database size={18} />}
            <span>{seeding ? "Seeding..." : "Seed Dummy Data"}</span>
          </button>
          <a href="https://api.daro.ma/" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            <ExternalLink size={18} />
            <span>API Docs</span>
          </a>
        </div>
      </header>

      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-icon category-icon">
            <Layers size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Categories</span>
            <h3 className="stat-value">{loading ? "..." : stats.categories}</h3>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon provider-icon">
            <UserCog size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Providers</span>
            <h3 className="stat-value">{loading ? "..." : stats.providers}</h3>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon active-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Active Providers</span>
            <h3 className="stat-value">{loading ? "..." : stats.activeProviders}</h3>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .page-header {
          margin-bottom: 2.5rem;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .page-subtitle {
          color: var(--muted-foreground);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .category-icon { background: rgba(59, 130, 246, 0.1); color: var(--primary); }
        .provider-icon { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .active-icon { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }

        .stat-label {
          font-size: 0.875rem;
          color: var(--muted-foreground);
          font-weight: 500;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
}
