import { trackEvent } from '@/core/services/analytics';
import * as Haptics from 'expo-haptics';
import { memo, useCallback } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import FilterButton from './filter-button';

interface FiltersScrollViewProps {
  filterCategories: string[];
  category: string | null;
  onSelectedCategoryChange: (category: string) => void;
  providersCount: number;
}

const FiltersScrollView = memo(function FiltersScrollView({
  filterCategories,
  category,
  onSelectedCategoryChange,
  providersCount
}: FiltersScrollViewProps) {
  const handleClick = useCallback(
    (category: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
      trackEvent('filter_selected', {
        category: category,
        providers_visible_count: providersCount
      });

      onSelectedCategoryChange(category);
    },
    [onSelectedCategoryChange, providersCount]
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterScrollContent}
      style={styles.filterScroll}
    >
      {filterCategories.map(cat => (
        <FilterButton
          key={cat}
          category={cat}
          isSelected={category === cat}
          onPress={handleClick}
        />
      ))}
    </ScrollView>
  );
});

export default FiltersScrollView;

const styles = StyleSheet.create({
  filterScroll: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 1
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 3
  },
  filterButtonSelected: {
    backgroundColor: '#007AFF'
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  filterTextSelected: {
    color: 'white'
  }
});
