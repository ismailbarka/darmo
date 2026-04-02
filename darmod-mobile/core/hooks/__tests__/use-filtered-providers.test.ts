import { Provider } from '@/core/types/provider-type';
import { renderHook } from '@testing-library/react-native';
import useFilteredProviders from '../use-filtered-providers';

describe('useFilteredProviders Hook', () => {
  const mockProviders: Partial<Provider>[] = [
    { id: 1, name: 'John', categoryName: 'Cleaner' },
    { id: 2, name: 'Jane', categoryName: 'Nanny' },
    { id: 3, name: 'Bob', categoryName: 'plumber' } // test case insensitivity
  ];

  it('should return all providers when category is "All"', () => {
    const { result } = renderHook(() =>
      useFilteredProviders(mockProviders as Provider[], 'All')
    );

    expect(result.current).toHaveLength(3);
    expect(result.current).toEqual(mockProviders);
  });

  it('should filter providers by category name (case-insensitive)', () => {
    // Testing exact match but different casing
    const { result } = renderHook(() =>
      useFilteredProviders(mockProviders as Provider[], 'cleaner')
    );

    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe('John');
  });

  it('should handle undefined categoryNames on providers gracefully', () => {
    // Some providers might not have a categoryName assigned
    const providersWithMissingData: Partial<Provider>[] = [
      { id: 1, name: 'No Category Provider' },
      { id: 2, name: 'Jane', categoryName: 'Nanny' }
    ];

    const { result } = renderHook(() =>
      useFilteredProviders(providersWithMissingData as Provider[], 'Nanny')
    );

    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe('Jane');
  });

  it('should return empty array if no providers match the category', () => {
    const { result } = renderHook(() =>
      useFilteredProviders(mockProviders as Provider[], 'Electrician')
    );

    expect(result.current).toEqual([]);
    expect(result.current).toHaveLength(0);
  });
});
