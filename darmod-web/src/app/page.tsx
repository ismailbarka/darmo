'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Provider } from '@/types';
import useProviders from '@/hooks/useProviders';
import useCategories from '@/hooks/useCategories';
import useCurrentLocation from '@/hooks/useCurrentLocation';
import useFilteredProviders from '@/hooks/useFilteredProviders';
import { trackEvent } from '@/services/analytics';
import { useLanguage } from '@/context/LanguageContext';
import FilterBar, { CategoryOption } from '@/components/FilterBar';
import ProviderPanel from '@/components/ProviderPanel';
import ProviderList from '@/components/ProviderList';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import Header from '@/components/Header';
const MapView = dynamic(() => import('@/components/Map'), { ssr: false });

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const { language, t } = useLanguage();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'All'>('All');
  const [isListOpen, setIsListOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [recenterTrigger, setRecenterTrigger] = useState(0);

  useEffect(() => {
    setMounted(true);
    // Cleanup any artifacts left by browser tools
    document.body.classList.remove('antigravity-scroll-lock');
  }, []);

  const { region, updateLocation } = useCurrentLocation();
  const [mapCenter, setMapCenter] = useState<{ lat: string; lng: string } | null>(null);

  const lat = mapCenter?.lat || region?.latitude?.toString();
  const lng = mapCenter?.lng || region?.longitude?.toString();

  const {
    data: providers = [],
    isLoading,
    isError,
    error,
    refetch: refetchProviders,
  } = useProviders(lat, lng, '10000'); // Increased radius to 10km for better coverage

  const filteredProviders = useFilteredProviders(providers, selectedCategoryId);
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
      { id: 'All', name: t('filter_category') },
      ...categories.map((c) => ({
        id: c.id,
        name: language === 'ar' ? c.nameAr : c.nameFr,
      })),
    ];
  }, [categories, language, t]);

  useEffect(() => {
    trackEvent('screen_viewed', { screen: 'home' });
  }, []);

  const handleLocateMe = useCallback(() => {
    trackEvent('locate_me_tapped', {});
    updateLocation().then(() => {
      setRecenterTrigger((t) => t + 1);
    });
  }, [updateLocation]);

  const handleOpenList = useCallback(() => {
    trackEvent('list_opened', {
      active_category_id: selectedCategoryId,
      providers_count: filteredProviders.length,
    });
    setIsListOpen(true);
  }, [filteredProviders.length, selectedCategoryId]);

  const handleCloseList = useCallback(() => setIsListOpen(false), []);

  const handleMapMove = useCallback((newLat: number, newLng: number) => {
    setMapCenter({ lat: newLat.toString(), lng: newLng.toString() });
  }, []);

  if (!mounted || isLoading || categoriesIsLoading) return <LoadingState />;

  if (isError || categoriesIsError) {
    const msg = error?.message || categoriesError?.message || 'Something went wrong';
    return (
      <ErrorState
        message={msg}
        onRetry={() => { refetchProviders(); refetchCategories(); }}
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

        <button className="fab fab--locate" onClick={handleLocateMe} title="Locate me">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4"/><line x1="1.05" y1="12" x2="7" y2="12"/><line x1="17.01" y1="12" x2="22.96" y2="12"/>
            <line x1="12" y1="1.05" x2="12" y2="7"/><line x1="12" y1="17.01" x2="12" y2="22.96"/>
          </svg>
        </button>

        <button className="fab fab--list" onClick={handleOpenList} title="View list">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
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
          category={filterCategories.find((c) => c.id === selectedCategoryId)?.name || ''}
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
