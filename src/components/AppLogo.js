/**
 * Brand mark: rounded purple tile + check + decorative dots (reference screens).
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { purple } from '../theme/theme';

export default function AppLogo({ size = 72 }) {
  const dot = 8;
  return (
    <View style={[styles.wrap, { width: size + 24, height: size + 24 }]}>
      <View style={[styles.dot, styles.dot1, { width: dot, height: dot, borderRadius: dot / 2 }]} />
      <View style={[styles.dot, styles.dot2, { width: dot, height: dot, borderRadius: dot / 2 }]} />
      <View style={[styles.dot, styles.dot3, { width: dot, height: dot, borderRadius: dot / 2 }]} />
      <View style={[styles.logo, { width: size, height: size, borderRadius: size * 0.28 }]}>
        <MaterialCommunityIcons name="check" size={size * 0.45} color="#FFFFFF" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logo: {
    backgroundColor: purple,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: purple,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  dot: {
    position: 'absolute',
    backgroundColor: '#FFB74D',
  },
  dot1: { top: 4, right: 18, backgroundColor: '#42A5F5' },
  dot2: { top: 14, left: 8, backgroundColor: '#FFB74D' },
  dot3: { bottom: 10, right: 6, backgroundColor: '#37474F' },
});
