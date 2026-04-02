export const CATEGORY_COLORS: Record<string, string> = {
  cleaner: '#4CAF50',
  nanny: '#E91E63',
  plumber: '#2196F3',
  electrician: '#FF9800',
};

export const DEFAULT_CATEGORY_COLOR = '#9E9E9E';

const PALETTE = ['#4CAF50', '#E91E63', '#2196F3', '#FF9800', '#8BC34A', '#9C27B0', '#F44336', '#00BCD4'];

export const getCategoryColor = (identifier?: string | number | null): string => {
  if (!identifier) return DEFAULT_CATEGORY_COLOR;
  if (typeof identifier === 'number') {
    return PALETTE[(identifier - 1) % PALETTE.length];
  }
  return CATEGORY_COLORS[identifier.toLowerCase()] || DEFAULT_CATEGORY_COLOR;
};
