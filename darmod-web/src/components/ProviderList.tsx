'use client';

import React from 'react';
import { Provider } from '@/types';
import ProviderCard from './ProviderCard';
import { useLanguage } from '@/context/LanguageContext';

interface ProviderListProps {
  providers: Provider[];
  category: string;
  onClose: () => void;
  onSelectProvider: (provider: Provider) => void;
}

export default function ProviderList({ providers, category, onClose, onSelectProvider }: ProviderListProps) {
  const { t } = useLanguage();
  return (
    <>
      <div className="panel-overlay" onClick={onClose} />
      <div className="provider-list-panel">
        <div className="list-panel-header">
          <h2 className="list-panel-title">{category}</h2>
          <button className="panel-close-btn" onClick={onClose}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="list-panel-body">
          {providers.length === 0 ? (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <p>{t('no_providers_found')}</p>
            </div>
          ) : (
            providers.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                onSelect={onSelectProvider}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
