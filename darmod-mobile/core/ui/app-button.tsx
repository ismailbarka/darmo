import * as Haptics from 'expo-haptics';
import React from 'react';
import {
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle
} from 'react-native';

type Props = PressableProps & {
  title?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function AppButton({ title, icon, onPress, style }: Props) {
  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    onPress?.();
  }

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={handlePress}>
      {icon}
      {title ? <Text style={styles.text}>{title}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    gap: 8,
    backgroundColor: '#1A1A1A'
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});
