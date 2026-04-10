/**
 * Email + password sign-in (reference: Welcome back + pill button + social row).
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
import {
  getAuthErrorMessage,
  getPasswordResetErrorMessage,
  resetPassword,
  signIn,
} from '../services/firebase';
import { inputFill, purple, textMuted, textPrimary } from '../theme/theme';

export default function LoginScreen({ navigation }) {
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
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
    } catch (e) {
      setError(getAuthErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!email.trim()) {
      Alert.alert('Forgot password', 'Enter your email above, then tap Forgot password again.');
      return;
    }
    try {
      await resetPassword(email);
      Alert.alert('Email sent', 'Check your inbox for reset instructions.');
    } catch (e) {
      Alert.alert('Could not send email', getPasswordResetErrorMessage(e));
    }
  };

  const socialHint = () =>
    Alert.alert('Email sign-in', 'Use your email and password to sign in. Social login is not connected in this build.');

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
          <Text variant="headlineSmall" style={styles.welcome}>
            Welcome back!
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

          <View style={styles.pwdRow}>
            <FieldLabel text="PASSWORD" />
            <Pressable onPress={handleForgot} hitSlop={8}>
              <Text style={styles.forgot}>Forgot password?</Text>
            </Pressable>
          </View>
          <TextInput
            mode="flat"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secure}
            autoComplete="password"
            style={styles.input}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            right={
              <TextInput.Icon
                icon={secure ? 'eye-outline' : 'eye-off-outline'}
                color={textMuted}
                onPress={() => setSecure((s) => !s)}
                forceTextInputFocus={false}
              />
            }
          />

          {!!error && (
            <Text style={styles.error} variant="bodySmall">
              {error}
            </Text>
          )}

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.primaryBtn}
            contentStyle={styles.btnContent}
            labelStyle={styles.btnLabel}
          >
            Log in
          </Button>

          <Text style={styles.orText}>or log in with</Text>
          <View style={styles.socialRow}>
            <SocialCircle icon="facebook" bg="#1877F2" onPress={socialHint} />
            <SocialCircle icon="google" bg="#EA4335" onPress={socialHint} />
            <SocialCircle icon="apple" bg="#000000" onPress={socialHint} />
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerMuted}>Don&apos;t have an account? </Text>
            <Pressable onPress={() => navigation.navigate('Register')} hitSlop={8}>
              <Text style={styles.footerLink}>Get started!</Text>
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
  welcome: {
    color: textPrimary,
    fontWeight: '700',
    marginBottom: 24,
    marginTop: 4,
  },
  fieldLabel: {
    color: textMuted,
    letterSpacing: 0.8,
    marginBottom: 6,
    marginTop: 12,
  },
  pwdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  forgot: {
    color: purple,
    fontSize: 13,
    fontWeight: '600',
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
