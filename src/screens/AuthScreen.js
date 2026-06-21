import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

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
    setError('');
    setSuccessMsg('');
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

  const webBg = Platform.OS === 'web' ? {
    background: `radial-gradient(ellipse at 20% 10%, rgba(212,98,42,0.12) 0%, transparent 60%),
                 radial-gradient(ellipse at 80% 90%, rgba(212,98,42,0.08) 0%, transparent 60%)`,
    minHeight: '100vh',
  } : {};

  return (
    <View style={[styles.root, { backgroundColor: theme.pageBg }, webBg]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.kav}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <Text style={[styles.logo, { color: theme.accentBg }]}>Cookbook</Text>
            <Text style={[styles.tagline, { color: theme.textSecondary }]}>
              Your recipes, beautifully organized
            </Text>
          </View>

          <View style={[
            styles.form,
            {
              backgroundColor: theme.cardBgGlass,
              borderColor: theme.borderColor,
              ...(Platform.OS === 'web' ? {
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
              } : {}),
            },
          ]}>
            <Text style={[styles.formTitle, { color: theme.textPrimary }]}>
              {isSignUp ? 'Create account' : 'Sign in'}
            </Text>

            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.inputText }]}
              placeholder="Email"
              placeholderTextColor={theme.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.inputText }]}
              placeholder="Password"
              placeholderTextColor={theme.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />

            {error ? <Text style={[styles.error, { color: theme.danger }]}>{error}</Text> : null}
            {successMsg ? <Text style={[styles.success, { color: theme.success }]}>{successMsg}</Text> : null}

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: theme.accentBg }]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.btnText}>{isSignUp ? 'Create account' : 'Sign in'}</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { setIsSignUp(p => !p); setError(''); setSuccessMsg(''); }}>
              <Text style={[styles.toggle, { color: theme.accentBg }]}>
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </Text>
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
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  hero: { alignItems: 'center', marginBottom: 40 },
  logo: {
    fontSize: 42,
    fontWeight: '700',
    letterSpacing: -1,
    marginBottom: 8,
  },
  tagline: { fontSize: 16, textAlign: 'center' },
  form: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
  },
  formTitle: { fontSize: 20, fontWeight: '600', marginBottom: 20 },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    fontSize: 15,
    marginBottom: 12,
  },
  error: { fontSize: 13, marginBottom: 12 },
  success: { fontSize: 13, marginBottom: 12 },
  btn: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 4,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  toggle: { textAlign: 'center', fontSize: 14 },
});
