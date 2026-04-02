import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/core/services/api/providersApi';

export default function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });
}
