export type Provider = {
  id: number;
  firstnameFr: string;
  lastnameFr: string;
  firstnameAr: string;
  lastnameAr: string;
  phone: string;
  descriptionFr: string;
  descriptionAr: string;
  latitude: number;
  longitude: number;
  photo?: string | null;
  rating: number;
  age?: number | null;
  isActive: boolean;
  categoryId: number;
  categoryNameFr?: string;
  categoryNameAr?: string;
  category?: Category;
  distance?: number;
};

export type Category = {
  id: number;
  nameFr: string;
  nameAr: string;
};
