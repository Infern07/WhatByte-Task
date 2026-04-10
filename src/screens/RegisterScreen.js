/**
 * Register — reference: Let's get started + pill Sign up + social row.
 */
import React, { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Button, Text, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppLogo from '../components/AppLogo';
import { getAuthErrorMessage, signUp } from '../services/firebase';
import { inputFill, purple, textMuted, textPrimary } from '../theme/theme';

export default function RegisterScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('#FFFFFF');
      }
    }, [])
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
    } catch (e) {
      setError(getAuthErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const socialHint = () =>
    Alert.alert('Email sign-up', 'Create an account with email and password. Social buttons are visual only in this build.');

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 24 + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>
          <AppLogo size={56} />
          <Text variant="headlineSmall" style={styles.headline}>
            Let&apos;s get started!
          </Text>

          <FieldLabel text="EMAIL ADDRESS" />
          <TextInput
            mode="flat"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            placeholder="you@email.com"
            style={styles.input}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            left={<TextInput.Icon icon="email-outline" color={textMuted} />}
          />

          <FieldLabel text="PASSWORD" />
          <TextInput
            mode="flat"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="new-password"
            style={styles.input}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
          />

          <FieldLabel text="CONFIRM PASSWORD" />
          <TextInput
            mode="flat"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            autoComplete="new-password"
            style={styles.input}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
          />

          {!!error && (
            <Text style={styles.error} variant="bodySmall">
              {error}
            </Text>
          )}

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.primaryBtn}
            contentStyle={styles.btnContent}
            labelStyle={styles.btnLabel}
          >
            Sign up
          </Button>

          <Text style={styles.orText}>or sign up with</Text>
          <View style={styles.socialRow}>
            <SocialCircle icon="facebook" bg="#1877F2" onPress={socialHint} />
            <SocialCircle icon="google" bg="#EA4335" onPress={socialHint} />
            <SocialCircle icon="apple" bg="#000000" onPress={socialHint} />
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerMuted}>Already an account? </Text>
            <Pressable onPress={() => navigation.navigate('Login')} hitSlop={8}>
              <Text style={styles.footerLink}>Log in</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function FieldLabel({ text }) {
  return (
    <Text variant="labelSmall" style={styles.fieldLabel}>
      {text}
    </Text>
  );
}

function SocialCircle({ icon, bg, onPress }) {
  const name = icon === 'facebook' ? 'facebook' : icon === 'google' ? 'google' : 'apple';
  return (
    <Pressable
      onPress={onPress}
      style={[styles.socialBtn, { backgroundColor: bg }]}
      accessibilityLabel={`${icon} (demo)`}
    >
      <MaterialCommunityIcons name={name} size={22} color="#FFFFFF" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 16,
  },
  inner: {
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  headline: {
    color: textPrimary,
    fontWeight: '700',
    marginBottom: 20,
    marginTop: 4,
  },
  fieldLabel: {
    color: textMuted,
    letterSpacing: 0.8,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: inputFill,
    borderRadius: 14,
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  error: {
    color: '#C62828',
    marginTop: 8,
    marginBottom: 4,
  },
  primaryBtn: {
    marginTop: 20,
    borderRadius: 28,
    elevation: 2,
  },
  btnContent: {
    paddingVertical: 10,
  },
  btnLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  orText: {
    textAlign: 'center',
    color: textMuted,
    marginTop: 28,
    marginBottom: 16,
    fontSize: 14,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 36,
    flexWrap: 'wrap',
  },
  footerMuted: {
    color: textMuted,
    fontSize: 15,
  },
  footerLink: {
    color: purple,
    fontSize: 15,
    fontWeight: '700',
  },
});
