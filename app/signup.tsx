import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { supabase } from '../config/supabase';

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSignup = async () => {
    if (!email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const redirectUrl = Linking.createURL('login');
    console.log('[Signup Diagnostic - handleSignup]:', {
      supabaseUrlFromClient: (supabase as any).supabaseUrl,
      supabaseAnonKeyLoadedFromClient: !!(supabase as any).supabaseKey,
      redirectUrl,
    });

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (authError) {
        setError(authError.message);
      } else {
        // Check if email confirmation is required (if session is null but user is created)
        if (data.user && !data.session) {
          setSuccessMsg('Registration successful! Please check your email inbox to confirm your account.');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
        }
        // Note: If email confirmation is disabled, Supabase logs them in immediately and AuthProvider handles redirect
      }
    } catch (err) {
      console.error('[Signup Error]:', err);
      setError('Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Create Account</Text>
          </View>
          <Text style={styles.eyebrow}>HerVeda App</Text>
          <Text style={styles.title}>Join Our Wellness Journey</Text>
          <Text style={styles.subtitle}>
            Register today to receive customized meal assessments and bone/vitality indicators.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign Up</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          ) : null}

          {successMsg ? (
            <View style={styles.successBox}>
              <Text style={styles.successText}>✨ {successMsg}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(val) => {
              setEmail(val);
              setError(null);
            }}
            placeholder="Enter your email"
            placeholderTextColor="#8a8f87"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={(val) => {
              setPassword(val);
              setError(null);
            }}
            placeholder="Min 6 characters"
            placeholderTextColor="#8a8f87"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={(val) => {
              setConfirmPassword(val);
              setError(null);
            }}
            placeholder="Re-enter your password"
            placeholderTextColor="#8a8f87"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.footerLinks}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Pressable onPress={() => router.push('/login')}>
            <Text style={styles.footerLinkText}>Log In</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7efe5',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  hero: {
    marginBottom: 26,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#eaf4e8',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  heroBadgeText: {
    color: '#4f7a4c',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  eyebrow: {
    color: '#4f7a4c',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    color: '#152017',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    color: '#5f655d',
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#2c3d2b',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  cardTitle: {
    color: '#19241a',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  errorBox: {
    backgroundColor: '#fdebeb',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#c93b3b',
    fontSize: 13,
    fontWeight: '600',
  },
  successBox: {
    backgroundColor: '#eef8ee',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  successText: {
    color: '#348e34',
    fontSize: 13,
    fontWeight: '600',
  },
  label: {
    color: '#415041',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#f8f2e8',
    borderColor: '#e3dfd5',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: '#19241a',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4f7a4c',
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 18,
    shadowColor: '#4f7a4c',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#9eb59a',
    shadowOpacity: 0.08,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    color: '#5f655d',
    fontSize: 14,
  },
  footerLinkText: {
    color: '#4f7a4c',
    fontSize: 14,
    fontWeight: '700',
  },
});
