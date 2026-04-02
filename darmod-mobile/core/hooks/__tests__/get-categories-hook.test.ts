import { getCategories } from '@/core/services/api/providersApi';
import { renderHook, waitFor } from '@testing-library/react-native';
import useGetCategories from '../get-categories-hook';

jest.mock('@/core/services/api/providersApi');

describe('useGetCategories Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch categories and update state on mount', async () => {
    const mockCategories = [
      { id: '1', title: 'Cleaners' },
      { id: '2', title: 'Nannies' }
    ];
    (getCategories as jest.Mock).mockResolvedValueOnce(mockCategories);

    const { result } = renderHook(() => useGetCategories());

    // Initially loading should be true
    expect(result.current.loading).toBe(true);
    expect(result.current.categories).toEqual([]);

    // Wait for the async useEffect to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.categories).toEqual(mockCategories);
    });

    expect(getCategories).toHaveBeenCalledTimes(1);
  });

  it('should handle API errors gracefully and set loading to false', async () => {
    // Suppress console.error in this specific test to keep output clean
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    (getCategories as jest.Mock).mockRejectedValueOnce(new Error('API failed'));

    const { result } = renderHook(() => useGetCategories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.categories).toEqual([]); // State should remain empty on error
    });

    consoleSpy.mockRestore(); // Important: Restore console.error for other tests
  });
});
