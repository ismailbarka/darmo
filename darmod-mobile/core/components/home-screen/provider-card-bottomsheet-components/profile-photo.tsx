import { Provider } from '@/core/types/provider-type';
import { getCategoryColor } from '@/core/utils/category-colors';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

function ProfilePhoto({
  provider,
  size
}: {
  provider: Provider;
  size: number;
}) {
  const categoryColor = getCategoryColor(provider.categoryName);

  const containerSize = size + 6;

  return (
    <View
      style={[
        styles.photoContainer,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2,
          borderColor: categoryColor
        }
      ]}
    >
      {provider.photoUrl ? (
        <Image
          source={{ uri: provider.photoUrl }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2
          }}
        />
      ) : (
        <View
          style={[
            styles.photoPlaceholder,
            {
              width: size,
              height: size,
              borderRadius: size / 2
            }
          ]}
        />
      )}
    </View>
  );
}
export default React.memo(ProfilePhoto);

const styles = StyleSheet.create({
  photoContainer: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginBottom: 12,
    marginTop: 10
  },

  photoPlaceholder: {
    backgroundColor: '#E0E0E0'
  }
});
