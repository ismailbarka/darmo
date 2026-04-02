import axios from 'axios';
import { Category, Provider } from '@/types';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.daro.ma',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

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
