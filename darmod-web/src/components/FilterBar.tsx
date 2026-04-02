'use client';

import React from 'react';
import { trackEvent } from '@/services/analytics';

export interface CategoryOption {
  id: number | 'All';
  name: string;
}

interface FilterBarProps {
  categories: CategoryOption[];
  selectedId: number | 'All';
  onSelect: (categoryId: number | 'All') => void;
  providersCount: number;
}

export default function FilterBar({ categories, selectedId, onSelect, providersCount }: FilterBarProps) {
  const handleClick = (category: CategoryOption) => {
    trackEvent('filter_selected', {
      category_id: category.id,
      category_name: category.name,
      providers_visible_count: providersCount,
    });
    onSelect(category.id);
  };

  return (
    <div className="filter-bar">
      <div className="filter-bar-scroll">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`filter-pill${selectedId === cat.id ? ' filter-pill--active' : ''}`}
            onClick={() => handleClick(cat)}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
