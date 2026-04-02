export const CATEGORY_COLORS: Record<string, string> = {
  cleaner: '#4CAF50',
  nanny: '#E91E63',
  plumber: '#2196F3',
  electrician: '#FF9800'
};

export const DEFAULT_CATEGORY_COLOR = '#9E9E9E';

export const getCategoryColor = (categoryName?: string | null): string => {
  if (!categoryName) {
    return DEFAULT_CATEGORY_COLOR;
  }
  return CATEGORY_COLORS[categoryName.toLowerCase()] || DEFAULT_CATEGORY_COLOR;
};
