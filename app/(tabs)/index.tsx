import React from 'react';
import { useRouter } from 'expo-router';

import HerVedaSplashScreen from '@/components/herveda-splash';

export default function HomeScreen() {
  const router = useRouter();

  return <HerVedaSplashScreen onGetStarted={() => router.push('/profile-setup')} />;
}
