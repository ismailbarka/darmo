export type Provider = {
  id: number;
  name: string;
  phone: string;
  description: string;
  latitude: number;
  longitude: number;
  photoUrl?: string | null;
  isActive: boolean;
  categoryId: number;
  categoryName: string;
  distance: number;
};
