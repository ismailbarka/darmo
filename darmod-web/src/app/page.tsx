"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Provider } from "@/types";
import useProviders from "@/hooks/useProviders";
import useCategories from "@/hooks/useCategories";
import useCurrentLocation from "@/hooks/useCurrentLocation";
import useFilteredProviders from "@/hooks/useFilteredProviders";
import { trackEvent } from "@/services/analytics";
import { useLanguage } from "@/context/LanguageContext";
import FilterBar, { CategoryOption } from "@/components/FilterBar";
import ProviderPanel from "@/components/ProviderPanel";
import ProviderList from "@/components/ProviderList";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import Header from "@/components/Header";

const MapView = dynamic(() => import("@/components/Map"), { ssr: false });

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const { language, t } = useLanguage();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "All">(
    "All"
  );

  const [isListOpen, setIsListOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );

  const [recenterTrigger, setRecenterTrigger] = useState(0);

  useEffect(() => {
    setMounted(true);
    document.body.classList.remove("antigravity-scroll-lock");
  }, []);

  const { region, updateLocation } = useCurrentLocation();

  const [mapCenter, setMapCenter] = useState<{
    lat: string;
    lng: string;
  } | null>(null);

  const lat = mapCenter?.lat || region?.latitude?.toString();
  const lng = mapCenter?.lng || region?.longitude?.toString();

  const {
    data: providers = [],
    isLoading,
    isError,
    error,
    refetch: refetchProviders,
  } = useProviders(lat, lng, "10000");

  const filteredProviders = useFilteredProviders(
    providers,
    selectedCategoryId
  );

  const visibleProviderIds = useMemo(
    () => new Set(filteredProviders.map((p) => p.id)),
    [filteredProviders]
  );

  const {
    data: categories = [],
    isLoading: categoriesIsLoading,
    isError: categoriesIsError,
    error: categoriesError,
    refetch: refetchCategories,
  } = useCategories();

  const filterCategories: CategoryOption[] = useMemo(() => {
    return [
      { id: "All", name: t("filter_category") },
      ...categories.map((c) => ({
        id: c.id,
        name: language === "ar" ? c.nameAr : c.nameFr,
      })),
    ];
  }, [categories, language, t]);

  useEffect(() => {
    trackEvent("screen_viewed", { screen: "home" });
  }, []);

  const handleLocateMe = useCallback(() => {
    trackEvent("locate_me_tapped", {});
    updateLocation().then(() => {
      setRecenterTrigger((t) => t + 1);
    });
  }, [updateLocation]);

  const handleOpenList = useCallback(() => {
    trackEvent("list_opened", {
      active_category_id: selectedCategoryId,
      providers_count: filteredProviders.length,
    });
    setIsListOpen(true);
  }, [filteredProviders.length, selectedCategoryId]);

  const handleCloseList = useCallback(() => setIsListOpen(false), []);

  const handleMapMove = useCallback((newLat: number, newLng: number) => {
    setMapCenter({
      lat: newLat.toString(),
      lng: newLng.toString(),
    });
  }, []);

  const handleSupportWhatsApp = useCallback(() => {
    trackEvent("support_whatsapp_tapped", {});
    window.open("https://wa.me/212601173734", "_blank");
  }, []);

  if (!mounted || isLoading || categoriesIsLoading)
    return <LoadingState />;

  if (isError || categoriesIsError) {
    const msg =
      error?.message ||
      categoriesError?.message ||
      "Something went wrong";

    return (
      <ErrorState
        message={msg}
        onRetry={() => {
          refetchProviders();
          refetchCategories();
        }}
      />
    );
  }

  return (
    <div className="app-container">
      <Header />

      <div className="map-wrapper">
        <MapView
          center={region}
          providers={providers}
          visibleIds={visibleProviderIds}
          onSelectProvider={setSelectedProvider}
          recenterTrigger={recenterTrigger}
          recenterZoom={16}
          onMapMove={handleMapMove}
        />

        {categories.length > 1 && (
          <FilterBar
            categories={filterCategories}
            selectedId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
            providersCount={filteredProviders.length}
          />
        )}

        {/* WhatsApp Support */}
        <button
          className="fab fab--whatsapp"
          onClick={handleSupportWhatsApp}
          title="WhatsApp Support"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="#ffffff"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
            />
          </svg>
        </button>

        {/* Locate */}
        <button
          className="fab fab--locate"
          onClick={handleLocateMe}
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
          onClick={handleOpenList}
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
      </div>

      {selectedProvider && (
        <ProviderPanel
          provider={selectedProvider}
          onClose={() => setSelectedProvider(null)}
          source="map"
        />
      )}

      {isListOpen && (
        <ProviderList
          providers={filteredProviders}
          category={
            filterCategories.find(
              (c) => c.id === selectedCategoryId
            )?.name || ""
          }
          onClose={handleCloseList}
          onSelectProvider={(provider) => {
            setIsListOpen(false);
            setSelectedProvider(provider);
          }}
        />
      )}
    </div>
  );
}