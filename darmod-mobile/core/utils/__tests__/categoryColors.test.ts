import {
  CATEGORY_COLORS,
  DEFAULT_CATEGORY_COLOR,
  getCategoryColor
} from '../category-colors';

describe('getCategoryColor Utility', () => {
  it('should return the correct color for a valid exact category', () => {
    expect(getCategoryColor('cleaner')).toBe(CATEGORY_COLORS.cleaner);
    expect(getCategoryColor('nanny')).toBe(CATEGORY_COLORS.nanny);
    expect(getCategoryColor('plumber')).toBe(CATEGORY_COLORS.plumber);
    expect(getCategoryColor('electrician')).toBe(CATEGORY_COLORS.electrician);
  });

  it('should be case-insensitive', () => {
    expect(getCategoryColor('ClEaNeR')).toBe(CATEGORY_COLORS.cleaner);
    expect(getCategoryColor('NANNY')).toBe(CATEGORY_COLORS.nanny);
  });

  it('should return the default color for an unknown category', () => {
    expect(getCategoryColor('unknown_job')).toBe(DEFAULT_CATEGORY_COLOR);
    expect(getCategoryColor('astronaut')).toBe(DEFAULT_CATEGORY_COLOR);
  });

  it('should return the default color when categoryName is null or undefined', () => {
    expect(getCategoryColor(null)).toBe(DEFAULT_CATEGORY_COLOR);
    expect(getCategoryColor(undefined)).toBe(DEFAULT_CATEGORY_COLOR);
  });

  it('should return the default color when categoryName is an empty string', () => {
    expect(getCategoryColor('')).toBe(DEFAULT_CATEGORY_COLOR);
  });
});
