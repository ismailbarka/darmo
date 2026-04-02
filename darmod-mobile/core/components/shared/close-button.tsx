import AppButton from '@/core/ui/app-button';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

export default function CloseButton({ onPress }: { onPress: () => void }) {
  return (
    <AppButton
      style={styles.closeBtn}
      onPress={onPress}
      icon={<Ionicons name="close" size={22} color="#666" />}
    />
  );
}

const styles = StyleSheet.create({
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  }
});
