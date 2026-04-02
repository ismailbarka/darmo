import { trackEvent } from '@/core/services/analytics';
import { Provider } from '@/core/types/provider-type';
import AppButton from '@/core/ui/app-button';
import { getCategoryColor } from '@/core/utils/category-colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { Linking, StyleSheet } from 'react-native';

function CallButton({ provider }: { provider: Provider }) {
  const categoryColor = getCategoryColor(provider.categoryName);

  const handleCall = useCallback(() => {
    if (!provider.phone) return;

    trackEvent('provider_called', {
      provider_id: provider.id,
      provider_name: provider.name,
      category: provider.categoryName
    });

    Linking.openURL(`tel:${provider.phone}`);
  }, [provider.phone, provider.categoryName, provider.id, provider.name]);

  return (
    <AppButton
      style={[styles.actionBtn, { backgroundColor: categoryColor }]}
      onPress={handleCall}
      title="Call"
      icon={<Ionicons name="call" size={18} color="#fff" />}
    />
  );
}

const styles = StyleSheet.create({
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8
  }
});

export default React.memo(CallButton);
