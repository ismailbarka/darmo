import { Provider } from '@/core/types/provider-type';
import { useMemo } from 'react';

export default function useFilteredProviders(
  providers: Provider[],
  selectedCategory: string
) {
  return useMemo(() => {
    if (selectedCategory === 'All') return providers;

    const lowerCategory = selectedCategory.toLowerCase();
    return providers.filter(
      p => p.categoryName?.toLowerCase() === lowerCategory
    );
  }, [providers, selectedCategory]);
}
