'use client';

import React from 'react';
import { Provider } from '@/types';
import { getCategoryColor } from '@/utils/categoryColors';
import { formatDistance } from '@/utils/formatDistance';
import { messageHandler } from '@/utils/messageHandler';
import { trackEvent } from '@/services/analytics';
import { useLanguage } from '@/context/LanguageContext';
import ActionButtons from './ActionButtons';

interface ProviderCardProps {
  provider: Provider;
  onSelect?: (provider: Provider) => void;
}

export default function ProviderCard({ provider, onSelect }: ProviderCardProps) {
  const { language } = useLanguage();
  const categoryName = language === 'ar' ? provider.categoryNameAr || provider.category?.nameAr || '' : provider.categoryNameFr || provider.category?.nameFr || '';
  const fullName = language === 'ar' ? `${provider.firstnameAr} ${provider.lastnameAr}` : `${provider.firstnameFr} ${provider.lastnameFr}`;
  const categoryColor = getCategoryColor(provider.categoryId);

  const handleShare = () => {
    trackEvent('provider_shared', {
      provider_id: provider.id,
      provider_name: fullName,
      category: categoryName,
    });
    const msg = messageHandler(fullName, categoryName, provider.phone);
    if (navigator.share) {
      navigator.share({ title: fullName, text: msg }).catch(() => {});
    } else {
      navigator.clipboard.writeText(msg).then(() => alert('Copied to clipboard!'));
    }
  };

  return (
    <div className="provider-card" onClick={() => onSelect?.(provider)}>
      <div className="provider-card-main">
        <div className="provider-card-image">
          {provider.photo ? (
            <img src={provider.photo} alt={fullName} />
          ) : (
            <img src="/profile.png" alt={fullName} className="image-placeholder" />
          )}
        </div>
        
        <div className="provider-card-details">
          <div className="details-header">
            <h3 className="provider-name">{fullName}</h3>
            {provider.rating && (
              <div className="provider-rating">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFB800"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <span>{provider.rating}</span>
              </div>
            )}
          </div>
          
          <div className="details-meta">
            <span className="provider-category" style={{ color: categoryColor }}>
              {categoryName}
            </span>
            <span className="meta-divider">•</span>
            <span className="provider-distance">
              {formatDistance(provider.distance || 0)}
            </span>
          </div>

          <div className="provider-card-actions" onClick={(e) => e.stopPropagation()}>
            <ActionButtons provider={provider} compact />
            <button className="icon-action-btn" onClick={handleShare} title="Share">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
