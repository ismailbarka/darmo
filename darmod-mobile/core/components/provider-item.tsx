import { Provider } from '@/core/types/provider-type';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { messagehandler } from '../utils/message-handler';
import ProviderBasicInfos from './home-screen/list-bottomsheet-components/provider-basic-infos';
import ProfilePhoto from './home-screen/provider-card-bottomsheet-components/profile-photo';
import CallButton from './shared/call-button';
import DirectionsButton from './shared/directions-button';
import ShareButton from './shared/share-button';
import WhatsAppButton from './shared/whatsapp-button';

type Props = {
  provider: Provider;
};

function ProviderItem({ provider }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <ProfilePhoto provider={provider} size={60} />
        <ProviderBasicInfos provider={provider} />
        <ShareButton
          title={provider.name}
          message={messagehandler(
            provider.name,
            provider.categoryName,
            provider.phone
          )}
          provider={provider}
        />
      </View>

      <View style={styles.actionRow}>
        <CallButton provider={provider} />
        <WhatsAppButton provider={provider} />
        <DirectionsButton provider={provider} />
      </View>
    </View>
  );
}

export default memo(ProviderItem, (prev, next) => {
  return prev.provider.id === next.provider.id;
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10
  }
});
