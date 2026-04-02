import { Provider } from '@/core/types/provider-type';
import { getCategoryColor } from '@/core/utils/category-colors';
import { formatDistance } from '@/core/utils/format-distance';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default function InfoRow({ provider }: { provider: Provider }) {
  const categoryColor = getCategoryColor(provider.categoryName);

  return (
    <View style={styles.infoRow}>
      <View style={[styles.badge, { backgroundColor: categoryColor + '20' }]}>
        <View style={[styles.badgeDot, { backgroundColor: categoryColor }]} />
        <Text style={[styles.badgeText, { color: categoryColor }]}>
          {provider.categoryName}
        </Text>
      </View>

      <View style={styles.distanceBadge}>
        <Ionicons name="navigate-outline" size={14} color="#666" />
        <Text style={styles.distanceText}>
          {formatDistance(provider.distance)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 6
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },

  badgeText: {
    fontSize: 13,
    fontWeight: '600'
  },

  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    gap: 4
  },
  distanceText: {
    fontSize: 12,
    color: '#666'
  }
});
