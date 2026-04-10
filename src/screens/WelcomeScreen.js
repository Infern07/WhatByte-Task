/**
 * Onboarding-style welcome (reference: "Get things done").
 */
import React, { useCallback } from 'react';
import { Dimensions, Platform, Pressable, StatusBar, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppLogo from '../components/AppLogo';
import { lavender, purple, textMuted, textPrimary } from '../theme/theme';

const { width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('#FFFFFF');
      }
    }, [])
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <AppLogo size={88} />
        <Text variant="headlineMedium" style={styles.headline}>
          Get things done.
        </Text>
        <Text variant="bodyLarge" style={styles.sub}>
          Just a click away from planning your tasks.
        </Text>

        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotInactive]} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={[styles.dot, styles.dotInactive]} />
        </View>
      </View>

      {/* Decorative purple arc (bottom-right) */}
      <View style={[styles.arc, { width: width * 0.85, height: width * 0.85 }]} />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Continue to sign in"
        style={[styles.fabNext, { bottom: 24 + insets.bottom }]}
        onPress={() => navigation.navigate('Login')}
      >
        <MaterialCommunityIcons name="arrow-right" size={26} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headline: {
    color: textPrimary,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 16,
  },
  sub: {
    color: textMuted,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 16,
    lineHeight: 22,
  },
  dots: {
    flexDirection: 'row',
    marginTop: 32,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotInactive: {
    backgroundColor: '#E0E0E8',
  },
  dotActive: {
    backgroundColor: purple,
    width: 22,
    borderRadius: 4,
  },
  arc: {
    position: 'absolute',
    right: -width * 0.35,
    bottom: -width * 0.35,
    borderRadius: 999,
    backgroundColor: lavender,
    opacity: 0.35,
  },
  fabNext: {
    position: 'absolute',
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: purple,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
});
