import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function GlassCard({ children, style }) {
  const { theme } = useTheme();

  const webGlass = Platform.OS === 'web' ? {
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.05)',
  } : {};

  return (
    <View style={[
      styles.card,
      {
        backgroundColor: theme.cardBgGlass,
        borderColor: theme.borderColor,
      },
      webGlass,
      style,
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    overflow: 'hidden',
  },
});
