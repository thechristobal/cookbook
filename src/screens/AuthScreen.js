import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const BC = 'BarlowCondensed_700Bold';
const BC_SB = 'BarlowCondensed_600SemiBold';
const BC_REG = 'BarlowCondensed_400Regular';

export default function AuthScreen() {
  const { theme } = useTheme();
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  async function handleSubmit() {
    setError(''); setSuccessMsg('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    if (isSignUp) {
      const { error } = await signUp(email, password);
      if (error) setError(error.message);
      else setSuccessMsg('Account created! Check your email to confirm, then sign in.');
    } else {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
    }
    setLoading(false);
  }

  const accent = theme.accentBg;

  const pageBg = Platform.OS === 'web' ? {
    background: `
      radial-gradient(ellipse at 20% 15%, ${accent}18 0%, transparent 50%),
      radial-gradient(ellipse at 80% 85%, ${accent}10 0%, transparent 50%),
      ${theme.pageBg}
    `,
    minHeight: '100vh',
  } : { backgroundColor: theme.pageBg };

  const shimmerLogo = Platform.OS === 'web' ? {
    background: `linear-gradient(90deg, #7C2D12 0%, ${accent} 20%, #FED7AA 38%, #FFFFFF 50%, #FED7AA 62%, ${accent} 80%, #7C2D12 100%)`,
    backgroundSize: '250% auto',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: 'cb-shimmer 10s linear infinite',
    WebkitTextStroke: `0.6px ${accent}70`,
  } : { color: accent };

  const cardShadow = Platform.OS === 'web' ? {
    boxShadow: `0 24px 64px rgba(0,0,0,0.18), 0 0 0 1px ${accent}18`,
  } : {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 16,
  };

  const btnShadow = Platform.OS === 'web' ? {
    boxShadow: `0 4px 20px ${accent}50`,
  } : {};

  return (
    <View style={[styles.root, pageBg]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.kav}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Logo */}
          <View style={styles.hero}>
            <Text style={[styles.logo, shimmerLogo]}>Cookbook</Text>
            <View style={[styles.accentLine, Platform.OS === 'web' ? {
              background: `linear-gradient(90deg, transparent 0%, ${accent}50 25%, ${accent} 50%, ${accent}50 75%, transparent 100%)`,
            } : { backgroundColor: accent + '80' }]} />
            <Text style={[styles.tagline, { color: theme.textSecondary, fontFamily: BC_REG }]}>
              Your recipes, beautifully organized
            </Text>
          </View>

          {/* Card */}
          <View style={[
            styles.card,
            { backgroundColor: theme.cardBgGlass, borderColor: theme.borderColor },
            cardShadow,
            Platform.OS === 'web' ? { backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' } : {},
          ]}>
            {/* Top accent line */}
            <View style={[styles.cardAccentLine, Platform.OS === 'web' ? {
              background: `linear-gradient(90deg, transparent 0%, ${accent}60 30%, ${accent} 50%, ${accent}60 70%, transparent 100%)`,
            } : { backgroundColor: accent }]} />

            {/* Toggle */}
            <View style={[styles.toggle, { backgroundColor: theme.pageBg, borderColor: theme.inputBorder }]}>
              {['Sign in', 'Sign up'].map((label, idx) => {
                const active = isSignUp === (idx === 1);
                return (
                  <TouchableOpacity
                    key={label}
                    style={[
                      styles.toggleBtn,
                      active && { backgroundColor: theme.accentLight, borderColor: accent + '50', borderWidth: 1 },
                    ]}
                    onPress={() => { setIsSignUp(idx === 1); setError(''); setSuccessMsg(''); }}
                  >
                    <Text style={[
                      styles.toggleBtnText,
                      { color: active ? accent : theme.textSecondary, fontFamily: active ? BC : BC_SB },
                    ]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.inputText, fontFamily: BC_REG }]}
              placeholder="Email"
              placeholderTextColor={theme.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.inputText, fontFamily: BC_REG }]}
              placeholder="Password"
              placeholderTextColor={theme.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />

            {error ? <Text style={[styles.errorText, { color: theme.danger, fontFamily: BC_REG }]}>{error}</Text> : null}
            {successMsg ? <Text style={[styles.successText, { color: theme.success, fontFamily: BC_REG }]}>{successMsg}</Text> : null}

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: accent }, btnShadow]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={[styles.btnText, { fontFamily: BC }]}>
                    {isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'}
                  </Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  kav: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24, gap: 32 },
  hero: { alignItems: 'center', gap: 10 },
  logo: {
    fontSize: 52,
    letterSpacing: -1,
    lineHeight: 56,
  },
  accentLine: {
    height: 1,
    width: 120,
    borderRadius: 1,
  },
  tagline: {
    fontSize: 16,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    paddingTop: 0,
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
    overflow: 'hidden',
    gap: 0,
  },
  cardAccentLine: {
    height: 2,
    borderRadius: 0,
    marginBottom: 24,
    marginHorizontal: -24,
  },
  toggle: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    padding: 3,
    marginBottom: 20,
    gap: 3,
  },
  toggleBtn: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  toggleBtnText: {
    fontSize: 15,
    letterSpacing: 1,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  errorText: { fontSize: 14, letterSpacing: 0.3, marginBottom: 12, textAlign: 'center' },
  successText: { fontSize: 14, letterSpacing: 0.3, marginBottom: 12, textAlign: 'center', lineHeight: 20 },
  btn: {
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  btnText: {
    color: '#fff',
    fontSize: 17,
    letterSpacing: 2,
  },
});
