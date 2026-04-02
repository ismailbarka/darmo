import { trackEvent } from '@/core/services/analytics';
import { Provider } from '@/core/types/provider-type';
import AppButton from '@/core/ui/app-button';
import { Ionicons } from '@expo/vector-icons';
import { useCallback } from 'react';
import { Share, StyleSheet } from 'react-native';

export default function ShareButton({
  title,
  message,
  provider
}: {
  title: string;
  message: string;
  provider: Provider;
}) {
  const handleShare = useCallback(() => {
    trackEvent('provider_shared', {
      provider_id: provider.id,
      provider_name: provider.name,
      category: provider.categoryName
    });
    Share.share({
      message,
      title: title
    });
  }, [message, provider.categoryName, provider.id, provider.name, title]);

  return (
    <AppButton
      style={styles.shareBtn}
      onPress={handleShare}
      icon={<Ionicons name="share-social-outline" size={20} color="#666" />}
    />
  );
}

const styles = StyleSheet.create({
  shareBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  }
});
