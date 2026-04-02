import { Category } from '@/core/types/category-types';
import { api } from './client';
import { Provider } from '@/core/types/provider-type';

export const getProviders = async (
  latitude: string,
  longitude: string,
  distance: string
): Promise<Provider[]> => {
  const { data } = await api.get(
    `/providers?lat=${latitude}&lng=${longitude}&distance=${distance}`
  );
  return data;
};

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get('/categories');
  return data;
};
