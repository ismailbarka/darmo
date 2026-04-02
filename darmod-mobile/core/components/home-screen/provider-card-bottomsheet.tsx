import { trackEvent } from '@/core/services/analytics';
import { Provider } from '@/core/types/provider-type';
import { messagehandler } from '@/core/utils/message-handler';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import CallButton from '../shared/call-button';
import CloseButton from '../shared/close-button';
import DirectionsButton from '../shared/directions-button';
import ShareButton from '../shared/share-button';
import WhatsAppButton from '../shared/whatsapp-button';
import InfoRow from './provider-card-bottomsheet-components/info-row';
import ProfilePhoto from './provider-card-bottomsheet-components/profile-photo';

export default function ProviderCardBottomsheet({
  onSelectedProvider,
  provider,
  source
}: {
  onSelectedProvider: (provider: Provider | null) => void;
  provider: Provider;
  source: 'map' | 'list';
}) {
  const modalRef = useRef<Modalize>(null);

  useEffect(() => {
    modalRef.current?.open();
    trackEvent('provider_card_viewed', {
      provider_id: provider.id,
      provider_name: provider.name,
      category: provider.categoryName,
      distance_meters: Math.round(provider.distance),
      source: source
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = useCallback(() => {
    setTimeout(() => {
      onSelectedProvider(null);
    }, 500);
  }, [onSelectedProvider]);

  const handleCloseModal = useCallback(() => {
    modalRef.current?.close();
  }, []);

  return (
    <Modalize
      ref={modalRef}
      adjustToContentHeight
      onClosed={handleClose}
      handlePosition="inside"
      modalStyle={styles.modal}
      panGestureEnabled
      closeOnOverlayTap
    >
      <View style={styles.sheet}>
        <View style={styles.header}>
          <ShareButton
            title={provider.name}
            message={messagehandler(
              provider.name,
              provider.categoryName,
              provider.phone
            )}
            provider={provider}
          />
          <CloseButton onPress={handleCloseModal} />
        </View>
        <ProfilePhoto provider={provider} size={90} />
        <Text style={styles.name}>{provider.name}</Text>
        <InfoRow provider={provider} />
        {provider.description && (
          <Text style={styles.description}>{provider.description}</Text>
        )}
        <View style={styles.actionRow}>
          <CallButton provider={provider} />
          <WhatsAppButton provider={provider} />
        </View>
        <DirectionsButton provider={provider} />
        <View style={styles.phoneInfoContainer}>
          <Ionicons name="call-outline" size={18} color="#666" />
          <Text style={styles.phoneText}>{provider.phone}</Text>
        </View>
      </View>
    </Modalize>
  );
}

const styles = StyleSheet.create({
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16
  },
  sheet: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
    minHeight: 300
  },

  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8
  },

  description: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 8
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    marginBottom: 16
  },

  phoneInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 14,
    padding: 12,
    width: '100%',
    justifyContent: 'center',
    gap: 8
  },

  phoneText: {
    fontSize: 15,
    color: '#333'
  }
});
