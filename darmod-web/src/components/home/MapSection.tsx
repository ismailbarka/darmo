import { Provider } from "@/types";
import dynamic from "next/dynamic";
import FilterBar, { CategoryOption } from "@/components/FilterBar";
import { useEffect, useMemo } from "react";
import Link from "next/link";
import type { Region } from "@/hooks/useCurrentLocation";
import { useLanguage } from "@/context/LanguageContext";

const MapView = dynamic(() => import("@/components/Map"), { ssr: false });

interface MapSectionProps {
  map: {
    center: Region;
    providers: Provider[];
    recenterTrigger: number;
    onMapMove: (lat: number, lng: number) => void;
    onSelectProvider: (provider: Provider) => void;
  };
  filters: {
    categories: CategoryOption[];
    selectedCategoryId: number | "All";
    onSelectCategory: (categoryId: number | "All") => void;
  };
  actions: {
    onLocateMe: () => Promise<void>;
    onOpenList: () => void;
  };
}

export default function MapSection({ map, filters, actions }: MapSectionProps) {
  const { t, language } = useLanguage();
  const visibleProviderIds = useMemo(
    () => new Set(map.providers.map((provider) => provider.id)),
    [map.providers],
  );
  const handleOpenLegal = () => {
    window.location.href = "/terms-of-service";
  };

  const handleReportIssue = () => {
    const msg =
      language === "ar"
        ? "مرحبا، اريد الابلاغ عن مشكلة على منصة daro.ma."
        : "Bonjour, je souhaite signaler un probleme sur la plateforme daro.ma.";
    window.open(
      `https://wa.me/212601173734?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  return (
    <div className="map-wrapper">
      <MapView
        center={map.center}
        providers={map.providers}
        visibleIds={visibleProviderIds}
        onSelectProvider={map.onSelectProvider}
        recenterTrigger={map.recenterTrigger}
        recenterZoom={16}
        onMapMove={map.onMapMove}
      />

      {filters.categories.length > 2 && (
        <FilterBar
          categories={filters.categories}
          selectedId={filters.selectedCategoryId}
          onSelect={filters.onSelectCategory}
          providersCount={map.providers.length}
        />
      )}

      {/* Legal entry point (replaces floating support CTA) */}
      <button
        className="fab fab--whatsapp"
        onClick={handleOpenLegal}
        title={t("legal_fab_label")}
        aria-label={t("legal_fab_label")}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4Z"
            stroke="#ffffff"
            strokeWidth="1.8"
          />
          <path
            d="M9.5 12.4 11.3 14.2 14.8 10.7"
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Locate */}
      <button
        className="fab fab--locate"
        onClick={() => void actions.onLocateMe()}
        title="Locate me"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <line x1="1.05" y1="12" x2="7" y2="12" />
          <line x1="17.01" y1="12" x2="22.96" y2="12" />
          <line x1="12" y1="1.05" x2="12" y2="7" />
          <line x1="12" y1="17.01" x2="12" y2="22.96" />
        </svg>
      </button>

      {/* List */}
      <button
        className="fab fab--list"
        onClick={actions.onOpenList}
        title="View list"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      </button>

      {/* <div className="legal-strip" role="contentinfo">
          <span className="legal-strip-label">{t("legal_links_label")}:</span>
          <Link href="/privacy-policy">{t("privacy_policy")}</Link>
          <span aria-hidden="true">•</span>
          <Link href="/terms-of-service">{t("terms_of_service")}</Link>
          <span aria-hidden="true">•</span>
          <button type="button" onClick={handleReportIssue}>
            {t("report_issue")}
          </button>
        </div> */}
    </div>
  );
}
