/**
 * App colors + React Native Paper MD3 theme (purple / lavender reference UI).
 */
import { MD3LightTheme } from 'react-native-paper';

/** Vibrant purple — primary buttons, FAB, accents */
export const purple = '#6B4EFF';
/** Deeper purple — pressed / emphasis */
export const purpleDark = '#5438CC';
/** Lavender header / hero (reference ~#9494FF) */
export const lavender = '#8B8BF5';
/** Soft screen background */
export const screenBg = '#F4F5FB';
/** Input fill (light grey rounded fields) */
export const inputFill = '#F0F0F5';
export const textPrimary = '#1A1A2E';
export const textMuted = '#8E8E9A';
export const danger = '#E53935';

/** Priority pill tags (readable on white cards) */
export const priorityTags = {
  high: { bg: '#FFE8E0', text: '#D84315', label: 'High' },
  medium: { bg: '#FFF8E1', text: '#F57C00', label: 'Med' },
  low: { bg: '#E3F2FD', text: '#1565C0', label: 'Low' },
};

export const appPaperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: purple,
    primaryContainer: '#E8E0FF',
    secondary: lavender,
    secondaryContainer: '#E8E8FF',
    surface: '#FFFFFF',
    surfaceVariant: inputFill,
    background: screenBg,
    onPrimary: '#FFFFFF',
    onSurface: textPrimary,
    onSurfaceVariant: textMuted,
    outline: '#D1D1DC',
    error: danger,
  },
  roundness: 16,
};
