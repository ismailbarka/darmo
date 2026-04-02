export const formatDistance = (dist: number): string => {
  if (dist < 1000) return `${Math.round(dist)}m away`;
  return `${(dist / 1000).toFixed(1)}km away`;
};
