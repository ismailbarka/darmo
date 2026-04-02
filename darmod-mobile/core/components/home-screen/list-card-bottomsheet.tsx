import ProviderItem from '@/core/components/provider-item';
import { Provider } from '@/core/types/provider-type';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import CloseButton from '../shared/close-button';

interface ListCardBottomsheetProps {
  onClose: () => void;
  providers: Provider[];
  category: string;
}

export default function ListCardBottomsheet({
  onClose,
  providers,
  category
}: ListCardBottomsheetProps) {
  const modalRef = useRef<Modalize>(null);
  const SCREEN_HEIGHT = Dimensions.get('window').height;

  useEffect(() => {
    modalRef.current?.open();
  }, []);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleCloseModal = useCallback(() => {
    modalRef.current?.close();
  }, []);
  return (
    <Modalize
      ref={modalRef}
      handlePosition="inside"
      withHandle
      modalStyle={styles.modal}
      panGestureEnabled={false}
      closeOnOverlayTap
      modalHeight={SCREEN_HEIGHT * 0.88}
      onClosed={handleClose}
      HeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>{category}</Text>
          <CloseButton onPress={handleCloseModal} />
        </View>
      }
      flatListProps={{
        data: providers,
        keyExtractor: item => item.id.toString(),
        renderItem: ({ item }) => <ProviderItem provider={item} />,
        contentContainerStyle: styles.listContent,
        showsVerticalScrollIndicator: false,
        bounces: false,
        ListEmptyComponent: (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="#CCC" />
            <Text style={styles.emptyText}>
              No providers found in this category
            </Text>
          </View>
        )
      }}
    />
  );
}

const styles = StyleSheet.create({
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden'
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A'
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 50
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    gap: 12
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center'
  }
});
