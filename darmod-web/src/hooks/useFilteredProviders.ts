import { useMemo } from 'react';
import { Provider } from '@/types';

export default function useFilteredProviders(
  providers: Provider[],
  selectedCategoryId: number | 'All'
) {
  return useMemo(() => {
    if (selectedCategoryId === 'All') return providers;
    return providers.filter((p) => p.categoryId === selectedCategoryId);
  }, [providers, selectedCategoryId]);
}
