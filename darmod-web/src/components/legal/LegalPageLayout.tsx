"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useLanguage } from "@/context/LanguageContext";
import LegalSidePanel from "./LegalSidePanel";

interface Section {
  id: string;
  title: string;
  content: string;
  items?: string[];
}

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: Section[];
}

export default function LegalPageLayout({
  title,
  subtitle,
  lastUpdated,
  sections,
}: LegalPageLayoutProps) {
  const { t, language } = useLanguage();

  const handleReportClick = () => {
    // Standard WhatsApp support link observed in the project
    window.open("https://wa.me/212601173734", "_blank");
  };

  return (
    <main className="legal-page">
      {/* Hero Section */}
      <header className="legal-hero">
        <div className="legal-hero-badge">
          {language === "ar" ? "آخر تحديث: " : "Dernière mise à jour : "}{" "}
          {lastUpdated}
        </div>
        <h1>{title}</h1>
        <p className="legal-hero-subtitle">{subtitle}</p>
      </header>

      <div className="legal-container">
        {/* Sidebar / ToC */}
        <aside className="legal-sidebar">
          <h3 className="legal-sidebar-title">
            {language === "ar" ? "الفهرس" : "Sommaire"}
          </h3>
          <nav className="legal-toc">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="legal-toc-link"
              >
                {section.title}
              </a>
            ))}
          </nav>

          <LegalSidePanel
            contactEmail="0601173734"
            onReportClick={handleReportClick}
          />

          <div style={{ marginTop: "40px" }}>
            <Link href="/" className="callout-link">
              ← {language === "ar" ? "العودة للرئيسية" : "Retour à l'accueil"}
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <article className="legal-content-main">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="legal-section">
              <div className="legal-section-header">
                <h2>{section.title}</h2>
              </div>
              <div className="legal-section-body">
                <p>{section.content}</p>
                {section.items && (
                  <ul>
                    {section.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </article>
      </div>

      {/* Footer Links (Mobile / Fallback) */}
      <footer
        style={{
          textAlign: "center",
          paddingBottom: "60px",
          borderTop: "1px solid var(--color-border)",
          paddingTop: "40px",
        }}
      >
        <nav style={{ display: "flex", justifyContent: "center", gap: "24px" }}>
          <Link
            href="/privacy-policy"
            className="callout-link"
            style={{ textDecoration: "none" }}
          >
            {t("privacy_policy")}
          </Link>
          <Link
            href="/terms-of-service"
            className="callout-link"
            style={{ textDecoration: "none" }}
          >
            {t("terms_of_service")}
          </Link>
        </nav>
      </footer>
    </main>
  );
}
