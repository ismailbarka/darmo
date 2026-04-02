import { getProviders } from '@/core/services/api/providersApi';
import { Provider } from '@/core/types/provider-type';
import { useEffect, useState } from 'react';

export default function useGetProviders(
  latitude: string,
  longitude: string,
  distance: string
) {
  const [providers, setproviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getNewProviders = async () => {
      if (!latitude || !longitude) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await getProviders(latitude, longitude, distance);
        setproviders(data || []);
      } catch (e) {
        console.error('Error fetching providers:', e);
      } finally {
        setLoading(false);
      }
    };
    getNewProviders();
  }, [distance, latitude, longitude]);
  return { providers, loading };
}
