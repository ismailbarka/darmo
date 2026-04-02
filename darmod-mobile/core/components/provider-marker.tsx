import { getCategoryColor } from '@/core/utils/category-colors';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

type Props = {
  categoryName?: string | null;
  photoUrl?: string | null;
};

const ProviderMarkerUI = React.memo(function ProviderMarkerUI({
  categoryName,
  photoUrl
}: Props) {
  const borderColor = getCategoryColor(categoryName);

  return (
    <View className="items-center justify-center">
      <View style={[styles.markerContainer, { borderColor }]}>
        {photoUrl ? (
          <Image source={{ uri: photoUrl }} style={styles.markerImage} />
        ) : (
          <View style={[styles.markerImage, styles.placeholder]} />
        )}
      </View>
      <View style={[styles.arrow, { borderTopColor: borderColor }]} />
    </View>
  );
});

export default React.memo(ProviderMarkerUI);

const MARKER_SIZE = 46;
const BORDER_WIDTH = 3;

const styles = StyleSheet.create({
  markerContainer: {
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderRadius: MARKER_SIZE / 2,
    borderWidth: BORDER_WIDTH,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  markerImage: {
    width: MARKER_SIZE - BORDER_WIDTH * 2,
    height: MARKER_SIZE - BORDER_WIDTH * 2,
    borderRadius: (MARKER_SIZE - BORDER_WIDTH * 2) / 2
  },
  placeholder: {
    backgroundColor: '#E0E0E0'
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    alignSelf: 'center',
    marginTop: -1
  }
});
