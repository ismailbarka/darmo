import React, { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type Props = {
  category: string;
  isSelected: boolean;
  onPress: (category: string) => void;
};

const FilterButton = React.memo(function FilterButton({
  category,
  isSelected,
  onPress
}: Props) {
  const handleButtonClick = useCallback(() => {
    onPress(category);
  }, [category, onPress]);

  return (
    <TouchableOpacity
      style={[styles.filterButton, isSelected && styles.filterButtonSelected]}
      onPress={handleButtonClick}
    >
      <Text
        style={[styles.filterText, isSelected && styles.filterTextSelected]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );
});

export default FilterButton;

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
