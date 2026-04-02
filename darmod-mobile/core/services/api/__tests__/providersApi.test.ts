import { api } from '../client';
import { getCategories, getProviders } from '../providersApi';

// Mock the entire client module
jest.mock('../client');

describe('providersApi', () => {
  afterEach(() => {
    // Clear mock history after each test to ensure tests don't leak state
    jest.clearAllMocks();
  });

  describe('getProviders', () => {
    it('should fetch providers with the correct query parameters', async () => {
      const mockProvidersData = [
        { id: '1', name: 'Cleaner Pro', categoryId: 'plumbing' }
      ];

      // We simulate a successful API response
      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockProvidersData });

      const latitude = '34.0522';
      const longitude = '-118.2437';
      const distance = '15';

      const result = await getProviders(latitude, longitude, distance);

      // Verify the returned data matches our mock
      expect(result).toEqual(mockProvidersData);

      // Verify the api.get function was called with the EXACT correct URL string
      expect(api.get).toHaveBeenCalledWith(
        `/providers?lat=${latitude}&lng=${longitude}&distance=${distance}`
      );
      expect(api.get).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the API call fails', async () => {
      const errorMessage = 'Network Error';
      // Simulate an API failure
      (api.get as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      // Attempting to call the function should throw the error
      await expect(getProviders('0', '0', '10')).rejects.toThrow(errorMessage);
    });
  });

  describe('getCategories', () => {
    it('should fetch all categories successfully', async () => {
      const mockCategoriesData = [
        { id: '1', title: 'Cleaners' },
        { id: '2', title: 'Nannies' }
      ];

      (api.get as jest.Mock).mockResolvedValueOnce({
        data: mockCategoriesData
      });

      const result = await getCategories();

      expect(result).toEqual(mockCategoriesData);
      expect(api.get).toHaveBeenCalledWith('/categories');
      expect(api.get).toHaveBeenCalledTimes(1);
    });
  });
});
