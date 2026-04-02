import { getProviders } from '@/core/services/api/providersApi';
import { renderHook, waitFor } from '@testing-library/react-native';
import useGetProviders from '../get-providers-hook';

jest.mock('@/core/services/api/providersApi');

describe('useGetProviders Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not fetch and return loading=false if latitude or longitude is falsy', async () => {
    // Render hook with missing arguments
    const { result } = renderHook(() => useGetProviders('', '', '10'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.providers).toEqual([]);
    });

    expect(getProviders).not.toHaveBeenCalled();
  });

  it('should fetch providers and update state successfully', async () => {
    const mockProviders = [{ id: '1', name: 'Cleaner Pro' }];
    (getProviders as jest.Mock).mockResolvedValueOnce(mockProviders);

    // Provide valid arguments
    const { result } = renderHook(() => useGetProviders('30.0', '-10.0', '15'));

    // Hook immediately sets loading to true on fetch start
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.providers).toEqual(mockProviders);
    });

    // Verify it called API with correct args based on dependencies
    expect(getProviders).toHaveBeenCalledWith('30.0', '-10.0', '15');
  });

  it('should handle API errors and complete loading cycle', async () => {
    // Suppress console.error so test logs remain clean
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    (getProviders as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    );

    const { result } = renderHook(() => useGetProviders('30.0', '-10.0', '15'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.providers).toEqual([]);
    });

    consoleSpy.mockRestore();
  });
});
