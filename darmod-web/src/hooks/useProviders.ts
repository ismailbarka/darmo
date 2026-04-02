import { useQuery } from '@tanstack/react-query';
import { getProviders } from '@/services/api';

export default function useProviders(
  latitude?: string,
  longitude?: string,
  distance = '5000'
) {
  return useQuery({
    queryKey: ['providers', latitude, longitude, distance],
    queryFn: () => getProviders(latitude!, longitude!, distance),
    enabled: !!latitude && !!longitude,
    staleTime: 1000 * 30,
    placeholderData: (previousData) => previousData,
    retry: 3,
  });
}
