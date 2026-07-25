import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface HerVedaSplashScreenProps {
  onGetStarted?: () => void;
}

export default function HerVedaSplashScreen({ onGetStarted }: HerVedaSplashScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.decorCircle} />
      <View style={styles.decorGlow} />

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>H</Text>
          </View>
        </View>

        <Text style={styles.title}>HerVeda</Text>
        <Text style={styles.subtitle}>
          Personalized Nutrition for Every Stage of Womanhood
        </Text>

        <Pressable
          accessibilityRole="button"
          onPress={onGetStarted}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7efe5',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  decorCircle: {
    position: 'absolute',
    top: -90,
    right: -90,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#4f7a4c',
    opacity: 0.95,
  },
  decorGlow: {
    position: 'absolute',
    bottom: -70,
    left: -70,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#ffffff',
    opacity: 0.8,
  },
  content: {
    width: '100%',
    maxWidth: 420,
    paddingHorizontal: 32,
    alignItems: 'center',
    zIndex: 1,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#eaf4e8',
    borderWidth: 2,
    borderColor: '#4f7a4c',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4f7a4c',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },
  logoText: {
    color: '#3f5e39',
    fontSize: 38,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    color: '#1f2d1f',
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    color: '#5f655d',
    fontSize: 17,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 320,
  },
  button: {
    backgroundColor: '#4f7a4c',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 999,
    minWidth: 180,
    alignItems: 'center',
    shadowColor: '#4f7a4c',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
