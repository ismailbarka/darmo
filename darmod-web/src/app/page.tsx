"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Provider } from "@/types";
import useProviders from "@/hooks/useProviders";
import useCategories from "@/hooks/useCategories";
import useCurrentLocation from "@/hooks/useCurrentLocation";
import useFilteredProviders from "@/hooks/useFilteredProviders";
import useMapState from "@/hooks/useMapState";
import { useLanguage } from "@/context/LanguageContext";
import type { CategoryOption } from "@/components/FilterBar";
import ProviderPanel from "@/components/ProviderPanel";
import ProviderList from "@/components/ProviderList";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import Header from "@/components/Header";
import MapSection from "@/components/home/MapSection";
import * as fpixel from "@/lib/fpixel";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const { language, t } = useLanguage();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "All">(
    "All",
  );

  const [isListOpen, setIsListOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null,
  );

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);


  const { region, updateLocation } = useCurrentLocation();
  const { lat, lng, recenterTrigger, handleMapMove, handleLocateMe } =
    useMapState({
      region,
      updateLocation,
    });

  const {
    data: providers = [],
    isLoading,
    isError,
    error,
    refetch: refetchProviders,
  } = useProviders(lat, lng, "10000");

  const filteredProviders = useFilteredProviders(providers, selectedCategoryId);

  const {
    data: categories = [],
    isLoading: categoriesIsLoading,
    isError: categoriesIsError,
    error: categoriesError,
    refetch: refetchCategories,
  } = useCategories();

  const filterCategories: CategoryOption[] = useMemo(() => {
    console.log("categories", categories);
    return [
      { id: "All", name: t("filter_category") },
      ...categories.map((c) => ({
        id: c.id,
        name: language === "ar" ? c.nameAr : c.nameFr,
      })),
    ];
  }, [categories, language, t]);

  // Track ViewContent when a provider is selected
  useEffect(() => {
    if (selectedProvider) {
      const category = filterCategories.find(c => c.id === selectedProvider.categoryId)?.name || "";
      fpixel.trackViewContent(selectedProvider.id, category);
    }
  }, [selectedProvider, filterCategories]);

  // Track Search when category is changed
  useEffect(() => {
    if (mounted && selectedCategoryId !== "All") {
      const categoryName = filterCategories.find(c => c.id === selectedCategoryId)?.name || "All";
      fpixel.trackSearch(categoryName);
    }
  }, [selectedCategoryId, filterCategories, mounted]);

  const handleCloseList = () => setIsListOpen(false);
  const handleOpenList = () => setIsListOpen(true);

  if (!mounted || isLoading || categoriesIsLoading) return <LoadingState />;

  if (isError || categoriesIsError) {
    const msg =
      error?.message || categoriesError?.message || "Something went wrong";

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

      <MapSection
        map={{
          center: region,
          providers: filteredProviders,
          recenterTrigger,
          onMapMove: handleMapMove,
          onSelectProvider: setSelectedProvider,
        }}
        filters={{
          categories: filterCategories,
          selectedCategoryId,
          onSelectCategory: setSelectedCategoryId,
        }}
        actions={{
          onLocateMe: handleLocateMe,
          onOpenList: handleOpenList,
        }}
      />
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
            filterCategories.find((c) => c.id === selectedCategoryId)?.name ||
            ""
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
