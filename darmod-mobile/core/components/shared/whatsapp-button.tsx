import { trackEvent } from '@/core/services/analytics';
import { Provider } from '@/core/types/provider-type';
import AppButton from '@/core/ui/app-button';
import { Ionicons } from '@expo/vector-icons';
import { useCallback } from 'react';
import { Linking, StyleSheet } from 'react-native';

export default function WhatsAppButton({ provider }: { provider: Provider }) {
  const handleWhatsApp = useCallback(async () => {
    const cleanPhone = provider.phone.replace(/\s+/g, '').replace('+', '');

    trackEvent('provider_whatsapp_tapped', {
      provider_id: provider.id,
      provider_name: provider.name,
      category: provider.categoryName
    });
    Linking.openURL(`https://wa.me/${cleanPhone}`);
  }, [provider.categoryName, provider.id, provider.name, provider.phone]);

  return (
    <AppButton
      style={[styles.actionBtn, styles.whatsappBtn]}
      onPress={handleWhatsApp}
      title="WhatsApp"
      icon={<Ionicons name="logo-whatsapp" size={18} color="#fff" />}
    />
  );
}

const styles = StyleSheet.create({
  whatsappBtn: {
    backgroundColor: '#25D366'
  },
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
