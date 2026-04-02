import { Provider } from '@/core/types/provider-type';
import { getCategoryColor } from '@/core/utils/category-colors';
import { formatDistance } from '@/core/utils/format-distance';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default function ProviderBasicInfos({
  provider
}: {
  provider: Provider;
}) {
  const categoryColor = getCategoryColor(provider.categoryName);

  return (
    <View style={styles.info}>
      <Text style={styles.name} numberOfLines={1}>
        {provider.name}
      </Text>

      <View style={styles.metaRow}>
        <View style={[styles.badge, { backgroundColor: categoryColor + '15' }]}>
          <View style={[styles.badgeDot, { backgroundColor: categoryColor }]} />
          <Text style={[styles.badgeText, { color: categoryColor }]}>
            {provider.categoryName}
          </Text>
        </View>

        <View style={styles.distanceRow}>
          <Ionicons name="navigate-outline" size={12} color="#666" />
          <Text style={styles.distanceText}>
            {formatDistance(provider.distance)} away
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  info: {
    flex: 1
  },
  name: {
    fontSize: 18,
    fontFamily: 'Jost-Bold',
    color: '#1A1A1A',
    marginBottom: 6
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Jost-Medium',
    fontWeight: '600'
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  distanceText: {
    fontSize: 12,
    fontFamily: 'Jost',
    color: '#666'
  }
});
